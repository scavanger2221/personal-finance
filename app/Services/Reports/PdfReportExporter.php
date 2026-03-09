<?php

namespace App\Services\Reports;

use App\Services\Reports\Abstracts\AbstractReportExporter;
use Barryvdh\DomPDF\Facade\Pdf;

class PdfReportExporter extends AbstractReportExporter
{
    /**
     * Export the report data to PDF.
     */
    public function export(TransactionReportData $reportData): string
    {
        return Pdf::loadView('exports.transactions', ['reportData' => $reportData])
            ->output();
    }

    /**
     * Get the content type for the export response.
     */
    public function contentType(): string
    {
        return 'application/pdf';
    }

    /**
     * Get the file extension for this exporter.
     */
    protected function extension(): string
    {
        return 'pdf';
    }
}
