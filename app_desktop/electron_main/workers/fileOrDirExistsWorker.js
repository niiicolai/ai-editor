import { parentPort, workerData } from "worker_threads";
import fs from "fs";

try {
  const { path } = workerData;
  if (!path || typeof path !== "string") {
    throw new Error("Invalid path");
  }

  fs.access(path, fs.constants.F_OK, (err) => {
    if (err) {
      parentPort.postMessage({ success: false, data: false });
    } else {
      parentPort.postMessage({ success: true, data: true });
    }
  });
} catch (error) {
  parentPort.postMessage({ success: false, data: [] });
}
