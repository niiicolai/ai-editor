import { parentPort, workerData } from "worker_threads";
import fs from "fs";

try {
  fs.mkdirSync(workerData.dirPath, { recursive: true });
  parentPort.postMessage({ success: true, data: workerData.dirPath });
} catch (error) {
  parentPort.postMessage({ success: false, data: "" });
}
