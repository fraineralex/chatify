
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="38a65454-d19d-57e4-a5bd-682b6d94ac11")}catch(e){}}();
export const SOCKET_EVENTS = {
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    CHAT_MESSAGE: 'chat_message',
    NEW_MESSAGE: 'new_message',
    EDIT_MESSAGE: 'edit_message',
    DELETE_MESSAGE: 'delete_message',
    READ_MESSAGE: 'read_message',
    UPDATE_MESSAGE: 'update_message',
    CHANGE_CHAT: 'change_chat',
    RECOVER_MESSAGES: 'recover_messages',
    DELIVERED_MESSAGE: 'delivered_message'
};
export const MESSAGES_TYPES = {
    TEXT: 'text',
    IMAGE: 'image',
    VIDEO: 'video',
    DOCUMENT: 'document',
    AUDIO: 'audio',
    STICKER: 'sticker',
    UNKNOWN: 'unknown'
};
//# sourceMappingURL=index.js.map
//# debugId=38a65454-d19d-57e4-a5bd-682b6d94ac11
