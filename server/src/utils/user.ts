import axios from 'axios'
import { User } from '../types/user.js'

const DOMAIN = process.env.AUTH0_DOMAIN ?? ''
const API_ACCESS_TOKEN = process.env.AUTH0_MGMT_API_TOKEN ?? ''

export async function getUserById (id: string) {
  const config = {
    method: 'GET',
    url: `https://${DOMAIN}/api/v2/users/${id}`,
    headers: {
      authorization: `Bearer ${API_ACCESS_TOKEN}`
    }
  }

  const response = await axios.request(config)
  return response.data as User
}
