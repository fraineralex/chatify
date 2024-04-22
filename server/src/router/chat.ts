import { Router } from 'express'
import { ChatController } from '../controllers/chat.js'
import { Client } from '@libsql/client'

export class ChatRouter {
  private chatController: ChatController

  constructor (client: Client) {
    this.chatController = new ChatController(client)
  }

  init () {
    const router = Router()

    router.get('/', this.chatController.getAllChats.bind(this.chatController))
    router.post('/', this.chatController.createChat.bind(this.chatController))

    return router
  }
}
