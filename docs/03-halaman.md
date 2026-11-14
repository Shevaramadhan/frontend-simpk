# Daftar Halaman

Status: **Kerangka** berarti rute sudah ada tetapi isinya belum dibuat.

| Rute | Akses | Komponen | Status |
|---|---|---|---|
| `/` | Publik | `pages/publik/LandingPage` | Selesai, sesuai desain Figma |
| `/login` | Publik | `pages/auth/LoginPage` | Selesai |
| `/daftar` | Publik | `pages/auth/DaftarPage` | Selesai |
| `/lupa-sandi` | Publik | `pages/auth/LupaSandiPage` | Selesai |
| `/reset-sandi` | Publik, dari tautan email | `pages/auth/ResetSandiPage` | Selesai |
| `/katalog` | Publik | `pages/publik/KatalogPublikPage` | Selesai, bergaya halaman klien (tidak ada di Figma) |
| `/app` | Operasional | `pages/operasional/ProjectOpsPage` | Selesai, desain Figma |
| `/app/pengajuan/:orderId` | Operasional | `pages/operasional/PilihWorkerPage` | Selesai, desain Figma |
| `/app/worker` | Operasional | `pages/operasional/WorkerPage` | Selesai, mengikuti wireframe |
| `/app` | Tim | `pages/tim/ProjectTimPage` | Selesai, bergaya desain Operasional |
| `/app/proyek/:projectId` | Marketing, Operasional, Tim | `pages/tim/ProyekTimPage` | Selesai, bergaya Detail klien |
| `/app/akun` | Marketing, Operasional, Tim | `pages/staff/AkunPage` | Selesai, mengikuti wireframe; foto profil belum didukung |
| `/app` | Marketing | `pages/marketing/DashboardPage` | Selesai, desain Figma |
| `/app/request`, `/app/request/:id`, `/app/request/:id/payment` | Marketing | `pages/marketing/RequestPage`, `RequestDetailPage`, `PaymentMarketingPage` | Selesai, mengikuti wireframe |
| `/app/projek` | Marketing | `pages/marketing/ProjekPage` | Selesai, mengikuti wireframe; detail memakai `/app/proyek/:projectId` |
| `/app/review` | Marketing | `pages/marketing/ReviewPage` | Selesai, mengikuti wireframe |
| `/app/katalog` | Marketing | `pages/marketing/KatalogPage` | Selesai, portofolio belum dapat dikelola |
| `/app/klien` | Marketing | `pages/marketing/KlienPage` | Selesai, bergaya pengurus |
| `/app/pengguna` | Operasional | `pages/operasional/PenggunaPage` | Selesai, akun internal dan perbaikan email; tampilan lama |
| `/portal` | Klien | `pages/klien/BerandaKlienPage` | Selesai, desain Figma |
| `/portal/proyek` | Klien | `pages/klien/ProyekSayaPage` | Selesai, desain Figma |
| `/portal/proyek/:id` | Klien | `pages/klien/DetailPage` | Selesai, desain Figma |
| `/portal/proyek/:id/payment` | Klien | `pages/klien/PaymentPage` | Selesai, desain Figma |
| `/portal/pesan` | Klien | `pages/klien/PesanPage` | Selesai, form pengajuan desain Figma |
| `/portal/profil` | Klien | `pages/klien/ProfilPage` | Selesai, data diri dan ganti kata sandi; `/portal/sandi` dialihkan ke sini |
| `/403` | Publik | `pages/ErrorPages` | Selesai |
| Lainnya | Publik | `pages/ErrorPages` | Selesai |

Pengguna yang sudah masuk diarahkan ke `/portal` untuk Klien dan `/app` untuk role lain. Di `/app`, semua pengurus memakai `StaffLayout`. Klien yang datang dari tombol pesan di katalog dilanjutkan ke form pesan dengan jasa pilihannya (`afterAuthPath`).
