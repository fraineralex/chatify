export interface Message {
  content: string
  created_at: Date
  isMe: boolean
  user: {
    name: string
    avatar: string
  }
}

export type Messages = Message[]
