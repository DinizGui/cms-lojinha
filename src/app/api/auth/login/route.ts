import { COOKIE, signSessionToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD não configurada no servidor" },
      { status: 500 }
    );
  }

  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (body.password !== expected) {
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
  }

  let token: string;
  try {
    token = await signSessionToken();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro ao criar sessão";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
