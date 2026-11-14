import { FramedLink, OutlinedTitle } from '../components/brand/Brand';

// Halaman galat bergaya desain: kode besar, pesan, dan tombol kembali.
function Message({ code, title, text }: { code: string; title: string; text: string }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-cream p-6 text-center text-coal-deep">
      <OutlinedTitle className="text-[clamp(5rem,22vh,11rem)]">{code}</OutlinedTitle>
      <h1 className="font-magic text-3xl uppercase text-flame sm:text-4xl">{title}</h1>
      <p className="max-w-md font-moon text-lg">{text}</p>
      <div className="mt-2">
        <FramedLink to="/">Kembali ke beranda</FramedLink>
      </div>
    </div>
  );
}

export function ForbiddenPage() {
  return <Message code="403" title="Akses ditolak" text="Anda tidak memiliki akses ke halaman ini." />;
}

export function NotFoundPage() {
  return <Message code="404" title="Halaman tidak ditemukan" text="Alamat yang Anda buka tidak tersedia." />;
}
