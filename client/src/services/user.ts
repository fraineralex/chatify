import { User } from '../types/chat'
import { metadata } from '../types/user'

const SERVER_DOMAIN =
  import.meta.env.VITE_SERVER_DOMAIN ?? 'http://localhost:3000'

export async function getAllUsers (): Promise<User[] | undefined> {
  try {
    const response = await fetch(`${SERVER_DOMAIN}/users`)
    return await response.json()
  } catch (error) {
    console.log(error)
    return
  }
}

export const updateUserMetadata = async (
  metadata: metadata,
  userSub: string | undefined
) => {
  const data = await fetch(`${SERVER_DOMAIN}/users/${userSub}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ metadata })
  })

  return data
}
