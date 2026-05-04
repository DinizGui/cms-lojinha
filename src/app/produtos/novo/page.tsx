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
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/produtos" className="text-sm text-zinc-500 underline hover:text-zinc-800">
        ← Voltar
      </Link>
      <h1 className="mt-4 text-xl font-semibold text-zinc-900">Novo produto</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
