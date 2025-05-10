import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';
if (!JWT_SECRET) console.error('JWT_SECRET is not set in .env file');

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ? process.env.JWT_EXPIRES_IN : '';
if (!JWT_EXPIRES_IN) console.error('JWT_EXPIRES_IN is not set or is invalid in .env file');

interface JWTPayload {
    _id: string;
    role: string;
}

interface JWTSignOption {
    expires: boolean;
}

export default class JwtService {

    /**
     * @function sign
     * @param {JWTPayload} payload
     * @returns {Promise<String>}
     */
    static async sign(payload: JWTPayload, options: JWTSignOption = { expires: true }): Promise<string> {
        const signOptions = {
            ...(options.expires && { expiresIn: JWT_EXPIRES_IN }),
        };

        return jwt.sign(payload, JWT_SECRET, signOptions as jwt.SignOptions);
    }

    /**
     * @function verify
     * @param {String} token
     * @returns {Promise<JWTPayload>}
     */
    static async verify(token: string): Promise<JWTPayload> {
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    }
}
