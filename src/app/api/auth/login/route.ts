import { COOKIE, signSessionToken } from "@/lib/auth";
import { getPool } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";

type AdminRow = RowDataPacket & {
  id: string;
  email: string;
  password_hash: string;
  name: string;
};

export async function POST(req: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  if (!email || !password) {
    return NextResponse.json({ error: "Email e senha obrigatórios" }, { status: 400 });
  }

  const [rows] = await getPool().query<AdminRow[]>(
    "SELECT id, email, password_hash, name FROM admins WHERE email = ? LIMIT 1",
    [email]
  );
  const admin = rows[0];
  if (!admin) {
    return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
  }
  const ok = await bcrypt.compare(password, admin.password_hash);
  if (!ok) {
    return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
  }

  let token: string;
  try {
    token = await signSessionToken(admin.id);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro ao criar sessão";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  const res = NextResponse.json({ ok: true, name: admin.name });
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
