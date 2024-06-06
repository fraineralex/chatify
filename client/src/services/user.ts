import { User } from '../types/chat'
import { metadata } from '../types/user'

const SERVER_DOMAIN =
  import.meta.env.VITE_SERVER_DOMAIN ?? 'http://localhost:3000'

export async function getAllUsers (token: string): Promise<User[] | undefined> {
  try {
    const response = await fetch(`${SERVER_DOMAIN}/users`, 
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return await response.json()
  } catch (error) {
    console.log(error)
    return
  }
}

export const updateUserMetadata = async (
  metadata: metadata,
  userSub: string,
  token: string
) => {
  const data = await fetch(`${SERVER_DOMAIN}/users/metadata/${userSub}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ metadata })
  })

  return data
}
