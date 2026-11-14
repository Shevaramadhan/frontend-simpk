import { useState, type InputHTMLAttributes } from 'react';

// Isian kata sandi dengan tombol mata untuk menampilkan atau menyembunyikan ketikan.
// `tone`: warna ikon. 'dark' untuk isian terang bergaya desain, 'light' untuk isian gelap bertema lama.
type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { tone?: 'dark' | 'light' };

function EyeIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
      {!open && <path d="M3 3l18 18" />}
    </svg>
  );
}

export default function PasswordInput({ className = '', tone = 'dark', ...props }: Props) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input {...props} type={visible ? 'text' : 'password'} className={`${className} pr-12`} />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        aria-label={visible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
        aria-pressed={visible}
        title={visible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
        // Sedikit diturunkan karena isian bergaya desain punya margin atas 4 px.
        className={`absolute right-3 top-[calc(50%+2px)] -translate-y-1/2 rounded-md p-1 transition ${
          tone === 'dark' ? 'text-coal-deep hover:text-flame' : 'text-ink/80 hover:text-ink'
        }`}
      >
        <EyeIcon open={visible} />
      </button>
    </div>
  );
}
