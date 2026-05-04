import { SignJWT, jwtVerify } from "jose";

const COOKIE = "painel_token";

function secretBytes(): Uint8Array | null {
  const s = process.env.SESSION_SECRET?.trim();
  if (!s) return null;
  return new TextEncoder().encode(s);
}

export async function signSessionToken(adminId: string): Promise<string> {
  const key = secretBytes();
  if (!key) {
    throw new Error("Defina SESSION_SECRET (string longa e aleatória)");
  }
  return new SignJWT({ sub: adminId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function verifySessionToken(token: string): Promise<string | null> {
  const key = secretBytes();
  if (!key) return null;
  try {
    const { payload } = await jwtVerify(token, key);
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

export { COOKIE };
