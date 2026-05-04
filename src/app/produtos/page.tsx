import { getPool } from "@/lib/db";
import { formatBrl } from "@/lib/format";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  name: string;
  price: string | number;
  category_slug: string;
  updated_at: Date | string;
};

export default async function ProdutosPage() {
  const pool = getPool();
  const [rows] = await pool.query(
    "SELECT id, name, price, category_slug, updated_at FROM products ORDER BY updated_at DESC"
  );
  const list = rows as Row[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-zinc-900">Produtos</h1>
        <Link
          href="/produtos/novo"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Novo produto
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-zinc-600">
            <tr>
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">Categoria</th>
              <th className="px-4 py-3 font-medium">Preço</th>
              <th className="px-4 py-3 font-medium">Atualizado</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                  Nenhum produto. Importe o schema + seed ou crie um novo.
                </td>
              </tr>
            ) : (
              list.map((p) => (
                <tr key={p.id} className="border-b border-zinc-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-zinc-900">{p.name}</td>
                  <td className="px-4 py-3 text-zinc-600">{p.category_slug}</td>
                  <td className="px-4 py-3 tabular-nums text-zinc-800">
                    {formatBrl(Number(p.price))}
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {new Date(p.updated_at).toLocaleString("pt-BR")}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/produtos/${encodeURIComponent(p.id)}`}
                      className="text-zinc-900 underline hover:text-zinc-600"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
