# Ketentuan Frontend

## Bahasa dan alat

- Semua kode ditulis dalam TypeScript mode `strict`. Tidak ada file `.js` atau `.jsx` baru.
- Hindari `any`. Tipe data bersama ada di `src/types/`.
- Semua teks antarmuka dalam Bahasa Indonesia.
- Istilah mengikuti BRS: Daftar Jasa, Pesanan, Tagihan, Tim.

## Menambah halaman

```
src/pages/<role>/<Nama>Page.tsx     halaman
src/services/<nama>Service.ts       pemanggilan API, satu file per modul
src/App.tsx                         rute dan pembatasan role
src/utils/navigation.ts             menu, jika halaman muncul di menu
```

Halaman tidak memanggil axios langsung. Semua lewat `services/`.

## Keamanan

1. Pembatasan rute dan menu hanya untuk kenyamanan. Pembatasan sebenarnya ada di backend.
2. Halaman klien hanya menampilkan data dari endpoint klien. Jangan menyembunyikan data sensitif dengan CSS atau kondisi tampilan.
3. Token hanya disentuh lewat `services/tokenAuth.ts`.
4. Jangan commit `.env`.

## Tampilan

- Harus nyaman di laptop dan ponsel (REQ-NF01). Cek keduanya sebelum commit.
- Pakai Tailwind CSS dan komponen dari `components/` sebelum membuat yang baru.
- Setiap halaman data menangani keadaan memuat, kosong, dan gagal.
- Pesan error memakai `errorMessage()` dari `services/apiConfig.ts`.
- Form memakai `label` yang terhubung ke input.

## Git

- `main` untuk versi stabil, `dev` untuk integrasi, `feature/<nama>` untuk pekerjaan.
- Pesan commit singkat dan menjelaskan perubahannya.
- Sebelum commit: `npm run build`, yang sudah mencakup pengecekan tipe.
- Setiap perubahan dicatat di `docs/CHANGELOG.md`.
