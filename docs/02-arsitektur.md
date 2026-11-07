# Arsitektur Frontend

## Teknologi

| Bagian | Pilihan |
|---|---|
| Bahasa | TypeScript |
| Kerangka | React 19, Vite |
| Rute | React Router 7 |
| Gaya | Tailwind CSS 4 |
| HTTP | axios |

## Struktur folder

```
frontend/
├── docs/                dokumentasi ini
├── index.html           wajib di akar folder untuk Vite
└── src/
    ├── assets/          berkas statis
    ├── components/      Button, Table, Modal, Field, StatusBadge, DataState, Placeholder, ProtectedRoute
    │   └── Layout/      PublicLayout, InternalLayout, ClientLayout
    ├── hooks/           useAuth, useCurrentUser, useData
    ├── pages/           auth, publik, marketing, operasional, tim, klien
    ├── services/        apiConfig, tokenAuth, *Service
    ├── types/           tipe data bersama
    ├── utils/           navigation, format (rupiah, tanggal, label status)
    ├── App.tsx          seluruh rute
    ├── index.css        Tailwind dan aturan cetak
    └── main.tsx         titik masuk
```

## Sesi login

1. `useAuth().login()` memanggil `POST /auth/login`, menyimpan token, dan menyimpan pengguna.
2. Token disimpan di `sessionStorage`, sehingga hilang saat tab ditutup.
3. `apiConfig` memasang token pada setiap permintaan.
4. Saat halaman dimuat ulang, `AuthProvider` memanggil `GET /auth/me`.
5. Jawaban `401` di luar login menghapus token dan mengarahkan ke `/login`.

## Variabel lingkungan

`VITE_API_URL` berisi alamat API, contoh di `.env.example`. Nilai berawalan `VITE_` terbaca di browser, jadi jangan menyimpan rahasia di sini.
