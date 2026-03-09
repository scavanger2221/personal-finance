<?php

namespace App\Http\Controllers;

use App\Services\Dashboard\DashboardSummaryService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        protected DashboardSummaryService $summaryService
    ) {}

    /**
     * Display the dashboard.
     */
    public function index(): Response
    {
        $summary = $this->summaryService->getSummary(Auth::user());

        return Inertia::render('Dashboard', [
            'summary' => $summary,
        ]);
    }
}
