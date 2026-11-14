# Daftar Halaman

Status: **Kerangka** berarti rute sudah ada tetapi isinya belum dibuat.

| Rute | Akses | Komponen | Status |
|---|---|---|---|
| `/` | Publik | `pages/publik/LandingPage` | Selesai, sesuai desain Figma |
| `/login` | Publik | `pages/auth/LoginPage` | Selesai |
| `/daftar` | Publik | `pages/auth/DaftarPage` | Selesai |
| `/lupa-sandi` | Publik | `pages/auth/LupaSandiPage` | Selesai |
| `/reset-sandi` | Publik, dari tautan email | `pages/auth/ResetSandiPage` | Selesai |
| `/katalog` | Publik | `pages/publik/KatalogPublikPage` | Selesai |
| `/app` | Marketing | `pages/marketing/MarketingDashboardPage` | Kerangka |
| `/app` | Operasional | `pages/operasional/ProjectOpsPage` | Selesai, desain Figma |
| `/app/pengajuan/:orderId` | Operasional | `pages/operasional/PilihWorkerPage` | Selesai, desain Figma |
| `/app/worker` | Operasional | `pages/operasional/WorkerPage` | Selesai, mengikuti wireframe |
| `/app/ringkasan` | Operasional | `pages/operasional/OperasionalDashboardPage` | Kerangka, tanpa menu |
| `/app` | Tim | `pages/tim/ProjectTimPage` | Selesai, bergaya desain Operasional |
| `/app/proyek/:projectId` | Operasional, Tim | `pages/tim/ProyekTimPage` | Selesai, bergaya Detail klien |
| `/app/tugas` | Tim | `pages/tim/TugasSayaPage` | Kerangka, tanpa menu |
| `/app/akun` | Operasional, Tim | `pages/staff/AkunPage` | Selesai, mengikuti wireframe; foto profil belum didukung |
| `/app/katalog` | Marketing | `pages/marketing/KatalogPage` | Selesai, portofolio belum dapat dikelola |
| `/app/pesanan` | Marketing | `pages/marketing/PesananPage` | Selesai, termasuk persetujuan dengan nilai |
| `/app/klien` | Marketing | `pages/marketing/KlienPage` | Selesai, lihat dan nonaktifkan klien |
| `/app/tagihan` | Marketing | `pages/marketing/TagihanPage` | Selesai: terbitkan tagihan, verifikasi bukti |
| `/app/pengguna` | Operasional | `pages/operasional/PenggunaPage` | Selesai, akun internal dan perbaikan email; tampilan lama |
| `/portal` | Klien | `pages/klien/BerandaKlienPage` | Selesai, desain Figma |
| `/portal/proyek` | Klien | `pages/klien/ProyekSayaPage` | Selesai, desain Figma |
| `/portal/proyek/:id` | Klien | `pages/klien/DetailPage` | Selesai, desain Figma |
| `/portal/proyek/:id/payment` | Klien | `pages/klien/PaymentPage` | Selesai, desain Figma |
| `/portal/pesan` | Klien | `pages/klien/PesanPage` | Selesai, form pengajuan desain Figma |
| `/app/sandi`, `/portal/sandi` | Semua role yang masuk | `pages/auth/GantiSandiPage` | Selesai |
| `/403` | Publik | `pages/ErrorPages` | Selesai |
| Lainnya | Publik | `pages/ErrorPages` | Selesai |

Pengguna yang sudah masuk diarahkan ke `/portal` untuk Klien dan `/app` untuk role lain. Di `/app`, Marketing memakai `InternalLayout`, sedangkan Operasional dan Tim memakai `StaffLayout`. Klien yang datang dari tombol pesan di katalog dilanjutkan ke form pesan dengan jasa pilihannya (`afterAuthPath`).
