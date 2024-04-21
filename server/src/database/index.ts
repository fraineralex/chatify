import { createClient } from '@libsql/client'

export async function createTables () {
  const db = createClient({
    url: process.env.DB_URL ?? '',
    authToken: process.env.DB_AUTH_TOKEN ?? ''
  })

  await db.execute(`
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

    CREATE INDEX IF NOT EXISTS sender_id_receiver_id ON messages (sender_id, receiver_id);

    CREATE TABLE IF NOT EXISTS chats (
      uuid TEXT PRIMARY KEY,
      user1_id TEXT NOT NULL,
      user2_id TEXT NOT NULL,
      last_message_id TEXT,
      last_message_created_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  
  `)
}
