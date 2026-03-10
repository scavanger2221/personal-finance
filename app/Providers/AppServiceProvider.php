<?php

namespace App\Providers;

use App\Models\ReportArchive;
use App\Policies\ReportArchivePolicy;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        if (! $this->app->isProduction()) {
            Model::preventLazyLoading();
            Model::preventSilentlyDiscardingAttributes();
        }

        // Configure rate limiter for exports
        RateLimiter::for('exports', function () {
            return Limit::perMinute(10)->by(auth()->id() ?: request()->ip());
        });

        Gate::policy(ReportArchive::class, ReportArchivePolicy::class);
    }
}
