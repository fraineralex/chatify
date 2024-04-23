import { Request, Response } from 'express'
import { Chat, Message, ServerChat, uuid } from '../types/chat.js'
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
      res.status(400).json({ error: 'Missing user_id' })
      return
    }

    try {
      const result = await this.client.execute({
        sql: 'SELECT * FROM chats WHERE user1_id = :user_id OR user2_id = :user_id',
        args: { user_id: userId }
      })

      const chats: ServerChat[] = []
      for (const chat of result.rows) {
        const id =
          chat.user1_id === userId
            ? (chat.user2_id as string)
            : (chat.user1_id as string)

        const chatUser = await getUserById(id)
        const name = chatUser.name?.split(' ').slice(0, 2).join(' ') as string

        let lastMessage: Message
        let unreadMessages: number

        const resultMessage = await this.client.execute({
          sql: 'SELECT * FROM messages WHERE chat_id = :chat_id ORDER BY created_at DESC LIMIT 1',
          args: { chat_id: chat.uuid }
        })

        lastMessage = {
          uuid: resultMessage.rows[0].uuid as uuid,
          chatId: chat.uuid as uuid,
          content: resultMessage.rows[0].content as string,
          createdAt: resultMessage.rows[0].created_at as string,
          isDeleted: !!resultMessage.rows[0].is_deleted as unknown as boolean,
          isEdited: !!resultMessage.rows[0].is_edited as unknown as boolean,
          isRead: !!resultMessage.rows[0].is_read as unknown as boolean,
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

        const newChat: ServerChat = {
          uuid: chat.uuid as uuid,
          user: {
            id,
            name,
            picture: chatUser.picture as string
          },
          createdAt: chat.created_at as string,
          unreadMessages,
          lastMessage
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
    const { user1_id, user2_id } = req.body
    const uuid = crypto.randomUUID()
    const created_at = new Date().toISOString()
    const chat: Chat = {
      uuid,
      user1_id,
      user2_id,
      created_at
    }

    try {
      await this.client.execute({
        sql: 'INSERT INTO chats (uuid, user1_id, user2_id, created_at) VALUES (:uuid, :user1_id, :user2_id, :created_at)',
        args: { ...chat }
      })
      res.status(201).json(chat)
    } catch (error) {
      console.error(error)
      throw Error('Failed to save record: ' + JSON.stringify(error))
      return
    }
  }
}
