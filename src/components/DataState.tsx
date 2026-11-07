export default function DataState({ loading, error }: { loading: boolean; error: string }) {
  if (loading) return <p className="text-muted">Memuat...</p>;
  if (error) return <p role="alert" className="text-danger">{error}</p>;
  return null;
}
