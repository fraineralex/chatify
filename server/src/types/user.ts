import { uuid } from './chat.js'

export interface User {
	createdAt: Date
	email: string
	email_verified: boolean
	family_name: string
	given_name: string
	identities?: Identity[]
	locale: string
	name: string
	nickname: string
	picture: string
	updated_at: Date
	user_id: string
	last_login: Date
	last_ip: string
	logins_count: number
	user_metadata: metadata
}

export interface Identity {
	provider: string
	access_token: string
	expires_in: number
	user_id: string
	connection: string
	isSocial: boolean
}

export interface metadata {
	chat_preferences: {
		muted: Array<uuid>
		deleted: Array<uuid>
		archived: Array<uuid>
		pinned: Array<uuid>
		cleaned: { [key: uuid]: string }
	}
}
