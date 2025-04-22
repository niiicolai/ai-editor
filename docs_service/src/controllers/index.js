import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

export const setupControllers = (app) => {
  const dir = path.resolve('src', 'controllers', 'api');
    fs.readdirSync(dir)
        .forEach(async file => {
            try {
                const fileDir = path.join(dir, file);
                const filePath = pathToFileURL(fileDir);
                const controller = await import(filePath.href);
                app.use('/api/v1', controller.default);
            } catch (error) {
                console.error('ERROR: Failed to load controller:', file, error);
            }
        })
};
