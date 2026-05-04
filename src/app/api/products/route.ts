import { getPool } from "@/lib/db";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

export async function GET() {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT id, category_slug, name, benefit, description, price, accent, image_url, created_at, updated_at FROM products ORDER BY updated_at DESC"
    );
    return NextResponse.json(rows);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  let body: {
    id?: string;
    category_slug?: string;
    name?: string;
    benefit?: string;
    description?: string;
    price?: number;
    accent?: string;
    image_url?: string | null;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const id = (body.id?.trim() || nanoid(12)) as string;
  const category_slug = body.category_slug?.trim();
  const name = body.name?.trim();
  const benefit = body.benefit?.trim();
  const description = body.description?.trim();
  const price = body.price;
  const accent = (body.accent?.trim() || "from-rose-100 to-amber-50") as string;
  const image_url = body.image_url?.trim() || null;

  if (!category_slug || !name || !benefit || !description || price == null || Number.isNaN(Number(price))) {
    return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
  }

  try {
    const pool = getPool();
    await pool.execute(
      `INSERT INTO products (id, category_slug, name, benefit, description, price, accent, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, category_slug, name, benefit, description, price, accent, image_url]
    );
    return NextResponse.json({ id });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
