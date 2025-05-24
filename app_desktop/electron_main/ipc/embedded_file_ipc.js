import { ipcMain } from "electron";
import { 
  insertEmbeddedFile,
  updateEmbeddedFile, 
  deleteEmbeddedFile, 
  deleteAllEmbeddedFiles, 
  paginateEmbeddedFiles, 
  findEmbeddedFileByHashAndProjectId,
  findEmbeddedFileByFilepathAndProjectId
} from "../sqlite/services/embedded_file_service.js";

export const embeddedFileIpc = (mainWindow) => {
  ipcMain.on(
    "find-embedded-file-by-hash-and-project-id",
    async (event, hash, project_id, embeddingModel) => {
      try {
        const file = findEmbeddedFileByHashAndProjectId(
          hash,
          project_id,
          embeddingModel
        );
        event.reply("on-find-embedded-file-by-hash-and-project-id", {
          success: true,
          file: file,
        });
      } catch (error) {
        console.error(
          "Error finding embedded file by hash and project id:",
          error
        );
        event.reply("on-find-embedded-file-by-hash-and-project-id", {
          success: false,
          error: error.message,
        });
      }
    }
  );

  ipcMain.on(
    "find-embedded-file-by-file-path-and-project-id",
    async (event, filepath, project_id, embeddingModel) => {
      try {
        const file = findEmbeddedFileByFilepathAndProjectId(
          filepath,
          project_id,
          embeddingModel
        );
        event.reply("on-find-embedded-file-by-file-path-and-project-id", {
          success: true,
          file: file,
        });
      } catch (error) {
        console.error(
          "Error finding embedded file by filepath and project id:",
          error
        );
        event.reply("on-find-embedded-file-by-file-path-and-project-id", {
          success: false,
          error: error.message,
        });
      }
    }
  );

  ipcMain.on("insert-embedded-file", async (event, body, embeddingModel) => {
    try {
      const insertId = insertEmbeddedFile(body, embeddingModel);
      event.reply("on-insert-embedded-file", { success: true, id: insertId });
    } catch (error) {
      console.error("Error inserting embedded file:", error);
      event.reply("on-insert-embedded-file", {
        success: false,
        error: error.message,
      });
    }
  });

  ipcMain.on(
    "update-embedded-file",
    async (event, id, body, embeddingModel) => {
      try {
        updateEmbeddedFile(id, body, embeddingModel);
        event.reply("on-update-embedded-file", { success: true });
      } catch (error) {
        console.error("Error updating embedded file:", error);
        event.reply("on-update-embedded-file", {
          success: false,
          error: error.message,
        });
      }
    }
  );

  ipcMain.on("delete-embedded-file", async (event, id, embeddingModel) => {
    try {
      deleteEmbeddedFile(id, embeddingModel);
      event.reply("on-delete-embedded-file", { success: true });
    } catch (error) {
      console.error("Error deleting embedded file:", error);
      event.reply("on-delete-embedded-file", {
        success: false,
        error: error.message,
      });
    }
  });

  ipcMain.on("delete-all-embedded-files", async (event, id, embeddingModel) => {
    try {
      deleteAllEmbeddedFiles(id, embeddingModel);
      event.reply("on-delete-all-embedded-files", { success: true });
    } catch (error) {
      console.error("Error deleting all embedded files:", error);
      event.reply("on-delete-all-embedded-files", {
        success: false,
        error: error.message,
      });
    }
  });

  ipcMain.on(
    "paginate-embedded-files",
    async (event, page, limit, project_id, embeddingModel) => {
      try {
        const result = paginateEmbeddedFiles(
          page,
          limit,
          project_id,
          embeddingModel
        );
        event.reply("on-paginate-embedded-files", { success: true, result });
      } catch (error) {
        console.error("Error paginate embedded files:", error);
        event.reply("on-paginate-embedded-files", {
          success: false,
          error: error.message,
        });
      }
    }
  );
};
