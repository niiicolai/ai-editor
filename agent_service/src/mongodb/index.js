import mongoose from 'mongoose';
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const ENV = process.env.NODE_ENV || "development";
const URL = process.env[`MONGODB_${ENV.toUpperCase()}_URL`];
if (!URL) console.error("ERROR: Missing MongoDB URL in environment variables");

export const loadModels = () => {
    const dir = path.resolve('src', 'mongodb', 'models');
    fs.readdirSync(dir)
        .forEach(async file => {
            try {
                const fileDir = path.join(dir, file);
                const filePath = pathToFileURL(fileDir);
                await import(filePath.href);
            } catch (error) {
                console.error('ERROR: Failed to load model:', file, error);
            }
        })
};

export const mongoConnect = async () => {

    try {
        await mongoose.connect(URL);
        loadModels(); // Ensure all models are loaded
        console.log("INFO: Connected to MongoDB");
    } catch (err) {
        console.error("ERROR: Error connecting to MongoDB", err);
    }
};
