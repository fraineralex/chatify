import { auth  } from 'express-oauth2-jwt-bearer'
import { Socket } from 'socket.io'
import jwt from 'jsonwebtoken'
import { ExtendedError } from '../types/socket.js'

const auth0SecretKey = process.env.AUTH0_CLIENT_SECRET_KEY ?? ''

export const checkJwtMiddleware = auth({
    audience: process.env.AUTH0_API_IDENTIFIER ?? '',
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}` ?? '',
  })
  
export const authSocketMiddleware = (socket: Socket, next: (err?: ExtendedError) => void) => {
    const error: ExtendedError = new Error("unauthorized")
    error.data = { content: 'Something went wrong validating your credentials, please try again later.' }
    const token = socket.handshake.auth?.token as string
    if(!token) return next(error)

    try {
        const decoded = jwt.verify(token, auth0SecretKey)
        socket.handshake.auth.user = decoded
    } catch (error) {
        return next(error as ExtendedError)
    }

    next()
}
