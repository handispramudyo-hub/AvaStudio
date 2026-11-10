# Deploy AvaStudio ke Rumahweb (cPanel Shared Hosting)

Panduan ini menjelaskan cara men-deploy **AvaStudio** (frontend React + API Laravel) ke
hosting Rumahweb berbasis cPanel, dalam **satu domain** dengan struktur:

```
~/ava/                      → seluruh kode Laravel (backend), di LUAR docroot
~/public_html/              → document root domain
  ├─ index.html             → hasil build frontend (SPA)
  ├─ assets/                → hasil build frontend
  ├─ favicon.png, robots.txt
  ├─ index.php              → entry point Laravel (dari deploy/public_html/)
  ├─ .htaccess              → routing /api → Laravel, sisanya → SPA
  └─ storage/               → symlink ke ~/ava/backend/storage/app/public
```

> **Prasyarat**: PHP **8.2+** aktif di cPanel (MultiPHP Manager), database MySQL sudah
> dibuat, dan SSH aktif. Laravel 12 tidak jalan di PHP 8.1 ke bawah.

---

## 1. Persiapan di lokal (komputer kamu)

```powershell
# Build frontend production → folder dist/
npm run build

# Paketkan hasil build agar mudah diunggah
tar -czf ava-web.tar.gz -C dist .
```

Yang perlu diunggah ke server nanti:

| File lokal            | Tujuan di server          |
| --------------------- | ------------------------- |
| `ava-web.tar.gz`      | isi `~/public_html/`      |
| `deploy/public_html/index.php` | `~/public_html/index.php` |
| `deploy/public_html/.htaccess` | `~/public_html/.htaccess` |

---

## 2. Ambil kode backend di server (via SSH)

```bash
cd ~
git clone https://github.com/handispramudyo-hub/AvaStudio.git ava
cd ~/ava/backend

# Install dependency production
composer install --no-dev --optimize-autoloader --no-interaction

# Salin template environment
cp .env.example .env
```

Jika `composer` belum tersedia di server:

```bash
cd ~
curl -sS https://getcomposer.org/installer | php
# lalu pakai: php ~/composer.phar install --no-dev --optimize-autoloader
```

---

## 3. Konfigurasi `.env`

Edit `~/ava/backend/.env` (`nano .env`) dan isi:

```env
APP_URL=https://domain-kamu.com
FRONTEND_URL=https://domain-kamu.com

DB_DATABASE=nama_db_cpanel
DB_USERNAME=user_db_cpanel
DB_PASSWORD=password_db_cpanel
```

Buat database + user di **cPanel → MySQL Databases** (user diberi ALL PRIVILEGES).

Lalu jalankan:

```bash
cd ~/ava/backend
php artisan key:generate
php artisan migrate --force --seed
```

Perintah `--seed` membuat akun admin default:

```
email    : admin@avastudio.id
password : AdminAvaStudio2026!
```

> **Segera ganti password admin** setelah login pertama kali.

---

## 4. Pasang frontend + entry Laravel ke `public_html`

Dari lokal:

```powershell
# Upload paket build
pscp ava-web.tar.gz USERNAME@HOST:~/ava-web.tar.gz

# Upload entry Laravel + .htaccess (jika belum ada di public_html)
pscp deploy/public_html/index.php USERNAME@HOST:~/public_html/index.php
pscp deploy/public_html/.htaccess USERNAME@HOST:~/public_html/.htaccess
```

Di server:

```bash
tar -xzf ~/ava-web.tar.gz -C ~/public_html
rm ~/ava-web.tar.gz
```

---

## 5. Symlink storage (gambar upload)

```bash
ln -sfn ~/ava/backend/storage/app/public ~/public_html/storage
```

Ini membuat gambar avatar/logo yang di-upload admin bisa diakses lewat
`https://domain-kamu.com/storage/...`.

---

## 6. Permission

```bash
cd ~/ava/backend
chmod -R 775 storage bootstrap/cache
```

---

## 7. Verifikasi

Buka di browser:

- `https://domain-kamu.com/` → katalog tampil
- `https://domain-kamu.com/catalog` → halaman katalog
- `https://domain-kamu.com/admin/login` → halaman login admin
- `https://domain-kamu.com/api/settings/public` → JSON `{"success":true,...}`

Jika `/api/...` error 500: cek `~/ava/backend/storage/logs/laravel.log`.

---

## 8. Cara update (redeploy) di kemudian hari

```bash
# di server
cd ~/ava
git pull
cd backend
composer install --no-dev --optimize-autoloader --no-interaction
php artisan migrate --force
php artisan optimize:clear
php artisan optimize
```

Frontend: ulangi `npm run build` di lokal lalu unggah ulang isi `dist/` ke `~/public_html/`.

---

## Troubleshooting

| Masalah | Solusi |
| --- | --- |
| 500 di semua halaman | Cek `storage/logs/laravel.log`; pastikan `chmod -R 775 storage bootstrap/cache` |
| `/api` 404 | Pastikan `~/public_html/.htaccess` ter-upload (file titik sering tersembunyi di File Manager) |
| Gambar tidak muncul | Symlink storage belum dibuat, atau `FILESYSTEM_DISK` bukan `public` |
| Halaman selain `/` blank | `.htaccess` SPA fallback tidak jalan — pastikan `mod_rewrite` aktif |
| "Vite manifest not found" | Tidak relevan untuk deploy ini; Laravel hanya dipakai sebagai API |
| 403 saat buka `/storage/...` | Aktifkan symlink follow (`Options +FollowSymLinks`) atau buat symlink dengan `ln -sfn` |
| PHP versi salah | cPanel → MultiPHP Manager → pilih PHP 8.2+ untuk domain |
