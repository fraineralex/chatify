import Dexie, { Table } from 'dexie'
import { Chat, Message } from '../types/chat'

export class DB extends Dexie {
  messages: Table<Message>
  chats: Table<Chat>

  constructor () {
    super('chatify')

    this.version(1).stores({
      messages:
        '&uuid, content, createdAt, senderId, receiverId, chatId, type, resourceUrl, isSent, isDelivered, isRead, isEdited, isDeleted, replyToId',
      chats: '&uuid, user, lastMessage, createdAt, unreadMessages, draft'
    })

    this.messages = this.table('messages')
    this.chats = this.table('chats')
  }
}

export const db = new DB()
