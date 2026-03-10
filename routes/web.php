<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportArchiveController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('categories', CategoryController::class)->except(['create', 'edit', 'show']);

    Route::resource('transactions', TransactionController::class)->except(['create', 'edit', 'show']);

    Route::get('exports', [ExportController::class, 'export'])
        ->name('exports.transactions')
        ->middleware('throttle:exports');

    Route::controller(ReportArchiveController::class)
        ->prefix('reports')
        ->group(function () {
            Route::get('/', 'index')->name('reports.index');
            Route::get('/{reportArchive}/download', 'download')->name('reports.download');
            Route::delete('/{reportArchive}', 'destroy')->name('reports.destroy');
        });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/profile/picture', [ProfileController::class, 'updateProfilePicture'])->name('profile.picture.update');
    Route::delete('/profile/picture', [ProfileController::class, 'deleteProfilePicture'])->name('profile.picture.delete');
});

require __DIR__.'/auth.php';
