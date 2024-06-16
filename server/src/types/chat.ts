import { MESSAGES_TYPES } from '../constants/index.js'

export type uuid = `${string}-${string}-${string}-${string}-${string}`

export interface ResourceData {
	file: string | Buffer
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

export type Users = User[]

export interface Chat {
	uuid: uuid
	user1Id: string
	user2Id: string
	blockedBy?: string | null
	createdAt: string
}

export interface Message {
	uuid?: uuid
	content: string
	createdAt: string
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
	reactions: string | null
}

export interface ChatItem {
	uuid: uuid
	user?: User
	lastMessage?: Message
	createdAt: string
	unreadMessages: number
	isMuted?: boolean
	isDeleted?: boolean
	isArchived?: boolean
	isPinned?: boolean
	cleaned?: string | null
	blockedBy?: string | null
}

export interface ChangeChat {
	uuid: uuid
	lastMessage?: Message
}

export declare class Auth0User {
	name?: string
	given_name?: string
	family_name?: string
	middle_name?: string
	nickname?: string
	preferred_username?: string
	profile?: string
	picture?: string
	website?: string
	email?: string
	email_verified?: boolean
	gender?: string
	birthdate?: string
	zoneinfo?: string
	locale?: string
	phone_number?: string
	phone_number_verified?: boolean
	address?: string
	updated_at?: string
	sub?: string;
	[key: string]: unknown
}
