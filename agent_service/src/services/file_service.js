
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import ClientError from "../errors/clientError.js";

const { S3 } = process.env;
if (!S3) {
    console.error(`S3 environment variables are not set. Please check your .env file.`);
    process.exit(1);
}

const env = process.env.NODE_ENV || 'development';
const S3Properties = S3.split(",");
if (S3Properties.length !== 6) {
    console.error(`S3 environment variables are not set correctly. Please check your .env file. 
        Must be in the format: S3_ENDPOINT:S3_REGION:S3_ACCESS_KEY_ID:S3_SECRET_ACCESS_KEY:S3_BUCKET:S3_CDN_URL`);
    process.exit(1);
}
const S3_ENDPOINT = S3Properties[0];
const S3_REGION = S3Properties[1];
const S3_ACCESS_KEY_ID = S3Properties[2];
const S3_SECRET_ACCESS_KEY = S3Properties[3];
const S3_BUCKET = S3Properties[4];
const S3_CDN_URL = S3Properties[5];
const s3 = new S3Client({
    endpoint: S3_ENDPOINT,
    region: S3_REGION,
    credentials: {
        accessKeyId: S3_ACCESS_KEY_ID,
        secretAccessKey: S3_SECRET_ACCESS_KEY
    }
});


const maxSize = 10 * 1024 * 1024; // 10MB
const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
];

export default class FileService {

    /**
     * @function putFile
     * @description Upload a file to an S3 bucket.
     * @param {Object} file - The file object.
     * @param {string} key - The key name.
     * @param {string} ACL - The access control list (ACL) for the file.
     * @returns {Promise<Object>} - The promise.
     */
    static async putFile(file, key, ACL = 'public-read', prefix = '') {
        if (!file) throw new Error("FileService.upload: file is required.");
        if (!key) throw new Error("FileService.upload: key is required.");
        if (!ACL) throw new Error("FileService.upload: ACL is required.");

        if (file.size > maxSize) ClientError.badRequest("File size exceeds the maximum limit of 10MB.");
        if (!allowedMimeTypes.includes(file.mimetype)) ClientError.badRequest(`Invalid file type. Allowed types are: ${allowedMimeTypes.join(", ")}`);

        const { buffer, mimetype } = file;
        const originalname = file.originalname.split('.').slice(0, -1).join('.').replace(/\s/g, '');
        const timestamp = new Date().getTime();
        const filename = `${originalname}-${key}-${timestamp}.${mimetype.split('/')[1]}`;
        key = `${prefix}/${key}/${filename}`;

        try {
            if (env !== 'test') {                
                await s3.send(new PutObjectCommand({
                    Bucket: S3_BUCKET, 
                    Key: key, 
                    Body: buffer, 
                    ACL
                }));
            } else console.warn("WARN: File was not uploaded to S3 in test environment.");
            return {
                url: `${S3_CDN_URL}/${key}`,
                key
            };
        } catch (error) {
            console.error("Error uploading file to S3:", error);
            throw error;
        }
    }

    /**
     * @function deleteFile
     * @description Delete a file from an S3 bucket.
     * @param {string} Key - The key name.
     * @returns {Promise} - The promise.
     */
    static async deleteFile(Key) {
        if (!Key) throw new Error("FileService.deleteFile: Key is required.");
        if (env === 'test') {
            console.warn("WARN: File deletion is disabled in test environment.");
            return;
        }

        try {
            await s3.send(new DeleteObjectCommand({ 
                Bucket: S3_BUCKET, 
                Key 
            }));
        } catch (error) {
            console.error("Error deleting file from S3:", error);
            throw error;
        }
    }

    /**
     * @function parseKey
     * @description Parse a key.
     * @param {string} url - The url.
     * @returns {string} - The key.
     */
    parseKey(url) {
        if (!url) throw new Error("StorageService.parseKey: url is required.");

        return url.replace(`${this.cdnURL}/`, '');
    }
}
