import { parentPort, workerData } from "worker_threads";
import fs from "fs";

try {
  const result = fs.writeFileSync(workerData.filePath, workerData.content, "utf8");
  parentPort.postMessage({ success: true, data: result });
} catch (error) {
  parentPort.postMessage({ success: false, data: {} });
}
