# Riwayat Perubahan Frontend

Semua perubahan dicatat di sini, terbaru di atas. Setiap entri ditulis dalam commit yang sama dengan perubahannya.

## Format

```
## YYYY-MM-DD

### Ditambah / Diubah / Diperbaiki / Dihapus
- Apa yang berubah dan alasannya.
```

## 2026-11-14

### Ditambah
- Halaman klien sesuai Figma: beranda dengan galeri karya yang bergerak ke samping, My Project (kosong dan berisi), form pengajuan dengan dokumen pendukung, Payment (tagihan DP dan pelunasan, unggah bukti), Detail (total progres, progres per bidang, catatan perkembangan).
- Sign In dan Login sesuai Figma dengan latar oranye; tombol Google (aktif bila `VITE_GOOGLE_CLIENT_ID` diisi).
- Halaman Tagihan dan Pembayaran untuk Marketing: terbitkan tagihan, buka bukti, terima atau tolak.
- Komponen `components/brand/` (AuthShell, Brand, GoogleButton, SiteFooter), `services/fileService.ts`, `data/portofolio.ts`.

### Diubah
- Landing page: artboard paling lebar 1200 px agar ukuran tidak terlalu besar; ornamen logo di hero digeser agar tampil utuh.
- Header portal klien: logo, SIMPK, dan menu HALLO (Project Saya, Ganti Kata Sandi, Keluar).
- Pesanan Marketing menampilkan nama project dan dokumen pendukung; persetujuan dari status Baru juga.

### Dihapus
- `components/AuthCard.tsx`, digantikan `components/brand/AuthShell.tsx`.
- Berkas font dari repo: dipindah ke `public/fonts/` dan dikecualikan dari Git bersama `docs/desain/` karena lisensinya hanya untuk pemakaian pribadi.

## 2026-11-13

### Ditambah
- Landing page publik di `/` sesuai desain Figma "SIMPK By Neotelemetri": hero, latest project, our project, journey, dan footer (`pages/publik/LandingPage`, `components/landing/`).
- Aset desain di `src/assets/landing/` dan font Magic Hat serta Seven Moon di `src/assets/fonts/`.
- Animasi dengan library `motion`: elemen muncul saat terlihat, ornamen mengambang, tombol mengikuti kursor, dan efek hover.
- Token warna dan font landing page di `src/index.css`; font Poppins dan League Spartan di `index.html`.
- Salinan desain di `docs/desain/`.

### Diubah
- `/` tidak lagi dialihkan ke `/katalog`. Halaman daftar jasa tetap di `/katalog` dan dibuka dari tombol "Lets Make A Project".
- Deskripsi footer memakai kalimat SIMPK, bukan teks BAKTI yang tersisa di desain.

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
