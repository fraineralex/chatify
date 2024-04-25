import { Chat } from "../types/chat"

const SERVER_DOMAIN = import.meta.env.VITE_SERVER_DOMAIN as string ?? 'http://localhost:3000'

export async function getChatById(chatId: string, userId: string | undefined): Promise<Chat> {
  const response = await fetch(`${SERVER_DOMAIN}/chats/${chatId}?user_id=${userId}`)

  return await response.json()
}
