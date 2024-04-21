import { MESSAGES_TYPES } from '../constants/index.ts'

type uuid = `${string}-${string}-${string}-${string}-${string}`

export interface ServerMessage {
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
}

export interface ServerMessageDB extends ServerMessage {
  uuid: uuid
  created_at: string
}

export interface MessagesToRead {
  chat_id: uuid
  sender_id: string
  receiver_id: string
}

export interface User {
  id: string
  name: string
  picture: string
}

export type Users = User[]

export interface Chat {
  uuid: uuid
  user1_id: string
  user2_id: string
  created_at: string
}
