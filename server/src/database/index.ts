import { Client } from '@libsql/client'

export async function createTables(client: Client) {
	try {
		await client.execute(`
      CREATE TABLE IF NOT EXISTS messages (
        uuid TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        senderId TEXT NOT NULL,
        receiverId TEXT NOT NULL,
        chatId TEXT NOT NULL,
        isDelivered BOOLEAN DEFAULT FALSE,
        isRead BOOLEAN DEFAULT FALSE,
        isEdited BOOLEAN DEFAULT FALSE,
        isDeleted BOOLEAN DEFAULT FALSE,
        replyToId TEXT,
        type TEXT NOT NULL DEFAULT 'text' CHECK( type IN ('text', 'image', 'audio', 'video', 'document', 'emoji', 'sticker') ),
        resource_url TEXT,
        reactions TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `)

		await client.execute(
			`CREATE INDEX IF NOT EXISTS sender_id_receiver_id ON messages (senderId, receiverId, chatId);`
		)

		await client.execute(
			`CREATE INDEX IF NOT EXISTS resource_url ON messages (resource_url);`
		)

		await client.execute(`
      CREATE TABLE IF NOT EXISTS chats (
        uuid TEXT PRIMARY KEY,
        user1Id TEXT NOT NULL,
        user2Id TEXT NOT NULL,
        blockedBy TEXT DEFAULT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `)

		await client.execute(`
      CREATE INDEX IF NOT EXISTS user1_id_user2_id ON chats (user1Id, user2Id);
    `)
	} catch (error) {
		console.error(error)
		return
	}
}
