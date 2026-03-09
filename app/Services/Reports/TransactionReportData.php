<?php

namespace App\Services\Reports;

use Illuminate\Support\Collection;

class TransactionReportData
{
    /**
     * @param Collection<\App\Models\Transaction> $transactions
     */
    public function __construct(
        public readonly Collection $transactions,
        public readonly float $totalIncome,
        public readonly float $totalExpense,
        public readonly float $netBalance,
        public readonly ?string $fromDate = null,
        public readonly ?string $toDate = null,
    ) {}
}
