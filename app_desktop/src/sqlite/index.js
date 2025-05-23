import Database from "better-sqlite3";
import * as vec from "sqlite-vec";

const db = new Database("editor_db.db");
vec.load(db);

db.prepare(
  `
    CREATE VIRTUAL TABLE IF NOT EXISTS all_minilm_l6_v2_files USING vec0(
        rowid INTEGER PRIMARY KEY AUTOINCREMENT,
        embedding FLOAT[384],
        project_id TEXT,
        filepath TEXT,
        filename TEXT,
        description TEXT,
        hash TEXT,
        created_at TEXT,
        updated_at TEXT
    );
`
).run();

db.prepare(
  `
    CREATE VIRTUAL TABLE IF NOT EXISTS code_t5_files USING vec0(
        rowid INTEGER PRIMARY KEY AUTOINCREMENT,
        embedding FLOAT[256],
        project_id TEXT,
        filepath TEXT,
        filename TEXT,
        description TEXT,
        hash TEXT,
        created_at TEXT,
        updated_at TEXT
    );
`
).run();

export const findEmbeddedFileByHashAndProjectId = (
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
            SELECT rowid, filepath, filename, description, hash, created_at, updated_at 
            FROM ${table} 
            WHERE project_id = ? AND hash = ?
        `
    )
    .get(project_id, hash);
    return result;
};

export const findEmbeddedFileByFilepathAndProjectId = (
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
            SELECT rowid, filepath, filename, description, hash, created_at, updated_at 
            FROM ${table} 
            WHERE project_id = ? AND filepath = ?
        `
    )
    .get(project_id, filepath);
    return result;
};

export const insertEmbeddedFile = (
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
            embedding, filepath, filename, description, project_id, hash, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
  const info = stmt.run(
    JSON.stringify(body.embedding),
    body.filepath,
    body.filename,
    body.description,
    body.project_id,
    body.hash,
    body.created_at,
    body.updated_at
  );
  return info.lastInsertRowid;
};

export const updateEmbeddedFile = (
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
    SET embedding = ?, filepath = ?, filename = ?, description = ?, project_id = ?, hash = ?, created_at = ?, updated_at = ?
    WHERE rowid = ?
  `);
  stmt.run(
    JSON.stringify(body.embedding),
    body.filepath,
    body.filename,
    body.description,
    body.project_id,
    body.hash,
    body.created_at,
    body.updated_at,
    id
  );
};

export const deleteEmbeddedFile = (id, embeddingModel = "all-MiniLM-L6-v2") => {
  const table =
    embeddingModel === "all-MiniLM-L6-v2"
      ? "all_minilm_l6_v2_files"
      : "code_t5_files";
  const stmt = db.prepare(`DELETE FROM ${table} WHERE rowid = ?`);
  stmt.run(id);
};

export const deleteAllEmbeddedFiles = (
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

export const vectorSearchEmbeddedFiles = (
  queryEmbedding,
  project_id,
  embeddingModel = "all-MiniLM-L6-v2"
) => {
  const table =
    embeddingModel === "all-MiniLM-L6-v2"
      ? "all_minilm_l6_v2_files"
      : "code_t5_files";
  const stmt = db.prepare(`
        SELECT rowid, filepath, filename, description, hash, created_at, updated_at, distance
        FROM ${table}
        WHERE embedding MATCH ? AND project_id = ?
        ORDER BY distance ASC
        LIMIT 4
    `);

  const result = stmt.all(JSON.stringify(queryEmbedding), project_id);
  return result;
};

export const textSearchEmbeddedFiles = (
  query,
  project_id,
  embeddingModel = "all-MiniLM-L6-v2"
) => {
  const table =
    embeddingModel === "all-MiniLM-L6-v2"
      ? "all_minilm_l6_v2_files"
      : "code_t5_files";
  const terms = query
    .split(" ")
    .map((term) => term.trim().replace(/[?!.,;:]+$/, ""))
    .filter((term) => term.length > 0);

  if (terms.length === 0) return [];

  // Build dynamic WHERE clause for each term
  const whereClauses = terms
    .map(
      (_, i) => `
        (
            filename LIKE @q${i} OR
            filepath LIKE @q${i} OR
            description LIKE @q${i}
        )
    `
    )
    .join(" OR ");

  const sql = `
        SELECT rowid, filepath, filename, description, hash, created_at, updated_at
        FROM ${table}
        WHERE 
            project_id = @project_id AND
            ${whereClauses}
        ORDER BY created_at DESC
        LIMIT 4
    `;

  // Build params object
  const params = { project_id };
  terms.forEach((term, i) => {
    params[`q${i}`] = `%${term}%`;
  });

  const stmt = db.prepare(sql);
  const result = stmt.all(params);
  return result;
};

export const paginateEmbeddedFiles = (
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
  const totalStmt = db.prepare(`
        SELECT COUNT(*) as total
        FROM ${table}
        WHERE project_id = ?
    `);
  const total = totalStmt.get(project_id).total;

  const pages = Math.ceil(total / limit);

  const filesStmt = db.prepare(`
        SELECT rowid, filepath, filename, description, hash, created_at, updated_at
        FROM ${table}
        WHERE project_id = ?
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
    `);
  const files = filesStmt.all(project_id, limit, offset);

  return {
    files,
    page,
    limit,
    pages,
    total,
  };
};
