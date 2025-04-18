import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

export const setupCron = () => {
    console.log('INFO: Setting up cron jobs...');
  const dir = path.resolve('src', 'jobs', 'cron');
    fs.readdirSync(dir)
        .forEach(async file => {
            try {
                const fileDir = path.join(dir, file);
                const filePath = pathToFileURL(fileDir);
                const job = await import(filePath.href);
                job.default();
                console.log('INFO: Loaded cron job:', file);
            } catch (error) {
                console.error('ERROR: Failed to load cron job:', file, error);
            }
        })
};
