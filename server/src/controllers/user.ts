import axios from 'axios'
import { Response, Request, NextFunction } from 'express'
import dotenv from 'dotenv'
import { Users } from '../types/chat.js'
import { metadata, User } from '../types/user.js'

dotenv.config({ path: '.env.local' })

const DOMAIN = process.env.AUTH0_DOMAIN ?? ''

export class UserController {
  static async getAll(
    req: Request & { accessToken?: string },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const config = {
      method: 'GET',
      url: `https://${DOMAIN}/api/v2/users`,
      maxBodyLength: Infinity,
      headers: {
        authorization: `Bearer ${req.accessToken}`,
        Accept: 'application/json',
      },
    }

    try {
      const response = await axios.request(config)
      const users: Users = response.data.map((user: User) => {
        const name = user.name.split(' ').slice(0, 2).join(' ')
        return {
          id: user.user_id,
          name,
          picture: user.picture,
        }
      })
      res.status(200).json(users)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }

  static async getUserMetadata(
    req: Request & { accessToken?: string },
    res: Response,
    next: NextFunction
  ) {
    const userId = req.auth?.payload?.sub

    if (!userId) {
      res.status(401).json({
        statusText:
          'Something went wrong validating your credentials, please try again later.',
        status: 401,
      })
      return
    }

    const config = {
      method: 'GET',
      url: `https://${DOMAIN}/api/v2/users/${userId}`,
      headers: {
        authorization: `Bearer ${req.accessToken}`,
        Accept: 'application/json',
      },
    }

    try {
      const data = await axios.request(config)
      if (data.status !== 200) {
        return res
          .status(data.status)
          .json({ statusText: data.statusText, status: data.status })
      }

      let userMetadata: metadata = data.data.user_metadata
      if (!userMetadata) {
        userMetadata = {
          chat_preferences: {
            archived: [],
            cleaned: {},
            deleted: [],
            muted: [],
            pinned: [],
          },
        }

        const config = {
          method: 'PATCH',
          url: `https://${DOMAIN}/api/v2/users/${userId}`,
          headers: {
            authorization: `Bearer ${req.accessToken}`,
            'Content-Type': 'application/json',
          },
          data: {
            user_metadata: userMetadata,
          },
        }

        const data = await axios.request(config)
        if (data.status !== 200) {
          return res
            .status(data.status)
            .json({ statusText: data.statusText, status: data.status })
        }
      }

      res.status(200).json(userMetadata)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }

  static async updateMetadata(
    req: Request & { accessToken?: string },
    res: Response,
    next: NextFunction
  ) {
    const userId = req.auth?.payload?.sub
    const { metadata } = req.body as { metadata: metadata }

    if (!metadata) {
      res.status(400).json({ statusText: 'Metadata is required', status: 400 })
      return
    }

    if (!userId) {
      res.status(401).json({
        statusText:
          'Something went wrong validating your credentials, please try again later.',
        status: 401,
      })
      return
    }

    const config = {
      method: 'PATCH',
      url: `https://${DOMAIN}/api/v2/users/${userId}`,
      headers: {
        authorization: `Bearer ${req.accessToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        user_metadata: metadata,
      },
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
      next(error)
    }
  }
}
