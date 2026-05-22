const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '../../.issatrix-db/issatrix.db');

let db;

function getDb() {
  if (!db) {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

function initDb() {
  const instance = getDb();

  instance.exec(`
    CREATE TABLE IF NOT EXISTS tokenization_projects (
      id           TEXT PRIMARY KEY,
      name         TEXT NOT NULL,
      asset_type   TEXT,
      issuer_name  TEXT,
      jurisdiction TEXT,
      estimated_value REAL,
      status       TEXT DEFAULT 'draft',
      created_at   TEXT NOT NULL,
      updated_at   TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS agent_sessions (
      id             TEXT PRIMARY KEY,
      project_id     TEXT REFERENCES tokenization_projects(id),
      agent_type     TEXT DEFAULT 'asset_structuring_agent',
      messages       TEXT DEFAULT '[]',
      collected_data TEXT DEFAULT '{}',
      status         TEXT DEFAULT 'active',
      created_at     TEXT NOT NULL,
      updated_at     TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tokenization_briefs (
      id                      TEXT PRIMARY KEY,
      project_id              TEXT REFERENCES tokenization_projects(id),
      session_id              TEXT REFERENCES agent_sessions(id),
      asset_overview          TEXT DEFAULT '{}',
      tokenization_model      TEXT DEFAULT '{}',
      investor_access_model   TEXT DEFAULT '{}',
      issuance_matrix_design  TEXT DEFAULT '{}',
      required_documents      TEXT DEFAULT '[]',
      technical_configuration TEXT DEFAULT '{}',
      risks_and_open_questions TEXT DEFAULT '[]',
      readiness_score         TEXT DEFAULT 'draft',
      raw_json                TEXT DEFAULT '{}',
      generated_by            TEXT DEFAULT 'asset_structuring_agent',
      created_at              TEXT NOT NULL,
      updated_at              TEXT NOT NULL
    );
  `);

  console.log(`  Database ready → ${DB_PATH}`);
  return instance;
}

module.exports = { getDb, initDb };
