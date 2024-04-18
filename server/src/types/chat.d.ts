import { MESSAGES_TYPES } from '../constants/index.ts'

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

export interface MessagesToRead {
  sender_id: string
  receiver_id: string
}
