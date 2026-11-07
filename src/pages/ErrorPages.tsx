import { Link } from 'react-router-dom';

function Message({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center text-ink">
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="mt-2 text-muted">{text}</p>
      <Link to="/" className="mt-4 text-sm underline">
        Kembali ke beranda
      </Link>
    </div>
  );
}

export function ForbiddenPage() {
  return <Message title="Akses ditolak" text="Anda tidak memiliki akses ke halaman ini." />;
}

export function NotFoundPage() {
  return <Message title="Halaman tidak ditemukan" text="Alamat yang Anda buka tidak tersedia." />;
}
