import { auth } from 'express-oauth2-jwt-bearer';
import jwt from 'jsonwebtoken';
const publicSigningKey = process.env.AUTH0_PUBLIC_SIGNING_KEY ?? '';
const audience = process.env.AUTH0_API_IDENTIFIER ?? '';
const auth0Domain = process.env.AUTH0_DOMAIN ?? '';
export const checkJwtMiddleware = auth({
    audience,
    issuerBaseURL: `https://${auth0Domain}`,
});
export const authSocketMiddleware = (socket, next) => {
    const error = new Error("unauthorized");
    error.data = { content: 'Something went wrong validating your credentials, please try again later.' };
    const token = socket.handshake.auth?.token;
    if (!token)
        return next(error);
    try {
        const decoded = jwt.verify(token, publicSigningKey);
        socket.handshake.auth.user = decoded;
    }
    catch (error) {
        console.error(error);
        return next(error);
    }
    next();
};
