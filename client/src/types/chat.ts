import { MESSAGES_TYPES } from '../constants'

export type uuid = `${string}-${string}-${string}-${string}-${string}`

export interface Message {
	uuid: uuid
	content: string
	createdAt: string
	senderId: string
	receiverId: string
	chatId: uuid
	type: (typeof MESSAGES_TYPES)[keyof typeof MESSAGES_TYPES]
	file: StaticFile | null
	isSent: boolean
	isDelivered: boolean
	isRead: boolean
	isEdited: boolean
	isDeleted: boolean
	replyToId: uuid | null
	reactions: string| null
}

export interface ServerMessage {
  uuid: uuid
  content: string
  senderId: string
  receiverId: string
  chatId: uuid
  type: (typeof MESSAGES_TYPES)[keyof typeof MESSAGES_TYPES]
  file: StaticFile | null
  isDelivered: boolean
  isRead: boolean
  isEdited: boolean
  isDeleted: boolean
  replyToId: uuid | null
  createdAt: string
  reactions: string | null
}
export interface ReplyMessage {
	uuid: uuid
	content: string
	type: (typeof MESSAGES_TYPES)[keyof typeof MESSAGES_TYPES]
	resourceUrl: StaticFile | null
	user: User
}

export interface ResourceData {
	file: string
	filename: string
	fileType: string
}

export interface StaticFile {
	url: string
	expiresAt?: string
	filename?: string
	contentType?: string
	contentLength?: number
}

export type MessageFilter = Array<'media' | 'files'> | null

export interface SignedFile {
	uuid: uuid
	file: StaticFile
}


export type Messages = Message[]

export interface User {
	id: string
	name: string
	picture: string
}

export interface Chat {
	uuid: uuid
	user: User
	lastMessage?: Message
	createdAt: Date
	unreadMessages: number
	draft?: string
	isMuted?: boolean
	isDeleted?: boolean
	isArchived?: boolean
	isPinned?: boolean
	cleaned?: Date | null
	blockedBy?: string | null
	isUnread?: boolean
}

export type Chats = Chat[]

export interface ChatDB {
	uuid: uuid
	user1Id: string
	user2Id: string
	blockedBy: string | null
	createdAt: string
}

export interface CurrentChat extends Chat {
	draft: string
}

export interface ChangeChat {
	uuid: uuid
	lastMessage?: Message
}

export interface MessagesToUpdate {
	chatId: uuid
	senderId: string
	receiverId?: string
}

export interface User {
	id: string
	name: string
	picture: string
}

export interface ChatItem {
	uuid?: uuid
	user: User
	lastMessage?: Message
	createdAt?: Date
	unreadMessages?: number
	isNewChat?: boolean
	isPinned?: boolean
	isUnread?: boolean
	cleaned?: Date | null
}

export type EmojiEvent = {
	unified: string
	emoji: string
}

export type ChatFilterState =
	| 'all'
	| 'blocked'
	| 'archived'
	| 'muted'
	| 'unread'

export interface FileMessage {
	file: File
	caption: string
}
