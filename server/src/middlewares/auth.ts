import { auth  } from 'express-oauth2-jwt-bearer'
import { Socket } from 'socket.io'
import jwt from 'jsonwebtoken'
import { ExtendedError } from '../types/socket.js'

const publicSigningKey = process.env.AUTH0_PUBLIC_SIGNING_KEY ?? ''
const audience = process.env.AUTH0_API_IDENTIFIER ?? ''
const auth0Domain = process.env.AUTH0_DOMAIN ?? ''

export const checkJwtMiddleware = auth({
    audience,
    issuerBaseURL: `https://${auth0Domain}`,
  })
  
export const authSocketMiddleware = (socket: Socket, next: (err?: ExtendedError) => void) => {
    const error: ExtendedError = new Error("unauthorized")
    error.data = { content: 'Something went wrong validating your credentials, please try again later.' }
    const token = socket.handshake.auth?.token as string
    if(!token) return next(error)

    try {
        const decoded = jwt.verify(token, publicSigningKey)
        socket.handshake.auth.user = decoded
    } catch (error) {
        console.error(error)
        return next(error as ExtendedError)
    }

    next()
}
