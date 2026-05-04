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

const ACCENT_PRESETS = [
  { label: "Rosa & âmbar",   value: "from-rose-100 to-amber-50" },
  { label: "Violeta & rosa", value: "from-violet-100 to-rose-50" },
  { label: "Esmeralda",      value: "from-emerald-100 to-teal-50" },
  { label: "Azul céu",       value: "from-sky-100 to-indigo-50" },
  { label: "Pêssego",        value: "from-orange-100 to-amber-50" },
];

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
            category_slug, name, benefit, description, price: p, accent, image_url: imageUrl,
          }),
        });
        const j = (await res.json()) as { error?: string };
        if (!res.ok) { setError(j.error ?? "Erro ao salvar"); return; }
      } else {
        const payload: Record<string, unknown> = {
          category_slug, name, benefit, description, price: p, accent, image_url: imageUrl,
        };
        const trimmed = id.trim();
        if (trimmed) payload.id = trimmed;
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const j = (await res.json()) as { error?: string; id?: string };
        if (!res.ok) { setError(j.error ?? "Erro ao criar"); return; }
      }
      router.push("/produtos");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error && (
        <p className="animate-fade-in rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-800">
          {error}
        </p>
      )}

      {!isEdit && (
        <div>
          <label htmlFor="pid" className="field-label">ID do produto <span className="font-normal text-[var(--fg-muted)]">(opcional)</span></label>
          <input
            id="pid"
            className="field"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Deixe vazio para gerar automaticamente"
          />
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="cat" className="field-label">Categoria</label>
          <select
            id="cat"
            className="field"
            value={category_slug}
            onChange={(e) => setCategorySlug(e.target.value)}
            required
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="price" className="field-label">Preço (R$)</label>
          <input
            id="price"
            type="text"
            inputMode="decimal"
            className="field tabular-nums"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0,00"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="name" className="field-label">Nome</label>
        <input
          id="name"
          className="field"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="benefit" className="field-label">Benefício curto</label>
        <input
          id="benefit"
          className="field"
          value={benefit}
          onChange={(e) => setBenefit(e.target.value)}
          placeholder="Ex.: Hidrata e perfuma"
          required
        />
      </div>

      <div>
        <label htmlFor="desc" className="field-label">Descrição</label>
        <textarea
          id="desc"
          className="field min-h-32 resize-y"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div>
        <span className="field-label">Gradiente fallback</span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {ACCENT_PRESETS.map((preset) => {
            const active = accent === preset.value;
            return (
              <button
                type="button"
                key={preset.value}
                onClick={() => setAccent(preset.value)}
                className={`group relative overflow-hidden rounded-lg border p-2 text-left text-xs transition ${
                  active ? "border-[var(--brand)] ring-2 ring-[var(--brand-ring)]" : "border-[var(--border)] hover:border-zinc-300"
                }`}
              >
                <div className={`mb-1.5 h-10 rounded-md bg-gradient-to-br ${preset.value} transition-transform group-hover:scale-[1.02]`} />
                <span className="font-medium text-[var(--fg)]">{preset.label}</span>
              </button>
            );
          })}
        </div>
        <input
          className="field mt-2 font-mono text-xs"
          value={accent}
          onChange={(e) => setAccent(e.target.value)}
          placeholder="Tailwind classes (sem prefixo bg-gradient)"
        />
      </div>

      <div>
        <span className="field-label">Foto</span>
        {imageUrl ? (
          <div className="flex items-start gap-4">
            <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-xl border border-[var(--border)] bg-zinc-50 shadow-sm">
              <Image src={imageUrl} alt="" fill className="object-cover" unoptimized />
            </div>
            <div className="flex flex-col gap-2 pt-1">
              <label className="btn btn-ghost cursor-pointer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
                Trocar foto
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={onFileChange}
                  disabled={uploading}
                />
              </label>
              <button type="button" className="text-sm text-[var(--danger)] hover:underline" onClick={() => setImageUrl(null)}>
                Remover
              </button>
              {uploading && <p className="text-xs text-[var(--fg-muted)]">Enviando…</p>}
            </div>
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--border)] bg-zinc-50/50 px-4 py-8 text-center transition hover:border-[var(--brand)] hover:bg-[var(--brand-soft)]/40">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--fg-muted)]">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            <p className="mt-2 text-sm font-medium text-[var(--fg)]">
              {uploading ? "Enviando…" : "Clique para enviar"}
            </p>
            <p className="text-xs text-[var(--fg-muted)]">PNG, JPG, WebP até alguns MB</p>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={onFileChange}
              disabled={uploading}
            />
          </label>
        )}
      </div>

      <div className="flex flex-wrap gap-3 border-t border-[var(--border)] pt-5">
        <button type="submit" disabled={saving} className="btn btn-primary">
          {saving ? <span className="spinner" /> : null}
          {saving ? "Salvando…" : isEdit ? "Salvar alterações" : "Criar produto"}
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => router.back()}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
