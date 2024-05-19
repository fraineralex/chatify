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
} as const

export const MESSAGES_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  DOCUMENT: 'document',
  AUDIO: 'audio',
  STICKER: 'sticker',
  UNKNOWN: 'unknown'
} as const
