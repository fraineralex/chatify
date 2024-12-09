
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="bdc7acc6-d9c5-58cd-81be-736dd8920ce8")}catch(e){}}();
import axios from 'axios';
const AUTH0_AUDIENCE = process.env.AUTH0_API_IDENTIFIER ?? '';
export async function getUserById(id, accessToken) {
    const config = {
        method: 'GET',
        url: `${AUTH0_AUDIENCE}users/${id}`,
        headers: {
            authorization: `Bearer ${accessToken}`,
        },
    };
    const response = await axios.request(config);
    return response.data;
}
export async function getUsersByIds(ids, accesToken) {
    const config = {
        method: 'GET',
        url: `${AUTH0_AUDIENCE}users`,
        headers: {
            authorization: `Bearer ${accesToken}`,
        },
        params: {
            q: `user_id:(${ids.map((id) => `"${id}"`).join(' OR ')})`,
            search_engine: 'v3',
        },
    };
    const response = await axios.request(config);
    return response.data;
}
//# sourceMappingURL=user.js.map
//# debugId=bdc7acc6-d9c5-58cd-81be-736dd8920ce8
