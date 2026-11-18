# Catatan Keputusan

Keputusan teknis beserta alasannya, supaya tidak dibahas ulang. Keputusan yang berubah tidak dihapus, tetapi ditandai digantikan.

Format: nomor, tanggal, keputusan, alasan, status.

| No | Tanggal | Keputusan | Alasan | Status |
|---|---|---|---|---|
| F-01 | 1 Nov 2026 | React dan Vite | Pilihan tim | Berlaku |
| F-02 | 1 Nov 2026 | Tailwind CSS | Cepat dibuat responsif | Berlaku |
| F-03 | 7 Nov 2026 | Mengikuti struktur folder frontend-beasiswa | Rapi dan jelas | Berlaku |
| F-04 | 7 Nov 2026 | Halaman dikelompokkan per role | Sesuai empat jenis pengguna | Berlaku |
| F-05 | 7 Nov 2026 | TypeScript mode strict | Keputusan pengembang; kesalahan tertangkap saat build | Berlaku |
| F-06 | 7 Nov 2026 | Backend dan frontend dua repo terpisah | Repo sudah disiapkan di GitHub | Berlaku |
| F-07 | 7 Nov 2026 | Token JWT di `sessionStorage`, dikirim lewat header | Sederhana untuk API terpisah; sesi berakhir saat tab ditutup | Berlaku |
| F-08 | 7 Nov 2026 | Mock data tidak dipakai | Satu orang mengerjakan frontend dan backend sehingga API langsung tersedia | Berlaku |
| F-10 | 7 Nov 2026 | Tampilan sementara mengacu situs profil Neo Telemetri, warna terpusat sebagai token | Prototype belum ada; token memudahkan penggantian | Sementara, sampai prototype tersedia |
| F-09 | 7 Nov 2026 | Tagihan PDF memakai cetak browser | Sesuai BRS, tanpa mesin PDF di backend | Berlaku |
| F-12 | 13 Nov 2026 | Landing page memakai artboard 1440 x 1024 yang diskalakan mengikuti lebar layar (mulai 1024 px); layar lebih kecil memakai tata letak tersendiri | Desain berupa komposisi bertumpuk dan miring; penskalaan menjaga posisi persis seperti Figma | Berlaku |
| F-13 | 13 Nov 2026 | Tombol SIGN IN ke `/login`, "Lets Make A Project" ke `/katalog`; daftar jasa tetap halaman terpisah | Keputusan PM; REQ-F01 tetap terpenuhi walau tidak ada di desain landing page | Berlaku |
| F-14 | 13 Nov 2026 | Isi Our Project dan Latest Project statis sesuai desain; tab MMD, Programming, SKJ menyaring kartu | Backend portofolio belum punya divisi dan unggah gambar | Sementara; pembagian divisi adalah asumsi |
| F-15 | 13 Nov 2026 | Animasi memakai `motion`, dimatikan otomatis bila pengguna memilih kurangi gerakan | Permintaan PM | Berlaku |
| F-11 | 8 Nov 2026 | Pengalihan setelah login dan daftar lewat satu fungsi `afterAuthPath` | Halaman login dan daftar mengalihkan pengguna begitu sesi terisi, jadi tujuan harus dihitung di satu tempat | Berlaku |
| F-16 | 14 Nov 2026 | Halaman klien dan halaman masuk memakai tata letak responsif biasa (bukan artboard berskala) dengan huruf sekitar 70% ukuran Figma | Masukan PM: ukuran desain terasa terlalu besar di web | Berlaku |
| F-17 | 14 Nov 2026 | Tombol Google memakai tombol resmi Google Identity Services yang dibuat transparan di atas tampilan desain | Hanya tombol resmi yang boleh menghasilkan ID token | Berlaku |
| F-18 | 14 Nov 2026 | Kode QR pada desain Payment tidak dipakai; kotak QR menunggu QRIS resmi Neo Telemetri | QR pada desain hanya contoh; klien bisa salah transfer | Sementara |
| F-19 | 14 Nov 2026 | Artboard landing diskalakan agar muat lebar dan tinggi layar (menggantikan batas lebar 1200 px); header landing di luar artboard | Masukan PM: pas pada zoom 100%, logo di sudut, menyesuaikan zoom | Berlaku |
| F-20 | 15 Nov 2026 | Halaman setelah login diperkecil lewat ukuran dasar huruf 87,5% di layar mulai 1024 px (`html:has([data-app-shell])`); batas ukuran `clamp` ditulis dalam rem | Masukan PM: tampilan internal terlalu besar dan beberapa halaman formulir harus digulir; satu pengaturan mengecilkan teks, jarak, ikon, dan modal sekaligus tanpa mengubah halaman masuk dan landing page | Berlaku |
| F-21 | 17 Nov 2026 | Ruang komentar/chat `OrderComments` memakai polling berkala tiap 15 detik saat tab aktif dan muat ulang langsung setelah kirim | Tetap ringan pada arsitektur REST API tanpa menambah server WebSocket terpisah | Berlaku |
| F-22 | 17 Nov 2026 | Halaman daftar, tabel, dan bagian riwayat/komentar dibatasi per halaman dengan navigasi `< Sebelumnya` dan `Selanjutnya >` (`Pagination`) | Masukan pengguna: daftar yang panjang (Projek, Request, Review, Katalog, Klien, Worker, Pengguna, Project Saya, Tugas, Komentar) harus muat dalam satu layar tanpa perlu digulir | Berlaku |
| F-23 | 17 Nov 2026 | Halaman setelah login (`[data-app-shell]`) memakai font `Poppins` dan grafik Dashboard Marketing memakai dua panel analitik modern (kurva halus aktivitas proyek + diagram batang keuntungan bulanan) | Font dekoratif `Seven Moon` dan `Magic Hat` serta empat pita oranye tajam melelahkan mata dan sulit dibaca pada pemakaian kerja sehari-hari | Berlaku |
| F-24 | 17 Nov 2026 | Modernisasi navbar/sidebar dan font `Poppins` hanya pada halaman pengurus (`StaffLayout`), sedangkan tampilan utama pengurus tetap bergaya SIMPK (`bg-coal-deep`, `bg-cream`, `border-flame`) dan Portal Klien tetap seperti semula | Masukan pengguna: Portal Klien dan tampilan utama dibiarkan seperti desain semula agar karakter SIMPK tetap terjaga, hanya navbar pengurus yang dimodernisasi | Berlaku |
| F-25 | 18 Nov 2026 | Dua font untuk seluruh web: Magic Hat (`font-magic`) untuk judul, navbar, dan tombol; Poppins (`font-body`) untuk semua teks isi. Seven Moon, League Spartan, Inter, dan Plus Jakarta Sans dihapus | Masukan teman PM: font tidak konsisten (landing page memakai empat font dan sepuluh ukuran tanpa aturan); Poppins dipilih PM karena mudah dibaca dan sudah dipakai di halaman pengurus | Berlaku |
