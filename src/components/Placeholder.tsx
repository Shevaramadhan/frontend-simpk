export default function Placeholder({ title }: { title: string }) {
  return (
    <section>
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="mt-2 text-muted">Halaman ini belum dibuat.</p>
    </section>
  );
}
