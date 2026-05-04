import mysql from "mysql2/promise";
import fs from "node:fs";
import path from "node:path";

const file = process.argv[2];
if (!file) {
  console.error("uso: node scripts/migrate.mjs <arquivo-sql>");
  process.exit(1);
}

if (!process.env.DATABASE_URL && fs.existsSync(".env")) {
  const env = fs.readFileSync(".env", "utf8");
  const m = env.match(/DATABASE_URL\s*=\s*"?([^"\n]+)"?/);
  if (m) process.env.DATABASE_URL = m[1].trim();
}
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não definida");

const sql = fs.readFileSync(path.resolve(file), "utf8");
const conn = await mysql.createConnection({ uri: process.env.DATABASE_URL, multipleStatements: true });
try {
  await conn.query(sql);
  console.log("OK", file);
} finally {
  await conn.end();
}
