import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import fs from "node:fs";

if (!process.env.DATABASE_URL && fs.existsSync(".env")) {
  const env = fs.readFileSync(".env", "utf8");
  const m = env.match(/DATABASE_URL\s*=\s*"?([^"\n]+)"?/);
  if (m) process.env.DATABASE_URL = m[1].trim();
}
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL não definida (.env)");
  process.exit(1);
}

const email = (process.argv[2] ?? "jana.admin@gmail.com").trim().toLowerCase();
const password = process.argv[3] ?? "admin123";
const name = process.argv[4] ?? "Jana";

const hash = await bcrypt.hash(password, 12);
const conn = await mysql.createConnection({ uri: process.env.DATABASE_URL });
try {
  const [existing] = await conn.query(
    "SELECT id FROM admins WHERE email = ? LIMIT 1",
    [email]
  );
  if (Array.isArray(existing) && existing.length > 0) {
    await conn.query(
      "UPDATE admins SET password_hash = ?, name = ? WHERE email = ?",
      [hash, name, email]
    );
    console.log(`Admin atualizado: ${email}`);
  } else {
    const id = nanoid(24);
    await conn.query(
      "INSERT INTO admins (id, email, password_hash, name) VALUES (?, ?, ?, ?)",
      [id, email, hash, name]
    );
    console.log(`Admin criado: ${email} (id=${id})`);
  }
  console.log(`Senha: ${password}`);
} finally {
  await conn.end();
}
