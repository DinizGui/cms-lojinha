import { DeleteProductButton } from "@/components/DeleteProductButton";
import { ProductForm } from "@/components/ProductForm";
import { getPool } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditarProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pool = getPool();
  const [prodRows] = await pool.query(
    "SELECT id, category_slug, name, benefit, description, price, accent, image_url FROM products WHERE id = ? LIMIT 1",
    [id]
  );
  const product = (prodRows as Record<string, unknown>[])[0];
  if (!product) notFound();

  const [catRows] = await pool.query(
    "SELECT slug, name FROM categories ORDER BY name ASC"
  );
  const categories = catRows as { slug: string; name: string }[];

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
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--fg-muted)]">Catálogo</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--fg)]">Editar produto</h1>
          <p className="mt-1 font-mono text-xs text-[var(--fg-muted)]">ID: {id}</p>
        </div>
        <DeleteProductButton id={id} />
      </div>
      <div className="mt-8 surface p-6 md:p-8 animate-fade-in delay-1">
        <ProductForm categories={categories} initial={product} />
      </div>
    </div>
  );
}
