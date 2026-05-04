"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteCategoryButton({
  slug,
  productCount,
}: {
  slug: string;
  productCount: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (productCount > 0) {
    return (
      <button
        type="button"
        disabled
        title={`Em uso por ${productCount} produto(s) — mova-os antes`}
        className="btn btn-ghost cursor-not-allowed opacity-60"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        </svg>
        Excluir
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={loading}
      className="btn btn-danger"
      onClick={async () => {
        if (!confirm("Excluir esta categoria?")) return;
        setLoading(true);
        try {
          const res = await fetch(`/api/categories/${encodeURIComponent(slug)}`, {
            method: "DELETE",
          });
          if (!res.ok) {
            const j = (await res.json()) as { error?: string };
            alert(j.error ?? "Erro ao excluir");
            return;
          }
          router.push("/categorias");
          router.refresh();
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading ? <span className="spinner" /> : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        </svg>
      )}
      {loading ? "Excluindo…" : "Excluir"}
    </button>
  );
}
