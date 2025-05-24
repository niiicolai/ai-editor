import { parentPort, workerData } from "worker_threads";
import fs from "fs";
import path from "path";

try {
  const files = fs.readdirSync(workerData.dirPath);
  const fileInfo = files.map((file) => {
    const fullPath = path.join(workerData.dirPath, file);
    const stats = fs.statSync(fullPath);
    return {
      name: file,
      path: fullPath,
      isDirectory: stats.isDirectory(),
    };
  });

  parentPort.postMessage({ success: true, data: fileInfo });
} catch (error) {
  parentPort.postMessage({ success: false, data: [] });
}
