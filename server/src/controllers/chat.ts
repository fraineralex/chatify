import { Request, Response } from 'express'
import { Message, ServerChat, StaticFile, uuid } from '../types/chat.js'
import { Client } from '@libsql/client'
import { getUserById } from '../utils/user.js'
import { MESSAGES_TYPES } from '../constants/index.js'
import { getObjectSignedUrl } from '../utils/s3.js'

export class ChatController {
  private client: Client

  constructor (client: Client) {
    this.client = client
  }

  async getAllChats (req: Request & { auth?: { sub?:string } }, res: Response): Promise<void> {
    const userId = req.auth?.sub

    if(!userId) {
      res.status(401)
      .json({ 
        statusText: 'Something went wrong validating your credentials, please try again later.',
        status: 401 
      })
    return 
  }

    try {
      const result = await this.client.execute({
        sql: 'SELECT * FROM chats WHERE user1_id = :user_id OR user2_id = :user_id',
        args: { user_id: userId }
      })

      const chats: ServerChat[] = []
      const loggedUser = await getUserById(userId)
      for (const chat of result.rows) {
        const id =
          chat.user1_id === userId
            ? (chat.user2_id as string)
            : (chat.user1_id as string)

        const chatUser = await getUserById(id)
        const name = chatUser.name?.split(' ').slice(0, 2).join(' ') as string

        let lastMessage: Message | undefined = undefined
        let unreadMessages: number = 0

        const resultMessage = await this.client.execute({
          sql: 'SELECT * FROM messages WHERE chat_id = :chat_id ORDER BY created_at DESC LIMIT 1',
          args: { chat_id: chat.uuid }
        })

        if (resultMessage.rows?.length > 0) {
          const message = resultMessage.rows[0]
          let staticFile: StaticFile | null = null

          if (
            message.resource_url &&
            (message.type === MESSAGES_TYPES.IMAGE ||
              message.type === MESSAGES_TYPES.DOCUMENT)
          ) {
            staticFile = await getObjectSignedUrl(
              message.resource_url as string
            )
          } else if (
            message.resource_url &&
            message.type === MESSAGES_TYPES.STICKER
          ) {
            staticFile = {
              url: message.resource_url as string,
              filename: `Gift message.gif`,
              contentType: 'image/gif'
            }
          }

          lastMessage = {
            uuid: message.uuid as uuid,
            chatId: chat.uuid as uuid,
            content: message.content as string,
            createdAt: message.created_at as string,
            isDeleted: !!message.is_deleted as unknown as boolean,
            isEdited: !!message.is_edited as unknown as boolean,
            isRead: !!message.is_read as unknown as boolean,
            isDelivered: !!message.is_delivered as unknown as boolean,
            receiverId: message.receiver_id as string,
            replyToId: message.reply_to_id as uuid | null,
            file: staticFile,
            senderId: message.sender_id as string,
            type: message.type as typeof MESSAGES_TYPES[keyof typeof MESSAGES_TYPES],
            reactions: message.reactions
              ? JSON.parse(message.reactions as string)
              : null
          }

          const resultUnreadMessages = await this.client.execute({
            sql: 'SELECT COUNT(*) as count FROM messages WHERE chat_id = :chat_id AND receiver_id = :receiver_id AND is_read = false',
            args: { chat_id: chat.uuid, receiver_id: userId }
          })

          unreadMessages = resultUnreadMessages.rows[0].count as number
        }

        const newChat: ServerChat = {
          uuid: chat.uuid as uuid,
          user: {
            id,
            name,
            picture: chatUser.picture as string
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
            ] as string) ?? null
        }

        chats.push(newChat)
      }

      res.status(200).json(chats)
    } catch (error) {
      console.error(error)
      throw Error('Failed to fetch records: ' + JSON.stringify(error))
      return
    }
  }

  async createChat (req: Request &{ auth?: { sub?: string } }, res: Response): Promise<void> {
    const userId = req.auth?.sub
    const {
      uuid,
      user1_id,
      user2_id
    }: { uuid: uuid; user1_id: string; user2_id: string } = req.body
    const created_at = new Date().toISOString()
    const chat: ServerChat = {
      uuid,
      createdAt: created_at,
      unreadMessages: 0,
      blockedBy: null
    }

    if(!userId) {
      res.status(401)
      .json({ 
        statusText: 'Something went wrong validating your credentials, please try again later.',
        status: 401 
      })
      return 
    }

    if(userId !== user1_id && userId !== user2_id) {
      res.status(403)
      .json({ 
        statusText: 'You can only create chats between yourself and another user.',
        status: 403 
      })
      return 
    }

    try {
      await this.client.execute({
        sql: 'INSERT INTO chats (uuid, user1_id, user2_id, created_at) VALUES (:uuid, :user1_id, :user2_id, :created_at)',
        args: { uuid, user1_id, user2_id, created_at }
      })
      res.status(201).json(chat)
    } catch (error) {
      console.error(error)
      throw Error('Failed to save record: ' + JSON.stringify(error))
      return
    }
  }

  async getChatById (req: Request & { auth?: { sub?: string } }, res: Response): Promise<void> {
    const chatId = req.params.chatId
    const userId = req.auth?.sub

    if (!chatId) {
      res.status(400).json({ statusText: 'Missing chat_id', status: 400 })
      return
    }

    if(!userId) {
      res.status(401)
      .json({ 
        statusText: 'Something went wrong validating your credentials, please try again later.',
        status: 401 
      })
      return 
    }

    try {
      const result = await this.client.execute({
        sql: 'SELECT * FROM chats WHERE uuid = :uuid',
        args: { uuid: chatId }
      })

      if (!result.rows || result.rows.length === 0) {
        res.status(404)
        .json({ 
          statusText: 'The chat you are trying to access does not exist.', 
          status: 404 
        })
        return
      }

      const chatDB = result.rows[0]
      const id =
        chatDB.user1_id === userId
          ? (chatDB.user2_id as string)
          : (chatDB.user1_id as string)

      const chatUser = await getUserById(id)
      const name = chatUser.name?.split(' ').slice(0, 2).join(' ') as string

      let lastMessage: Message | undefined = undefined
      let unreadMessages: number = 0

      const resultMessage = await this.client.execute({
        sql: 'SELECT * FROM messages WHERE chat_id = :chat_id ORDER BY created_at DESC LIMIT 1',
        args: { chat_id: chatDB.uuid }
      })

      if (resultMessage.rows && resultMessage.rows.length > 0) {
        const message = resultMessage.rows[0]
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
            contentType: 'image/gif'
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
          type: message.type as typeof MESSAGES_TYPES[keyof typeof MESSAGES_TYPES],
          reactions: message.reactions
            ? JSON.parse(message.reactions as string)
            : null
        }
      }

      const resultUnreadMessages = await this.client.execute({
        sql: 'SELECT COUNT(*) as count FROM messages WHERE chat_id = :chat_id AND receiver_id = :receiver_id AND is_read = false',
        args: { chat_id: chatId, receiver_id: userId }
      })

      unreadMessages = (resultUnreadMessages.rows[0].count as number) ?? 0

      const loggedUser = await getUserById(userId)
      const chat: ServerChat = {
        uuid: chatDB.uuid as uuid,
        user: {
          id,
          name,
          picture: chatUser.picture as string
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
          ] as string) ?? null
      }

      res.status(200).json(chat)
    } catch (error) {
      console.error(error)
      throw Error('Failed to fetch record: ' + JSON.stringify(error))
      return
    }
  }

  async getSignedFileUrls (req: Request, res: Response): Promise<void> {
    const messageUUIDs = req.params.messageIds?.split(',')

    if (
      !messageUUIDs ||
      !messageUUIDs?.every(
        id =>
          typeof id === 'string' &&
          id.match(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
          )
      )
    ) {
      res.status(400).json({
        statusText:
          "Invalid input: 'messageIds' should be an array of valid UUID strings.",
        status: 400
      })
      return
    }

    if (messageUUIDs?.length === 0) {
      res.status(400).json({ statusText: 'Missing messageIds', status: 400 })
      return
    }

    try {
      const stringMessageUUIDs = messageUUIDs.map(id => `'${id}'`).join(',')
      const selectStatement = await this.client.execute({
        sql: `SELECT uuid, resource_url FROM messages WHERE uuid IN (${stringMessageUUIDs})`,
        args: {}
      })

      if (selectStatement.rows?.length === 0) {
        res.status(404).json({ statusText: 'Messages not found', status: 404 })
        return
      }

      const updatedSignedUrls = await Promise.all(
        selectStatement.rows.map(async message => {
          const signedUrl = await getObjectSignedUrl(
            message.resource_url as string
          )
          return {
            uuid: message.uuid as uuid,
            file: signedUrl
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
      return
    }
  }

  async updateChat (req: Request, res: Response): Promise<void> {
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
        args: { uuid: chatId }
      })

      if (result.rows?.length === 0) {
        res.status(404).json({ statusText: 'Chat not found', status: 404 })
        return
      }

      await this.client.execute({
        sql: 'UPDATE chats SET blocked_by = :blocked_by WHERE uuid = :uuid',
        args: { blocked_by, uuid: chatId }
      })

      res.status(200).json({ statusText: 'OK', status: 200 })
    } catch (error) {
      console.error(error)
      throw Error('Failed to update record: ' + JSON.stringify(error))
      return
    }
  }
}
