// Satu sumber gaya tombol aksi untuk seluruh web (masukan teman PM 18 Nov; WCAG 1.4.3 kontras dan 2.4.7 fokus terlihat).
// Bentuk, ukuran, font (Poppins tebal), dan tanda fokus sama untuk semua varian; yang berbeda hanya warnanya.
// Tombol merek berbingkai (Framed, Magic Hat) tetap dipakai untuk ajakan utama di landing page dan halaman masuk.
//
// Kontras teks: utama #262626 di atas #ff6200 = 5,04:1; gelap krem di atas #292929 = 14,46:1; garis #262626 di atas
// krem = 15:1; bahaya #9c2b2b di atas krem = 7,47:1; tautan #c2410c di atas krem = 5,15:1 (khusus latar terang).

const DASAR =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border-2 font-body font-semibold leading-tight transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coal-deep focus-visible:ring-offset-2 focus-visible:ring-offset-cream ' +
  'disabled:cursor-not-allowed disabled:opacity-60';

const UKURAN = {
  kecil: 'px-3.5 py-1 text-xs',
  sedang: 'px-5 py-1.5 text-sm',
  besar: 'px-6 py-2 text-base',
} as const;

const VARIAN = {
  /** Aksi utama: Simpan, Detail, Payment, Pesan jasa ini. */
  utama: 'border-transparent bg-flame text-coal-deep hover:bg-[#ff7a26]',
  /** Aksi di atas latar terang yang perlu menonjol tanpa oranye: Perbarui, Kirim. */
  gelap: 'border-transparent bg-coal text-cream hover:bg-coal-deep',
  /** Aksi kedua: Ubah, Cetak Tagihan, Kembali. */
  garis: 'border-coal-deep bg-transparent text-coal-deep hover:bg-coal-deep hover:text-cream',
  /** Aksi yang menghapus atau membatalkan. */
  bahaya: 'border-[#9c2b2b] bg-transparent text-[#9c2b2b] hover:bg-[#9c2b2b] hover:text-cream',
  /** Konfirmasi akhir di modal untuk menolak atau membatalkan (krem di atas #9c2b2b = 7,47:1). */
  bahayaPenuh: 'border-transparent bg-[#9c2b2b] text-cream hover:bg-[#7f2222]',
} as const;

export type VarianTombol = keyof typeof VARIAN;
export type UkuranTombol = keyof typeof UKURAN;

/** Kelas tombol aksi. Contoh: `className={tombol('garis', 'kecil')}`. */
export function tombol(varian: VarianTombol = 'utama', ukuran: UkuranTombol = 'sedang') {
  return `${DASAR} ${UKURAN[ukuran]} ${VARIAN[varian]}`;
}

/** Tautan teks di atas latar terang, misalnya Ubah dan Hapus di tabel. */
export const tautan =
  'rounded font-body text-sm font-medium text-flame-ink underline underline-offset-4 transition-colors hover:text-coal-deep ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coal-deep focus-visible:ring-offset-2 focus-visible:ring-offset-cream';
