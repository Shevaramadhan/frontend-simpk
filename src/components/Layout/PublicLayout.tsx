import { Link, Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-page text-ink">
      <header className="flex items-center justify-between border-b border-line bg-page px-4 py-3 sm:px-6">
        <Link to="/" className="font-heading text-lg font-bold">Neo Telemetri</Link>
        <nav className="flex items-center gap-4">
          <Link to="/daftar" className="text-sm font-medium hover:underline">Daftar</Link>
          <Link to="/login" className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-hover">
            Masuk
          </Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
