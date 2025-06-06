const { ipcMain } = require('electron');

const {
  insertQA,
  updateQA,
  deleteQA,
  deleteAllQAByProjectId,
  paginateQAByProjectId,
  vectorSearchQAByProjectId,
  textSearchQAByProjectId
} = require('../sqlite/services/qa_service.cjs');


const qaIpc = (mainWindow) => {

  ipcMain.on("insert-qa", async (event, body, embeddingModel) => {
    try {
      const insertId = insertQA(body, embeddingModel);
      event.reply("on-insert-qa", { success: true, id: insertId });
    } catch (error) {
      console.error("Error inserting embedded file:", error);
      event.reply("on-insert-qa", {
        success: false,
        error: error.message,
      });
    }
  });

  ipcMain.on(
    "update-qa",
    async (event, rowid, body, embeddingModel) => {
      try {
        updateQA(rowid, body, embeddingModel);
        event.reply("on-update-qa", { success: true });
      } catch (error) {
        console.error("Error updating embedded file:", error);
        event.reply("on-update-qa", {
          success: false,
          error: error.message,
        });
      }
    }
  );

  ipcMain.on("delete-qa", async (event, rowid, embeddingModel) => {
    try {
      deleteQA(rowid, embeddingModel);
      event.reply("on-delete-qa", { success: true });
    } catch (error) {
      console.error("Error deleting embedded file:", error);
      event.reply("on-delete-qa", {
        success: false,
        error: error.message,
      });
    }
  });

  ipcMain.on("delete-all-qa", async (event, project_id, embeddingModel) => {
    try {
      deleteAllQAByProjectId(project_id, embeddingModel);
      event.reply("on-delete-all-qa", { success: true });
    } catch (error) {
      console.error("Error deleting all QA:", error);
      event.reply("on-delete-all-qa", {
        success: false,
        error: error.message,
      });
    }
  });

  ipcMain.on("vector-search-qa", async (event, project_id, queryEmbedding, embeddingModel) => {
    try {
      const result = vectorSearchQAByProjectId(queryEmbedding, project_id, embeddingModel);
      event.reply("on-vector-search-qa", { success: true, result });
    } catch (error) {
      console.error("Error vector searching QA:", error);
      event.reply("on-vector-search-qa", { success: false, error: error.message });
    }
  });

  ipcMain.on("text-search-qa", async (event, project_id, query, embeddingModel) => {
    try {
      const result = textSearchQAByProjectId(query, project_id, embeddingModel);
      event.reply("on-text-search-qa", { success: true, result });
    } catch (error) {
      console.error("Error text searching QA:", error);
      event.reply("on-text-search-qa", { success: false, error: error.message });
    }
  });

  ipcMain.on(
    "paginate-qa",
    async (event, page, limit, project_id, embeddingModel) => {
      try {
        const result = paginateQAByProjectId(
          page,
          limit,
          project_id,
          embeddingModel
        );
        event.reply("on-paginate-qa", { success: true, result });
      } catch (error) {
        console.error("Error paginate QA:", error);
        event.reply("on-paginate-qa", {
          success: false,
          error: error.message,
        });
      }
    }
  );
};

module.exports = {
  qaIpc
};
