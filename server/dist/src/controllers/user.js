
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="1abbf5ab-8ecd-5190-a50c-fb812bc0b14e")}catch(e){}}();
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const DOMAIN = process.env.AUTH0_DOMAIN ?? '';
export class UserController {
    static async getAll(req, res, next) {
        const config = {
            method: 'GET',
            url: `https://${DOMAIN}/api/v2/users`,
            maxBodyLength: Infinity,
            headers: {
                authorization: `Bearer ${req.accessToken}`,
                Accept: 'application/json',
            },
        };
        try {
            const response = await axios.request(config);
            const users = response.data.map((user) => {
                const name = user.name.split(' ').slice(0, 2).join(' ');
                return {
                    id: user.user_id,
                    name,
                    picture: user.picture,
                };
            });
            res.status(200).json(users);
        }
        catch (error) {
            console.error(error);
            next(new Error('Something went wrong fetching users'));
        }
    }
    static async getUserMetadata(req, res, next) {
        const userId = req.auth?.payload?.sub;
        if (!userId) {
            res.status(401).json({
                statusText: 'Something went wrong validating your credentials, please try again later.',
                status: 401,
            });
            return;
        }
        const config = {
            method: 'GET',
            url: `https://${DOMAIN}/api/v2/users/${userId}`,
            headers: {
                authorization: `Bearer ${req.accessToken}`,
                Accept: 'application/json',
            },
        };
        try {
            const data = await axios.request(config);
            if (data.status !== 200) {
                return res
                    .status(data.status)
                    .json({ statusText: data.statusText, status: data.status });
            }
            let userMetadata = data.data.user_metadata;
            if (!userMetadata) {
                userMetadata = {
                    chat_preferences: {
                        archived: [],
                        cleaned: {},
                        deleted: [],
                        muted: [],
                        pinned: [],
                    },
                };
                const config = {
                    method: 'PATCH',
                    url: `https://${DOMAIN}/api/v2/users/${userId}`,
                    headers: {
                        authorization: `Bearer ${req.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    data: {
                        user_metadata: userMetadata,
                    },
                };
                const data = await axios.request(config);
                if (data.status !== 200) {
                    return res
                        .status(data.status)
                        .json({ statusText: data.statusText, status: data.status });
                }
            }
            res.status(200).json(userMetadata);
        }
        catch (error) {
            console.error(error);
            next(new Error('Something went wrong fetching user metadata'));
        }
    }
    static async updateMetadata(req, res, next) {
        const userId = req.auth?.payload?.sub;
        const { metadata } = req.body;
        if (!metadata) {
            res.status(400).json({ statusText: 'Metadata is required', status: 400 });
            return;
        }
        if (!userId) {
            res.status(401).json({
                statusText: 'Something went wrong validating your credentials, please try again later.',
                status: 401,
            });
            return;
        }
        const config = {
            method: 'PATCH',
            url: `https://${DOMAIN}/api/v2/users/${userId}`,
            headers: {
                authorization: `Bearer ${req.accessToken}`,
                'Content-Type': 'application/json',
            },
            data: {
                user_metadata: metadata,
            },
        };
        try {
            const data = await axios.request(config);
            if (data.status !== 200) {
                return res
                    .status(data.status)
                    .json({ statusText: data.statusText, status: data.status });
            }
            res.status(200).json({ statusText: data.statusText, status: data.status });
        }
        catch (error) {
            console.error(error);
            next(new Error('Something went wrong updating user metadata'));
        }
    }
}
//# sourceMappingURL=user.js.map
//# debugId=1abbf5ab-8ecd-5190-a50c-fb812bc0b14e
