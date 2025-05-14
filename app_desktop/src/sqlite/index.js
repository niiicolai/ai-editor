import Database from "better-sqlite3";
import * as vec from "sqlite-vec";

const db = new Database("editor_db.db");
vec.load(db);

db.prepare(`
  CREATE VIRTUAL TABLE IF NOT EXISTS embeddedfiles USING vec0(
    embedding FLOAT[384],
    project_id TEXT,
    filepath TEXT,
    filename TEXT,
    description TEXT,
    created_at TEXT
  );
`).run();

export const insertEmbeddedFile = (body) => {
    const stmt = db.prepare(`
        INSERT INTO embeddedfiles (
            embedding, filepath, filename, description, project_id, created_at
        ) VALUES (?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
        JSON.stringify(body.embedding),
        body.filepath,
        body.filename,
        body.description,
        body.project_id,
        body.created_at
    );
    return info.lastInsertRowid;
};

export const updateEmbeddedFile = (id, body) => {
  const stmt = db.prepare(`
    UPDATE embeddedfiles
    SET embedding = ?, filepath = ?, filename = ?, description = ?, project_id = ?, created_at = ?
    WHERE rowid = ?
  `);
  stmt.run(
    JSON.stringify(body.embedding),
    body.filepath,
    body.filename,
    body.description,
    body.project_id,
    body.created_at,
    id
  );
};

export const deleteEmbeddedFile = (id) => {
  const stmt = db.prepare(`DELETE FROM embeddedfiles WHERE rowid = ?`);
  stmt.run(id);
};

export const deleteAllEmbeddedFiles = (project_id) => {
    const stmt = db.prepare(`
        DELETE FROM embeddedfiles
        WHERE project_id = ?
    `);
    stmt.run(project_id);
};

export const vectorSearchEmbeddedFiles = (queryEmbedding, project_id) => {
    const stmt = db.prepare(`
        SELECT rowid, filepath, filename, description, created_at, distance
        FROM embeddedfiles
        WHERE embedding MATCH ? AND project_id = ?
        ORDER BY distance ASC
        LIMIT 5
    `);

    const result = stmt.all(JSON.stringify(queryEmbedding), project_id);
    return result;
};

export const textSearchEmbeddedFiles = (query, project_id) => {
    const stmt = db.prepare(`
        SELECT rowid, filepath, filename, description, created_at
        FROM embeddedfiles
        WHERE 
            project_id = @project_id AND (
                filename LIKE @q OR
                filepath LIKE @q OR
                description LIKE @q
            )
        ORDER BY created_at DESC
        LIMIT 20
    `);

    const result = stmt.all({ q: `%${query}%`, project_id });
    return result;
};

export const paginateEmbeddedFiles = (page, limit, project_id) => {
    const offset = (page - 1) * limit;

    const totalStmt = db.prepare(`
        SELECT COUNT(*) as total
        FROM embeddedfiles
        WHERE project_id = ?
    `);
    const total = (totalStmt.get(project_id)).total;

    const pages = Math.ceil(total / limit);

    const filesStmt = db.prepare(`
        SELECT rowid, filepath, filename, description, created_at
        FROM embeddedfiles
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
