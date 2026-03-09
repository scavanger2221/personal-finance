<?php

namespace App\Services\Reports;

use App\Services\Reports\Abstracts\AbstractReportExporter;

class CsvReportExporter extends AbstractReportExporter
{
    /**
     * Export the report data to CSV.
     */
    public function export(TransactionReportData $reportData): string
    {
        $handle = fopen('php://temp', 'r+');

        // Add header info
        fputcsv($handle, ['Laporan Transaksi']);
        fputcsv($handle, ['Periode', ($reportData->fromDate ?? 'Semua') . ' sampai ' . ($reportData->toDate ?? 'Semua')]);
        fputcsv($handle, []);

        // Add summary
        fputcsv($handle, ['Ringkasan']);
        fputcsv($handle, ['Total Pendapatan', $this->formatCurrency($reportData->totalIncome)]);
        fputcsv($handle, ['Total Pengeluaran', $this->formatCurrency($reportData->totalExpense)]);
        fputcsv($handle, ['Saldo Bersih', $this->formatCurrency($reportData->netBalance)]);
        fputcsv($handle, []);

        // Add transactions
        fputcsv($handle, ['Tanggal', 'Kategori', 'Keterangan', 'Tipe', 'Jumlah']);

        foreach ($reportData->transactions as $transaction) {
            fputcsv($handle, [
                $this->formatDate($transaction->transaction_date),
                $transaction->category->name,
                $transaction->description,
                $transaction->category->type->value === 'income' ? 'Pendapatan' : 'Pengeluaran',
                $this->formatCurrency((float) $transaction->amount),
            ]);
        }

        rewind($handle);
        $content = stream_get_contents($handle);
        fclose($handle);

        return $content;
    }

    /**
     * Get the content type for the export response.
     */
    public function contentType(): string
    {
        return 'text/csv';
    }

    /**
     * Get the file extension for this exporter.
     */
    protected function extension(): string
    {
        return 'csv';
    }
}
