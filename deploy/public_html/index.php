<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

/*
|--------------------------------------------------------------------------
| Lokasi aplikasi Laravel (backend)
|--------------------------------------------------------------------------
| Default: repo AvaStudio di-clone ke folder "ava" di home directory cPanel,
| sehingga docroot (~/public_html) berada SATU LEVEL di bawah home.
|
| Jika struktur hosting kamu berbeda, ubah baris $appBase di bawah.
| Contoh untuk addon domain di ~/domains/domain.com/public_html:
|   $appBase = __DIR__ . '/../ava/backend';
*/
$appBase = dirname(__DIR__) . '/ava/backend';

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
