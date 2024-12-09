
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="252c067a-7ab7-5a92-9af3-6a1dc29f8a32")}catch(e){}}();
import { SOCKET_EVENTS } from '../constants/index.js';
import { SocketController } from '../controllers/socket.js';
import { authSocketMiddleware } from '../middlewares/auth.js';
export class SocketRouter {
    constructor(io, db) {
        this.io = io;
        this.socketController = new SocketController(io, db);
    }
    async init() {
        this.io.use((socket, next) => authSocketMiddleware(socket, next));
        this.io.on(SOCKET_EVENTS.CONNECTION, async (socket) => {
            socket.on(SOCKET_EVENTS.DISCONNECT, this.socketController.disconnect.bind(this.socketController));
            socket.on(SOCKET_EVENTS.NEW_MESSAGE, this.socketController.newMessage.bind(this.socketController));
            socket.on(SOCKET_EVENTS.READ_MESSAGE, this.socketController.readMessages.bind(this.socketController));
            socket.on(SOCKET_EVENTS.DELIVERED_MESSAGE, this.socketController.deliverMessages.bind(this.socketController));
            socket.on(SOCKET_EVENTS.EDIT_MESSAGE, this.socketController.editMessage.bind(this.socketController));
            socket.on(SOCKET_EVENTS.DELETE_MESSAGE, this.socketController.deleteMessage.bind(this.socketController));
            socket.on(SOCKET_EVENTS.RECOVER_MESSAGES, this.socketController.recoverMessages(socket));
            /* if (socket.recovered) {
              this.socketController.recoverMessages(socket)()
            } */
        });
    }
}
//# sourceMappingURL=socket.js.map
//# debugId=252c067a-7ab7-5a92-9af3-6a1dc29f8a32
