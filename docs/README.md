# Dokumentasi Frontend SIMPK

Folder ini adalah pusat informasi frontend Sistem Informasi Manajemen Proyek Klien Neo Telemetri. Dokumen di sini menjadi dasar setiap pekerjaan. Kalau kode dan dokumen berbeda, cek kodenya, lalu perbaiki yang salah.

| Dokumen | Isi | Kapan dibaca atau diperbarui |
|---|---|---|
| [STATUS.md](STATUS.md) | Posisi pekerjaan saat ini dan langkah berikutnya | Dibaca pertama kali; diperbarui setiap selesai bekerja |
| [01-ketentuan.md](01-ketentuan.md) | Aturan penulisan kode dan tampilan | Sebelum menulis kode |
| [02-arsitektur.md](02-arsitektur.md) | Teknologi, struktur folder, login, pemanggilan API | Saat struktur berubah |
| [03-halaman.md](03-halaman.md) | Daftar rute dan halaman per role | Setiap halaman atau rute berubah |
| [KEPUTUSAN.md](KEPUTUSAN.md) | Keputusan teknis beserta alasannya | Setiap ada keputusan baru |
| [CHANGELOG.md](CHANGELOG.md) | Riwayat semua perubahan | Setiap perubahan |

Kontrak API dan matriks hak akses ada di repo [backend-simpk](https://github.com/Shevaramadhan/backend-simpk), folder `docs/`. Di sana sumber kebenarannya, jadi tidak disalin ke sini.

## Sumber kebutuhan

Acuan fitur adalah BRS Sistem Informasi Manajemen Proyek Klien Neo Telemetri. Tampilan mengikuti prototype UI/UX setelah divalidasi koordinator. Fitur di luar BRS tidak dikerjakan tanpa persetujuan Project Owner.

## Aturan mencatat perubahan

Setiap perubahan dicatat dalam commit yang sama dengan perubahannya:

1. Tambahkan entri di `CHANGELOG.md`.
2. Perbarui dokumen yang terdampak.
3. Perbarui `STATUS.md` jika posisi pekerjaan berubah.
4. Tambahkan entri di `KEPUTUSAN.md` jika ada pilihan teknis baru.
