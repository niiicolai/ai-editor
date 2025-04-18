
const AUTH_LS_KEY = import.meta.env.VITE_AUTH_LS_KEY;
if (!AUTH_LS_KEY) console.error('CONFIGURATION ERROR(tokenService.ts): VITE_AUTH_LS_KEY should be set in the .env file');


/**
 * @interface Token
 * @description Token interface
 * @param {string} exp - The token expiration
 * @param {string} iat - The token issued at
 * @param {string} sub - The token subject
 */
export interface ParsedToken {
    exp: number;
    iat: number;
    sub: string;
}

export default class TokenService {

    /**
     * @function setToken
     * @description Set the JWT token
     * @param {string} token - The JWT token
     * @returns {void}
     */
    static setToken = (token: string): void => {
        localStorage.setItem(AUTH_LS_KEY, token);
    }

    /**
     * @function getToken
     * @description Get the JWT token
     * @returns {string | null} token
     */
    static getToken = (): string | null => {
        return localStorage.getItem(AUTH_LS_KEY);
    }

    /**
     * @function removeToken
     * @description Remove the JWT token
     * @returns {void}
     */
    static removeToken = (): void => {
        localStorage.removeItem(AUTH_LS_KEY);
    }

    /**
     * @function hasToken
     * @description Check if the JWT token exists
     * @returns {boolean}
     */
    static hasToken = (): boolean => {
        return !!localStorage.getItem(AUTH_LS_KEY);
    }

    /**
     * @function parseToken
     * @description Parse the JWT token
     * @param {string} token - The JWT token
     * @returns {ParsedToken | null} payload
     */
    static parseToken = (token: string): ParsedToken | null => {
        if (!token) return null;
        const [, payload] = token.split('.');
        return JSON.parse(atob(payload));
    }

    /**
     * @function isTokenExpired
     * @description Check if the JWT token is expired
     * @param {string} token - The JWT token
     * @returns {boolean}
     */
    static isTokenExpired = (token: string): boolean => {
        const payload = TokenService.parseToken(token);
        if (!payload) return true;
        const now = Date.now() / 1000;
        return payload.exp < now;
    }
}   