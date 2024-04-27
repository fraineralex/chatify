import { Chat, uuid } from '../types/chat'

const SERVER_DOMAIN =
  (import.meta.env.VITE_SERVER_DOMAIN as string) ?? 'http://localhost:3000'

export async function getChatById (
  chatId: string,
  userId: string | undefined
): Promise<Chat | undefined> {
  try {
    const response = await fetch(
      `${SERVER_DOMAIN}/chats/${chatId}?user_id=${userId}`
    )
    return await response.json()
  } catch (error) {
    console.log(error)
    return
  }
}

export async function createChat (
  user1Id: string | undefined,
  user2Id: string,
  uuid: uuid
): Promise<Chat | undefined> {
  try {
    const response = await fetch(`${SERVER_DOMAIN}/chats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uuid, user1_id: user1Id, user2_id: user2Id })
    })

    return await response.json()
  } catch (error) {
    console.log(error)
    return
  }
}

export async function getAllChats (
  userId: string | undefined
): Promise<Chat[] | undefined> {
  try {
    const response = await fetch(
      `${SERVER_DOMAIN}/chats${userId ? `?user_id=${userId}` : ''}`
    )
    return await response.json()
  } catch (error) {
    console.log(error)
    return
  }
}
