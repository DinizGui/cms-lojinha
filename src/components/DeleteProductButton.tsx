"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      type="button"
      disabled={loading}
      className="btn btn-danger"
      onClick={async () => {
        if (!confirm("Excluir este produto?")) return;
        setLoading(true);
        try {
          const res = await fetch(`/api/products/${encodeURIComponent(id)}`, {
            method: "DELETE",
          });
          if (!res.ok) {
            const j = (await res.json()) as { error?: string };
            alert(j.error ?? "Erro ao excluir");
            return;
          }
          router.push("/produtos");
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
