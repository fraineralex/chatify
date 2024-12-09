import axios from 'axios';
import jwt from 'jsonwebtoken';
const AUTH0_M2M_CLIENT_ID = process.env.AUTH0_M2M_CLIENT_ID ?? '';
const AUTH0_M2M_CLIENT_SECRET = process.env.AUTH0_M2M_CLIENT_SECRET ?? '';
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN ?? '';
const AUTH0_AUDIENCE = process.env.AUTH0_API_IDENTIFIER ?? '';
let token = null;
let tokenExpiresAt = 0;
async function getAuth0Token() {
    const options = {
        method: 'POST',
        url: `https://${AUTH0_DOMAIN}/oauth/token`,
        headers: { 'content-type': 'application/json' },
        data: {
            client_id: AUTH0_M2M_CLIENT_ID,
            client_secret: AUTH0_M2M_CLIENT_SECRET,
            audience: AUTH0_AUDIENCE,
            grant_type: 'client_credentials',
        },
    };
    try {
        const response = await axios(options);
        token = response.data.access_token;
        if (!token)
            throw new Error('No token received from Auth0');
        const decoded = jwt.decode(token);
        tokenExpiresAt = decoded.exp * 1000;
        return { token, tokenExpiresAt };
    }
    catch (error) {
        console.log('Error getting Auth0 token:', error);
        throw error;
    }
}
export async function refreshAccessToken(req, res, next) {
    if (!token || Date.now() >= tokenExpiresAt) {
        try {
            await getAuth0Token();
        }
        catch (error) {
            return next(new Error('Something went wrong validating your credentials, please try again later'));
        }
    }
    if (!token)
        return next(new Error('No token received from Auth0'));
    req.accessToken = token;
    next();
}
