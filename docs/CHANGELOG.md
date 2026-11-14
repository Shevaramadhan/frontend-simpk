# Riwayat Perubahan Frontend

Semua perubahan dicatat di sini, terbaru di atas. Setiap entri ditulis dalam commit yang sama dengan perubahannya.

## Format

```
## YYYY-MM-DD

### Ditambah / Diubah / Diperbaiki / Dihapus
- Apa yang berubah dan alasannya.
```

## 2026-11-14 (keahlian worker)

### Ditambah
- Keahlian worker (diketik bebas, dengan saran): diisi saat Tambah Worker, dapat diubah lewat tombol Ubah di kartu worker, dan tampil di kartu.
- Saringan "Semua" di Pilih Worker kini menyaring per keahlian; posisi di project terisi otomatis dari keahlian dan tetap dapat diketik ulang.

### Diubah
- Tambah Akun di halaman Pengguna hanya untuk Marketing dan Operasional; akun Tim lewat menu Worker. Kolom Role menampilkan keahlian akun Tim.

## 2026-11-14 (halaman Pengguna)

### Diperbaiki
- Halaman Pengguna tidak terbaca di sidebar baru (teks gelap di atas tabel biru tua). Kini bergaya halaman Operasional: panel gelap, tabel krem berbingkai oranye, jendela isian krem. Bawaan role saat Tambah Akun menjadi Marketing karena akun Tim sudah punya menu Worker.

## 2026-11-14 (ikon mata kata sandi)

### Ditambah
- `components/PasswordInput.tsx`: tombol mata untuk menampilkan atau menyembunyikan ketikan kata sandi. Dipasang di Login, Sign In, Reset Sandi, Account, Ganti Kata Sandi, Tambah Worker, dan Pengguna.

## 2026-11-14 (persiapan deploy)

### Ditambah
- `vercel.json`: build Vite dan pengalihan semua alamat ke `index.html` agar rute seperti `/portal` dapat dibuka langsung.
- Menu Pengguna di sidebar Operasional untuk membuat akun Marketing dan Operasional.
- Font Magic Hat dan Seven Moon kembali masuk repo (`public/fonts/`) agar build Vercel memakainya. Lisensi komersial tetap perlu diselesaikan sebelum serah terima.

## 2026-11-14 (halaman Operasional dan Tim)

### Ditambah
- `StaffLayout`: sidebar gelap sesuai Figma "Project Page Operational" (SIMPK, menu Project, Worker, Account, Log Out) untuk Operasional dan Tim; di ponsel menjadi bar atas.
- Operasional: daftar pengajuan yang disetujui dengan keterangan "Belum ada worker yang mengerjakan" (`/app`), halaman Detail dengan Pilih Worker, saringan, dan tanda PM (`/app/pengajuan/:orderId`), halaman Worker dengan Tambah Worker (`/app/worker`).
- Tim: daftar project yang diikuti (`/app`) dan detail project (`/app/proyek/:projectId`) berisi total progres, progres per bidang, tabel tugas, Tambah Tugas (PM dan Operasional), Perbarui progres dengan catatan klien dan catatan teknis, serta riwayat progres.
- Halaman Account (`/app/akun`) untuk ganti kata sandi.
- Komponen `brand/Progress`, `brand/ProyekInfo` (dipakai bersama halaman klien), `brand/BrandModal`, `brand/StaffParts`; `services/projectService.ts`; ikon di `assets/staff/`.

### Diubah
- `ProyekInfo` dan panel progres dipindah dari `pages/klien` ke `components/brand` agar dipakai halaman klien, Operasional, dan Tim.
- Marketing tetap memakai `InternalLayout`.

### Dihapus
- Rute kerangka `/app/proyek`. Ringkasan lama Operasional dipindah ke `/app/ringkasan` dan Tugas Saya ke `/app/tugas` (tanpa menu) sampai dashboard dibuat.

## 2026-11-14

### Diubah (revisi tampilan)
- Landing page: tiap bagian setinggi satu layar dan artboard diskalakan agar muat utuh, sehingga pas pada zoom 100% dan ikut menyesuaikan saat zoom atau jendela berubah.
- Header landing (logo, menu, Sign In) dipisah dari artboard: logo selalu di sudut kiri atas layar.
- Ornamen logo di hero digeser agar tidak menempel pada tulisan dan bayangan SIMPK.
- Di layar lebar, unsur tepi (ornamen, deskripsi, tombol Lets Make A Project, kolase dan kartu Latest Project, isi footer) bergeser ke tepi layar lewat variabel `--edge` agar isi tidak menumpuk di tengah.
- Beranda klien muat satu layar tanpa digulir (laptop, monitor, ponsel); kartu galeri sama tinggi dengan deskripsi dikunci empat baris, dan gambar miring tidak lagi terpotong. Header dan isi halaman klien setinggi satu layar, footer setelahnya.
- Latar Sign In dan Login dibagi tiga lapis (tengah, menempel atas, menempel bawah) agar ornamen di tepi bawah tetap terlihat di layar lebar.
- Sign In dan Login muat satu layar tanpa digulir; ukuran mengikuti tinggi layar, dan di layar pendek isian Sign In menjadi dua kolom.

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
