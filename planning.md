# Planning Pembuatan Web Sosial Minimal (Seperti Facebook Sederhana)

## Pendahuluan
Proyek ini bertujuan untuk membuat aplikasi web sosial sederhana dengan fitur minimal, mirip Facebook namun tidak sekompleks. Fokus pada performa tinggi, teknologi ringan, dan kemudahan deployment menggunakan ngrok untuk akses publik.

## Fitur Minimal
- **Autentikasi**: Login dan signup sederhana
- **Posting**: Buat dan tampilkan postingan teks
- **Timeline**: Lihat postingan dari semua pengguna
- **Interaksi Dasar**: Like pada postingan
- **Profil**: Halaman profil sederhana

## Teknologi Stack
- **Frontend**: SvelteKit (ringan, cepat, SSR/SSG)
- **Backend**: SvelteKit API routes (Node.js based)
- **Database**: SQLite (ringan, file-based)
- **Styling**: Tailwind CSS (minimal dan cepat)
- **Deployment**: ngrok untuk tunneling lokal ke publik

## Arsitektur Aplikasi
- **Frontend**: SvelteKit untuk UI dan routing
- **Backend**: API routes di SvelteKit untuk handling request
- **Database**: SQLite untuk penyimpanan data lokal
- **Authentication**: Session-based atau JWT sederhana

## Langkah Implementasi
1. Setup proyek SvelteKit
2. Implementasi autentikasi
3. Buat schema database dan model
4. Implementasi fitur posting
5. Implementasi timeline dan like
6. Styling dengan Tailwind
7. Testing dan optimasi
8. Integrasi ngrok untuk akses publik

## Urutan Pembuatan Detail
### 1. Setup Proyek SvelteKit
- Install Node.js (versi terbaru LTS)
- Buat proyek baru: `npm create svelte@latest my-social-app`
- Pilih template: Skeleton project
- Install dependencies: `npm install`
- Tambahkan Tailwind CSS: `npm install -D tailwindcss postcss autoprefixer`
- Setup Tailwind: `npx tailwindcss init -p`
- Konfigurasi Tailwind di `app.css` dan `tailwind.config.js`

### 2. Setup Database SQLite
- Install sqlite3: `npm install sqlite3`
- Buat file `db.js` untuk koneksi database
- Buat schema tabel: users, posts, likes
- Buat fungsi helper untuk query database

### 3. Implementasi Autentikasi
- Buat halaman login dan signup
- Install bcryptjs: `npm install bcryptjs`
- Buat API routes untuk register dan login
- Implementasi session atau JWT untuk autentikasi
- Buat middleware untuk proteksi route

### 4. Fitur Posting
- Buat form untuk posting teks
- Buat API route `/api/posts` untuk create dan get posts
- Tampilkan posts di halaman utama
- Validasi input posting

### 5. Timeline dan Like
- Buat halaman timeline untuk semua posts
- Implementasi like button dengan API `/api/likes`
- Update UI secara real-time (opsional dengan Svelte stores)

### 6. Profil Pengguna
- Buat halaman profil sederhana
- Tampilkan posts pengguna
- Edit profil dasar

### 7. Styling dan UI
- Terapkan Tailwind classes untuk responsive design
- Buat komponen reusable (Button, Card, dll.)
- Optimasi untuk mobile-first

### 8. Testing dan Optimasi
- Test manual untuk semua fitur
- Optimasi performa (lazy loading, dll.)
- Fix bugs dan edge cases

### 9. Integrasi ngrok
- Install ngrok dari situs resmi
- Jalankan app: `npm run dev`
- Expose port: `ngrok http 5173` (atau port SvelteKit)
- Bagikan URL untuk testing publik

## Integrasi ngrok
- Install ngrok
- Jalankan aplikasi di localhost
- Gunakan `ngrok http 3000` untuk expose port 3000
- Bagikan URL ngrok untuk akses publik

## Timeline Estimasi
- Minggu 1: Setup dan autentikasi
- Minggu 2: Database dan posting
- Minggu 3: Timeline dan interaksi
- Minggu 4: Styling dan testing

## Dependencies Utama
- sveltekit
- sqlite3
- tailwindcss
- bcryptjs (untuk password hashing)
- jsonwebtoken (opsional untuk JWT)

## Catatan
- Prioritas performa dan kemudahan maintenance
- Scalability minimal karena fitur sederhana
- Fokus pada UX yang smooth dengan SvelteKit