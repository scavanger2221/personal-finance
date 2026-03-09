<?php

namespace App\Services\Reports;

use App\Enums\CategoryType;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Collection;

class TransactionReportService
{
    /**
     * Generate transaction report data for a user.
     */
    public function getReportData(User $user, ?string $fromDate = null, ?string $toDate = null): TransactionReportData
    {
        $transactions = Transaction::forUser($user->id)
            ->with('category')
            ->inDateRange($fromDate, $toDate)
            ->latestFirst()
            ->get();

        $totalIncome = $this->calculateTotal($transactions, CategoryType::INCOME);
        $totalExpense = $this->calculateTotal($transactions, CategoryType::EXPENSE);
        $netBalance = $totalIncome - $totalExpense;

        return new TransactionReportData(
            transactions: $transactions,
            totalIncome: $totalIncome,
            totalExpense: $totalExpense,
            netBalance: $netBalance,
            fromDate: $fromDate,
            toDate: $toDate,
        );
    }

    /**
     * Calculate total for a specific category type.
     *
     * @param Collection<Transaction> $transactions
     */
    private function calculateTotal(Collection $transactions, CategoryType $type): float
    {
        return (float) $transactions
            ->filter(fn (Transaction $t) => $t->category->type === $type)
            ->sum('amount');
    }
}
