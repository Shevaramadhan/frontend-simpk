import type { ButtonHTMLAttributes } from 'react';

export default function Button({ className = '', type = 'button', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`rounded-full bg-primary px-5 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-60 ${className}`}
      {...props}
    />
  );
}
