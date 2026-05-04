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
      className="text-sm text-red-600 underline hover:text-red-800 disabled:opacity-50"
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
      {loading ? "Excluindo…" : "Excluir produto"}
    </button>
  );
}
