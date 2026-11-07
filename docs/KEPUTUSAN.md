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
| F-11 | 8 Nov 2026 | Pengalihan setelah login dan daftar lewat satu fungsi `afterAuthPath` | Halaman login dan daftar mengalihkan pengguna begitu sesi terisi, jadi tujuan harus dihitung di satu tempat | Berlaku |
