import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) console.error('JWT_SECRET is not set in .env file');

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
if (!JWT_EXPIRES_IN) console.error('JWT_EXPIRES_IN is not set in .env file');

export default class JwtService {

    /**
     * @function sign
     * @param {Object} payload
     * @param {String} payload._id
     * @returns {Promise<String>}
     */
    static async sign(payload, options={ expires: true }) {
        if (!payload) throw new Error('Payload is required');
        if (typeof payload !== 'object') throw new Error('Payload must be an object');
        if (!payload._id) throw new Error('Payload must contain _id');

        const signOptions = {
            ...(options.expires && { expiresIn: JWT_EXPIRES_IN }),
        };

        return jwt.sign(payload, JWT_SECRET, signOptions);
    }

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
