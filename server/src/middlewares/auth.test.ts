import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import jwt from 'jsonwebtoken'
import type { Socket } from 'socket.io'
import type { ExtendedError } from '../types/socket.js'

const signingKey = 'test-signing-key'

process.env.AUTH0_PUBLIC_SIGNING_KEY = signingKey
process.env.AUTH0_API_IDENTIFIER = 'https://chatify.test/api'
process.env.AUTH0_DOMAIN = 'auth.chatify.test'

const { authSocketMiddleware } = await import('./auth.js')

function createSocket (token?: string): Socket {
  return {
    handshake: {
      auth: token === undefined ? {} : { token }
    }
  } as Socket
}

describe('authSocketMiddleware', () => {
  it('rejects connections without a token', () => {
    const socket = createSocket()
    let error: ExtendedError | undefined

    authSocketMiddleware(socket, (err) => {
      error = err
    })

    assert.ok(error)
    assert.equal(error?.message, 'unauthorized')
    assert.equal(
      error?.data?.content,
      'Something went wrong validating your credentials, please try again later.'
    )
  })

  it('rejects connections with an invalid token', () => {
    const socket = createSocket('not-a-valid-token')
    let error: ExtendedError | undefined

    authSocketMiddleware(socket, (err) => {
      error = err
    })

    assert.ok(error)
  })

  it('accepts connections with a valid token and attaches the user payload', () => {
    const token = jwt.sign({ sub: 'auth0|user-123' }, signingKey)
    const socket = createSocket(token)
    let error: ExtendedError | undefined

    authSocketMiddleware(socket, (err) => {
      error = err
    })

    assert.equal(error, undefined)
    assert.equal(socket.handshake.auth.user?.sub, 'auth0|user-123')
  })
})
