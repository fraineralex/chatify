import axios from 'axios'
import { Response, Request } from 'express'
import dotenv from 'dotenv'
import { Users } from '../types/chat.js'
import { User } from '../types/user.js'

dotenv.config({ path: '.env.local' })

const DOMAIN = process.env.AUTH0_DOMAIN ?? ''
const API_ACCESS_TOKEN = process.env.AUTH0_MGMT_API_TOKEN ?? ''

export class UserController {
  static async getAll (req: Request, res: Response): Promise<void> {
    const config = {
      method: 'GET',
      url: `https://${DOMAIN}/api/v2/users`,
      maxBodyLength: Infinity,
      headers: {
        authorization: `Bearer ${API_ACCESS_TOKEN}`,
        Accept: 'application/json'
      }
    }

    const response = await axios.request(config)
    const users: Users = response.data.map((user: User) => {
      const name = user.name.split(' ').slice(0, 2).join(' ')
      return {
        id: user.user_id,
        name,
        picture: user.picture
      }
    })
    res.status(200).json(users)
  }

}
