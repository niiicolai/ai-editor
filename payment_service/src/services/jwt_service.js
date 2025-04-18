import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) console.error('JWT_SECRET is not set in .env file');

export default class JwtService {

    /**
     * @function verify
     * @param {String} token
     * @returns {Promise<Object>}
     */
    static async verify(token) {
        if (!token) throw new Error('Token is required');
        if (typeof token !== 'string') throw new Error('Token must be a string');
        
        return jwt.verify(token, JWT_SECRET);
    }
}
