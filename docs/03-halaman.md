# Daftar Halaman

Status: **Kerangka** berarti rute sudah ada tetapi isinya belum dibuat.

| Rute | Akses | Komponen | Status |
|---|---|---|---|
| `/login` | Publik | `pages/auth/LoginPage` | Selesai |
| `/daftar` | Publik | `pages/auth/DaftarPage` | Selesai |
| `/lupa-sandi` | Publik | `pages/auth/LupaSandiPage` | Selesai |
| `/reset-sandi` | Publik, dari tautan email | `pages/auth/ResetSandiPage` | Selesai |
| `/katalog` | Publik | `pages/publik/KatalogPublikPage` | Selesai |
| `/app` | Marketing | `pages/marketing/MarketingDashboardPage` | Kerangka |
| `/app` | Operasional | `pages/operasional/OperasionalDashboardPage` | Kerangka |
| `/app` | Tim | `pages/tim/TugasSayaPage` | Kerangka |
| `/app/katalog` | Marketing | `pages/marketing/KatalogPage` | Selesai, portofolio belum dapat dikelola |
| `/app/pesanan` | Marketing | `pages/marketing/PesananPage` | Selesai, termasuk persetujuan dengan nilai |
| `/app/klien` | Marketing | `pages/marketing/KlienPage` | Selesai, lihat dan nonaktifkan klien |
| `/app/tagihan` | Marketing | `pages/marketing/TagihanPage` | Kerangka |
| `/app/proyek` | Marketing, Operasional, Tim | Placeholder langsung di `App.tsx` | Kerangka, akan dipisah per role |
| `/app/pengguna` | Operasional | `pages/operasional/PenggunaPage` | Selesai, akun internal dan perbaikan email |
| `/portal` | Klien | `pages/klien/ProyekSayaPage` | Selesai untuk pesanan; proyek menyusul |
| `/portal/pesan` | Klien | `pages/klien/PesanPage` | Selesai |
| `/app/sandi`, `/portal/sandi` | Semua role yang masuk | `pages/auth/GantiSandiPage` | Selesai |
| `/403` | Publik | `pages/ErrorPages` | Selesai |
| Lainnya | Publik | `pages/ErrorPages` | Selesai |

Pengguna yang sudah masuk diarahkan ke `/portal` untuk Klien dan `/app` untuk role lain. Klien yang datang dari tombol pesan di katalog dilanjutkan ke form pesan dengan jasa pilihannya (`afterAuthPath`).
