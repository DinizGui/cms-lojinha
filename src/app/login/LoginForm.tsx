"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const j = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(j.error ?? "Falha no login");
        return;
      }
      const from = params.get("from") || "/produtos";
      router.replace(from);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      {error && (
        <p className="animate-fade-in rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-800">
          {error}
        </p>
      )}

      <div>
        <label htmlFor="email" className="field-label">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="field"
          placeholder="voce@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="pw" className="field-label">Senha</label>
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="text-xs text-[var(--brand)] hover:underline"
          >
            {showPw ? "Esconder" : "Mostrar"}
          </button>
        </div>
        <input
          id="pw"
          type={showPw ? "text" : "password"}
          autoComplete="current-password"
          className="field"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" disabled={loading} className="btn btn-primary w-full">
        {loading ? <span className="spinner" /> : null}
        {loading ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
