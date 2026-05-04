"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-full">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-zinc-800">
            <Link href="/produtos" className="hover:text-zinc-600">
              Produtos
            </Link>
            <Link href="/produtos/novo" className="hover:text-zinc-600">
              Novo produto
            </Link>
          </div>
          <LogoutButton />
        </div>
      </header>
      {children}
    </div>
  );
}

function LogoutButton() {
  return (
    <button
      type="button"
      className="text-sm text-zinc-500 underline hover:text-zinc-800"
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/login";
      }}
    >
      Sair
    </button>
  );
}
