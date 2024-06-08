import { User } from '../types/chat'
import { metadata } from '../types/user'

const SERVER_URL =
  import.meta.env.VITE_SERVER_URL ?? 'http://localhost:3000'

export async function getAllUsers (token: string): Promise<User[] | undefined> {
  try {
    const response = await fetch(`${SERVER_URL}/api/users`, 
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
  token: string
) => {
  const data = await fetch(`${SERVER_URL}/api/users/metadata`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ metadata })
  })

  return data
}
