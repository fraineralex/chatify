import { User } from '@auth0/auth0-react'
import { Chat, Message, SignedFile, uuid } from '../types/chat'

const SERVER_DOMAIN =
  (import.meta.env.VITE_SERVER_DOMAIN as string) ?? 'http://localhost:3000'

export async function getChatById (
  chatId: string,
  userId: string | undefined,
  token: string
): Promise<Chat | undefined> {
  try {
    const response = await fetch(
      `${SERVER_DOMAIN}/chats/${chatId}?user_id=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
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
  uuid: uuid,
  token: string
): Promise<Chat | undefined> {
  try {
    const response = await fetch(`${SERVER_DOMAIN}/chats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
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
  userId: string | undefined, token: string
): Promise<Chat[] | undefined> {
  try {
    const response = await fetch(
      `${SERVER_DOMAIN}/chats${userId && `?user_id=${userId}`}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    return await response.json()
  } catch (error) {
    console.log(error)
    return
  }
}

export async function toggleChatBlock (
  chatId: uuid,
  userId: string | undefined,
  token: string
) {
  try {
    const response = await fetch(`${SERVER_DOMAIN}/chats/${chatId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ blocked_by: userId ?? null })
    })
    return await response.json()
  } catch (error) {
    console.log(error)
    return
  }
}

export async function updateChatLastMessage (
  chats: Chat[],
  message: Message,
  loggedUser: User | undefined,
  token: string
) {
  let chat = chats.find(c => c.uuid === message.chatId)
  if (!chat) {
    chat = await getChatById(message.chatId, loggedUser?.sub, token)
  }

  if (!chat || chat.lastMessage?.uuid !== message.uuid) return

  chat.lastMessage =
    chat.lastMessage &&
    chat.lastMessage.createdAt.getTime() > message.createdAt.getTime()
      ? chat.lastMessage
      : message

  return chat
}

export async function getSignedUrls (messageIds: uuid[], token: string) {
  try {
    const response = await fetch(
      `${SERVER_DOMAIN}/chats/signed-urls/${messageIds.join(',')}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    if (!response.ok) return []
    return (await response.json()) as SignedFile[]
  } catch (error) {
    console.log(error)
    return []
  }
}
