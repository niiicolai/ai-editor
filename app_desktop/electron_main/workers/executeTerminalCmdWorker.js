import { parentPort, workerData } from "worker_threads";
import { exec } from "child_process";

try {
  const { cmd, cwd } = workerData;

  if (!cmd || typeof cmd !== "string") {
    throw new Error("Invalid command");
  }

  if (!cwd || typeof cwd !== "string") {
    throw new Error("Invalid command");
  }

  const content = await new Promise((resolve, reject) => {
    exec(cmd, { cwd }, (error, stdout, stderr) => {
      if (error) {
        reject({ message: error.message, code: error.code });
        return;
      }
      resolve(`${stdout} ${stderr}`);
    });
  });

  parentPort.postMessage({ success: true, data: content });
} catch (error) {
  parentPort.postMessage({ success: false, error: error.message });
}
