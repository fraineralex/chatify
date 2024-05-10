import { Request, Response } from 'express'
import { Message, ServerChat, uuid } from '../types/chat.js'
import { Client } from '@libsql/client'
import { getUserById } from '../utils/user.js'
import { MESSAGES_TYPES } from '../constants/index.js'

export class ChatController {
  private client: Client

  constructor (client: Client) {
    this.client = client
  }

  async getAllChats (req: Request, res: Response): Promise<void> {
    const userId = req.query.user_id as string

    if (!userId) {
      res.status(400).json({ statusText: 'Missing user_id', status: 400 })
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

        if (resultMessage.rows.length > 0) {
          lastMessage = {
            uuid: resultMessage.rows[0].uuid as uuid,
            chatId: chat.uuid as uuid,
            content: resultMessage.rows[0].content as string,
            createdAt: resultMessage.rows[0].created_at as string,
            isDeleted: !!resultMessage.rows[0].is_deleted as unknown as boolean,
            isEdited: !!resultMessage.rows[0].is_edited as unknown as boolean,
            isRead: !!resultMessage.rows[0].is_read as unknown as boolean,
            isDelivered: !!resultMessage.rows[0]
              .is_delivered as unknown as boolean,
            receiverId: resultMessage.rows[0].receiver_id as string,
            replyToId: resultMessage.rows[0].reply_to_id as uuid,
            resourceUrl: resultMessage.rows[0].resource_url as string,
            senderId: resultMessage.rows[0].sender_id as string,
            type: resultMessage.rows[0]
              .type as typeof MESSAGES_TYPES[keyof typeof MESSAGES_TYPES]
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

  async createChat (req: Request, res: Response): Promise<void> {
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

  async getChatById (req: Request, res: Response): Promise<void> {
    const chatId = req.params.chatId
    const userId = req.query.user_id as string
    console.log(chatId)

    if (!chatId) {
      res.status(400).json({ statusText: 'Missing chat_id', status: 400 })
      return
    }

    if (!userId) {
      res.status(400).json({ statusText: 'Missing user_id', status: 400 })
      return
    }

    try {
      const result = await this.client.execute({
        sql: 'SELECT * FROM chats WHERE uuid = :uuid',
        args: { uuid: chatId }
      })

      if (result.rows.length === 0) {
        res.status(404).json({ statusText: 'Chat not found', status: 404 })
        return
      }

      const chatDB = result.rows[0]
      const id =
        chatDB.user1_id === userId
          ? (chatDB.user2_id as string)
          : (chatDB.user1_id as string)

      const chatUser = await getUserById(id)
      const name = chatUser.name?.split(' ').slice(0, 2).join(' ') as string

      let unreadMessages: number = 0

      const resultUnreadMessages = await this.client.execute({
        sql: 'SELECT COUNT(*) as count FROM messages WHERE chat_id = :chat_id AND receiver_id = :receiver_id AND is_read = false',
        args: { chat_id: chatId, receiver_id: userId }
      })

      unreadMessages = (resultUnreadMessages.rows[0].count as number) ?? 0

      const chat: ServerChat = {
        uuid: chatDB.uuid as uuid,
        user: {
          id,
          name,
          picture: chatUser.picture as string
        },
        createdAt: chatDB.created_at as string,
        unreadMessages,
        blockedBy: (chatDB.blocked_by as string) ?? null
      }

      res.status(200).json(chat)
    } catch (error) {
      console.error(error)
      throw Error('Failed to fetch record: ' + JSON.stringify(error))
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

      if (result.rows.length === 0) {
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
