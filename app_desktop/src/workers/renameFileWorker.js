import { parentPort, workerData } from "worker_threads";
import fs from "fs";
import path from "path";

try {
    const { filePath, newName } = workerData;

    // Get the directory of the file and construct the new file path
    const directory = path.dirname(filePath);
    const newFilePath = path.join(directory, newName);
    // Rename the file
    fs.renameSync(filePath, newFilePath);

    // Send success message back to the parent thread
    parentPort.postMessage({ success: true, data: newFilePath });
} catch (error) {
    // Send error message back to the parent thread
    parentPort.postMessage({ success: false, error: error.message });
}
