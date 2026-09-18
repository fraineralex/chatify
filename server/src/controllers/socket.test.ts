import { describe, it, mock } from 'node:test'
import assert from 'node:assert/strict'
import { MESSAGES_TYPES, SOCKET_EVENTS } from '../constants/index.js'
import type { Message, uuid } from '../types/chat.js'
import type { Server } from 'socket.io'
import type { Client } from '@libsql/client'

process.env.S3_BUCKET_REGION = 'us-east-1'
process.env.S3_BUCKET_NAME = 'test-bucket'
process.env.S3_ACCESS_KEY_ID = 'test-key'
process.env.S3_SECRET_ACCESS_KEY = 'test-secret'

const { SocketController } = await import('./socket.js')

function createMessage (): Message {
  const chatId = '11111111-1111-1111-1111-111111111111' as uuid
  const messageId = '22222222-2222-2222-2222-222222222222' as uuid

  return {
    uuid: messageId,
    content: 'Hello from CI',
    createdAt: '2026-01-01T00:00:00.000Z',
    senderId: 'auth0|sender',
    receiverId: 'auth0|receiver',
    chatId,
    type: MESSAGES_TYPES.TEXT,
    file: null,
    isDelivered: false,
    isRead: false,
    isEdited: false,
    isDeleted: false,
    replyToId: null,
    reactions: null
  }
}

describe('SocketController.newMessage', () => {
  it('persists text messages and broadcasts them to connected clients', async () => {
    const message = createMessage()
    const execute = mock.fn(async () => ({ rows: [], rowsAffected: 1 }))
    const emit = mock.fn(() => undefined)
    const client = { execute } as unknown as Client
    const io = { emit } as unknown as Server
    const controller = new SocketController(io, client)

    await controller.newMessage(message)

    assert.equal(execute.mock.callCount(), 1)
    const insertCall = execute.mock.calls[0]?.arguments[0] as unknown as {
      sql: string
      args: Record<string, unknown>
    }
    assert.match(insertCall.sql, /INSERT INTO messages/)
    assert.deepEqual(insertCall.args, {
      ...message,
      file: null
    })

    assert.equal(emit.mock.callCount(), 1)
    const emittedEvent = emit.mock.calls[0]?.arguments[0] as string
    const emittedMessage = emit.mock.calls[0]?.arguments[1] as Message
    assert.equal(emittedEvent, SOCKET_EVENTS.CHAT_MESSAGE)
    assert.deepEqual(emittedMessage, message)
  })
})
