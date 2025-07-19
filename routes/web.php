<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\MailController;
use App\Http\Controllers\ThreadController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ImageUploadController;
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

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    Route::resource('staff', StaffController::class);
    
    Route::resource('mail', MailController::class)->except(['edit', 'update', 'destroy']);
    Route::get('/mail/users', [MailController::class, 'users'])->name('mail.users');
    
    Route::resource('threads', ThreadController::class);
    Route::post('threads/{thread}/favorite', [ThreadController::class, 'toggleFavorite'])->name('threads.favorite');
    Route::post('threads/{thread}/comments', [CommentController::class, 'store'])->name('comments.store');
    Route::patch('comments/{comment}', [CommentController::class, 'update'])->name('comments.update');
    Route::delete('comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');
    
    Route::post('upload/avatar/{user?}', [ImageUploadController::class, 'uploadAvatar'])->name('upload.avatar');
    Route::delete('upload/avatar/{user?}', [ImageUploadController::class, 'deleteAvatar'])->name('upload.avatar.delete');
});

require __DIR__.'/auth.php';
