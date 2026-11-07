# Frontend SIMPK Neo Telemetri

Antarmuka web Sistem Informasi Manajemen Proyek Klien UKM Neo Telemetri Universitas Andalas.
Dibangun dengan TypeScript, React, Vite, dan Tailwind CSS. Backend: [backend-simpk](https://github.com/Shevaramadhan/backend-simpk).

## Menjalankan

Butuh Node.js 22 dan backend yang sudah berjalan.

```bash
cp .env.example .env
npm install
npm run dev      # http://localhost:5173
```

## Struktur

- `src/pages/<role>/`: halaman per jenis pengguna
- `src/components/`: komponen yang dipakai ulang, termasuk `Layout/`
- `src/services/`: pemanggilan API, satu file per modul
- `src/hooks/`, `src/utils/`, `src/assets/`
