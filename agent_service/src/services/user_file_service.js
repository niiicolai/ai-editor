
import FileService from "./file_service.js";
import UserFile from "../mongodb/models/user_file_model.js";
import User from "../mongodb/models/user_model.js";
import dto from "../dto/user_file_dto.js";
import ClientError from '../errors/client_error.js';

import { objectValidator } from "../validators/object_validator.js";
import { stringValidator } from "../validators/string_validator.js";
import { idValidator } from "../validators/id_validator.js";
import { fieldsValidator } from "../validators/fields_validator.js";
import { paginatorValidator } from "../validators/paginator_validator.js";

const prefix = "user_file";
const categories = ['cv', 'cover_letter', 'portfolio', 'other'];
const allowedFields = [
    "_id",
    "user",
    "title",
    "url",
    "fileName",
    "category",
    "mimeType",
    "bytes",
    "created_at",
    "updated_at",
];

export default class UserFileService {

    /**
     * @function find
     * @description Find user file by id
     * @param {string} _id - User file id
     * @param {string} userId - User id
     * @param {array} fields - Fields to return
     * @return {Promise<object>} - User file object
     */
    static async find(_id, userId, fields = null) {
        idValidator(_id, "_id");
        idValidator(userId, "userId");
        fields = fieldsValidator(fields, allowedFields);

        const userFile = await UserFile
            .findOne({ _id, user: userId })
            .select(fields);
        if (!userFile) ClientError.notFound("user file not found");

        return dto(userFile);
    }

    /**
     * @function findAll
     * @description Find all user files by user id
     * @param {number} page - Page number
     * @param {number} limit - Page size
     * @param {string} userId - User id
     * @param {array} fields - Fields to return
     * @return {Promise<object>} - User files object
     */
    static async findAll(page, limit, userId, fields = null) {
        paginatorValidator(page, limit);
        idValidator(userId, "userId");
        fields = fieldsValidator(fields, allowedFields);

        const userFiles = await UserFile
            .find({ user: userId })
            .select(fields)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ created_at: -1 });
        const total = await UserFile.countDocuments({ user: userId });
        const pages = Math.ceil(total / limit);

        return {
            files: userFiles.map(dto),
            page,
            limit,
            total,
            pages,
        };
    }

    /**
     * @function create
     * @description Create a new user file
     * @param {object} file - File object
     * @param {object} body - Request body
     * @param {string} userId - User id
     * @param {array} fields - Fields to return
     * @return {Promise<object>} - Created user file object
     */
    static async create(file, body, userId, fields = null) {
        objectValidator(body, "body");
        stringValidator(body.category, "category");
        stringValidator(body.title, "title");
        idValidator(userId, "userId");

        if (!categories.includes(body.category)) {
            ClientError.badRequest("category must be one of the following: cv, cover_letter, portfolio, other");
        }

        if (file.size === 0) {
            ClientError.badRequest("file is required");
        }

        const user = await User.findOne({ _id: userId });
        if (!user) ClientError.notFound("user not found");
        
        let fileKey;
        try {
            const { url, key } = await FileService.putFile(file, body.category, 'public-read', prefix);
            fileKey = key;
            const userFile = new UserFile({
                url,
                filename: key,
                title: body.title,
                category: body.category,
                mimetype: file.mimetype,
                bytes: file.size,
                user: user._id,
            });

            await userFile.save();

            return await this.find(userFile._id.toString(), userId, fields);
        } catch (error) {
            if (fileKey) {
                try {
                    await FileService.deleteFile(fileKey);
                } catch (deleteError) {
                    console.error("Error deleting file from storage on catch error", deleteError);
                }
            }
            console.error("Error creating user file", error);
            throw new Error("Error uploading file", error);
        }
    }

    /**
     * @function destroy
     * @description Delete user file by id
     * @param {string} _id - User file id
     * @param {string} userId - User id
     * @return {Promise<void>}
     */
    static async destroy(_id, userId) {
        idValidator(_id, "_id");
        idValidator(userId, "userId");
        
        const userFile = await UserFile.findOne({ _id, user: userId });
        if (!userFile) ClientError.notFound("user file not found");

        try {
            await FileService.deleteFile(userFile.filename);
            await UserFile.deleteOne({ _id });
        } catch (error) {
            throw new Error("Error deleting file from storage", error);
        }
    }
}
