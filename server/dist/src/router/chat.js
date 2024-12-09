
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="a7266524-5186-5c71-9cb7-4c8a546e748a")}catch(e){}}();
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
//# sourceMappingURL=chat.js.map
//# debugId=a7266524-5186-5c71-9cb7-4c8a546e748a
