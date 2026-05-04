import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import fs from "node:fs";

if (!process.env.DATABASE_URL && fs.existsSync(".env")) {
  const env = fs.readFileSync(".env", "utf8");
  const m = env.match(/DATABASE_URL\s*=\s*"?([^"\n]+)"?/);
  if (m) process.env.DATABASE_URL = m[1].trim();
}

const email = process.argv[2] ?? "jana.admin@gmail.com";
const password = process.argv[3] ?? "admin123";

const conn = await mysql.createConnection({ uri: process.env.DATABASE_URL });
const [rows] = await conn.query(
  "SELECT id, email, password_hash, name FROM admins WHERE email = ? LIMIT 1",
  [email]
);
console.log("admins:", rows.length);
if (rows.length) {
  const a = rows[0];
  console.log("id:", a.id);
  console.log("hash prefix:", a.password_hash.substring(0, 7));
  const ok = await bcrypt.compare(password, a.password_hash);
  console.log(`compare(${password}):`, ok);
}
await conn.end();
