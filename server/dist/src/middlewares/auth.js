
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="7f15490a-6941-5966-a8cb-a6870930bd88")}catch(e){}}();
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
//# sourceMappingURL=auth.js.map
//# debugId=7f15490a-6941-5966-a8cb-a6870930bd88
