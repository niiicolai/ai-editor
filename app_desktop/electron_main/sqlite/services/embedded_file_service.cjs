const { db } = require('../index.cjs');

const findEmbeddedFileByHashAndProjectId = (
    hash,
    project_id,
    embeddingModel = "all-MiniLM-L6-v2"
) => {
    const table =
        embeddingModel === "all-MiniLM-L6-v2"
            ? "all_minilm_l6_v2_files"
            : "code_t5_files";
    const result = db.prepare(
        `
            SELECT rowid, filepath, filename, hash, created_at, updated_at 
            FROM ${table} 
            WHERE project_id = ? AND hash = ?
        `
    )
    .get(project_id, hash);
    return result;
};

const findEmbeddedFileByFilepathAndProjectId = (
    filepath,
    project_id,
    embeddingModel = "all-MiniLM-L6-v2"
) => {
    const table =
        embeddingModel === "all-MiniLM-L6-v2"
            ? "all_minilm_l6_v2_files"
            : "code_t5_files";
    const result = db.prepare(
        `
            SELECT rowid, filepath, filename, hash, created_at, updated_at 
            FROM ${table} 
            WHERE project_id = ? AND filepath = ?
        `
    )
    .get(project_id, filepath);
    return result;
};

const insertEmbeddedFile = (
  body,
  embeddingModel = "all-MiniLM-L6-v2"
) => {
  // check if the filepath and hash already exist
  const table =
    embeddingModel === "all-MiniLM-L6-v2"
      ? "all_minilm_l6_v2_files"
      : "code_t5_files";
  const existingFile = db
    .prepare(
      `
        SELECT rowid 
        FROM ${table} 
        WHERE project_id = ? AND hash = ?
    `
    )
    .get(body.project_id, body.hash);

  if (existingFile) {
    throw new Error("A file with the same filepath and hash already exists.");
  }
  const stmt = db.prepare(`
        INSERT INTO ${table} (
            filepath, filename, project_id, hash, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?)
    `);
  const info = stmt.run(
    body.filepath,
    body.filename,
    body.project_id,
    body.hash,
    body.created_at,
    body.updated_at
  );
  return info.lastInsertRowid;
};

const updateEmbeddedFile = (
  id,
  body,
  embeddingModel = "all-MiniLM-L6-v2"
) => {
  const table =
    embeddingModel === "all-MiniLM-L6-v2"
      ? "all_minilm_l6_v2_files"
      : "code_t5_files";
  const stmt = db.prepare(`
    UPDATE ${table}
    filepath = ?, filename = ?, project_id = ?, hash = ?, created_at = ?, updated_at = ?
    WHERE rowid = ?
  `);
  stmt.run(
    body.filepath,
    body.filename,
    body.project_id,
    body.hash,
    body.created_at,
    body.updated_at,
    id
  );
};

const deleteEmbeddedFile = (id, embeddingModel = "all-MiniLM-L6-v2") => {
  const table =
    embeddingModel === "all-MiniLM-L6-v2"
      ? "all_minilm_l6_v2_files"
      : "code_t5_files";
  const stmt = db.prepare(`DELETE FROM ${table} WHERE rowid = ?`);
  stmt.run(id);
};

const deleteAllEmbeddedFiles = (
  project_id,
  embeddingModel = "all-MiniLM-L6-v2"
) => {
  const table =
    embeddingModel === "all-MiniLM-L6-v2"
      ? "all_minilm_l6_v2_files"
      : "code_t5_files";
  const stmt = db.prepare(`
        DELETE FROM ${table}
        WHERE project_id = ?
    `);
  stmt.run(project_id);
};

const paginateEmbeddedFiles = (
  page,
  limit,
  project_id,
  embeddingModel = "all-MiniLM-L6-v2"
) => {
  const offset = (page - 1) * limit;
  const table =
    embeddingModel === "all-MiniLM-L6-v2"
      ? "all_minilm_l6_v2_files"
      : "code_t5_files";
  const joinTable =
    embeddingModel === "all-MiniLM-L6-v2"
      ? "all_minilm_l6_v2_file_question_answer"
      : "code_t5_file_question_answer";
  const joinKey  =
    embeddingModel === "all-MiniLM-L6-v2"
      ? "all_minilm_l6_v2_file_id"
      : "code_t5_file_id";

  // Get total and paginated files in one go
  const totalStmt = db.prepare(`
    SELECT COUNT(*) as total
    FROM ${table}
    WHERE project_id = ?
  `);
  const total = totalStmt.get(project_id).total;
  const pages = Math.ceil(total / limit);

  // Fetch paginated files and their question_answers in a single LEFT JOIN
  const filesWithQAStmt = db.prepare(`
    SELECT 
      f.rowid as file_rowid, f.filepath, f.filename, f.hash, f.created_at, f.updated_at,
      joined_qa.rowid as qa_rowid, joined_qa.qa, joined_qa.created_at as qa_created_at, joined_qa.updated_at as qa_updated_at
    FROM ${table} f
    LEFT JOIN ${joinTable} joined_qa ON joined_qa.${joinKey} = f.rowid
    WHERE f.project_id = ?
    ORDER BY f.created_at DESC
    LIMIT ? OFFSET ?
  `);
  const rows = filesWithQAStmt.all(project_id, limit, offset);

  // Group by file_rowid
  const fileMap = new Map();
  for (const row of rows) {
    if (!fileMap.has(row.file_rowid)) {
      fileMap.set(row.file_rowid, {
        rowid: row.file_rowid,
        filepath: row.filepath,
        filename: row.filename,
        hash: row.hash,
        created_at: row.created_at,
        updated_at: row.updated_at,
        question_answers: []
      });
    }
    if (row.qa_rowid) {
      fileMap.get(row.file_rowid).question_answers.push({
        rowid: row.qa_rowid,
        qa: row.qa,
        created_at: row.qa_created_at,
        updated_at: row.qa_updated_at
      });
    }
  }

  return {
    files: Array.from(fileMap.values()),
    page,
    limit,
    pages,
    total,
  };
};

module.exports = {
  findEmbeddedFileByHashAndProjectId,
  findEmbeddedFileByFilepathAndProjectId,
  insertEmbeddedFile,
  updateEmbeddedFile,
  deleteEmbeddedFile,
  deleteAllEmbeddedFiles,
  paginateEmbeddedFiles
};
