import { Client } from '@libsql/client'

export async function createTables (client: Client) {

  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS messages (
        uuid TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        sender_id TEXT NOT NULL,
        receiver_id TEXT NOT NULL,
        chat_id TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        is_edited BOOLEAN DEFAULT FALSE,
        is_deleted BOOLEAN DEFAULT FALSE,
        reply_to_id TEXT,
        type TEXT NOT NULL DEFAULT 'text' CHECK( type IN ('text', 'image', 'audio', 'video', 'file', 'emoji', 'sticker') ),
        resource_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await client.execute(
      `CREATE INDEX IF NOT EXISTS sender_id_receiver_id ON messages (sender_id, receiver_id, chat_id);`
    )

    await client.execute(`
      CREATE TABLE IF NOT EXISTS chats (
        uuid TEXT PRIMARY KEY,
        user1_id TEXT NOT NULL,
        user2_id TEXT NOT NULL,
        last_message_id TEXT,
        last_message_created_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await client.execute(`
      CREATE INDEX IF NOT EXISTS user1_id_user2_id ON chats (user1_id, user2_id);
    `)
  } catch (error) {
    console.error(error)
    return
  }
}
