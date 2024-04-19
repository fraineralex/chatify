import { MESSAGES_TYPES } from '../constants'

export interface Message {
  uuid?: string
  content: string
  createdAt: Date
  senderId : string
  receiverId: string
  type: typeof MESSAGES_TYPES[keyof typeof MESSAGES_TYPES]
  resourceUrl: string | null
  isRead: boolean
  isEdited: boolean
  isDeleted: boolean
  replyToId: string | null
}

export interface ServerMessage {
  content: string
  sender_id: string
  receiver_id: string
  type: typeof MESSAGES_TYPES[keyof typeof MESSAGES_TYPES]
  resource_url: string | null
  is_read: boolean
  is_edited: boolean
  is_deleted: boolean
  reply_to_id: string | null
}

export interface ServerMessageDB extends ServerMessage {
  uuid: string
  created_at: string
}

export type Messages = Message[]

export interface Chat {
  user: {
    name: string
    avatar: string
  }
  lastMessage: string
  lastMessageDate: string
  unreadMessages: number
}

export type Chats = Chat[]

export interface CurrentChat {
  name: string
  draft: string
}

export interface MessagesToRead {
  sender_id: string
  receiver_id: string
}
