import type { ReactNode } from 'react';

export const inputClass = 'mt-1 w-full rounded-lg border border-line px-3 py-2';

export default function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium" htmlFor={id}>
        {label}
      </label>
      {children}
    </div>
  );
}
