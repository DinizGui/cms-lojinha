import { getPool } from "@/lib/db";
import { NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT id, category_slug, name, benefit, description, price, accent, image_url, created_at, updated_at FROM products WHERE id = ? LIMIT 1",
      [id]
    );
    const list = rows as Record<string, unknown>[];
    const row = list[0];
    if (!row) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    return NextResponse.json(row);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  let body: Partial<{
    category_slug: string;
    name: string;
    benefit: string;
    description: string;
    price: number;
    accent: string;
    image_url: string | null;
  }>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const fields: string[] = [];
  const values: unknown[] = [];

  const map: [keyof typeof body, string][] = [
    ["category_slug", "category_slug"],
    ["name", "name"],
    ["benefit", "benefit"],
    ["description", "description"],
    ["price", "price"],
    ["accent", "accent"],
    ["image_url", "image_url"],
  ];

  for (const [key, col] of map) {
    if (key in body && body[key] !== undefined) {
      fields.push(`${col} = ?`);
      values.push(body[key]);
    }
  }

  if (fields.length === 0) {
    return NextResponse.json({ error: "Nada para atualizar" }, { status: 400 });
  }

  values.push(id);

  try {
    const pool = getPool();
    const [res] = await pool.execute(
      `UPDATE products SET ${fields.join(", ")} WHERE id = ?`,
      values as (string | number | null)[]
    );
    const ok = (res as { affectedRows?: number }).affectedRows;
    if (!ok) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  try {
    const pool = getPool();
    const [res] = await pool.execute("DELETE FROM products WHERE id = ?", [id]);
    const ok = (res as { affectedRows?: number }).affectedRows;
    if (!ok) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
