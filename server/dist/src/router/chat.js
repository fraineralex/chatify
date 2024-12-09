import { Router } from 'express';
import { ChatController } from '../controllers/chat.js';
export class ChatRouter {
    constructor(client) {
        this.chatController = new ChatController(client);
    }
    init() {
        const router = Router();
        router.get('/', this.chatController.getAllChats.bind(this.chatController));
        router.post('/', this.chatController.createChat.bind(this.chatController));
        router.get('/:chatId', this.chatController.getChatById.bind(this.chatController));
        router.patch('/:chatId', this.chatController.updateChat.bind(this.chatController));
        router.get('/signed-urls/:messageIds', this.chatController.getSignedFileUrls.bind(this.chatController));
        return router;
    }
}
