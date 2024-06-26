import { Server, Socket } from 'socket.io'
import {
	ChangeChat,
	Message,
	MessagesToUpdate,
	ResourceData,
	uuid,
	StaticFile
} from '../types/chat.js'
import { Client } from '@libsql/client'
import { MESSAGES_TYPES, SOCKET_EVENTS } from '../constants/index.js'
import { deleteObject, getObjectSignedUrl, uploadFile } from '../utils/s3.js'
import { generateRandomFileName, optimizeImage } from '../utils/chat.js'

export class SocketController {
	private client: Client
	private io: Server

	constructor(io: Server, client: Client) {
		this.io = io
		this.client = client
	}

	async disconnect(): Promise<void> {
		//console.log('User disconnected')
	}

	async newMessage(message: Message, file?: ResourceData): Promise<void> {
		if (file && message.type !== MESSAGES_TYPES.TEXT) {
			try {
				if (message.type === MESSAGES_TYPES.IMAGE) {
					file = await optimizeImage(file)
					file.filename = generateRandomFileName(file)
				} else {
					file.file = Buffer.from(file.file as string, 'base64')
					file.filename = `${file.filename}.${generateRandomFileName(file)}`
				}

				await uploadFile(file)
			} catch (error) {
				console.error(error)
				return
			}
		}
		const resource = message.type === MESSAGES_TYPES.STICKER ? message.file?.url : file?.filename
		try {
			await this.client.execute({
				sql: 'INSERT INTO messages (uuid, content, senderId, receiverId, isRead, isDelivered, isEdited, isDeleted, replyToId, type, resource_url, chatId, reactions, createdAt) VALUES (:uuid, :content, :senderId, :receiverId, :isRead, :isDelivered, :isEdited, :isDeleted, :replyToId, :type, :file, :chatId, :reactions, :createdAt)',
				args: {
					...message,
					file: resource ?? null
				}
			})

			let staticFile: StaticFile | null = null
			if (
				file &&
				(message.type === MESSAGES_TYPES.IMAGE ||
					message.type === MESSAGES_TYPES.DOCUMENT)
			) {
				staticFile = await getObjectSignedUrl(file.filename)
			} else if (message.type === MESSAGES_TYPES.STICKER && message.file?.url) {
				staticFile = {
					url: message.file.url,
					filename: `Gift message.gif`,
					contentType: 'image/gif'
				}
			}

			const createdMessage: Message = {
				...message,
				file: staticFile
			}

			this.io.emit(SOCKET_EVENTS.CHAT_MESSAGE, createdMessage)
		} catch (error) {
			console.error(error)
			return
		}
	}

	async readMessages(messages: MessagesToUpdate): Promise<void> {
		try {
			const selectResult = await this.client.execute({
				sql: 'SELECT * FROM messages WHERE senderId = :senderId AND receiverId = :receiverId AND chatId = :chatId AND isRead = FALSE ORDER BY createdAt ASC',
				args: { ...messages }
			})

			if (selectResult.rows?.length === 0) return

			const updateResult = await this.client.execute({
				sql: 'UPDATE messages SET isRead = TRUE, isDelivered = TRUE WHERE senderId = :senderId AND receiverId = :receiverId AND chatId = :chatId AND isRead = FALSE',
				args: { ...messages }
			})

			if (selectResult.rows?.length === updateResult.rowsAffected) {
				const messages: uuid[] = []
				selectResult.rows.forEach(row => messages.push(row.uuid as uuid))

				this.io.emit(SOCKET_EVENTS.READ_MESSAGE, messages)
			}
		} catch (error) {
			console.error(error)
			return
		}
	}

	async deliverMessages(messages: MessagesToUpdate): Promise<void> {
		try {
			const selectResult = await this.client.execute({
				sql: 'SELECT * FROM messages WHERE senderId = :senderId AND receiverId = :receiverId AND chatId = :chatId AND isDelivered = FALSE ORDER BY createdAt ASC',
				args: { ...messages }
			})

			if (selectResult.rows?.length === 0) return

			const updateResult = await this.client.execute({
				sql: 'UPDATE messages SET isDelivered = TRUE WHERE senderId = :senderId AND receiverId = :receiverId AND chatId = :chatId AND isDelivered = FALSE',
				args: { ...messages }
			})

			if (selectResult.rows?.length === updateResult.rowsAffected) {
				const messages: uuid[] = []
				selectResult.rows.forEach(row => messages.push(row.uuid as uuid))

				this.io.emit(SOCKET_EVENTS.DELIVERED_MESSAGE, messages)
			}
		} catch (error) {
			console.error(error)
			return
		}
	}

	async editMessage(message: Message) {
		try {
			const updateResult = await this.client.execute({
				sql: 'UPDATE messages SET isEdited = TRUE, content = :content, reactions = :reactions WHERE uuid = :uuid;',
				args: { content: message.content, uuid: message.uuid!, reactions: message.reactions }
			})

			if (updateResult.rowsAffected === 1) {
				this.io.emit(SOCKET_EVENTS.UPDATE_MESSAGE, message)
			}
		} catch (error) {
			console.error(error)
			return
		}
	}

	async deleteMessage(message: Message) {
		try {
			const selectResult = await this.client.execute({
				sql: 'SELECT * FROM messages WHERE uuid = :uuid AND isDeleted = FALSE LIMIT 1;',
				args: { uuid: message.uuid! }
			})

			if (selectResult.rows?.length === 0) return

			const updateResult = await this.client.execute({
				sql: 'UPDATE messages SET isDeleted = TRUE WHERE uuid = :uuid;',
				args: { uuid: message.uuid! }
			})

			if (updateResult.rowsAffected === 1) {
				await deleteObject(selectResult.rows[0].resource_url as string)
				this.io.emit(SOCKET_EVENTS.UPDATE_MESSAGE, message)
			}
		} catch (error) {
			console.error(error)
			return
		}
	}

	recoverMessages = (socket: Socket) => async (): Promise<void> => {
		const offset = socket.handshake.auth?.serverOffset ?? 0
		const loggedUserId: string = socket.handshake.auth?.user?.sub

		try {
			const results = await this.client.execute({
				sql: `SELECT uuid, content, senderId, receiverId, isRead, isDelivered, isEdited, isDeleted, replyToId, type, resource_url, chatId, reactions, createdAt FROM messages WHERE createdAt > :offset AND (senderId = :loggedUserId OR receiverId = :loggedUserId) ORDER BY createdAt ASC`,
				args: { offset, loggedUserId }
			})

			results.rows.forEach(async row => {
				let staticFile: StaticFile | null = null
				if (
					row.resource_url &&
					(row.type === MESSAGES_TYPES.IMAGE ||
						row.type === MESSAGES_TYPES.DOCUMENT)
				) {
					staticFile = await getObjectSignedUrl(row.resource_url as string)
				} else if (row.resource_url && row.type === MESSAGES_TYPES.STICKER) {
					staticFile = {
						url: row.resource_url as string,
						filename: `Gift message.gif`,
						contentType: 'image/gif'
					}
				}
				const message = {
					...row,
					file: staticFile
				}
				socket.emit(SOCKET_EVENTS.CHAT_MESSAGE, message)
			})
		} catch (e) {
			console.error(e)
			return
		}
	}

	private async updateChat(
		message: Message
	): Promise<ChangeChat | undefined> {
		try {
			const result = await this.client.execute({
				sql: 'SELECT * FROM chats WHERE uuid = :chatId LIMIT 1',
				args: { chatId: message.chatId }
			})

			const chat: ChangeChat = {
				uuid: result.rows[0].uuid as uuid,
				lastMessage: {
					...message,
					file: null
				}
			}

			return chat
		} catch (error) {
			console.error(error)
			return
		}
	}
}
