<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TransactionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('categories', CategoryController::class)->except(['create', 'edit', 'show']);
    
    Route::resource('transactions', TransactionController::class)->except(['create', 'edit', 'show']);
    Route::post('transactions', [TransactionController::class, 'store'])
        ->name('transactions.store')
        ->middleware('throttle:transactions');
    Route::put('transactions/{transaction}', [TransactionController::class, 'update'])
        ->name('transactions.update')
        ->middleware('throttle:transactions');

    Route::get('exports', [ExportController::class, 'export'])
        ->name('exports.transactions')
        ->middleware('throttle:exports');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
