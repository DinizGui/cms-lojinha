import { getBucket } from "@/lib/firebase-admin";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX = 5 * 1024 * 1024;

export async function POST(req: Request) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Form inválido" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Arquivo ausente" }, { status: 400 });
  }

  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "Use JPG, PNG, WebP ou GIF" }, { status: 400 });
  }

  if (file.size > MAX) {
    return NextResponse.json({ error: "Máximo 5 MB" }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const ext =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
        ? "webp"
        : file.type === "image/gif"
          ? "gif"
          : "jpg";
  const path = `produtos/${nanoid(16)}.${ext}`;

  try {
    const bucket = getBucket();
    const f = bucket.file(path);
    await f.save(buf, {
      contentType: file.type,
      resumable: false,
      metadata: { cacheControl: "public, max-age=31536000" },
    });

    const expires = Date.now() + 1000 * 60 * 60 * 24 * 365 * 10;
    const [url] = await f.getSignedUrl({
      version: "v4",
      action: "read",
      expires,
    });

    return NextResponse.json({ url, path });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload falhou";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
