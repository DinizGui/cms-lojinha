import { getPool } from "@/lib/db";
import { NextResponse } from "next/server";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  const { slug } = await ctx.params;
  const [rows] = await getPool().query<RowDataPacket[]>(
    "SELECT slug, name, blurb FROM categories WHERE slug = ? LIMIT 1",
    [slug]
  );
  if (!rows[0]) {
    return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 });
  }
  return NextResponse.json(rows[0]);
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  const { slug } = await ctx.params;
  let body: { name?: string; blurb?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const name = body.name != null ? String(body.name).trim() : undefined;
  const blurb = body.blurb != null ? String(body.blurb).trim() : undefined;
  if (name == null && blurb == null) {
    return NextResponse.json({ error: "Nada a atualizar" }, { status: 400 });
  }

  const pool = getPool();
  const sets: string[] = [];
  const values: unknown[] = [];
  if (name != null) { sets.push("name = ?"); values.push(name); }
  if (blurb != null) { sets.push("blurb = ?"); values.push(blurb); }
  values.push(slug);

  const [r] = await pool.query<ResultSetHeader>(
    `UPDATE categories SET ${sets.join(", ")} WHERE slug = ?`,
    values
  );
  if (r.affectedRows === 0) {
    return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  const { slug } = await ctx.params;
  const pool = getPool();

  const [used] = await pool.query<RowDataPacket[]>(
    "SELECT COUNT(*) AS n FROM products WHERE category_slug = ?",
    [slug]
  );
  const n = Number((used[0] as { n?: number })?.n ?? 0);
  if (n > 0) {
    return NextResponse.json(
      { error: `Categoria em uso por ${n} produto${n > 1 ? "s" : ""}. Mova-os antes de excluir.` },
      { status: 409 }
    );
  }
  const [r] = await pool.query<ResultSetHeader>(
    "DELETE FROM categories WHERE slug = ?",
    [slug]
  );
  if (r.affectedRows === 0) {
    return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
