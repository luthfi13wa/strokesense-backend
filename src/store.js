import pg from "pg";

const { Pool } = pg;

const memoryPredictions = [];

const hasDatabase = Boolean(process.env.DATABASE_URL);

const pool = hasDatabase
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.DATABASE_SSL === "true"
          ? { rejectUnauthorized: false }
          : false
    })
  : null;

export async function initStore() {
  if (!pool) {
    console.log("Storage: using temporary in-memory storage.");
    return;
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS predictions (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL,
      input JSONB NOT NULL,
      prediction JSONB NOT NULL,
      model_source TEXT NOT NULL,
      model_version TEXT NOT NULL
    );
  `);

  console.log("Storage: connected to PostgreSQL.");
}

export async function savePrediction(record) {
  if (!pool) {
    memoryPredictions.unshift(record);
    return record;
  }

  await pool.query(
    `
      INSERT INTO predictions (
        id,
        created_at,
        input,
        prediction,
        model_source,
        model_version
      )
      VALUES ($1, $2, $3, $4, $5, $6)
    `,
    [
      record.id,
      record.createdAt,
      record.input,
      record.prediction,
      record.modelSource,
      record.modelVersion
    ]
  );

  return record;
}

export async function getPredictions(limit = 50) {
  if (!pool) {
    return memoryPredictions.slice(0, limit);
  }

  const result = await pool.query(
    `
      SELECT
        id,
        created_at AS "createdAt",
        input,
        prediction,
        model_source AS "modelSource",
        model_version AS "modelVersion"
      FROM predictions
      ORDER BY created_at DESC
      LIMIT $1
    `,
    [limit]
  );

  return result.rows;
}

export async function getPredictionById(id) {
  if (!pool) {
    return memoryPredictions.find((item) => item.id === id) || null;
  }

  const result = await pool.query(
    `
      SELECT
        id,
        created_at AS "createdAt",
        input,
        prediction,
        model_source AS "modelSource",
        model_version AS "modelVersion"
      FROM predictions
      WHERE id = $1
      LIMIT 1
    `,
    [id]
  );

  return result.rows[0] || null;
}

export async function deletePredictionById(id) {
  if (!pool) {
    const index = memoryPredictions.findIndex((item) => item.id === id);

    if (index === -1) {
      return false;
    }

    memoryPredictions.splice(index, 1);
    return true;
  }

  const result = await pool.query(
    `
      DELETE FROM predictions
      WHERE id = $1
    `,
    [id]
  );

  return result.rowCount > 0;
}