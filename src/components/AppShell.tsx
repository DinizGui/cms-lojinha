"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/produtos",      label: "Produtos",      icon: "box" },
  { href: "/produtos/novo", label: "Novo produto",  icon: "plus" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--bg-elev)] md:flex">
        <div className="flex items-center gap-2.5 border-b border-[var(--border)] px-5 py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-bold text-white shadow-sm">
            J
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-[var(--fg)]">Painel</p>
            <p className="text-xs text-[var(--fg-muted)]">Loja da Jana</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV.map((item, i) => {
            const active =
              item.href === "/produtos"
                ? pathname === "/produtos" || pathname.startsWith("/produtos/")
                  ? !pathname.startsWith("/produtos/novo")
                  : false
                : pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item animate-slide-in-left delay-${i + 1} ${active ? "active" : ""}`}
              >
                <Icon name={item.icon} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[var(--border)] px-3 py-3">
          <LogoutButton />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--bg-elev)]/80 px-4 py-3 backdrop-blur md:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xs font-bold text-white">
              J
            </div>
            <span className="text-sm font-semibold">Painel</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="rounded-lg px-2.5 py-1.5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900">
                {n.label}
              </Link>
            ))}
            <LogoutButton compact />
          </div>
        </header>

        <main className="flex-1 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}

function LogoutButton({ compact = false }: { compact?: boolean }) {
  return (
    <button
      type="button"
      className={
        compact
          ? "rounded-lg px-2.5 py-1.5 text-sm text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
          : "nav-item w-full text-left"
      }
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/login";
      }}
    >
      {!compact && <Icon name="logout" />}
      <span>Sair</span>
    </button>
  );
}

function Icon({ name }: { name: string }) {
  const props = {
    className: "nav-icon",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    viewBox: "0 0 24 24",
  };
  switch (name) {
    case "box":
      return (
        <svg {...props}>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="m3.27 6.96 8.73 5.05 8.73-5.05M12 22.08V12" />
        </svg>
      );
    case "plus":
      return (
        <svg {...props}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case "logout":
      return (
        <svg {...props}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
        </svg>
      );
    default:
      return null;
  }
}
