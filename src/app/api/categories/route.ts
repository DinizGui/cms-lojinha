import { getPool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT slug, name, blurb FROM categories ORDER BY name ASC"
    );
    return NextResponse.json(rows);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
