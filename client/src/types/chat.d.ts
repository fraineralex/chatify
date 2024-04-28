import { MESSAGES_TYPES } from '../constants'

type uuid = `${string}-${string}-${string}-${string}-${string}`

export interface Message {
  uuid: uuid
  content: string
  createdAt: Date
  senderId: string
  receiverId: string
  chatId: uuid
  type: typeof MESSAGES_TYPES[keyof typeof MESSAGES_TYPES]
  resourceUrl: string | null
  isRead: boolean
  isSent: boolean
  isEdited: boolean
  isDeleted: boolean
  replyToId: string | null
}

export interface ServerMessage {
  uuid: uuid
  content: string
  sender_id: string
  receiver_id: string
  chat_id: uuid
  type: typeof MESSAGES_TYPES[keyof typeof MESSAGES_TYPES]
  resource_url: string | null
  is_read: boolean
  is_edited: boolean
  is_deleted: boolean
  reply_to_id: string | null
  created_at: string
}

export type Messages = Message[]

interface User {
  id: string
  name: string
  picture: string
}

export interface Chat {
  uuid: uuid
  user: User
  lastMessage?: Message
  createdAt: Date
  unreadMessages: number
}

export type Chats = Chat[]

export interface ChatDB {
  uuid: uuid
  user1_id: string
  user2_id: string
  created_at: string
}

export interface CurrentChat extends Chat {
  draft: string
}

export interface ChangeChat {
  uuid: uuid
  lastMessage?: Message
}

export interface MessagesToRead {
  chat_id: uuid
  sender_id: string
  receiver_id?: string
}

export interface User {
  id: string
  name: string
  picture: string
}

export interface ChatItem {
  uuid?: uuid
  user: User
  lastMessage?: Message
  createdAt?: Date
  unreadMessages?: number
  isNewChat?: boolean
}
