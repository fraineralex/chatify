import Dexie, { Table } from 'dexie'
import { Chat, Message } from '../types/chat'

export class DB extends Dexie {
  messages: Table<Message>
  chats: Table<Chat>

  constructor () {
    super('chatify')

    this.version(1).stores({
      messages:
        '&uuid, content, sender_id, receiver_id, is_read, is_edited, is_deleted, reply_to_id, type, resource_url, chat_id, created_at',
      chats: '&uuid, user, lastMessage, createdAt, unreadMessages'
    })

    this.messages = this.table('messages')
    this.chats = this.table('chats')
  }
}

export const db = new DB()
