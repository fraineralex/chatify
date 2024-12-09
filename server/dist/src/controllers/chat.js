
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="6d309ad5-a4fd-544b-bb37-02f479f95f0b")}catch(e){}}();
import { getUserById, getUsersByIds } from '../utils/user.js';
import { MESSAGES_TYPES } from '../constants/index.js';
import { getObjectSignedUrl } from '../utils/s3.js';
export class ChatController {
    constructor(client) {
        this.client = client;
    }
    async getAllChats(req, res, next) {
        const userId = req.auth?.payload?.sub;
        if (!userId || !req.accessToken) {
            res.status(401).json({
                statusText: 'Something went wrong validating your credentials, please try again later.',
                status: 401
            });
            return;
        }
        try {
            const result = await this.client.execute({
                sql: 'SELECT * FROM chats WHERE user1Id = :user_id OR user2Id = :user_id',
                args: { user_id: userId }
            });
            if (result.rows.length === 0) {
                res.status(200).json([]);
                return;
            }
            const chatUUIDs = result.rows
                .map(chat => chat.uuid)
                .map(id => `'${id}'`)
                .join(',');
            const lastMsgAndUnreadCount = await this.client.execute({
                sql: `
					SELECT
						m1.*,
						COALESCE(unread.count, 0) as unread_count
					FROM
						messages m1
					LEFT JOIN (
						SELECT
						chatId,
						COUNT(*) as count
						FROM
						messages
						WHERE
						chatId IN (${chatUUIDs}) AND
						receiverId = :receiverId AND
						isRead = false
						GROUP BY
						chatId
					) unread
					ON m1.chatId = unread.chatId
					WHERE
						m1.createdAt = (
						SELECT
							MAX(m2.createdAt)
						FROM
							messages m2
						WHERE
							m2.chatId = m1.chatId
						)
						AND m1.chatId IN (${chatUUIDs})
					LIMIT ${chatUUIDs.length}
					`,
                args: {
                    receiverId: userId
                }
            });
            const chats = [];
            const usersIds = result.rows.map(chat => chat.user1Id === userId
                ? chat.user2Id
                : chat.user1Id);
            const users = await getUsersByIds([...usersIds, userId], req.accessToken);
            const loggedUser = users.find(user => user.user_id === userId);
            for (const chat of result.rows) {
                const id = chat.user1Id === userId
                    ? chat.user2Id
                    : chat.user1Id;
                const chatUser = users.find(user => user.user_id === id);
                if (!chatUser || !loggedUser)
                    continue;
                const name = chatUser.name?.split(' ').slice(0, 2).join(' ');
                let lastMessage;
                let unreadMessages = 0;
                if (lastMsgAndUnreadCount.rows?.length > 0 &&
                    lastMsgAndUnreadCount.rows?.find(msg => msg.chatId === chat.uuid)) {
                    const message = lastMsgAndUnreadCount.rows.find(msg => msg.chatId === chat.uuid);
                    let staticFile = null;
                    if (message?.resource_url &&
                        (message.type === MESSAGES_TYPES.IMAGE ||
                            message.type === MESSAGES_TYPES.DOCUMENT)) {
                        staticFile = await getObjectSignedUrl(message.resource_url);
                    }
                    else if (message?.resource_url &&
                        message.type === MESSAGES_TYPES.STICKER) {
                        staticFile = {
                            url: message.resource_url,
                            filename: `Gift message.gif`,
                            contentType: 'image/gif'
                        };
                    }
                    lastMessage = {
                        ...message,
                        file: staticFile,
                    };
                    unreadMessages = message?.unread_count;
                }
                const newChat = {
                    ...chat,
                    user: {
                        id,
                        name,
                        picture: chatUser.picture
                    },
                    unreadMessages,
                    lastMessage,
                    isArchived: loggedUser.user_metadata?.chat_preferences.archived.includes(chat.uuid),
                    isDeleted: loggedUser.user_metadata?.chat_preferences.deleted.includes(chat.uuid),
                    isMuted: loggedUser.user_metadata?.chat_preferences.muted.includes(chat.uuid),
                    isPinned: loggedUser.user_metadata?.chat_preferences.pinned.includes(chat.uuid),
                    cleaned: loggedUser.user_metadata?.chat_preferences.cleaned[chat.uuid] ?? null
                };
                chats.push(newChat);
            }
            res.status(200).json(chats);
        }
        catch (error) {
            console.error(error);
            next(new Error('Something went wrong fetching chats.'));
        }
    }
    async createChat(req, res, next) {
        const userId = req.auth?.payload?.sub;
        const { uuid, user1Id, user2Id } = req.body;
        const createdAt = new Date().toISOString();
        const chat = {
            uuid,
            createdAt,
            unreadMessages: 0,
            blockedBy: null
        };
        if (!userId) {
            res.status(401).json({
                statusText: 'Something went wrong validating your credentials, please try again later.',
                status: 401
            });
            return;
        }
        if (userId !== user1Id && userId !== user2Id) {
            res.status(403).json({
                statusText: 'You can only create chats between yourself and another user.',
                status: 403
            });
            return;
        }
        try {
            await this.client.execute({
                sql: 'INSERT INTO chats (uuid, user1Id, user2Id, createdAt) VALUES (:uuid, :user1Id, :user2Id, :createdAt)',
                args: { uuid, user1Id, user2Id, createdAt }
            });
            res.status(201).json(chat);
        }
        catch (error) {
            console.error(error);
            next(new Error('Something went wrong creating the chat.'));
        }
    }
    async getChatById(req, res, next) {
        const chatId = req.params.chatId;
        const userId = req.auth?.payload?.sub;
        if (!chatId) {
            res.status(400).json({ statusText: 'Missing chatId', status: 400 });
            return;
        }
        if (!userId || !req.accessToken) {
            res.status(401).json({
                statusText: 'Something went wrong validating your credentials, please try again later.',
                status: 401
            });
            return;
        }
        try {
            const result = await this.client.execute({
                sql: 'SELECT * FROM chats WHERE uuid = :uuid',
                args: { uuid: chatId }
            });
            if (!result.rows || result.rows.length === 0) {
                res.status(404).json({
                    statusText: 'The chat you are trying to access does not exist.',
                    status: 404
                });
                return;
            }
            const chatDB = result.rows[0];
            const id = chatDB.user1Id === userId
                ? chatDB.user2Id
                : chatDB.user1Id;
            const chatUser = await getUserById(id, req.accessToken);
            const name = chatUser.name?.split(' ').slice(0, 2).join(' ');
            let lastMessage = undefined;
            let unreadMessages = 0;
            const lastMsgAndUnreadCount = await this.client.execute({
                sql: `
					SELECT
						m1.*,
						COALESCE(unread.count, 0) as unread_count
					FROM
						messages m1
					LEFT JOIN (
						SELECT
						chatId,
						COUNT(*) as count
						FROM
						messages
						WHERE
						chatId = :chatId AND
						receiverId = :receiverId AND
						isRead = false
					) unread
					ON m1.chatId = unread.chatId
					WHERE
						m1.createdAt = (
						SELECT
							MAX(m2.createdAt)
						FROM
							messages m2
						WHERE
							m2.chatId = :chatId
						)
					LIMIT 1
					`,
                args: {
                    receiverId: userId,
                    chatId
                }
            });
            if (lastMsgAndUnreadCount.rows.length > 0) {
                const message = lastMsgAndUnreadCount.rows[0];
                let staticFile = null;
                if (message.resource_url &&
                    (message.type === MESSAGES_TYPES.IMAGE ||
                        message.type === MESSAGES_TYPES.DOCUMENT)) {
                    staticFile = await getObjectSignedUrl(message.resource_url);
                }
                else if (message.resource_url &&
                    message.type === MESSAGES_TYPES.STICKER) {
                    staticFile = {
                        url: message.resource_url,
                        filename: `Gift message.gif`,
                        contentType: 'image/gif'
                    };
                }
                lastMessage = {
                    ...message,
                    file: staticFile,
                };
            }
            unreadMessages =
                lastMsgAndUnreadCount.rows[0].unread_count ?? 0;
            const loggedUser = await getUserById(userId, req.accessToken);
            const chat = {
                ...chatDB,
                user: {
                    id,
                    name,
                    picture: chatUser.picture
                },
                unreadMessages,
                lastMessage,
                isArchived: loggedUser.user_metadata?.chat_preferences.archived.includes(chatDB.uuid),
                isDeleted: loggedUser.user_metadata?.chat_preferences.deleted.includes(chatDB.uuid),
                isMuted: loggedUser.user_metadata?.chat_preferences.muted.includes(chatDB.uuid),
                isPinned: loggedUser.user_metadata?.chat_preferences.pinned.includes(chatDB.uuid),
                cleaned: loggedUser.user_metadata?.chat_preferences.cleaned[chatDB.uuid] ?? null
            };
            res.status(200).json(chat);
        }
        catch (error) {
            console.error(error);
            next(new Error('Something went wrong fetching the chat.'));
        }
    }
    async getSignedFileUrls(req, res, next) {
        const messageUUIDs = req.params.messageIds?.split(',');
        if (!messageUUIDs ||
            !messageUUIDs?.every(id => typeof id === 'string' &&
                id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/))) {
            res.status(400).json({
                statusText: "Invalid input: 'messageIds' should be an array of valid UUID strings.",
                status: 400
            });
            return;
        }
        if (messageUUIDs?.length === 0) {
            res.status(400).json({ statusText: 'Missing messageIds', status: 400 });
            return;
        }
        try {
            const stringMessageUUIDs = messageUUIDs.map(id => `'${id}'`).join(',');
            const selectStatement = await this.client.execute({
                sql: `SELECT uuid, resource_url FROM messages WHERE uuid IN (${stringMessageUUIDs})`,
                args: {}
            });
            if (selectStatement.rows?.length === 0) {
                res.status(404).json({ statusText: 'Messages not found', status: 404 });
                return;
            }
            const updatedSignedUrls = await Promise.all(selectStatement.rows.map(async (message) => {
                const signedUrl = await getObjectSignedUrl(message.resource_url);
                return {
                    uuid: message.uuid,
                    file: signedUrl
                };
            }));
            if (!updatedSignedUrls) {
                res.status(404).json({ statusText: 'Files not found', status: 404 });
                return;
            }
            res.status(200).json(updatedSignedUrls);
        }
        catch (error) {
            console.error(error);
            next(new Error('Something went wrong fetching the files.'));
        }
    }
    async updateChat(req, res, next) {
        const uuid = req.params.chatId;
        const { blockedBy } = req.body;
        if (!uuid) {
            res.status(400).json({ statusText: 'Missing chatId', status: 400 });
            return;
        }
        if (blockedBy === undefined) {
            res
                .status(400)
                .json({ statusText: 'Missing blockedBy field', status: 400 });
            return;
        }
        try {
            const result = await this.client.execute({
                sql: 'SELECT * FROM chats WHERE uuid = :uuid',
                args: { uuid }
            });
            if (result.rows?.length === 0) {
                res.status(404).json({ statusText: 'Chat not found', status: 404 });
                return;
            }
            await this.client.execute({
                sql: 'UPDATE chats SET blockedBy = :blockedBy WHERE uuid = :uuid',
                args: { blockedBy, uuid }
            });
            res.status(200).json({ statusText: 'OK', status: 200 });
        }
        catch (error) {
            console.error(error);
            next(new Error('Something went wrong updating the chat.'));
        }
    }
}
//# sourceMappingURL=chat.js.map
//# debugId=6d309ad5-a4fd-544b-bb37-02f479f95f0b
