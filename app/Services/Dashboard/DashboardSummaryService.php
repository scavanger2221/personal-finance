<?php

namespace App\Services\Dashboard;

use App\Enums\CategoryType;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class DashboardSummaryService
{
    /**
     * Get dashboard summary data for a user.
     */
    public function getSummary(User $user): DashboardSummaryData
    {
        $transactions = Transaction::forUser($user->id)
            ->with('category')
            ->latestFirst()
            ->get();

        $totalIncome = (float) $transactions
            ->filter(fn (Transaction $t) => $t->category->type === CategoryType::INCOME)
            ->sum('amount');

        $totalExpense = (float) $transactions
            ->filter(fn (Transaction $t) => $t->category->type === CategoryType::EXPENSE)
            ->sum('amount');

        $categoryBreakdown = Transaction::forUser($user->id)
            ->join('categories', 'transactions.category_id', '=', 'categories.id')
            ->select('categories.name', DB::raw('SUM(transactions.amount) as value'))
            ->groupBy('categories.name')
            ->get()
            ->map(fn($item) => [
                'name' => $item->name,
                'value' => (float) $item->value
            ]);

        $recentTransactions = $transactions->take(10)->values();

        // Calculate monthly trends (last 6 months)
        $sixMonthsAgo = now()->subMonths(5)->startOfMonth();
        $monthlyTrends = $transactions
            ->where('transaction_date', '>=', $sixMonthsAgo)
            ->groupBy(function ($t) {
                return \Carbon\Carbon::parse($t->transaction_date)->format('M Y');
            })
            ->map(function ($group, $month) {
                $income = $group->filter(fn($t) => $t->category->type === CategoryType::INCOME)->sum('amount');
                $expense = $group->filter(fn($t) => $t->category->type === CategoryType::EXPENSE)->sum('amount');
                return [
                    'month' => $month,
                    'income' => (float) $income,
                    'expense' => (float) $expense,
                ];
            })
            ->values();

        // Sort by actual date to ensure correct order
        $monthlyTrends = $monthlyTrends->sortBy(function($item) {
            return \Carbon\Carbon::createFromFormat('M Y', $item['month'])->timestamp;
        })->values();

        return new DashboardSummaryData(
            totalIncome: $totalIncome,
            totalExpense: $totalExpense,
            netBalance: $totalIncome - $totalExpense,
            categoryBreakdown: $categoryBreakdown->values(),
            recentTransactions: $recentTransactions,
            monthlyTrends: $monthlyTrends,
        );
    }
}
