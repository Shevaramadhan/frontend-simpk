import api from './apiConfig';

/** Mengunduh berkas yang dilindungi login (dokumen pendukung, bukti transfer) lalu membukanya di tab baru. */
export async function openProtectedFile(path: string, fileName: string) {
  const { data } = await api.get<Blob>(path, { responseType: 'blob' });
  const url = URL.createObjectURL(data);
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener';
  if (!data.type.startsWith('image/') && data.type !== 'application/pdf') link.download = fileName;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
