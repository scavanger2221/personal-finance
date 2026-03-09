<?php

namespace App\Services\Reports\Contracts;

use App\Services\Reports\TransactionReportData;
use Illuminate\Support\Carbon;

interface ReportExporterInterface
{
    /**
     * Export the report data.
     */
    public function export(TransactionReportData $reportData): mixed;

    /**
     * Get the suggested file name for the export.
     */
    public function fileName(TransactionReportData $reportData): string;

    /**
     * Get the content type for the export response.
     */
    public function contentType(): string;
}
