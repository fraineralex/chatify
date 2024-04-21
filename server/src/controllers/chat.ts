import { Request, Response } from 'express'
import { Chat } from '../types/chat.js'
import { Client } from '@libsql/client'

export class ChatController {
  private client: Client

  constructor (client: Client) {
    this.client = client
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
