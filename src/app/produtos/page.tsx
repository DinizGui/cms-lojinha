import { getPool } from "@/lib/db";
import { formatBrl } from "@/lib/format";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  name: string;
  price: string | number;
  category_slug: string;
  image_url: string | null;
  updated_at: Date | string;
};

export default async function ProdutosPage() {
  const pool = getPool();
  const [rows] = await pool.query(
    "SELECT id, name, price, category_slug, image_url, updated_at FROM products ORDER BY updated_at DESC"
  );
  const list = rows as Row[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 animate-fade-in">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--fg-muted)]">Catálogo</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--fg)]">
            Produtos
            <span className="ml-2 align-middle text-sm font-normal text-[var(--fg-muted)]">
              {list.length}
            </span>
          </h1>
        </div>
        <Link href="/produtos/novo" className="btn btn-primary">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Novo produto
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
                  <th className="px-5 py-3 font-medium">Produto</th>
                  <th className="px-5 py-3 font-medium">Categoria</th>
                  <th className="px-5 py-3 font-medium">Preço</th>
                  <th className="px-5 py-3 font-medium">Atualizado</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {list.map((p, i) => (
                  <tr
                    key={p.id}
                    className={`row-hover border-b border-[var(--border-soft)] last:border-0 animate-fade-in delay-${Math.min(4, i + 1)}`}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-[var(--border-soft)] bg-zinc-100">
                          {p.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.image_url} alt="" className="h-full w-full object-cover transition-transform duration-300 hover:scale-110" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-zinc-400">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-[var(--fg)]">{p.name}</p>
                          <p className="truncate text-xs text-[var(--fg-muted)]">{p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="badge">{p.category_slug}</span>
                    </td>
                    <td className="px-5 py-3 tabular-nums font-medium text-[var(--fg)]">
                      {formatBrl(Number(p.price))}
                    </td>
                    <td className="px-5 py-3 text-[var(--fg-muted)]">
                      {new Date(p.updated_at).toLocaleString("pt-BR", {
                        day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                      })}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/produtos/${encodeURIComponent(p.id)}`}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-sm font-medium text-[var(--brand)] transition hover:bg-[var(--brand-soft)]"
                      >
                        Editar
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
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
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="m3.27 6.96 8.73 5.05 8.73-5.05M12 22.08V12" />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-[var(--fg)]">Nenhum produto ainda</h3>
      <p className="mt-1 max-w-sm text-sm text-[var(--fg-muted)]">
        Cadastre o primeiro produto pra começar a vender.
      </p>
      <Link href="/produtos/novo" className="btn btn-primary mt-5">Criar primeiro produto</Link>
    </div>
  );
}
