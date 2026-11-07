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
