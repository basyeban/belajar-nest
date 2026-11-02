# 🐷 CelenganKu (Aplikasi Celengan & Tabungan)

CelenganKu adalah aplikasi manajemen tabungan pribadi berbasis web yang membantu pengguna menetapkan target impian (*financial goals*), memantau kemajuan menabung secara *real-time*, serta mencatat riwayat transaksi setoran dan penarikan dana secara transparan.

---

## 🏗️ Arsitektur Teknologi

- **Frontend:** Next.js 14 (React, Tailwind CSS, Lucide Icons)
- **Backend:** Nest.js 12 (Express, TypeScript ESM, Validation Pipe, REST API)
- **Database:** Firebase Realtime Database (sinkronisasi data instan & konsisten)

---

## 📁 Struktur Direktori

```
d:\belajar-nest/
├── src/                          # Nest.js Backend API
│   ├── firebase/                 # Firebase Service & Fallback Storage
│   │   ├── firebase.module.ts
│   │   ├── firebase.service.ts
│   │   └── firebase.types.ts
│   ├── goals/                    # Manajemen Target Tabungan
│   │   ├── dto/create-goal.dto.ts
│   │   ├── goals.controller.ts
│   │   ├── goals.service.ts
│   │   └── goals.module.ts
│   ├── transactions/             # Pencatatan Transaksi (Menabung/Tarik)
│   │   ├── dto/create-transaction.dto.ts
│   │   ├── transactions.controller.ts
│   │   ├── transactions.service.ts
│   │   └── transactions.module.ts
│   ├── dashboard/                # Ringkasan Statistik
│   │   ├── dashboard.controller.ts
│   │   └── dashboard.module.ts
│   ├── app.module.ts
│   └── main.ts                   # Entry point backend (port 4000)
│
├── frontend/                     # Next.js 14 Frontend UI
│   ├── app/                      # Next.js App Router
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx              # Halaman Utama Dasbor CelenganKu
│   ├── components/               # Komponen UI
│   │   ├── Header.tsx            # Navbar & Realtime indicator
│   │   ├── SummaryCards.tsx      # 4 Kartu Statistik (Feature C)
│   │   ├── GoalCard.tsx          # Kartu Target & Progress Bar (Feature A)
│   │   ├── AddGoalModal.tsx      # Modal Tambah Target
│   │   ├── TransactionModal.tsx  # Modal Setor & Tarik Dana (Feature B)
│   │   ├── TransactionHistory.tsx# Riwayat Mutasi Lengkap
│   │   └── EmptyState.tsx
│   ├── lib/
│   │   ├── api.ts                # Client API connector
│   │   ├── types.ts              # Interface & format rupiah
│   │   └── firebase.ts
│   └── package.json
│
├── .env.example                  # Template env backend
├── .env                          # Konfigurasi aktif backend
└── package.json                  # Root Nest.js dependencies
```

---

## ⚡ Cara Menjalankan Aplikasi

### 1. Menjalankan Backend (Nest.js)

Buka terminal pada root direktori:

```bash
# 1. Install dependensi
npm install

# 2. Jalankan server Nest.js (berjalan di http://localhost:4000)
npm run start:dev
```

> **Catatan Mode Standalone:** Backend dilengkapi fitur penyimpanan in-memory otomatis dengan data demo jika `FIREBASE_DATABASE_URL` belum diisi. Begitu Anda memasukkan URL Firebase di `.env`, backend akan langsung tersambung ke Firebase Realtime Database.

---

### 2. Menjalankan Frontend (Next.js)

Buka terminal baru dan masuk ke folder `frontend`:

```bash
cd frontend

# 1. Install dependensi frontend
npm install

# 2. Jalankan Next.js development server (berjalan di http://localhost:3000)
npm run dev
```

Buka browser di **[http://localhost:3000](http://localhost:3000)**.

---

## 📡 Spesifikasi Endpoint Backend (REST API)

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Login akun (validasi password polos tanpa hash) |
| `POST` | `/api/auth/register` | Mendaftarkan akun baru |
| `GET` | `/api/auth/me` | Mengambil data profil user yang login |
| `GET` | `/api/dashboard/stats` | Mengambil 4 data statistik ringkasan dasbor |
| `POST` | `/api/dashboard/reset` | Mengosongkan data celengan dan mutasi akun |
| `GET` | `/api/goals` | Mengambil daftar seluruh target tabungan |
| `POST` | `/api/goals` | Membuat target tabungan baru |
| `GET` | `/api/goals/:id` | Mengambil detail target tabungan |
| `PUT` | `/api/goals/:id` | Memperbarui/edit target tabungan (nama, nominal, deadline, dll.) |
| `DELETE` | `/api/goals/:id` | Menghapus target tabungan & riwayat transaksi terkait (*cascade*) |
| `GET` | `/api/transactions` | Mengambil riwayat seluruh transaksi |
| `POST` | `/api/transactions` | Menambah transaksi menabung atau penarikan dana |

---

## 🛡️ Aturan Keamanan Firebase Realtime Database (Rules)

Salin aturan berikut ke menu **Database Rules** di Firebase Console:

```json
{
  "rules": {
    "users": {
      "$userId": {
        ".read": true,
        ".write": true,
        "goals": {
          ".indexOn": ["category", "createdAt"]
        },
        "transactions": {
          ".indexOn": ["goalId", "date"]
        }
      }
    }
  }
}
```
