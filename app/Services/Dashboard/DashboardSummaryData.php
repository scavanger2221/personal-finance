<?php

namespace App\Services\Dashboard;

use Illuminate\Support\Collection;

class DashboardSummaryData
{
    /**
     * @param Collection<array{name: string, value: float}> $categoryBreakdown
     * @param Collection<\App\Models\Transaction> $recentTransactions
     * @param Collection<array{month: string, income: float, expense: float}> $monthlyTrends
     */
    public function __construct(
        public readonly float $totalIncome,
        public readonly float $totalExpense,
        public readonly float $netBalance,
        public readonly Collection $categoryBreakdown,
        public readonly Collection $recentTransactions,
        public readonly Collection $monthlyTrends,
    ) {}
}
