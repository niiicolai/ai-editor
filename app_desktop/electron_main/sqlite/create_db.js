export const createDB = (db) => {
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS all_minilm_l6_v2_files (
      rowid INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id TEXT,
      filepath TEXT,
      filename TEXT,
      hash TEXT,
      created_at TEXT,
      updated_at TEXT
    );
    `
  ).run();

  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS code_t5_files (
      rowid INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id TEXT,
      filepath TEXT,
      filename TEXT,
      hash TEXT,
      created_at TEXT,
      updated_at TEXT
    );
    `
  ).run();

  db.prepare(
    `
    CREATE VIRTUAL TABLE IF NOT EXISTS code_t5_file_question_answer USING vec0(
      rowid INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id TEXT,
      embedding FLOAT[256],
      qa TEXT,
      created_at TEXT,
      updated_at TEXT
    );
    `//code_t5_file_id FLOAT NULL,
  ).run();

  db.prepare(
    `
    CREATE VIRTUAL TABLE IF NOT EXISTS all_minilm_l6_v2_file_question_answer USING vec0(
      rowid INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id TEXT,
      embedding FLOAT[384],
      qa TEXT,
      created_at TEXT,
      updated_at TEXT
    );
    `//all_minilm_l6_v2_file_id INTEGER NULL,
  ).run();
};
