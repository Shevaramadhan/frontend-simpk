# Riwayat Perubahan Frontend

Semua perubahan dicatat di sini, terbaru di atas. Setiap entri ditulis dalam commit yang sama dengan perubahannya.

## Format

```
## YYYY-MM-DD

### Ditambah / Diubah / Diperbaiki / Dihapus
- Apa yang berubah dan alasannya.
```

## 2026-11-07

### Ditambah
- Folder `docs/` sebagai pusat informasi frontend, termasuk ketentuan, arsitektur, daftar halaman, status, dan catatan keputusan.
- Kerangka proyek React, Vite, dan Tailwind.
- Login, sesi pengguna, pembatasan rute per role, tiga layout.
- Komponen Button, Table, Modal, Placeholder.

### Diubah
- Struktur folder mengikuti referensi frontend-beasiswa: `components`, `pages`, `services`, `hooks`, `utils`, `assets`.
- Seluruh kode dari JavaScript ke TypeScript mode strict.
- Frontend dipisah menjadi repo sendiri.
