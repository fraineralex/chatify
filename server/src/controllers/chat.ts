import { NextFunction, Request, Response } from 'express'
import { Message, ServerChat, StaticFile, uuid } from '../types/chat.js'
import { Client } from '@libsql/client'
import { getUserById, getUsersByIds } from '../utils/user.js'
import { MESSAGES_TYPES } from '../constants/index.js'
import { getObjectSignedUrl } from '../utils/s3.js'

export class ChatController {
  private client: Client

  constructor(client: Client) {
    this.client = client
  }

  async getAllChats(
    req: Request & { accessToken?: string },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const userId = req.auth?.payload?.sub

    if (!userId || !req.accessToken) {
      res.status(401).json({
        statusText:
          'Something went wrong validating your credentials, please try again later.',
        status: 401,
      })
      return
    }

    try {
      const result = await this.client.execute({
        sql: 'SELECT * FROM chats WHERE user1_id = :user_id OR user2_id = :user_id',
        args: { user_id: userId },
      })

      if (result.rows.length === 0) res.status(200).json([])

      const chatUUIDs = result.rows
        .map((chat) => chat.uuid as string)
        .map((id) => `'${id}'`)
        .join(',')

      const lastMsgAndUnreadCount = await this.client.execute({
        sql: `
          SELECT
            m1.*,
            COALESCE(unread.count, 0) as unread_count
          FROM
            messages m1
          LEFT JOIN (
            SELECT
              chat_id,
              COUNT(*) as count
            FROM
              messages
            WHERE
              chat_id IN (${chatUUIDs}) AND
              receiver_id = :receiver_id AND
              is_read = false
            GROUP BY
              chat_id
          ) unread
          ON m1.chat_id = unread.chat_id
          WHERE
            m1.created_at = (
              SELECT
                MAX(m2.created_at)
              FROM
                messages m2
              WHERE
                m2.chat_id = m1.chat_id
            )
            AND m1.chat_id IN (${chatUUIDs})
          LIMIT ${chatUUIDs.length}
        `,
        args: {
          receiver_id: userId,
        },
      })

      const chats: ServerChat[] = []
      const usersIds = result.rows.map((chat) =>
        chat.user1_id === userId
          ? (chat.user2_id as string)
          : (chat.user1_id as string)
      )
      const users = await getUsersByIds([...usersIds, userId], req.accessToken)
      const loggedUser = users.find((user) => user.user_id === userId)

      for (const chat of result.rows) {
        const id =
          chat.user1_id === userId
            ? (chat.user2_id as string)
            : (chat.user1_id as string)

        const chatUser = users.find((user) => user.user_id === id)
        if (!chatUser || !loggedUser) continue
        const name = chatUser.name?.split(' ').slice(0, 2).join(' ') as string

        let lastMessage: Message | undefined = undefined
        let unreadMessages: number = 0

        if (
          lastMsgAndUnreadCount.rows?.length > 0 &&
          lastMsgAndUnreadCount.rows?.find((msg) => msg.chat_id === chat.uuid)
        ) {
          const message = lastMsgAndUnreadCount.rows.find(
            (msg) => msg.chat_id === chat.uuid
          )
          let staticFile: StaticFile | null = null

          if (
            message?.resource_url &&
            (message.type === MESSAGES_TYPES.IMAGE ||
              message.type === MESSAGES_TYPES.DOCUMENT)
          ) {
            staticFile = await getObjectSignedUrl(
              message.resource_url as string
            )
          } else if (
            message?.resource_url &&
            message.type === MESSAGES_TYPES.STICKER
          ) {
            staticFile = {
              url: message.resource_url as string,
              filename: `Gift message.gif`,
              contentType: 'image/gif',
            }
          }

          lastMessage = {
            uuid: message?.uuid as uuid,
            chatId: chat.uuid as uuid,
            content: message?.content as string,
            createdAt: message?.created_at as string,
            isDeleted: !!message?.is_deleted as unknown as boolean,
            isEdited: !!message?.is_edited as unknown as boolean,
            isRead: !!message?.is_read as unknown as boolean,
            isDelivered: !!message?.is_delivered as unknown as boolean,
            receiverId: message?.receiver_id as string,
            replyToId: message?.reply_to_id as uuid | null,
            file: staticFile,
            senderId: message?.sender_id as string,
            type: message?.type as (typeof MESSAGES_TYPES)[keyof typeof MESSAGES_TYPES],
            reactions: message?.reactions
              ? JSON.parse(message?.reactions as string)
              : null,
          }

          unreadMessages = message?.unread_count as number
        }

        const newChat: ServerChat = {
          uuid: chat.uuid as uuid,
          user: {
            id,
            name,
            picture: chatUser.picture as string,
          },
          createdAt: chat.created_at as string,
          unreadMessages,
          lastMessage,
          blockedBy: (chat.blocked_by as string) ?? null,
          isArchived:
            loggedUser.user_metadata?.chat_preferences.archived.includes(
              chat.uuid as uuid
            ),
          isDeleted:
            loggedUser.user_metadata?.chat_preferences.deleted.includes(
              chat.uuid as uuid
            ),
          isMuted: loggedUser.user_metadata?.chat_preferences.muted.includes(
            chat.uuid as uuid
          ),
          isPinned: loggedUser.user_metadata?.chat_preferences.pinned.includes(
            chat.uuid as uuid
          ),
          cleaned:
            (loggedUser.user_metadata?.chat_preferences.cleaned[
              chat.uuid as uuid
            ] as string) ?? null,
        }

        chats.push(newChat)
      }

      res.status(200).json(chats)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }

  async createChat(
    req: Request & { accessToken?: string },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const userId = req.auth?.payload?.sub
    const {
      uuid,
      user1_id,
      user2_id,
    }: { uuid: uuid; user1_id: string; user2_id: string } = req.body
    const created_at = new Date().toISOString()
    const chat: ServerChat = {
      uuid,
      createdAt: created_at,
      unreadMessages: 0,
      blockedBy: null,
    }

    if (!userId) {
      res.status(401).json({
        statusText:
          'Something went wrong validating your credentials, please try again later.',
        status: 401,
      })
      return
    }

    if (userId !== user1_id && userId !== user2_id) {
      res.status(403).json({
        statusText:
          'You can only create chats between yourself and another user.',
        status: 403,
      })
      return
    }

    try {
      await this.client.execute({
        sql: 'INSERT INTO chats (uuid, user1_id, user2_id, created_at) VALUES (:uuid, :user1_id, :user2_id, :created_at)',
        args: { uuid, user1_id, user2_id, created_at },
      })
      res.status(201).json(chat)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }

  async getChatById(
    req: Request & { accessToken?: string },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const chatId = req.params.chatId
    const userId = req.auth?.payload?.sub

    if (!chatId) {
      res.status(400).json({ statusText: 'Missing chat_id', status: 400 })
      return
    }

    if (!userId || !req.accessToken) {
      res.status(401).json({
        statusText:
          'Something went wrong validating your credentials, please try again later.',
        status: 401,
      })
      return
    }

    try {
      const result = await this.client.execute({
        sql: 'SELECT * FROM chats WHERE uuid = :uuid',
        args: { uuid: chatId },
      })

      if (!result.rows || result.rows.length === 0) {
        res.status(404).json({
          statusText: 'The chat you are trying to access does not exist.',
          status: 404,
        })
        return
      }

      const chatDB = result.rows[0]
      const id =
        chatDB.user1_id === userId
          ? (chatDB.user2_id as string)
          : (chatDB.user1_id as string)

      const chatUser = await getUserById(id, req.accessToken)
      const name = chatUser.name?.split(' ').slice(0, 2).join(' ') as string

      let lastMessage: Message | undefined = undefined
      let unreadMessages: number = 0

      const lastMsgAndUnreadCount = await this.client.execute({
        sql: `
          SELECT
            m1.*,
            COALESCE(unread.count, 0) as unread_count
          FROM
            messages m1
          LEFT JOIN (
            SELECT
              chat_id,
              COUNT(*) as count
            FROM
              messages
            WHERE
              chat_id = :chat_id AND
              receiver_id = :receiver_id AND
              is_read = false
          ) unread
          ON m1.chat_id = unread.chat_id
          WHERE
            m1.created_at = (
              SELECT
                MAX(m2.created_at)
              FROM
                messages m2
              WHERE
                m2.chat_id = :chat_id
            )
          LIMIT 1
        `,
        args: {
          receiver_id: userId,
          chat_id: chatDB.uuid,
        },
      })

      if (lastMsgAndUnreadCount.rows.length > 0) {
        const message = lastMsgAndUnreadCount.rows[0]
        let staticFile: StaticFile | null = null
        if (
          message.resource_url &&
          (message.type === MESSAGES_TYPES.IMAGE ||
            message.type === MESSAGES_TYPES.DOCUMENT)
        ) {
          staticFile = await getObjectSignedUrl(message.resource_url as string)
        } else if (
          message.resource_url &&
          message.type === MESSAGES_TYPES.STICKER
        ) {
          staticFile = {
            url: message.resource_url as string,
            filename: `Gift message.gif`,
            contentType: 'image/gif',
          }
        }
        lastMessage = {
          uuid: message.uuid as uuid,
          chatId: chatDB.uuid as uuid,
          content: message.content as string,
          createdAt: message.created_at as string,
          isDeleted: !!message.is_deleted as unknown as boolean,
          isEdited: !!message.is_edited as unknown as boolean,
          isRead: !!message.is_read as unknown as boolean,
          isDelivered: !!message.is_delivered as unknown as boolean,
          receiverId: message.receiver_id as string,
          replyToId: message.reply_to_id as uuid,
          file: staticFile,
          senderId: message.sender_id as string,
          type: message.type as (typeof MESSAGES_TYPES)[keyof typeof MESSAGES_TYPES],
          reactions: message.reactions
            ? JSON.parse(message.reactions as string)
            : null,
        }
      }

      unreadMessages =
        (lastMsgAndUnreadCount.rows[0].unread_count as number) ?? 0

      const loggedUser = await getUserById(userId, req.accessToken)
      const chat: ServerChat = {
        uuid: chatDB.uuid as uuid,
        user: {
          id,
          name,
          picture: chatUser.picture as string,
        },
        createdAt: chatDB.created_at as string,
        unreadMessages,
        lastMessage,
        blockedBy: (chatDB.blocked_by as string) ?? null,
        isArchived:
          loggedUser.user_metadata?.chat_preferences.archived.includes(
            chatDB.uuid as uuid
          ),
        isDeleted: loggedUser.user_metadata?.chat_preferences.deleted.includes(
          chatDB.uuid as uuid
        ),
        isMuted: loggedUser.user_metadata?.chat_preferences.muted.includes(
          chatDB.uuid as uuid
        ),
        isPinned: loggedUser.user_metadata?.chat_preferences.pinned.includes(
          chatDB.uuid as uuid
        ),
        cleaned:
          (loggedUser.user_metadata?.chat_preferences.cleaned[
            chatDB.uuid as uuid
          ] as string) ?? null,
      }

      res.status(200).json(chat)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }

  async getSignedFileUrls(
    req: Request & { accessToken?: string },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const messageUUIDs = req.params.messageIds?.split(',')

    if (
      !messageUUIDs ||
      !messageUUIDs?.every(
        (id) =>
          typeof id === 'string' &&
          id.match(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
          )
      )
    ) {
      res.status(400).json({
        statusText:
          "Invalid input: 'messageIds' should be an array of valid UUID strings.",
        status: 400,
      })
      return
    }

    if (messageUUIDs?.length === 0) {
      res.status(400).json({ statusText: 'Missing messageIds', status: 400 })
      return
    }

    try {
      const stringMessageUUIDs = messageUUIDs.map((id) => `'${id}'`).join(',')
      const selectStatement = await this.client.execute({
        sql: `SELECT uuid, resource_url FROM messages WHERE uuid IN (${stringMessageUUIDs})`,
        args: {},
      })

      if (selectStatement.rows?.length === 0) {
        res.status(404).json({ statusText: 'Messages not found', status: 404 })
        return
      }

      const updatedSignedUrls = await Promise.all(
        selectStatement.rows.map(async (message) => {
          const signedUrl = await getObjectSignedUrl(
            message.resource_url as string
          )
          return {
            uuid: message.uuid as uuid,
            file: signedUrl,
          }
        })
      )

      if (!updatedSignedUrls) {
        res.status(404).json({ statusText: 'Files not found', status: 404 })
        return
      }

      res.status(200).json(updatedSignedUrls)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }

  async updateChat(
    req: Request & { accessToken?: string },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const chatId = req.params.chatId
    const { blocked_by } = req.body

    if (!chatId) {
      res.status(400).json({ statusText: 'Missing chat_id', status: 400 })
      return
    }

    if (blocked_by === undefined) {
      res
        .status(400)
        .json({ statusText: 'Missing blocked_by field', status: 400 })
      return
    }

    try {
      const result = await this.client.execute({
        sql: 'SELECT * FROM chats WHERE uuid = :uuid',
        args: { uuid: chatId },
      })

      if (result.rows?.length === 0) {
        res.status(404).json({ statusText: 'Chat not found', status: 404 })
        return
      }

      await this.client.execute({
        sql: 'UPDATE chats SET blocked_by = :blocked_by WHERE uuid = :uuid',
        args: { blocked_by, uuid: chatId },
      })

      res.status(200).json({ statusText: 'OK', status: 200 })
    } catch (error) {
      console.error(error)
      next(error)
    }
  }
}
