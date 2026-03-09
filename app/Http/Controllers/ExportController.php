<?php

namespace App\Http\Controllers;

use App\Http\Requests\ExportTransactionsRequest;
use App\Services\Reports\CsvReportExporter;
use App\Services\Reports\PdfReportExporter;
use App\Services\Reports\TransactionReportService;
use Illuminate\Http\Response;
use Illuminate\Support\Carbon;

class ExportController extends Controller
{
    public function __construct(
        protected TransactionReportService $reportService
    ) {}

    /**
     * Export transactions in requested format.
     */
    public function export(ExportTransactionsRequest $request)
    {
        $reportData = $this->reportService->getReportData(
            $request->user(),
            $request->from_date,
            $request->to_date
        );

        $exporter = match ($request->format) {
            'pdf' => new PdfReportExporter(),
            'csv' => new CsvReportExporter(),
        };

        $content = $exporter->export($reportData);
        $fileName = $exporter->fileName($reportData);

        return response()->streamDownload(function () use ($content) {
            echo $content;
        }, $fileName, [
            'Content-Type' => $exporter->contentType(),
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
        ]);
    }
}
