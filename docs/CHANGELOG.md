# Riwayat Perubahan Frontend

Semua perubahan dicatat di sini, terbaru di atas. Setiap entri ditulis dalam commit yang sama dengan perubahannya.

## Format

```
## YYYY-MM-DD

### Ditambah / Diubah / Diperbaiki / Dihapus
- Apa yang berubah dan alasannya.
```

## 2026-11-08

### Ditambah
- Halaman `/daftar`, `/lupa-sandi`, `/reset-sandi`, dan komponen `AuthCard`.
- Halaman ganti kata sandi di `/app/sandi` dan `/portal/sandi`.
- Halaman Pengguna untuk Operasional: akun internal dan perbaikan email, beserta `userService`.
- Formulir persetujuan dengan nilai kesepakatan pada modal pesanan.

### Diubah
- Tombol pesan di katalog menuju `/daftar` untuk pengunjung yang belum masuk; jasa pilihan terbawa setelah daftar atau login.
- Halaman Klien hanya untuk melihat dan menonaktifkan klien.

### Dihapus
- Formulir Tambah Klien di halaman Marketing.

## 2026-11-07

### Ditambah
- Halaman daftar jasa publik, kelola jasa, kelola klien, pemeriksaan pesanan, form pesan, dan daftar pesanan klien.
- `useData`, `DataState`, `Field`, `StatusBadge`, `utils/format`, serta service katalog, klien, dan pesanan.

### Diubah
- Tampilan memakai tema gelap dari situs profil Neo Telemetri, dengan token warna di `src/index.css`; halaman daftar jasa publik ditata ulang.
- `errorMessage` menampilkan pesan validasi per kolom dari backend.
- Menu Marketing ditambah Klien; portal klien ditambah rute `/portal/pesan`.

### Ditambah
- Folder `docs/` sebagai pusat informasi frontend, termasuk ketentuan, arsitektur, daftar halaman, status, dan catatan keputusan.
- Kerangka proyek React, Vite, dan Tailwind.
- Login, sesi pengguna, pembatasan rute per role, tiga layout.
- Komponen Button, Table, Modal, Placeholder.

### Diubah
- `STATUS.md` diperbarui setelah commit pertama dikirim ke GitHub.
- Struktur folder mengikuti referensi frontend-beasiswa: `components`, `pages`, `services`, `hooks`, `utils`, `assets`.
- Seluruh kode dari JavaScript ke TypeScript mode strict.
- Frontend dipisah menjadi repo sendiri.
