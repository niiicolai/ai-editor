import { parentPort, workerData } from "worker_threads";
import fs from "fs";
import path from "path";

try {
    const { dirPath, newName } = workerData;

    // Get the parent directory of the directory to be renamed
    const parentDirectory = path.dirname(dirPath);
    const newDirPath = path.join(parentDirectory, newName);

    // Rename the directory
    fs.renameSync(dirPath, newDirPath);

    // Send success message back to the parent thread
    parentPort.postMessage({ success: true, data: newDirPath });
} catch (error) {
    // Send error message back to the parent thread
    parentPort.postMessage({ success: false, error: error.message });
}
