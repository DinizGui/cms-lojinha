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
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/produtos" className="text-sm text-zinc-500 underline hover:text-zinc-800">
        ← Voltar
      </Link>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-xl font-semibold text-zinc-900">Editar produto</h1>
        <DeleteProductButton id={id} />
      </div>
      <p className="mt-1 font-mono text-xs text-zinc-500">ID: {id}</p>
      <ProductForm categories={categories} initial={product} />
    </div>
  );
}
