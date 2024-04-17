import express from 'express'
import logger from 'morgan'
import path from 'path'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@libsql/client'
import { SOCKET_EVENTS } from './src/constants'
import { ServerMessage, ServerMessageDB } from './src/types/chat'

dotenv.config({ path: '.env.local' })
const port = process.env.PORT ?? 3000

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173'
  },
  connectionStateRecovery: {}
})

const db = createClient({
  url: process.env.DB_URL ?? '',
  authToken: process.env.DB_AUTH_TOKEN ?? ''
})

await db.execute(`
  CREATE TABLE IF NOT EXISTS messages (
    uuid TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    sender_id TEXT NOT NULL,
    receiver_id TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    is_edited BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    reply_to_id TEXT,
    type TEXT NOT NULL DEFAULT 'text' CHECK( type IN ('text', 'image', 'audio', 'video', 'file', 'emoji', 'sticker') ),
    resource_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

io.on(SOCKET_EVENTS.CONNECTION, async socket => {
  console.log('An user has connected!')

  socket.on(SOCKET_EVENTS.DISCONNECT, () => {
    console.log('An user has disconnected!')
  })

  socket.on(SOCKET_EVENTS.CHAT_MESSAGE, async (message: ServerMessage) => {
    let result
    const uuid = crypto.randomUUID()
    const created_at = new Date().toISOString()
    const createdMessage: ServerMessageDB = {
      uuid,
      ...message,
      created_at
    }

    try {
      result = await db.execute({
        sql: 'INSERT INTO messages (uuid, content, sender_id, receiver_id, is_read, is_edited, is_deleted, is_deletedreply_to_id, type, resource_url, created_at) VALUES (:uuid, :content, :sender_id, :receiver_id, :is_read, :is_edited, :is_deleted, :reply_to_id, :type, :resource_url, :created_at)',
        args: {
          uuid,
          ...message,
          created_at
        }
      })
    } catch (error) {
      console.error(error)
      return
    }

    io.emit(SOCKET_EVENTS.NEW_MESSAGE, createdMessage)
  })

  if (!socket.recovered) {
    try {
      const results = await db.execute({
        sql: `SELECT uuid, content, sender_id, receiver_id, created_at FROM messages WHERE created_at > ?`,
        args: [socket.handshake.auth.serverOffset ?? 0]
      })

      results.rows.forEach(row => {
        const message = {
          uuid: row.uuid,
          content: row.content,
          created_at: row.created_at,
          sender_id: row.sender_id,
          receiver_id: row.receiver_id
        }
        socket.emit(SOCKET_EVENTS.CHAT_MESSAGE, message)
      })
    } catch (e) {
      console.error(e)
    }
  }
})

app.use(
  cors({
    origin: 'http://localhost:5173'
  })
)
app.use(logger('dev'))

/* app.use(express.static(path.join(process.cwd(), '../client/dist')))
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), '../client/dist/index.html'))
}) */

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
