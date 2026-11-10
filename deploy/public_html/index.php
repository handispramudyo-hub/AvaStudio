<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

/*
|--------------------------------------------------------------------------
| Lokasi aplikasi Laravel (backend)
|--------------------------------------------------------------------------
| Entry point ini ada di document root, sedangkan kode Laravel berada di
| luar docroot (disarankan, lebih aman). Karena struktur tiap hosting bisa
| berbeda, lokasinya dideteksi otomatis dari beberapa kandidat berikut.
|
| Kandidat 1: docroot = ~/public_html/domain.com   → backend di ~/ava/backend
| Kandidat 2: docroot = ~/public_html/sub.domain   → backend di ~/ava/backend
| Kandidat 3: backend di samping docroot           → <docroot>/../backend
| Kandidat 4: backend di dalam docroot             → <docroot>/backend
|
| Kalau struktur kamu lain lagi, cukup tambahkan path-nya di array ini.
*/
$candidates = [
    dirname(__DIR__) . '/ava/backend',
    __DIR__ . '/../../ava/backend',
    dirname(__DIR__) . '/backend',
    __DIR__ . '/backend',
];

$appBase = null;
foreach ($candidates as $candidate) {
    if (is_file($candidate . '/vendor/autoload.php')) {
        $appBase = $candidate;
        break;
    }
}

if (! $appBase) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    echo "Backend Laravel tidak ditemukan.\n";
    echo "Sudah dicek:\n- " . implode("\n- ", $candidates) . "\n";
    exit(1);
}

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = $appBase . '/storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require $appBase . '/vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once $appBase . '/bootstrap/app.php';

$app->handleRequest(Request::capture());
