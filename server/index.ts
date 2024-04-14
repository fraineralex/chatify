import express from 'express'
import logger from 'morgan'
import path from 'path'

import { Server } from 'socket.io'
import { createServer } from 'node:http'
import cors from 'cors'

const port = process.env.PORT ?? 3000

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173'
  }
})

io.on('connection', socket => {
  console.log('An user has connected!')

  socket.on('disconnect', () => {
    console.log('An user has disconnected!')
  })

  socket.on('chat message', message => {
    console.log('Message:', message)
  })
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
