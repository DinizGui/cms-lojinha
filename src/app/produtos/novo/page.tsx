import { ProductForm } from "@/components/ProductForm";
import { getPool } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NovoProdutoPage() {
  const pool = getPool();
  const [rows] = await pool.query(
    "SELECT slug, name FROM categories ORDER BY name ASC"
  );
  const categories = rows as { slug: string; name: string }[];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-12 animate-fade-in">
      <Link
        href="/produtos"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--fg-muted)] transition hover:text-[var(--fg)]"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M11 18l-6-6 6-6" />
        </svg>
        Voltar
      </Link>
      <div className="mt-4">
        <p className="text-xs font-medium uppercase tracking-wider text-[var(--fg-muted)]">Catálogo</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--fg)]">Novo produto</h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">Preencha os campos abaixo. A foto é opcional.</p>
      </div>
      <div className="mt-8 surface p-6 md:p-8 animate-fade-in delay-1">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
