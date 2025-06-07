const { db } = require('../index.cjs');

const getTable = (embeddingModel) =>
    embeddingModel === "all-MiniLM-L6-v2"
      ? "all_minilm_l6_v2_file_question_answer"
      : "code_t5_file_question_answer";
const getForeignKey = (embeddingModel) =>
    embeddingModel === "all-MiniLM-L6-v2"
      ? "all_minilm_l6_v2_file_id"
      : "code_t5_file_id";

const insertQA = (
  body,
  embeddingModel = "all-MiniLM-L6-v2"
) => {
  const table = getTable(embeddingModel);
  const foreignKey = getForeignKey(embeddingModel);

  const stmt = db.prepare(`
        INSERT INTO ${table} (
            embedding, qa, project_id, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?)
    `);
  const info = stmt.run(
    JSON.stringify(body.embedding),
    body.qa,
    //parseInt(body.file_id),
    body.project_id,
    body.created_at,
    body.updated_at
  );
  return info.lastInsertRowid;
};

const updateQA = (
  id,
  body,
  embeddingModel = "all-MiniLM-L6-v2"
) => {
  const table = getTable(embeddingModel);
  const foreignKey = getForeignKey(embeddingModel);

  const stmt = db.prepare(`
    UPDATE ${table}
    SET embedding = ?, qa = ?, project_id = ?, created_at = ?, updated_at = ?
    WHERE rowid = ?
  `);
  stmt.run(
    JSON.stringify(body.embedding),
    body.qa,
    //parseInt(body.file_id),
    body.project_id,
    body.created_at,
    body.updated_at,
    id
  );
};

const deleteQA = (id, embeddingModel = "all-MiniLM-L6-v2") => {
  const table = getTable(embeddingModel);
  const stmt = db.prepare(`DELETE FROM ${table} WHERE rowid = ?`);
  stmt.run(id);
};

const deleteAllQAByProjectId = (
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

const vectorSearchQAByProjectId = (
  queryEmbedding,
  project_id,
  embeddingModel = "all-MiniLM-L6-v2"
) => {
  const table = getTable(embeddingModel);
  const foreignKey = getForeignKey(embeddingModel);
  
  const stmt = db.prepare(`
        SELECT rowid, qa, created_at, updated_at, distance
        FROM ${table}
        WHERE embedding MATCH ? AND project_id = ?
        ORDER BY distance ASC
        LIMIT 2
    `);

  const result = stmt.all(JSON.stringify(queryEmbedding), project_id);
  return result;
};

const textSearchQAByProjectId = (
  query,
  project_id,
  embeddingModel = "all-MiniLM-L6-v2"
) => {
  const table = getTable(embeddingModel);
  const foreignKey = getForeignKey(embeddingModel);

  // Initialize params before using it
  const params = { project_id };

  // Split the query into keywords and build a dynamic WHERE clause
  // Remove punctuation like question marks, exclamation points, etc.
  const cleanedQuery = query.replace(/[?!.,;:()\[\]{}'"`~@#$%^&*_+=<>\\/|-]/g, '');
  const keywords = cleanedQuery
    .split(/\s+/)
    .filter(Boolean)
    .map((kw, idx) => {
      params[`kw${idx}`] = `%${kw}%`;
      return `qa LIKE @kw${idx}`;
    });

  const whereClause = keywords.length
    ? `project_id = @project_id AND (${keywords.join(' OR ')})`
    : `project_id = @project_id`;

  const sql = `
        SELECT rowid, qa, created_at, updated_at
        FROM ${table}
        WHERE ${whereClause}
        ORDER BY created_at DESC
        LIMIT 2
    `;

  // params mapping already added above

  const stmt = db.prepare(sql);
  const result = stmt.all(params);
  return result;
};

const paginateQAByProjectId = (
  page,
  limit,
  project_id,
  embeddingModel = "all-MiniLM-L6-v2"
) => {
  const offset = (page - 1) * limit;
  const table = getTable(embeddingModel);
  const foreignKey = getForeignKey(embeddingModel);

  const totalStmt = db.prepare(`
        SELECT COUNT(*) as total
        FROM ${table}
        WHERE project_id = ?
    `);
  const total = totalStmt.get(project_id).total;

  const pages = Math.ceil(total / limit);

  const filesStmt = db.prepare(`
        SELECT rowid, qa, created_at, updated_at
        FROM ${table}
        WHERE project_id = ?
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
    `);
  const data = filesStmt.all(project_id, limit, offset);

  return {
    data,
    page,
    limit,
    pages,
    total,
  };
};

module.exports = {
  insertQA,
  updateQA,
  deleteQA,
  deleteAllQAByProjectId,
  paginateQAByProjectId,
  vectorSearchQAByProjectId,
  textSearchQAByProjectId
};
