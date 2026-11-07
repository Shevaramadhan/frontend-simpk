import type { ButtonHTMLAttributes } from 'react';

export default function Button({ className = '', type = 'button', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`rounded bg-slate-800 px-3 py-2 font-medium text-white disabled:opacity-60 ${className}`}
      {...props}
    />
  );
}
