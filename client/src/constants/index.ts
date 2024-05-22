import {
  PDFIcon,
  DOCIcon,
  PPTIcon,
  XLSIcon,
  XLSXIcon,
  UnknownFileIcon
} from '../components/common/svg-icons'

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

export const FILE_ICONS: {
  [key: string]: ({ className }: { className: string }) => JSX.Element
} = {
  pdf: PDFIcon,
  doc: DOCIcon,
  docx: DOCIcon,
  ppt: PPTIcon,
  pptx: PPTIcon,
  xls: XLSIcon,
  xlsx: XLSXIcon,
  xlsm: XLSXIcon,
  unknown: UnknownFileIcon
}

export const MIME_TYPE_MAP: { [key: string]: string } = {
  'application/pdf': 'PDF Document',
  'text/plain': 'Plain Text',
  'application/msword': 'MS Word Document',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    'MS Word Document',
  'application/vnd.ms-excel': 'MS Excel Spreadsheet',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    'MS Excel Spreadsheet',
  'application/vnd.ms-powerpoint': 'MS PowerPoint Presentation',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    'MS PowerPoint Presentation',
  'text/csv': 'CSV File',
  'text/html': 'HTML File',
  'text/xml': 'XML File',
  'unknown': 'Unknown File'
}
