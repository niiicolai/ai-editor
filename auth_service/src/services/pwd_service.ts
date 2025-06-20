import bcrypt from "bcrypt";
import ClientError from "../errors/client_error";

export default class PwdService {

    /**
     * @function hashPassword
     * @param {String} password
     * @returns {Promise<String>}
     */
    static async hashPassword(password: string): Promise<string> {
        if (!password) ClientError.badRequest("Password is required");
        if (password.includes(" ")) ClientError.badRequest("Password must not contain spaces");
        if (password.length < 8) ClientError.badRequest("Password must be at least 8 characters long");
        if (password.length > 100) ClientError.badRequest("Password must be at most 100 characters long");
        if (!/\d/.test(password)) ClientError.badRequest("Password must contain at least one digit");
        if (!/[a-z]/.test(password)) ClientError.badRequest("Password must contain at least one lower case letter");
        if (!/[A-Z]/.test(password)) ClientError.badRequest("Password must contain at least one upper case letter");
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) ClientError.badRequest("Password must contain at least one special character");

        return bcrypt.hash(password, 10);
    }

    /**
     * @function comparePassword
     * @param {String} password
     * @param {String} hashedPassword
     * @returns {Promise<Boolean>}
     */
    static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        if (!password) throw new Error("Password is required");
        if (!hashedPassword) throw new Error("HashedPassword is required");

        return bcrypt.compare(password, hashedPassword);
    }
}
