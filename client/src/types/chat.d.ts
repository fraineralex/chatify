export interface Message {
  uuid?: string
  content: string
  createdAt: Date
  sender_id: {
    username: string
    avatar: string
  }
  receiver_id: {
    username: string
    avatar: string
  }
}

export interface ServerMessage {
  uuid: string
  content: string
  sender_id: string
  receiver_id: string
  created_at: string
}

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

export type Messages = Message[]
