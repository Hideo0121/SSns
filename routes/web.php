<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\MailController;
use App\Http\Controllers\ThreadController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ImageUploadController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\FileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    // Clear any cached authentication state
    if (!auth()->check() || !auth()->user()) {
        auth()->logout();
        session()->flush();
        return redirect()->route('login');
    }
    return redirect()->route('staff.index');
});

// テスト用シンプルルート（認証なし）
Route::get('/mail/test-simple', function() {
    return response()->json(['message' => 'Test route works!']);
})->name('mail.test.simple');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    Route::resource('staff', StaffController::class);
    
    // テスト用シンプルルート
    Route::get('/mail/test', function() {
        return Inertia::render('Mail/Create', [
            'availableUsers' => [],
            'filters' => [],
            'selectedStaffIds' => []
        ]);
    })->name('mail.test');
    
    Route::resource('mail', MailController::class)->except(['edit', 'update', 'destroy']);
    Route::get('/mail/users', [MailController::class, 'users'])->name('mail.users');
    
    // 監査ログ（管理者のみ）
    Route::get('/audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');
    Route::get('/audit-logs/export', [AuditLogController::class, 'export'])->name('audit-logs.export');
    Route::get('/audit-logs/{id}', [AuditLogController::class, 'show'])->name('audit-logs.show');
    
    Route::resource('threads', ThreadController::class);
    Route::post('threads/{thread}/favorite', [ThreadController::class, 'toggleFavorite'])->name('threads.favorite');
    Route::post('threads/{thread}/comments', [CommentController::class, 'store'])->name('comments.store');
    Route::patch('comments/{comment}', [CommentController::class, 'update'])->name('comments.update');
    Route::delete('comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');
    
    Route::post('upload/avatar/{user?}', [ImageUploadController::class, 'uploadAvatar'])->name('upload.avatar');
    Route::delete('upload/avatar/{user?}', [ImageUploadController::class, 'deleteAvatar'])->name('upload.avatar.delete');
    
    // 画像表示用ルート
    Route::get('storage/avatars/{filename}', [FileController::class, 'showAvatar'])->name('avatar.show');
    
    // 監査ログ - 管理者のみアクセス可能
    Route::middleware('admin')->group(function () {
        Route::get('audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');
        Route::get('audit-logs/export', [AuditLogController::class, 'export'])->name('audit-logs.export');
        Route::get('audit-logs/{id}', [AuditLogController::class, 'show'])->name('audit-logs.show');
    });
});

require __DIR__.'/auth.php';
