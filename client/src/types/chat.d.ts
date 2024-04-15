export interface Message {
  content: string
  createdAt: Date
  isMe: boolean
  user: {
    name: string
    avatar: string
  }
}

export interface ServerMessage {
  id: number
  content: string
  created_at: string
  username: string
}

export type Messages = Message[]
