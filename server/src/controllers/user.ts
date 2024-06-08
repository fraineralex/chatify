import axios from 'axios'
import { Response, Request } from 'express'
import dotenv from 'dotenv'
import { Users } from '../types/chat.js'
import { metadata, User } from '../types/user.js'

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

  static async getUserMetadata (req: Request, res: Response) {
    const userId = req.auth?.payload?.sub

    if(!userId) {
      res.status(401)
      .json({ 
        statusText: 'Something went wrong validating your credentials, please try again later.',
        status: 401 
      })
    return 
  }

    const config = {
      method: 'GET',
      url: `https://${DOMAIN}/api/v2/users/${userId}`,
      headers: {
        authorization: `Bearer ${API_ACCESS_TOKEN}`,
        Accept: 'application/json'
      }
    }

    try {
      const data = await axios.request(config)
      if (data.status !== 200) {
        return res
          .status(data.status)
          .json({ statusText: data.statusText, status: data.status })
      }

      res.status(200).json(data.data.user_metadata)
    } catch (error) {
      console.error(error)
    }
  }

  static async updateMetadata (req: Request, res: Response) {
    const userId = req.auth?.payload?.sub
    const { metadata } = req.body as { metadata: metadata }

    if (!metadata) {
      res.status(400).json({ statusText: 'Metadata is required', status: 400 })
      return
    }

    if(!userId) {
      res.status(401)
      .json({ 
        statusText: 'Something went wrong validating your credentials, please try again later.',
        status: 401 
      })
    return 
  }

    const config = {
      method: 'PATCH',
      url: `https://${DOMAIN}/api/v2/users/${userId}`,
      headers: {
        authorization: `Bearer ${API_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      data: {
        user_metadata: metadata
      }
    }

    try {
      const data = await axios.request(config)
      if (data.status !== 200) {
        return res
          .status(data.status)
          .json({ statusText: data.statusText, status: data.status })
      }

      res.status(200).json({ statusText: data.statusText, status: data.status })
    } catch (error) {
      console.error(error)
    }
  }
}
