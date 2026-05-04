import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="relative grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-violet-600 via-fuchsia-500 to-rose-400 lg:block">
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_30%_20%,white_0,transparent_55%),radial-gradient(circle_at_70%_75%,white_0,transparent_50%)]" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-lg font-bold backdrop-blur">J</div>
            <span className="text-lg font-semibold">Loja da Jana</span>
          </div>
          <div className="space-y-3 animate-fade-in">
            <h1 className="text-3xl font-semibold leading-tight">
              Cuide do catálogo
              <br />em poucos cliques.
            </h1>
            <p className="max-w-sm text-sm text-white/80">
              Cadastre produtos, ajuste preços e mantenha tudo organizado num só lugar.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
            Painel administrativo
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-bold text-white shadow-md">J</div>
            <div>
              <p className="text-sm font-semibold">Painel</p>
              <p className="text-xs text-zinc-500">Loja da Jana</p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-[var(--fg)]">Bem-vinda de volta</h2>
          <p className="mt-1.5 text-sm text-[var(--fg-muted)]">Entre com seu email e senha pra continuar.</p>

          <Suspense fallback={<div className="mt-8 h-32 skeleton" />}>
            <LoginForm />
          </Suspense>

          <p className="mt-8 text-center text-xs text-[var(--fg-muted)]">
            © {new Date().getFullYear()} Loja da Jana
          </p>
        </div>
      </div>
    </div>
  );
}
