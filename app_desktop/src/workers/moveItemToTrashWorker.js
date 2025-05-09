import { parentPort, workerData } from "worker_threads";
import trash from "trash";

(async () => {
    try {
        const { path } = workerData;
        if (!path || typeof path !== "string") {
            throw new Error("Invalid path");
        }

        // Move the file to the trash
        await trash([path]);

        parentPort.postMessage({ success: true, data: { path } });
    } catch (error) {
        parentPort.postMessage({ success: false, error: error.message });
    }
})();
