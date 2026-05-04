import { CategoryForm } from "@/components/CategoryForm";
import { DeleteCategoryButton } from "@/components/DeleteCategoryButton";
import { getPool } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditarCategoriaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT c.slug, c.name, c.blurb,
            (SELECT COUNT(*) FROM products p WHERE p.category_slug = c.slug) AS product_count
       FROM categories c WHERE c.slug = ? LIMIT 1`,
    [slug]
  );
  const cat = (rows as Record<string, unknown>[])[0] as
    | { slug: string; name: string; blurb: string; product_count: number | string }
    | undefined;
  if (!cat) notFound();

  const productCount = Number(cat.product_count);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:py-12 animate-fade-in">
      <Link
        href="/categorias"
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
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--fg)]">Editar categoria</h1>
          <p className="mt-1 font-mono text-xs text-[var(--fg-muted)]">slug: {cat.slug}</p>
        </div>
        <DeleteCategoryButton slug={cat.slug} productCount={productCount} />
      </div>
      <div className="mt-8 surface p-6 md:p-8 animate-fade-in delay-1">
        <CategoryForm initial={{ slug: cat.slug, name: cat.name, blurb: cat.blurb }} />
      </div>
    </div>
  );
}
