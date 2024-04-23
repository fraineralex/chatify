import { Server, Socket } from 'socket.io'
import {
  ChangeChat,
  MessagesToRead,
  ServerMessage,
  ServerMessageDB,
  uuid
} from '../types/chat.js'
import { Client } from '@libsql/client'
import { SOCKET_EVENTS } from '../constants/index.js'
import { getUserById } from '../utils/user.js'
import { error } from 'console'

export class SocketController {
  private client: Client
  private io: Server

  constructor (io: Server, client: Client) {
    this.io = io
    this.client = client
  }

  async disconnect (): Promise<void> {
    console.log('User disconnected')
  }

  async newMessage (message: ServerMessage): Promise<void> {
    const uuid = crypto.randomUUID()
    const created_at = new Date().toISOString()
    const createdMessage: ServerMessageDB = {
      uuid,
      ...message,
      created_at
    }

    try {
      await this.client.execute({
        sql: 'INSERT INTO messages (uuid, content, sender_id, receiver_id, is_read, is_edited, is_deleted, reply_to_id, type, resource_url, chat_id, created_at) VALUES (:uuid, :content, :sender_id, :receiver_id, :is_read, :is_edited, :is_deleted, :reply_to_id, :type, :resource_url, :chat_id, :created_at)',
        args: {
          uuid,
          ...message,
          created_at
        }
      })


      this.io.emit(SOCKET_EVENTS.CHAT_MESSAGE, createdMessage)
      
    } catch (error) {
      console.error(error)
      return
    }

  }

  async readMessages (messages: MessagesToRead): Promise<void> {
    let selectResult
    let updateResult
    try {
      selectResult = await this.client.execute({
        sql: 'SELECT * FROM messages WHERE sender_id = :sender_id AND receiver_id = :receiver_id AND chat_id = :chat_id AND is_read = FALSE',
        args: { ...messages }
      })

      updateResult = await this.client.execute({
        sql: 'UPDATE messages SET is_read = TRUE WHERE sender_id = :sender_id AND receiver_id = :receiver_id AND chat_id = :chat_id AND is_read = FALSE',
        args: { ...messages }
      })

      if (
        selectResult.rowsAffected === updateResult.rowsAffected &&
        selectResult.rows.length > 0
      ) {
        selectResult.rows.forEach(row => {
          const message = {
            ...row
          }

          this.io.emit(SOCKET_EVENTS.READ_MESSAGE, message)
        })
      }
    } catch (error) {
      console.error(error)
      return
    }
  }

  async recoverMessages (socket: Socket): Promise<void> {
    if (socket.recovered) return

    const offset = socket.handshake.auth.serverOffset ?? 0
    const loggedUserId = socket.handshake.auth.userId

    try {
      const results = await this.client.execute({
        sql: `SELECT uuid, content, sender_id, receiver_id, is_read, is_edited, is_deleted, reply_to_id, type, resource_url, chat_id, created_at FROM messages WHERE created_at > :offset AND (sender_id = :loggedUserId OR receiver_id = :loggedUserId) ORDER BY created_at ASC`,
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

  private async updateChat(message: ServerMessageDB): Promise<ChangeChat | undefined>  {
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
      isRead: message.is_read,
        receiverId: message.receiver_id,
        replyToId: message.replyToId,
        resourceUrl: message.resource_url,
        senderId: message.sender_id,
        type: message.type
      }
    }

    return chat
  } catch (error) {
    console.error(error)
    return
  }
  }
}

