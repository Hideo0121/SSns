<?php

require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\DB;

$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== Users with avatar_photo ===\n";
$users = DB::table('users')
    ->select('id', 'name', 'avatar_photo')
    ->whereNotNull('avatar_photo')
    ->get();

foreach ($users as $user) {
    echo "ID: {$user->id}, Name: {$user->name}, Avatar: {$user->avatar_photo}\n";
}

echo "\n=== All users ===\n";
$allUsers = DB::table('users')
    ->select('id', 'name', 'avatar_photo')
    ->get();

foreach ($allUsers as $user) {
    $avatar = $user->avatar_photo ?? 'NULL';
    echo "ID: {$user->id}, Name: {$user->name}, Avatar: {$avatar}\n";
}
