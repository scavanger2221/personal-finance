<?php

namespace App\Services\Reports\Abstracts;

use App\Services\Reports\Contracts\ReportExporterInterface;
use App\Services\Reports\TransactionReportData;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

abstract class AbstractReportExporter implements ReportExporterInterface
{
    /**
     * Get the suggested file name for the export.
     */
    public function fileName(TransactionReportData $reportData): string
    {
        $dateStr = now()->format('Y_m_d_His');
        $randomSuffix = Str::lower(Str::random(5));

        return sprintf(
            'laporan-%s-%s-%s.%s',
            $this->extension(),
            $dateStr,
            $randomSuffix,
            $this->extension()
        );
    }

    /**
     * Get the file extension for this exporter.
     */
    abstract protected function extension(): string;

    /**
     * Format a currency value.
     */
    protected function formatCurrency(float $value): string
    {
        return number_format($value, 2);
    }

    /**
     * Format a date for the report.
     */
    protected function formatDate(Carbon $date): string
    {
        return $date->format('Y-m-d');
    }
}
