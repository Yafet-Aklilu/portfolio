"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Container } from "@/components/layout/Container";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed");
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="section-pad min-h-[70dvh]">
      <Container className="max-w-md">
        <p className="text-label text-muted">Admin</p>
        <h1 className="text-title mt-4 text-3xl">Sign in</h1>
        <form onSubmit={onSubmit} className="mt-10 space-y-5">
          <label className="block space-y-2">
            <span className="text-label text-muted">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              className="w-full border border-line bg-bg px-3 py-2"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {error ? <p className="text-sm text-ink-muted">{error}</p> : null}
          <button type="submit" className="btn btn-solid" disabled={loading}>
            {loading ? "Checking…" : "Enter"}
          </button>
        </form>
      </Container>
    </main>
  );
}
