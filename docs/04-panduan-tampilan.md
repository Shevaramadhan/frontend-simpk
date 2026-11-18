# Panduan Tampilan

Tampilan sementara mengacu pada situs profil Neo Telemetri (`neotelemetri.id/marketing`) sampai prototype dari UI/UX Designer tersedia. Saat prototype datang, ubah token di `src/index.css` lebih dulu.

## Token warna

Halaman hanya memakai nama token, tidak menulis warna langsung.

| Token | Nilai | Dipakai untuk |
|---|---|---|
| `page` | `#0f1322` | Latar halaman |
| `surface` | `#171b36` | Kartu, panel, tabel, modal |
| `surface-2` | `#222850` | Kepala tabel, lencana, menu aktif |
| `line` | `#2d3460` | Garis tepi |
| `ink` | `#f1f5f9` | Teks utama |
| `muted` | `#a0aec0` | Teks pendukung |
| `primary` | `#3b5bdb` | Tombol utama |
| `primary-hover` | `#2f4fc9` | Tombol saat disentuh |
| `accent` | `#8ea6ff` | Sorotan teks dan label kecil |
| `danger` | `#fca5a5` | Pesan kesalahan |

`accent` lebih terang dari `primary` karena `#3b5bdb` kurang terbaca sebagai teks kecil di latar gelap.

## Font

- Judul: Plus Jakarta Sans (`font-heading`, otomatis pada `h1` sampai `h3`).
- Isi: Inter.

## Bentuk

- Tombol: `rounded-full`.
- Kartu dan modal: `rounded-2xl`; tabel `rounded-xl`; input `rounded-lg`.
- Latar kisi hero: utility `hero-grid`.

## Yang tidak disalin

Logo dan foto karya Neo Telemetri belum dipakai. Logo menunggu berkas resmi dari mitra.

## Landing page publik

Mengikuti desain Figma "SIMPK By Neotelemetri"; salinan PNG ada di `docs/desain/`. Halaman lain masih memakai tema di atas sampai desainnya tersedia.

| Token | Nilai | Dipakai untuk |
|---|---|---|
| `cream` | `#fffff5` | Latar terang, teks di atas gelap |
| `coal` | `#292929` | Latar gelap, kartu |
| `coal-deep` | `#262626` | Bingkai foto |
| `flame` | `#ff6200` | Judul, tombol, aksen |
| `sand` | `#f6eddd` | Judul footer |

Font (F-25): hanya dua font di seluruh web.

| Peran | Font dan kelas |
|---|---|
| Judul (h1 sampai h3), navbar, label tombol | Magic Hat, `font-magic` |
| Paragraf, label form, tabel, footer | Poppins, `font-body` |

Di halaman pengurus (`data-staff-shell`) `font-magic` juga menjadi Poppins tebal. Jangan menambah font lain; Seven Moon, League Spartan, Inter, dan Plus Jakarta Sans sudah dihapus. Garis tepi judul memakai utility `text-outline` dan `text-outline-lg`.

**Tombol (F-26).** Semua tombol aksi memakai `tombol(varian, ukuran)` dari `components/brand/Tombol.ts`: bentuk kapsul, Poppins tebal, dan tanda fokus keyboard yang sama. Varian: `utama` (oranye, teks gelap), `gelap`, `garis`, `bahaya`, `bahayaPenuh`; ukuran: `kecil`, `sedang`, `besar`. Tautan teks memakai `tautan`. `pillButton` dan `linkButton` di `StaffParts` adalah alias keduanya. Tombol merek berbingkai (`Framed`, Magic Hat) hanya untuk ajakan utama di landing page dan halaman masuk. Jangan menulis kelas tombol sendiri.

**Kontras (WCAG 2.1 AA).** Oranye `flame` (#ff6200) hanya untuk latar, ikon, dan teks di atas latar gelap. Teks oranye di atas latar terang memakai `text-flame-ink` (#c2410c, 5,15:1 di atas krem). Teks di atas latar oranye memakai `text-coal-deep`, bukan putih atau krem. Warna status: hijau `#0f7a00`, merah `#c62828`. Teks abu di atas krem paling pudar `text-coal-deep/70`.

**Lisensi font.** Magic Hat gratis hanya untuk pemakaian pribadi (Seven Moon sudah tidak dipakai). Pemakaian komersial wajib membeli lisensi (lihat berkas lisensi di dalam `docs/desain/desain font/*.zip`). Putuskan beli lisensi atau ganti font sebelum situs dipakai Neo Telemetri, dan sebelum berkas font dimasukkan ke repo publik.

Posisi elemen di `components/landing/` memakai angka koordinat Figma lewat `box(x, y, lebar, tinggi)`. Jangan mengubahnya tanpa mengubah desain.

Berkas font ada di `public/fonts/` (`MagicHat.ttf`; `SevenMoon.ttf` tidak dimuat lagi) agar ikut ter-build di Vercel. Lisensinya hanya untuk pemakaian pribadi, jadi lisensi komersial harus dibeli, atau font diganti, sebelum sistem dipakai resmi oleh Neo Telemetri. Tanpa berkas itu judul memakai huruf cadangan Impact. Poppins dimuat dari Google Fonts. PNG desain di `docs/desain/` juga hanya disimpan lokal; sumber utamanya file Figma "SIMPK By Neotelemetri".
