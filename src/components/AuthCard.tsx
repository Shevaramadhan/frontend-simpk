import type { ReactNode } from 'react';

export default function AuthCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="hero-grid flex min-h-screen items-center justify-center bg-page p-4 text-ink">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6">
        <h1 className="text-lg font-semibold">{title}</h1>
        <p className="mb-4 text-sm text-muted">SIM Proyek Klien Neo Telemetri</p>
        {children}
      </div>
    </div>
  );
}
