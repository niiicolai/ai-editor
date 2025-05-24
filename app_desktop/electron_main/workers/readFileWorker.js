import { parentPort, workerData } from "worker_threads";
import fs from "fs";

try {
  const content = fs.readFileSync(workerData.filePath, "utf8");
  parentPort.postMessage({ success: true, data: content });
} catch (error) {
  parentPort.postMessage({ success: false, data: "" });
}
