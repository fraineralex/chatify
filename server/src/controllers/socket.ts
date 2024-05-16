import { Server, Socket } from 'socket.io'
import {
  ChangeChat,
  Message,
  MessagesToUpdate,
  ServerMessage,
  uuid
} from '../types/chat.js'
import { Client } from '@libsql/client'
import { SOCKET_EVENTS } from '../constants/index.js'

export class SocketController {
  private client: Client
  private io: Server

  constructor (io: Server, client: Client) {
    this.io = io
    this.client = client
  }

  async disconnect (): Promise<void> {
    //console.log('User disconnected')
  }

  async newMessage (message: ServerMessage): Promise<void> {
    const createdMessage: ServerMessage = {
      ...message
    }

    try {
      await this.client.execute({
        sql: 'INSERT INTO messages (uuid, content, sender_id, receiver_id, is_read, is_delivered, is_edited, is_deleted, reply_to_id, type, resource_url, chat_id, reactions, created_at) VALUES (:uuid, :content, :sender_id, :receiver_id, :is_read, :is_delivered, :is_edited, :is_deleted, :reply_to_id, :type, :resource_url, :chat_id, :reactions, :created_at)',
        args: {
          ...message
        }
      })

      this.io.emit(SOCKET_EVENTS.CHAT_MESSAGE, createdMessage)
    } catch (error) {
      console.error(error)
      return
    }
  }

  async readMessages (messages: MessagesToUpdate): Promise<void> {
    try {
      const selectResult = await this.client.execute({
        sql: 'SELECT * FROM messages WHERE sender_id = :sender_id AND receiver_id = :receiver_id AND chat_id = :chat_id AND is_read = FALSE ORDER BY created_at ASC',
        args: { ...messages }
      })

      if (selectResult.rows.length === 0) return

      const updateResult = await this.client.execute({
        sql: 'UPDATE messages SET is_read = TRUE, is_delivered = TRUE WHERE sender_id = :sender_id AND receiver_id = :receiver_id AND chat_id = :chat_id AND is_read = FALSE',
        args: { ...messages }
      })

      if (selectResult.rows.length === updateResult.rowsAffected) {
        const messages: uuid[] = []
        selectResult.rows.forEach(row => messages.push(row.uuid as uuid))

        this.io.emit(SOCKET_EVENTS.READ_MESSAGE, messages)
      }
    } catch (error) {
      console.error(error)
      return
    }
  }

  async deliverMessages (messages: MessagesToUpdate): Promise<void> {
    try {
      const selectResult = await this.client.execute({
        sql: 'SELECT * FROM messages WHERE sender_id = :sender_id AND receiver_id = :receiver_id AND chat_id = :chat_id AND is_delivered = FALSE ORDER BY created_at ASC',
        args: { ...messages }
      })

      if (selectResult.rows.length === 0) return

      const updateResult = await this.client.execute({
        sql: 'UPDATE messages SET is_delivered = TRUE WHERE sender_id = :sender_id AND receiver_id = :receiver_id AND chat_id = :chat_id AND is_delivered = FALSE',
        args: { ...messages }
      })

      if (selectResult.rows.length === updateResult.rowsAffected) {
        const messages: uuid[] = []
        selectResult.rows.forEach(row => messages.push(row.uuid as uuid))

        this.io.emit(SOCKET_EVENTS.DELIVERED_MESSAGE, messages)
      }
    } catch (error) {
      console.error(error)
      return
    }
  }

  async editMessage (message: Message) {
    try {
      const reactions = message.reactions
        ? JSON.stringify(message.reactions)
        : null
      const updateResult = await this.client.execute({
        sql: 'UPDATE messages SET is_edited = TRUE, content = :content, reactions = :reactions WHERE uuid = :uuid;',
        args: { content: message.content, uuid: message.uuid!, reactions }
      })

      if (updateResult.rowsAffected === 1) {
        this.io.emit(SOCKET_EVENTS.UPDATE_MESSAGE, message)
      }
    } catch (error) {
      console.error(error)
      return
    }
  }

  async deleteMessage (message: Message) {
    try {
      const updateResult = await this.client.execute({
        sql: 'UPDATE messages SET is_deleted = TRUE WHERE uuid = :uuid;',
        args: { uuid: message.uuid! }
      })

      if (updateResult.rowsAffected === 1) {
        this.io.emit(SOCKET_EVENTS.UPDATE_MESSAGE, message)
      }
    } catch (error) {
      console.error(error)
      return
    }
  }

  recoverMessages = (socket: Socket) => async (): Promise<void> => {
    const offset = socket.handshake.auth.serverOffset ?? 0
    const loggedUserId = socket.handshake.auth.userId

    try {
      const results = await this.client.execute({
        sql: `SELECT uuid, content, sender_id, receiver_id, is_read, is_delivered, is_edited, is_deleted, reply_to_id, type, resource_url, chat_id, reactions, created_at FROM messages WHERE created_at > :offset AND (sender_id = :loggedUserId OR receiver_id = :loggedUserId) ORDER BY created_at ASC`,
        args: { offset, loggedUserId }
      })

      results.rows.forEach(row => {
        const message = {
          ...row
        }
        socket.emit(SOCKET_EVENTS.CHAT_MESSAGE, message)
      })
    } catch (e) {
      console.error(e)
      return
    }
  }

  private async updateChat (
    message: ServerMessage
  ): Promise<ChangeChat | undefined> {
    try {
      const result = await this.client.execute({
        sql: 'SELECT * FROM chats WHERE uuid = :chat_id LIMIT 1',
        args: { chat_id: message.chat_id }
      })

      const chat: ChangeChat = {
        uuid: result.rows[0].uuid as uuid,
        lastMessage: {
          uuid: message.uuid,
          chatId: message.chat_id,
          content: message.content,
          createdAt: message.created_at,
          isDeleted: message.is_deleted,
          isEdited: message.is_edited,
          isDelivered: message.is_delivered,
          isRead: message.is_read,
          receiverId: message.receiver_id,
          replyToId: message.replyToId,
          resourceUrl: message.resource_url,
          senderId: message.sender_id,
          type: message.type,
          reactions: message.reactions ? JSON.parse(message.reactions) : null
        }
      }

      return chat
    } catch (error) {
      console.error(error)
      return
    }
  }
}
