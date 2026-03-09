<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        if (env('APP_ENV') === 'testing' || (defined('PHPUNIT_COMPOSER_INSTALL') || defined('__PHPUNIT_PHAR__'))) {
            $middleware->validateCsrfTokens(except: ['*']);
        }
    })
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        using: function () {
            \Illuminate\Support\Facades\Route::middleware('web')
                ->group(base_path('routes/web.php'));

            \Illuminate\Support\Facades\RateLimiter::for('transactions', function (\Illuminate\Http\Request $request) {
                return \Illuminate\Cache\RateLimiting\Limit::perMinute(30)->by($request->user()?->id ?: $request->ip());
            });

            \Illuminate\Support\Facades\RateLimiter::for('exports', function (\Illuminate\Http\Request $request) {
                return \Illuminate\Cache\RateLimiting\Limit::perMinute(10)->by($request->user()?->id ?: $request->ip());
            });
        },
    )
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
