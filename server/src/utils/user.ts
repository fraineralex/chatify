import axios from 'axios'
import { User } from '../types/user.js'

const AUTH0_AUDIENCE = process.env.AUTH0_API_IDENTIFIER ?? ''

export async function getUserById(id: string, accessToken: string) {
  const config = {
    method: 'GET',
    url: `${AUTH0_AUDIENCE}users/${id}`,
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  }

  const response = await axios.request(config)
  return response.data as User
}

export async function getUsersByIds(ids: Array<string>, accesToken: string) {
  const config = {
    method: 'GET',
    url: `${AUTH0_AUDIENCE}users`,
    headers: {
      authorization: `Bearer ${accesToken}`,
    },
    params: {
      q: `user_id:(${ids.map((id) => `"${id}"`).join(' OR ')})`,
      search_engine: 'v3',
    },
  }

  const response = await axios.request(config)
  return response.data as User[]
}
