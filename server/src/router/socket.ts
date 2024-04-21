import { Client } from '@libsql/client'
import { Server } from 'socket.io'
import { SOCKET_EVENTS } from '../constants/index.js'
import { SocketController } from '../controllers/socket.js'

export class SocketRouter {
  private io: Server
  private socketController: SocketController

  constructor (io: Server, db: Client) {
    this.io = io
    this.socketController = new SocketController(io, db)
  }

  async init () {
    this.io.on(SOCKET_EVENTS.CONNECTION, async socket => {
      socket.on(SOCKET_EVENTS.DISCONNECT, this.socketController.disconnect)
      socket.on(SOCKET_EVENTS.NEW_MESSAGE, this.socketController.newMessage)
      socket.on(SOCKET_EVENTS.READ_MESSAGE, this.socketController.readMessages)

      this.socketController.recoverMessages(socket)
    })
  }
}
