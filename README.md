# Personal Finance App

Aplikasi manajemen keuangan pribadi berbasis web dengan desain minimalis dan gelap. Dibuat dengan Laravel, React, dan Inertia.js untuk memberikan pengalaman pengguna yang cepat dan responsif.

Fitur utama aplikasi ini mencakup pencatatan transaksi pemasukan dan pengeluaran, pengelolaan kategori, visualisasi data keuangan melalui grafik dan laporan, serta kemampuan ekspor data ke format PDF dan CSV. Desain antarmuka mengusung filosofi minimalis dengan palet warna gelap tanpa gradient atau bayangan yang berlebihan.

## Fitur Utama

- Pencatatan transaksi pemasukan dan pengeluaran
- Manajemen kategori keuangan
- Dashboard dengan visualisasi grafik keuangan
- Laporan keuangan terperinci
- Ekspor data ke format PDF dan CSV
- Autentikasi pengguna
- Antarmuka minimalis dengan tema gelap
- Responsif untuk desktop dan mobile

## Teknologi yang Digunakan

- **Backend**: Laravel 12 (PHP 8.2+)
- **Frontend**: React 18 dengan Inertia.js
- **Styling**: Tailwind CSS 3
- **Database**: SQLite (default), PostgreSQL (container)
- **Container**: Docker/Podman support
- **Package Manager**: Composer, NPM

## Prasyarat

- PHP 8.2 atau lebih tinggi
- Composer
- Node.js 20 atau lebih tinggi
- NPM atau Yarn
- SQLite (untuk instalasi normal)
- Docker atau Podman (opsional, untuk container)
- Git

---

## Cara Instalasi

### Metode 1: Instalasi dengan PHP Normal

Ikuti langkah-langkah berikut untuk menjalankan aplikasi menggunakan PHP native di mesin lokal Anda.

#### 1. Clone Repository

```bash
git clone https://github.com/scavanger2221/personal-finance.git
cd personal-finance
```

#### 2. Install Dependensi PHP

```bash
composer install
```

#### 3. Konfigurasi Environment

```bash
cp .env.example .env
php artisan key:generate
```

#### 4. Setup Database

Aplikasi menggunakan SQLite sebagai database default. Pastikan file database dibuat:

```bash
touch database/database.sqlite
```

#### 5. Jalankan Migrasi Database

```bash
php artisan migrate
```

#### 6. Install Dependensi JavaScript

```bash
npm install
```

#### 7. Build Assets

Untuk development:
```bash
npm run dev
```

Untuk production:
```bash
npm run build
```

#### 8. Jalankan Aplikasi

```bash
php artisan serve
```

Aplikasi akan berjalan di `http://localhost:8000`

#### Menggunakan Script Setup (Cepat)

Anda juga dapat menggunakan script setup yang sudah disediakan:

```bash
composer run setup
```

Script ini akan otomatis menjalankan semua langkah instalasi di atas.

---

### Metode 2: Instalasi dengan Container (Docker/Podman)

Gunakan metode ini jika Anda ingin menjalankan aplikasi dalam lingkungan container yang terisolasi.

#### Prasyarat Container

- Docker Engine atau Podman
- Docker Compose (untuk Docker)
- Podman Compose (opsional, untuk Podman)

#### 1. Clone Repository

```bash
git clone https://github.com/scavanger2221/personal-finance.git
cd personal-finance
```

#### 2. Build dan Jalankan Container

**Menggunakan Docker:**

```bash
# Build image
docker build -t personal-finance .

# Jalankan container
docker run -d \
  --name personal-finance \
  -p 9000:9000 \
  -v $(pwd):/var/www \
  personal-finance
```

**Menggunakan Podman:**

```bash
# Build image
podman build -t personal-finance .

# Jalankan container
podman run -d \
  --name personal-finance \
  -p 9000:9000 \
  -v $(pwd):/var/www \
  personal-finance
```

#### 3. Setup Database dan Migrasi

Masuk ke dalam container dan jalankan migrasi:

**Docker:**
```bash
docker exec -it personal-finance bash
php artisan migrate
exit
```

**Podman:**
```bash
podman exec -it personal-finance bash
php artisan migrate
exit
```

#### 4. Akses Aplikasi

Aplikasi akan tersedia di `http://localhost:9000`

#### 5. Menghentikan Container

**Docker:**
```bash
docker stop personal-finance
docker rm personal-finance
```

**Podman:**
```bash
podman stop personal-finance
podman rm personal-finance
```

---

## Penggunaan

Setelah aplikasi berjalan, buka browser dan akses URL yang sesuai dengan metode instalasi yang Anda pilih:

- **PHP Normal**: `http://localhost:8000`
- **Container**: `http://localhost:9000`

### Langkah Awal

1. Daftarkan akun baru atau login jika sudah memiliki akun
2. Tambahkan kategori keuangan sesuai kebutuhan Anda
3. Mulai mencatat transaksi pemasukan dan pengeluaran
4. Lihat dashboard untuk melihat ringkasan keuangan
5. Gunakan fitur laporan untuk analisis lebih detail

## Pengembangan

### Perintah yang Berguna

```bash
# Jalankan development server
composer run dev

# Jalankan test
composer run test

# Format kode dengan Pint
./vendor/bin/pint

# Jalankan queue worker
php artisan queue:work

# Jalankan queue listener
php artisan queue:listen
```

### Struktur Proyek

```
personal-finance/
├── app/                 # Kode aplikasi Laravel
├── bootstrap/           # File bootstrap
├── config/              # Konfigurasi
├── database/            # Migrasi, seeder, dan factory
├── docker/              # File konfigurasi Docker
├── public/              # Entry point dan assets publik
├── resources/           # Views, React components, dan assets
├── routes/              # Definisi route
├── storage/             # Logs, cache, dan uploads
├── tests/               # Unit dan feature tests
├── .env.example         # Contoh konfigurasi environment
├── composer.json        # Dependensi PHP
├── Dockerfile           # Konfigurasi container
├── package.json         # Dependensi JavaScript
└── vite.config.js       # Konfigurasi Vite
```

## Kontribusi

Kontribusi sangat diterima! Jika Anda ingin berkontribusi:

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b fitur/fitur-baru`)
3. Commit perubahan Anda (`git commit -am 'Menambahkan fitur baru'`)
4. Push ke branch (`git push origin fitur/fitur-baru`)
5. Buat Pull Request

## Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

## Penulis

Dibuat dengan oleh [scavanger2221](https://github.com/scavanger2221)

---

## Dukungan

Jika Anda mengalami masalah atau memiliki pertanyaan, silakan buat issue di [GitHub Issues](https://github.com/scavanger2221/personal-finance/issues).
