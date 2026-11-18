# Riwayat Perubahan Frontend

Semua perubahan dicatat di sini, terbaru di atas. Setiap entri ditulis dalam commit yang sama dengan perubahannya.

## Format

```
## YYYY-MM-DD

### Ditambah / Diubah / Diperbaiki / Dihapus
- Apa yang berubah dan alasannya.
```

## 2026-11-18 (Our Project interaktif dan aksesibilitas keyboard landing page)

### Ditambah
- Our Project: tab **SEMUA** (aktif sejak awal) di depan MMD, PROGRAMMING, dan SKJ; tab kini memilih, bukan menyalakan dan mematikan. Pil menu disusun dengan flex sehingga empat tab tetap rapi; garis pemisah dibuat dengan `span`.
- Our Project: kartu dapat diklik atau dibuka dengan Enter untuk melihat gambar project dalam ukuran besar beserta judul, divisi, dan deskripsi; panah kiri dan kanan berpindah project dalam tab yang sedang dipilih.
- Pengumuman jumlah project untuk pembaca layar saat tab berganti (`aria-live`).
- Komponen bersama `components/landing/Lightbox.tsx`, dipakai Latest Project dan Our Project: fokus pindah ke tombol Tutup saat dibuka, Tab berputar di dalam dialog, Esc menutup, dan fokus kembali ke kartu pemicu (WCAG 2.4.3).

### Diperbaiki
- Tombol Sign In dan Lets Make A Project terkena Tab dua kali karena pembungkus `Magnet` diberi `tabindex=0` oleh motion (`whileTap`); pembungkus kini `tabIndex={-1}`.
- Tanda fokus keyboard di landing page hanya garis 1 px gelap yang tidak terlihat di latar gelap; kini garis oranye 3 px dengan cincin gelap di dalamnya (`[data-landing] :focus-visible` di `index.css`), terlihat di latar krem maupun gelap (WCAG 2.4.7, 1.4.11).
- Salah ketik data portofolio: "anniversarry" menjadi "anniversary", "entertaiment" menjadi "entertainment", "betugas" menjadi "bertugas", serta spasi setelah koma.

### Dihapus
- Komponen `Separator` di `landing/Parts.tsx` (tidak dipakai lagi).

## 2026-11-18 (elemen desain landing page tanpa gambar)

### Diubah
- Elemen desain landing page dibuat dengan HTML, Tailwind, dan SVG inline, tidak lagi dari berkas gambar (permintaan PM): segitiga latar Latest Project memakai `clip-path`, elips alas dan garis judul memakai `div`/`span` berwarna, garis pemisah menu Our Project memakai `span` krem, dan tanda © memakai teks.
- Ikon media sosial (Instagram, Facebook, Spotify, X, TikTok, YouTube) di footer landing page dan footer halaman klien memakai komponen baru `components/landing/IkonSosial.tsx` (SVG inline, warna mengikuti `currentColor`, `role="img"` dengan `aria-label`). Tampilan tidak berubah; uji regresi landing dan audit axe tetap lulus.
- Yang masih berupa gambar: foto kegiatan, tangkapan layar proyek, logo, dan ornamen hero (karya grafis merek).

### Dihapus
- 14 berkas SVG yang tidak dipakai lagi di `assets/landing`: `latest-segitiga`, `latest-mask`, `latest-garis-gelap`, `latest-garis-terang`, `latest-elips`, `journey-garis`, `garis-menu`, `ikon-copyright`, `ikon-facebook`, `ikon-instagram`, `ikon-spotify`, `ikon-vector-a`, `ikon-vector-b`, `ikon-vector-c`.

## 2026-11-18 (perbaikan temuan QA)

### Diperbaiki
- BUG-01: halaman Payment Marketing menyembunyikan form Terbitkan Tagihan setelah seluruh nilai kesepakatan ditagih ("Seluruh tagihan sudah lunas" atau petunjuk membatalkan tagihan yang belum dibayar); kolom nominal dibatasi sisa yang belum ditagih.
- BUG-02 (ponsel): tombol Sign In di header Daftar Jasa tidak lagi membesar dan terlipat (ukuran dibatasi lebar layar, `whitespace-nowrap` pada tombol berbingkai); tautan "← Beranda" di halaman Login dan Daftar berada di atas judul pada layar sempit sehingga tidak menumpuk; tulisan tombol Masuk dengan Google diperkecil dan satu baris.
- BUG-03: Project Saya menampilkan status proyek (Tim Disiapkan, Sedang Dikerjakan, Ditunda, Selesai, Dibatalkan) setelah pesanan menjadi proyek, bukan selalu "Disetujui" (`CLIENT_PROJECT_STATUS`).

## 2026-11-18 (tombol konsisten dan perbaikan WCAG)

### Ditambah
- `components/brand/Tombol.ts`: satu sumber gaya tombol aksi (F-26) dengan varian utama, gelap, garis, bahaya, bahayaPenuh, dan tautan; ukuran kecil, sedang, besar; tanda fokus keyboard terlihat di latar terang maupun gelap. `pillButton` dan `linkButton` menjadi alias. Tombol yang sebelumnya ditulis sendiri-sendiri di Payment klien dan Marketing, Detail klien, Daftar Jasa publik, Project Saya, Tagihan cetak, detail project Tim, dan komentar kini memakai komponen ini.
- Warna `flame-ink` (#c2410c) untuk teks oranye di atas latar terang.

### Diperbaiki
- Kontras teks (WCAG 1.4.3): label form, judul kartu, tautan, "by neotelemetri", nilai progres, nama dokumen, dan judul bagian di latar terang memakai `flame-ink`; menu aktif sidebar, persentase progres, dan tombol utama memakai teks gelap di atas oranye; hijau status `#14aa00` menjadi `#0f7a00`, merah `#ff4d4d`/`#e60000` menjadi `#c62828`; teks abu `text-coal-deep/60` menjadi `/70`.
- Grafik dashboard: area yang dapat difokus diberi `role="img"` agar `aria-label` sah (WCAG 4.1.2), dan Dashboard Marketing mendapat h1.
- Hasil audit axe WCAG 2.1 AA pada 12 halaman: 11 halaman tanpa pelanggaran; satu sisa di landing page adalah positif palsu (subjudul hero berdiri di atas bayangannya sendiri yang gelap, 5,04:1, tetapi axe tidak membaca latar dari `text-shadow`).

## 2026-11-18 (judul hero dengan HTML dan CSS)

### Diubah
- Judul hero (SIMPK, subjudul, dan bidang bayangan gelap) dibuat dengan HTML dan CSS, menggantikan tiga gambar `hero-simpk.png`, `hero-subjudul.png`, dan `hero-bayangan.png` (masukan teman PM). Bayangan panjang ke kiri bawah dibuat dari `text-shadow` berlapis (langkah 1,5 px) sehingga kedua bayangan menyatu seperti desain; lapisan bayangan dipisah dari lapisan huruf agar bayangan huruf berikutnya tidak menimpa huruf sebelumnya.
- Animasi masuk dengan motion: huruf S-I-M-P-K masuk satu per satu dari kiri bawah bersama bayangannya, lalu subjudul.
- H1 kini teks yang terlihat, "SIMPK, Sistem Informasi Manajemen Proyek Klien" (sebelumnya H1 tersembunyi dan judul berupa gambar). Ejaan subjudul diperbaiki dari "Management Projek Klient" pada gambar desain.

### Dihapus
- Gambar `hero-simpk.png`, `hero-subjudul.png`, dan `hero-bayangan.png`, serta komponen `Backdrop`.

## 2026-11-18 (navbar landing menempel)

### Diubah
- Navbar landing page (`LandingHeader`) dipindah dari dalam hero ke `LandingPage` dan menempel di atas layar saat digulir, di layar lebar maupun ponsel, atas masukan teman PM agar pengunjung selalu dapat berpindah bagian. Navbar berlatar krem dan berbayang tipis setelah halaman digulir.
- Menu menyorot bagian yang sedang dilihat (teks krem) dan menandainya dengan `aria-current`.
- Tinggi navbar ditulis ke `--landing-header-h`: hero layar lebar mengisi sisa tinggi layar, dan setiap bagian memakai `scroll-margin-top` sehingga judul bagian tidak tertutup navbar saat menu diklik.

## 2026-11-18 (tipografi konsisten dan hero tanpa deskripsi)

### Diubah
- Seluruh web memakai dua font (F-25): Magic Hat untuk judul, navbar, dan tombol; Poppins untuk semua teks isi. Kelas `font-moon`, `font-poppins`, dan `font-spartan` digabung menjadi `font-body`; token `--font-moon`, `--font-poppins`, `--font-spartan`, dan `--font-heading` dihapus; judul tanpa kelas memakai `--font-magic`. Google Fonts hanya memuat Poppins, dan `@font-face` Seven Moon dihapus.
- Landing page: judul "Website Firetech 2026" memakai Magic Hat seperti judul lain dan selalu satu baris; paragraf Latest Project 30 px (sebelumnya Seven Moon 48 px); deskripsi kartu Our Project 15 px dibatasi tiga baris.
- `StaffPanel` menerima `level={2}`; panel Portofolio memakai h2 sehingga halaman Daftar Jasa Marketing hanya punya satu h1.

### Dihapus
- Deskripsi panjang "SIMPK Merupakan Website..." di hero landing page (layar lebar dan ponsel) atas masukan teman PM: hero cukup judul dan tombol aksi. Deskripsi di footer tetap.

## 2026-11-17 (kelola portofolio)

### Ditambah
- Panel Portofolio di halaman Daftar Jasa Marketing (`/app/katalog`): tambah, ubah, dan hapus portofolio (judul, deskripsi, jasa terkait, tahun) dengan paginasi. Portofolio tampil di bagian Portofolio pada Daftar Jasa publik; portofolio milik jasa yang disembunyikan ikut tidak tampil. Memenuhi REQ-F01 dan UC-13 yang sebelumnya baru sebagian. Memakai endpoint `/portfolios` yang sudah ada; gambar portofolio belum dikelola.

## 2026-11-17 (modernisasi navbar/sidebar dengan mempertahankan gaya desain SIMPK)

### Diubah
- Navbar/sidebar pengurus (`StaffLayout.tsx`) diperbarui agar lebih modern dan nyaman di mata (menu tidak aktif berwarna abu-abu lembut `text-zinc-400`, menu aktif tetap memakai pill oranye `#ff6200`, serta profil pengguna di kanan atas berupa badge ringkas).
- Tampilan utama halaman pengurus tetap mempertahankan gaya desain khas SIMPK (`bg-coal-deep`, kartu `bg-cream`, aksen `flame`) dengan font `Poppins`, sedangkan seluruh Portal Klien (`ClientLayout.tsx` dan halaman klien) dibiarkan seperti semula mengikuti desain asli Figma (F-24).

## 2026-11-17 (grafik dashboard modern dan font Poppins setelah login)

### Diubah
- Seluruh halaman setelah login (`[data-app-shell]` pada `StaffLayout` dan `ClientLayout`) kini memakai font **Poppins** (`400`/`500`/`600`/`700`) menggantikan `Seven Moon` dan `Magic Hat` yang melelahkan mata pada ukuran teks antarmuka; landing page publik tetap memakai font dekoratif Figma (F-23).
- Grafik di Dashboard Marketing (`TrendBands.tsx`, `DashboardPage.tsx`) diperbarui menjadi dua panel analitik modern berdampingan:
  - **Tren Aktivitas Proyek**: kurva halus (*cubic-bezier*) dengan gradasi lembut, garis bantu sumbu Y, titik data interaktif, dan warna berbeda yang nyaman di mata untuk *Request Masuk* (kuning amber), *Projek Masuk* (oranye), dan *Projek Selesai* (hijau zamrud).
  - **Tren Keuntungan Bulanan**: diagram batang membulat bergradasi dengan kurva penghubung, label sumbu Y dalam Rupiah ringkas, dan tooltip rincian per bulan.

## 2026-11-17 (paginasi daftar agar muat satu layar)

### Ditambah
- Komponen `Pagination` dan hook `usePagination` (`components/brand/Pagination.tsx`) dengan tombol `< Sebelumnya`, nomor halaman, dan `Selanjutnya >` (F-22).
- `StaffPanel` (`StaffParts.tsx`) dan `StaffLayout.tsx` mengisi sisa tinggi layar secara proporsional dengan jarak bawah sejajar tombol Log Out di sidebar, serta menambatkan tombol paginasi di bagian bawah panel.
- Paginasi diterapkan pada seluruh halaman daftar/tabel agar muat satu layar tanpa perlu digulir panjang:
  - Marketing: `ProjekPage` (6 per halaman), `RequestPage` (6 per halaman per tab), `ReviewPage` (6 per halaman), `KatalogPage` (8 per halaman), `KlienPage` (8 per halaman).
  - Operasional: `ProjectOpsPage` (6 per halaman), `WorkerPage` (12 kartu per halaman), `PilihWorkerPage` (6 kartu worker per halaman), `PenggunaPage` (tab Akun Internal dan Akun Klien masing-masing 8 baris per halaman).
  - Tim & Klien: `ProjectTimPage` (6 per halaman), `ProyekSayaPage` (6 per halaman).
  - Bagian dalam Detail: `OrderComments` (4 komentar per halaman, otomatis ke halaman terakhir saat ada pesan baru), `TaskTable` (5 tugas per halaman), serta `Riwayat` dan `Updates` (3 catatan per halaman).

## 2026-11-17 (komentar/chat pada detail project)

### Ditambah
- Komponen `OrderComments` (`components/brand/OrderComments.tsx`) dengan tampilan utas chat (gelembung pesan sendiri vs pihak lain, label peran pengirim, stempel waktu, muat ulang berkala tiap 15 detik saat tab aktif, dan kirim dengan tombol atau Enter).
- Dipasang pada halaman Detail klien (`DetailPage.tsx`), Detail Request Marketing (`RequestDetailPage.tsx`), Pilih Worker Operasional (`PilihWorkerPage.tsx`), dan Detail Proyek Tim/Operasional/Marketing (`ProyekTimPage.tsx`).

## 2026-11-16 (detail project dikembalikan)

### Dihapus
- Tata letak dua kolom setinggi layar pada detail project (commit ae1bfb0) dikembalikan ke tampilan satu kolom sebelumnya atas masukan PM: kolom kiri yang harus digulir sendiri terasa kurang nyaman.

## 2026-11-16 (footer halaman klien)

### Diubah
- `SiteFooter` (halaman klien dan Daftar Jasa publik) disamakan dengan footer landing page: membentang selebar layar dengan judul dan deskripsi menempel di kiri, FOLLOW US di tengah, dan CONTACT US dekat tepi kanan (proporsi kolom 28 : 40 : 30), menggantikan kotak selebar 6xl di tengah. Ukuran huruf dan ikon mengikuti lebar layar seperti landing page; di ponsel tetap bertumpuk.

## 2026-11-15 (kolom tanggal)

### Diperbaiki
- Ikon kalender pada kolom tanggal tidak terlihat karena input mewarisi `color-scheme: dark` dari tema lama sehingga ikon tergambar putih di atas latar krem. Kolom tanggal kini memakai skema terang dan ikon kalender oranye (`index.css`).

### Ditambah
- Komponen `DateInput` (`components/DateInput.tsx`): klik di bagian mana pun kolom membuka kalender, bukan hanya pada ikon. Dipakai di keenam kolom tanggal: ekspektasi selesai pesanan, tanggal transfer, tenggat tugas, target selesai proyek, serta jatuh tempo tagihan baru dan ubah tagihan.
- Batas tanggal: ekspektasi selesai pesanan dan jatuh tempo tagihan baru tidak dapat sebelum hari ini; tanggal transfer tidak dapat melewati hari ini. Kolom ubah tagihan, tenggat tugas, dan target proyek tanpa batas agar data lama tetap dapat disimpan.

## 2026-11-15 (kilatan bingkai Our Project)

### Ditambah
- Kartu Our Project di landing page (layar lebar dan ponsel): kilatan oranye berekor memudar berjalan mengelilingi bingkai saat kartu diarahkan (`BorderBeam` di `landing/Motion.tsx`, keyframes `simpk-beam` di `index.css`). Memakai `offset-path` dan animasi CSS karena animasi offset-distance lewat motion tidak berulang. Bila pengguna memilih kurangi gerakan, diganti bingkai oranye diam.

## 2026-11-15 (ukuran halaman setelah login)

### Diubah
- Semua halaman setelah login (Marketing, Operasional, Tim, dan klien) sekitar 12,5% lebih kecil di layar mulai 1024 px: ukuran dasar huruf 87,5% lewat penanda `data-app-shell` di StaffLayout dan ClientLayout (F-20). Ponsel tetap 100%.
- Ukuran yang mengikuti tinggi layar ikut dikecilkan: sidebar (lebar, huruf menu, jarak), judul panel, judul kartu project, avatar, judul tabel, label grafik, dan judul SIMPK di header klien. Batas ukuran input dan label formulir di `Brand.tsx` kini dalam rem; halaman masuk tidak berubah.
- Kartu dashboard Marketing lebih pendek dan diberi ikon (request, projek, selesai, keuntungan); grafik dipertinggi agar dashboard terisi satu layar.
- Profil klien memakai dua kolom, dan Pengaturan serta Payment klien dirapatkan, sehingga ketiganya muat satu layar tanpa digulir pada 1366 x 768. Halaman daftar dan detail yang isinya bertambah (daftar project, pengguna, worker, tugas) tetap dapat digulir.

## 2026-11-15 (ornamen hero terpotong, teks tombol bergulir)

### Ditambah
- Teks tombol "Lets Make A Project" dan "Sign In" di landing page layar lebar bergulir saat diarahkan atau difokus keyboard (`RollingText` dan `useHoverFocus` di `landing/Motion.tsx`). Satu guliran selesai dulu sebelum berbalik arah; pembaca layar tetap membaca teksnya sekali; mati bila pengguna memilih kurangi gerakan. Menu navbar sengaja tidak memakai efek ini agar tidak bersaing dengan tombol aksi.

### Diperbaiki
- Ornamen kiri hero terpotong di tepi atas saat bergeser mengikuti kursor. Ornamen kiri kini hanya bergeser dan mengambang ke bawah, dengan posisi diturunkan 30 px (skala desain). Geser ke atas ornamen kanan atas dibatasi 16 px (prop baru `naikMaks` pada `Ornament`).

## 2026-11-15 (animasi landing page)

### Diubah
- Ornamen hero (`Ornament` di `landing/Motion.tsx`): masuk berputar dari blur lalu memantul, bergeser dan miring 3D mengikuti kursor dengan kedalaman berbeda (parallax), bergoyang elastis saat diarahkan, dan tetap mengambang saat diam. Posisi akhir sama dengan desain; mati bila pengguna memilih kurangi gerakan.
- Kolase Latest Project: gambar yang diarahkan kursor naik ke depan sehingga dua gambar belakang dapat dilihat utuh, dan klik membuka tampilan penuh dengan tombol sebelumnya/berikutnya (Esc dan panah keyboard).

## 2026-11-15 (dokumen pendukung tambahan)

### Ditambah
- Tombol "+ Tambah Dokumen" pada bagian Document Pendukung di Detail dan Payment klien (selama pengajuan belum diterima) serta di Detail Request dan Payment Marketing (misalnya MoU). Setiap dokumen menampilkan pengunggahnya, dan pengunggah dapat menghapus dokumennya selama masih diizinkan.

## 2026-11-14 (pengaturan dan perbaikan tagihan)

### Ditambah
- Halaman Pengaturan Marketing (`/app/pengaturan`) untuk identitas dan rekening Neo Telemetri yang tercetak di tagihan; menggantikan berkas `data/neoTelemetri.ts`.
- Tombol Ubah dan Batalkan tagihan di halaman Payment Marketing, hanya untuk tagihan yang belum dibayar dan tanpa bukti yang sedang diperiksa. Tagihan dibatalkan dicoret, tidak dihitung sebagai sudah ditagih, dan ditandai di tagihan cetak serta halaman Payment klien.

### Diperbaiki
- Pesan "Pengaturan disimpan" tidak hilang setelah data dimuat ulang.

### Dihapus
- `data/neoTelemetri.ts` (diganti API Pengaturan).

## 2026-11-14 (tagihan cetak)

### Ditambah
- Halaman tagihan siap cetak `/tagihan/:orderId/:invoiceId` (FR-12, UC-16, Charter Tujuan 4) untuk klien pemilik, Marketing, dan Operasional: identitas Neo Telemetri, nomor, tanggal terbit, jatuh tempo, status, data klien, project, rincian, total, sudah dibayar, sisa, pembayaran diterima, dan rekening tujuan. Tombol Cetak / Simpan PDF memakai fitur cetak browser; ukuran A4 satu halaman.
- Tombol Cetak Tagihan pada setiap tagihan di halaman Payment klien dan Marketing.
- `data/neoTelemetri.ts`: identitas dan rekening Neo Telemetri. Masih data contoh (DUMMY), sehingga tagihan menampilkan peringatan agar tidak ada transfer ke rekening contoh.

## 2026-11-14 (ubah dan hapus tugas)

### Ditambah
- PM dan Operasional dapat mengubah tugas (judul, deskripsi, bidang, bobot, penanggung jawab, tenggat) dan menghapus tugas dengan konfirmasi. Persentase tetap diubah lewat Perbarui agar tercatat di riwayat. Tombol tidak tampil untuk anggota biasa dan untuk project yang sudah Selesai atau Dibatalkan.

## 2026-11-14 (peran anggota di detail project)

### Ditambah
- Detail project untuk Tim menampilkan kotak "Peran Anda di project ini": posisi, tanda Project Manager bila PM, penjelasan hak (PM menambah dan membagi tugas; anggota memperbarui tugas miliknya), dan jumlah tugas miliknya.
- Susunan tim menandai "(Anda)" dan kini menampilkan posisi PM juga (sebelumnya hanya tertulis PM).

## 2026-11-14 (Daftar Jasa publik dan halaman galat)

### Diubah
- Daftar Jasa publik (`/katalog`, tujuan tombol LETS MAKE A PROJECT) mengikuti gaya halaman klien: header logo dan SIMPK, kartu jasa krem berbingkai oranye, footer situs. Tombol header menyesuaikan pengunjung (Sign In), klien (Project Saya), atau pengurus (Dashboard).
- Jasa yang dipilih lewat "Pesan jasa ini" kini terbawa ke form pengajuan (dapat dilepas) dan tersimpan sebagai jasa pesanan.
- Halaman 404, 403, dan layar memuat bergaya desain.

### Dihapus
- `PublicLayout` dan komponen tema lama yang tidak dipakai lagi (Button, Table, Modal, Field, DataState, StatusBadge, Placeholder).

## 2026-11-14 (perbaikan kartu dashboard)

### Diperbaiki
- Nilai panjang di kartu dashboard (misalnya "25,2 JT") terlipat dan keluar dari kartu; kini tetap satu baris dan mengecil otomatis.

## 2026-11-14 (sidebar dapat diperkecil, kartu dashboard sejajar)

### Ditambah
- Tombol perkecil/perbesar sidebar di layar lebar untuk semua pengurus: saat diperkecil hanya ikon menu yang tampil (nama menu muncul saat diarahkan), logo menjadi "S", menu aktif berupa kotak dengan garis penanda di kiri. Pilihan diingat di peramban.

### Diubah
- Dashboard Marketing: keempat kartu sejajar satu baris dan nomor 01-04 dihilangkan atas permintaan PM; pita grafik diberi nama (Request, Projek, Selesai, Keuntungan).

## 2026-11-14 (halaman Marketing, dashboard, ulasan)

### Ditambah
- Marketing memakai sidebar seperti Operasional (Figma "Project Dashboard Page Marketing") dengan menu Dashboard, Request, Projek, Review, ditambah Daftar Jasa, Klien, dan Account. Ikon Request, Projek, Review diambil dari Figma.
- Dashboard: empat kartu angka (Request Masuk, Total Projek Masuk, Total Projek Selesai, Keuntungan) dan grafik pita per bulan. Tiap pita berskala sendiri karena jumlah dan rupiah tidak boleh berbagi satu sumbu; nilai asli tampil saat diarahkan, dan ada tabel untuk pembaca layar.
- Request: daftar bertab (Perlu Ditinjau, Diterima, Ditolak/Batal, Semua) dengan penanda bukti transfer menunggu; Detail dengan tombol Tolak, Diskusi Lebih Lanjut, Terima; Payment per request untuk menerbitkan tagihan dan memeriksa bukti.
- Projek: daftar dan detail (ringkasan tugas tanpa penanggung jawab dan catatan teknis). Review: daftar ulasan dengan bintang dan rata-rata.
- Klien memberi ulasan (bintang dan komentar) di halaman Detail setelah project Selesai.
- Operasional menetapkan status dan target selesai project di halaman detail project.

### Diubah
- Daftar Jasa dan Klien bergaya halaman pengurus; nomor WhatsApp klien dapat diklik.
- Alamat lama `/app/pesanan`, `/app/tagihan`, dan `/app/sandi` dialihkan ke halaman baru.

### Dihapus
- `InternalLayout`, halaman Pesanan dan Tagihan lama, Ganti Kata Sandi lama, serta kerangka Ringkasan Operasional dan Tugas Saya.

## 2026-11-14 (profil klien)

### Ditambah
- Halaman Profil klien (`/portal/profil`) bergaya desain: Data Diri (nama, email hanya dibaca, nomor WhatsApp, nama instansi, jenis klien, alamat) dan Ganti Kata Sandi. Peringatan tampil bila nomor WhatsApp belum diisi. Sapaan HALLO ikut berubah setelah nama disimpan (`refreshUser` di `useAuth`).

### Diubah
- Menu HALLO klien: Ganti Kata Sandi diganti Profil; alamat lama `/portal/sandi` dialihkan ke `/portal/profil`.

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
