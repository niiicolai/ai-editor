import mongoose from 'mongoose';

const ENV = process.env.NODE_ENV || "development";
const URL = process.env[`MONGODB_${ENV.toUpperCase()}_URL`];
if (!URL) console.error("ERROR: Missing MongoDB URL in environment variables");

export const mongoConnect = async () => {
    if (!URL) return;
    
    try {
        await mongoose.connect(URL);
        console.log("INFO: Connected to MongoDB");
    } catch (err) {
        console.error("ERROR: Error connecting to MongoDB", err);
    }
};
