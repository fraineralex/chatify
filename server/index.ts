import express from 'express'
import logger from 'morgan'
//import path from 'path'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import cors from 'cors'
import dotenv from 'dotenv'
import { SOCKET_EVENTS } from './src/constants/index.js'
import { userRouter } from './src/router/user.js'
import { SocketController } from './src/controllers/socket.js'
import { createTables } from './src/database/index.js'

dotenv.config({ path: '.env.local' })
const port = process.env.PORT ?? 3000
const clientDomain = process.env.CLIENT_DOMAIN ?? 'http://localhost:5173'

const app = express()
const server = createServer(app)
export const io = new Server(server, {
  cors: { origin: clientDomain },
  connectionStateRecovery: {}
})

createTables()

io.on(SOCKET_EVENTS.CONNECTION, async socket => {
  socket.on(SOCKET_EVENTS.DISCONNECT, SocketController.disconnect)
  socket.on(SOCKET_EVENTS.NEW_MESSAGE, SocketController.newMessage)
  socket.on(SOCKET_EVENTS.READ_MESSAGE, SocketController.readMessages)

  SocketController.recoverMessages(socket)
})

app.use(cors({ origin: clientDomain }))
app.use(logger('dev'))
app.use('/users', userRouter)

/* app.use(express.static(path.join(process.cwd(), '../client/dist')))
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), '../client/dist/index.html'))
}) */

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
