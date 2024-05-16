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
  isSent: boolean
  isDelivered: boolean
  isRead: boolean
  isEdited: boolean
  isDeleted: boolean
  replyToId: uuid | null
  reactions: { [key: string]: string } | null
}

export interface ReplyMessage {
  uuid: uuid
  content: string
  type: typeof MESSAGES_TYPES[keyof typeof MESSAGES_TYPES]
  resourceUrl: string | null
  user: User
}

export interface ServerMessage {
  uuid: uuid
  content: string
  sender_id: string
  receiver_id: string
  chat_id: uuid
  type: typeof MESSAGES_TYPES[keyof typeof MESSAGES_TYPES]
  resource_url: string | null
  is_delivered: boolean
  is_read: boolean
  is_edited: boolean
  is_deleted: boolean
  reply_to_id: uuid | null
  created_at: string
  reactions: string | null
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
  draft?: string
  isMuted?: boolean
  isDeleted?: boolean
  isArchived?: boolean
  isPinned?: boolean
  cleaned?: Date | null
  blockedBy?: string | null
  isUnread?: boolean
}

export type Chats = Chat[]

export interface ChatDB {
  uuid: uuid
  user1_id: string
  user2_id: string
  blocked_by: string | null
  created_at: string
}

export interface CurrentChat extends Chat {
  draft: string
}

export interface ChangeChat {
  uuid: uuid
  lastMessage?: Message
}

export interface MessagesToUpdate {
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
  isPinned?: boolean
  isUnread?: boolean
  cleaned?: Date | null
}

export type EmojiEvent = {
  unified: string
  emoji: string
}

export type ChatFilterState =
  | 'all'
  | 'blocked'
  | 'archived'
  | 'muted'
  | 'unread'
  | 'search'
