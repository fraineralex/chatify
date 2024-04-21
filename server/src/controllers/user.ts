import axios from 'axios'
import { Response, Request } from 'express'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const DOMAIN = process.env.AUTH0_DOMAIN ?? ''
const MGMT_API_TOKEN = process.env.AUTH0_MGMT_API_TOKEN ?? ''

export class UserController {
  static async getAll (req: Request, res: Response): Promise<void> {
    const options = {
      method: 'GET',
      url: `https://${DOMAIN}/api/v2/users`,
      maxBodyLength: Infinity,
      params: { search_engine: 'v3' },
      headers: {
        authorization: `Bearer ${MGMT_API_TOKEN}`,
        Accept: 'application/json'
      }
    }

    const data = await axios.request(options)
    console.log(JSON.stringify(data))
  }
}
