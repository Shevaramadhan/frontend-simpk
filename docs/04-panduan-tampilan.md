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

Font: Magic Hat (`font-magic`, judul dan menu), Seven Moon (`font-moon`, teks isi), Poppins dan League Spartan (footer). Garis tepi judul memakai utility `text-outline` dan `text-outline-lg`.

**Lisensi font.** Magic Hat dan Seven Moon gratis hanya untuk pemakaian pribadi. Pemakaian komersial wajib membeli lisensi (lihat berkas lisensi di dalam `docs/desain/desain font/*.zip`). Putuskan beli lisensi atau ganti font sebelum situs dipakai Neo Telemetri, dan sebelum berkas font dimasukkan ke repo publik.

Posisi elemen di `components/landing/` memakai angka koordinat Figma lewat `box(x, y, lebar, tinggi)`. Jangan mengubahnya tanpa mengubah desain.

Berkas font ada di `public/fonts/` (`MagicHat.ttf`, `SevenMoon.ttf`) agar ikut ter-build di Vercel. Lisensinya hanya untuk pemakaian pribadi, jadi lisensi komersial harus dibeli, atau font diganti, sebelum sistem dipakai resmi oleh Neo Telemetri. Tanpa berkas itu tampilan memakai huruf cadangan (Impact dan Trebuchet MS). PNG desain di `docs/desain/` juga hanya disimpan lokal; sumber utamanya file Figma "SIMPK By Neotelemetri".
