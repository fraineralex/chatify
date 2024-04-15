import express from 'express'
import logger from 'morgan'
import path from 'path'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@libsql/client'

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
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

io.on('connection', async socket => {
  console.log('An user has connected!')

  socket.on('disconnect', () => {
    console.log('An user has disconnected!')
  })

  socket.on('chat message', async content => {
    let result
    const username = socket.handshake.auth.username
    const created_at = new Date().toISOString()

    try {
      result = await db.execute({
        sql: 'INSERT INTO messages (content, username, created_at) VALUES (:content, :username, :created_at)',
        args: { content, username, created_at }
      })
    } catch (error) {
      console.error(error)
      return
    }

    const message = {
      id: result.lastInsertRowid?.toString(),
      content,
      created_at: created_at,
      username
    }

    io.emit('chat message', message)
  })

  if (!socket.recovered) {
    try {
      const results = await db.execute({
        sql: `SELECT id, content, username, created_at FROM messages WHERE id > ?`,
        args: [socket.handshake.auth.serverOffset ?? 0]
      })

      results.rows.forEach(row => {
        const message = {
          id: row.id?.toString(),
          content: row.content,
          created_at: row.created_at,
          username: row.username
        }
        socket.emit('chat message', message)
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
