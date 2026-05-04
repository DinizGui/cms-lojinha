import { getPool } from "@/lib/db";
import { NextResponse } from "next/server";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 64);
}

export async function GET() {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT c.slug, c.name, c.blurb,
              (SELECT COUNT(*) FROM products p WHERE p.category_slug = c.slug) AS product_count
         FROM categories c
        ORDER BY c.name ASC`
    );
    return NextResponse.json(rows);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  let body: { slug?: string; name?: string; blurb?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const name = String(body.name ?? "").trim();
  const blurb = String(body.blurb ?? "").trim();
  let slug = String(body.slug ?? "").trim().toLowerCase();
  if (!slug) slug = slugify(name);
  if (!slug || !name) {
    return NextResponse.json({ error: "Slug e nome são obrigatórios" }, { status: 400 });
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: "Slug deve conter só letras minúsculas, números e hífens" }, { status: 400 });
  }

  const pool = getPool();
  const [existing] = await pool.query<RowDataPacket[]>(
    "SELECT slug FROM categories WHERE slug = ? LIMIT 1",
    [slug]
  );
  if (existing.length > 0) {
    return NextResponse.json({ error: "Já existe categoria com esse slug" }, { status: 409 });
  }
  await pool.query<ResultSetHeader>(
    "INSERT INTO categories (slug, name, blurb) VALUES (?, ?, ?)",
    [slug, name, blurb]
  );
  return NextResponse.json({ ok: true, slug });
}
