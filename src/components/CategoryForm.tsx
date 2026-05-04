"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Initial = { slug?: string; name?: string; blurb?: string };

function autoSlug(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 64);
}

export function CategoryForm({ initial }: { initial?: Initial | null }) {
  const router = useRouter();
  const isEdit = Boolean(initial?.slug);
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [name, setName] = useState(initial?.name ?? "");
  const [blurb, setBlurb] = useState(initial?.blurb ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function onNameChange(v: string) {
    setName(v);
    if (!isEdit && !slugTouched) setSlug(autoSlug(v));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      if (isEdit) {
        const res = await fetch(`/api/categories/${encodeURIComponent(initial!.slug!)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, blurb }),
        });
        const j = (await res.json()) as { error?: string };
        if (!res.ok) { setError(j.error ?? "Erro ao salvar"); return; }
      } else {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: slug.trim().toLowerCase(), name, blurb }),
        });
        const j = (await res.json()) as { error?: string };
        if (!res.ok) { setError(j.error ?? "Erro ao criar"); return; }
      }
      router.push("/categorias");
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

      <div>
        <label htmlFor="cname" className="field-label">Nome</label>
        <input
          id="cname"
          className="field"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Ex.: Perfumaria"
          required
        />
      </div>

      <div>
        <label htmlFor="cslug" className="field-label">
          Slug <span className="font-normal text-[var(--fg-muted)]">(URL — não pode ter espaços ou acentos)</span>
        </label>
        <input
          id="cslug"
          className="field font-mono text-sm"
          value={slug}
          onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }}
          placeholder="ex: perfumaria"
          pattern="[a-z0-9-]+"
          required
          disabled={isEdit}
        />
        {isEdit && (
          <p className="mt-1.5 text-xs text-[var(--fg-muted)]">Slug não pode ser alterado depois de criado.</p>
        )}
      </div>

      <div>
        <label htmlFor="cblurb" className="field-label">Descrição curta</label>
        <textarea
          id="cblurb"
          className="field min-h-24 resize-y"
          value={blurb}
          onChange={(e) => setBlurb(e.target.value)}
          placeholder="Como essa categoria aparece pros clientes."
        />
      </div>

      <div className="flex flex-wrap gap-3 border-t border-[var(--border)] pt-5">
        <button type="submit" disabled={saving} className="btn btn-primary">
          {saving ? <span className="spinner" /> : null}
          {saving ? "Salvando…" : isEdit ? "Salvar alterações" : "Criar categoria"}
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => router.back()}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
