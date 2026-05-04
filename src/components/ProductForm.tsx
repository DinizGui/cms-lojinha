"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Category = { slug: string; name: string };

type Initial = {
  id?: string;
  category_slug?: string;
  name?: string;
  benefit?: string;
  description?: string;
  price?: string | number;
  accent?: string;
  image_url?: string | null;
};

export function ProductForm({
  categories,
  initial,
}: {
  categories: Category[];
  initial?: Initial | null;
}) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [id, setId] = useState(initial?.id ?? "");
  const [category_slug, setCategorySlug] = useState(
    initial?.category_slug ?? categories[0]?.slug ?? ""
  );
  const [name, setName] = useState(initial?.name ?? "");
  const [benefit, setBenefit] = useState(initial?.benefit ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(
    initial?.price != null ? String(initial.price) : ""
  );
  const [accent, setAccent] = useState(
    initial?.accent ?? "from-rose-100 to-amber-50"
  );
  const [imageUrl, setImageUrl] = useState<string | null>(
    initial?.image_url ?? null
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const j = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        setError(j.error ?? "Upload falhou");
        return;
      }
      if (j.url) setImageUrl(j.url);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const p = Number.parseFloat(price.replace(",", "."));
      if (Number.isNaN(p)) {
        setError("Preço inválido");
        return;
      }
      if (isEdit) {
        const res = await fetch(`/api/products/${encodeURIComponent(initial!.id!)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category_slug,
            name,
            benefit,
            description,
            price: p,
            accent,
            image_url: imageUrl,
          }),
        });
        const j = (await res.json()) as { error?: string };
        if (!res.ok) {
          setError(j.error ?? "Erro ao salvar");
          return;
        }
      } else {
        const payload: Record<string, unknown> = {
          category_slug,
          name,
          benefit,
          description,
          price: p,
          accent,
          image_url: imageUrl,
        };
        const trimmed = id.trim();
        if (trimmed) payload.id = trimmed;
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const j = (await res.json()) as { error?: string; id?: string };
        if (!res.ok) {
          setError(j.error ?? "Erro ao criar");
          return;
        }
      }
      router.push("/produtos");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}

      {!isEdit && (
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            ID do produto (opcional)
          </label>
          <input
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Deixe vazio para gerar automaticamente"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-zinc-700">Categoria</label>
        <select
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          value={category_slug}
          onChange={(e) => setCategorySlug(e.target.value)}
          required
        >
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Nome</label>
        <input
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Benefício (curto)</label>
        <input
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          value={benefit}
          onChange={(e) => setBenefit(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Descrição</label>
        <textarea
          className="mt-1 min-h-28 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Preço (R$)</label>
        <input
          type="text"
          inputMode="decimal"
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">
          Gradiente fallback (Tailwind, sem prefixo bg-gradient)
        </label>
        <input
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 font-mono text-sm"
          value={accent}
          onChange={(e) => setAccent(e.target.value)}
        />
        <p className="mt-1 text-xs text-zinc-500">
          Ex.: from-rose-100 to-amber-50 — usado quando não há foto.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Foto</label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="mt-1 block w-full text-sm"
          onChange={onFileChange}
          disabled={uploading}
        />
        {uploading && <p className="mt-1 text-xs text-zinc-500">Enviando…</p>}
        {imageUrl && (
          <div className="relative mt-3 aspect-square w-40 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
            <Image src={imageUrl} alt="" fill className="object-cover" unoptimized />
          </div>
        )}
        {imageUrl && (
          <button
            type="button"
            className="mt-2 text-sm text-red-600 underline"
            onClick={() => setImageUrl(null)}
          >
            Remover foto
          </button>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {saving ? "Salvando…" : isEdit ? "Salvar" : "Criar produto"}
        </button>
        <button
          type="button"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm"
          onClick={() => router.back()}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
