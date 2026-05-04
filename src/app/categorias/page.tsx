import { getPool } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Row = {
  slug: string;
  name: string;
  blurb: string;
  product_count: string | number;
};

export default async function CategoriasPage() {
  const pool = getPool();
  const [rows] = await pool.query(
    `SELECT c.slug, c.name, c.blurb,
            (SELECT COUNT(*) FROM products p WHERE p.category_slug = c.slug) AS product_count
       FROM categories c
      ORDER BY c.name ASC`
  );
  const list = rows as Row[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 animate-fade-in">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--fg-muted)]">Catálogo</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--fg)]">
            Categorias
            <span className="ml-2 align-middle text-sm font-normal text-[var(--fg-muted)]">
              {list.length}
            </span>
          </h1>
        </div>
        <Link href="/categorias/novo" className="btn btn-primary">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Nova categoria
        </Link>
      </div>

      {list.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="mt-8 surface overflow-hidden animate-fade-in delay-1">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-[var(--border)] bg-[var(--border-soft)]/60 text-xs font-medium uppercase tracking-wider text-[var(--fg-muted)]">
                <tr>
                  <th className="px-5 py-3 font-medium">Nome</th>
                  <th className="px-5 py-3 font-medium">Slug</th>
                  <th className="px-5 py-3 font-medium">Descrição</th>
                  <th className="px-5 py-3 font-medium">Produtos</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {list.map((c, i) => (
                  <tr
                    key={c.slug}
                    className={`row-hover border-b border-[var(--border-soft)] last:border-0 animate-fade-in delay-${Math.min(4, i + 1)}`}
                  >
                    <td className="px-5 py-3 font-medium text-[var(--fg)]">{c.name}</td>
                    <td className="px-5 py-3 font-mono text-xs text-[var(--fg-muted)]">{c.slug}</td>
                    <td className="px-5 py-3 max-w-md truncate text-[var(--fg-muted)]">{c.blurb}</td>
                    <td className="px-5 py-3 tabular-nums text-[var(--fg)]">
                      <span className="badge">{Number(c.product_count)}</span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/categorias/${encodeURIComponent(c.slug)}`}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-sm font-medium text-[var(--brand)] transition hover:bg-[var(--brand-soft)]"
                      >
                        Editar
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-10 surface flex flex-col items-center justify-center px-6 py-16 text-center animate-fade-in delay-1">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 text-violet-600">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7h18M3 12h18M3 17h18" />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-[var(--fg)]">Nenhuma categoria ainda</h3>
      <p className="mt-1 max-w-sm text-sm text-[var(--fg-muted)]">
        Crie a primeira categoria pra organizar seus produtos.
      </p>
      <Link href="/categorias/novo" className="btn btn-primary mt-5">Criar primeira categoria</Link>
    </div>
  );
}
