import { db } from '../index.js'

const getTable = (embeddingModel) =>
    embeddingModel === "all-MiniLM-L6-v2"
      ? "all_minilm_l6_v2_file_question_answer"
      : "code_t5_file_question_answer";
const getForeignKey = (embeddingModel) =>
    embeddingModel === "all-MiniLM-L6-v2"
      ? "all_minilm_l6_v2_file_id"
      : "code_t5_file_id";

export const insertQA = (
  body,
  embeddingModel = "all-MiniLM-L6-v2"
) => {
  const table = getTable(embeddingModel);
  const foreignKey = getForeignKey(embeddingModel);

  const stmt = db.prepare(`
        INSERT INTO ${table} (
            embedding, qa, ${foreignKey}, project_id, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?)
    `);
  const info = stmt.run(
    JSON.stringify(body.embedding),
    body.qa,
    parseInt(body.file_id),
    body.project_id,
    body.created_at,
    body.updated_at
  );
  return info.lastInsertRowid;
};

export const updateQA = (
  id,
  body,
  embeddingModel = "all-MiniLM-L6-v2"
) => {
  const table = getTable(embeddingModel);
  const foreignKey = getForeignKey(embeddingModel);

  const stmt = db.prepare(`
    UPDATE ${table}
    SET embedding = ?, qa = ?, ${foreignKey} = ?, project_id = ?, created_at = ?, updated_at = ?
    WHERE rowid = ?
  `);
  stmt.run(
    JSON.stringify(body.embedding),
    body.qa,
    parseInt(body.file_id),
    body.project_id,
    body.created_at,
    body.updated_at,
    id
  );
};

export const deleteQA = (id, embeddingModel = "all-MiniLM-L6-v2") => {
  const table = getTable(embeddingModel);
  const stmt = db.prepare(`DELETE FROM ${table} WHERE rowid = ?`);
  stmt.run(id);
};

export const deleteAllQAByProjectId = (
  project_id,
  embeddingModel = "all-MiniLM-L6-v2"
) => {
  const table = getTable(embeddingModel);
  const stmt = db.prepare(`
        DELETE FROM ${table}
        WHERE project_id = ?
    `);
  stmt.run(project_id);
};

export const vectorSearchQAByProjectId = (
  queryEmbedding,
  project_id,
  embeddingModel = "all-MiniLM-L6-v2"
) => {
  const table = getTable(embeddingModel);
  const foreignKey = getForeignKey(embeddingModel);
  
  const stmt = db.prepare(`
        SELECT rowid, qa, ${foreignKey}, created_at, updated_at, distance
        FROM ${table}
        WHERE embedding MATCH ? AND project_id = ?
        ORDER BY distance ASC
        LIMIT 2
    `);

  const result = stmt.all(JSON.stringify(queryEmbedding), project_id);
  return result;
};

export const textSearchQAByProjectId = (
  query,
  project_id,
  embeddingModel = "all-MiniLM-L6-v2"
) => {
  const table = getTable(embeddingModel);
  const foreignKey = getForeignKey(embeddingModel);

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
        SELECT rowid, qa, ${foreignKey}, created_at, updated_at
        FROM ${table}
        WHERE 
            project_id = @project_id AND
            ${whereClauses}
        ORDER BY created_at DESC
        LIMIT 2
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

export const paginateQAByFileId = (
  page,
  limit,
  file_id,
  embeddingModel = "all-MiniLM-L6-v2"
) => {
  const offset = (page - 1) * limit;
  const table = getTable(embeddingModel);
  const foreignKey = getForeignKey(embeddingModel);

  const totalStmt = db.prepare(`
        SELECT COUNT(*) as total
        FROM ${table}
        WHERE ${foreignKey} = ?
    `);
  const total = totalStmt.get(file_id).total;

  const pages = Math.ceil(total / limit);

  const filesStmt = db.prepare(`
        SELECT rowid, qa, ${foreignKey}, created_at, updated_at
        FROM ${table}
        WHERE ${foreignKey} = ?
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
    `);
  const data = filesStmt.all(file_id, limit, offset);

  return {
    data,
    page,
    limit,
    pages,
    total,
  };
};
