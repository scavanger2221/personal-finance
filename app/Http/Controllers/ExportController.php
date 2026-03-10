<?php

namespace App\Http\Controllers;

use App\Http\Requests\ExportTransactionsRequest;
use App\Models\ReportArchive;
use App\Models\User;
use App\Services\Reports\CsvReportExporter;
use App\Services\Reports\PdfReportExporter;
use App\Services\Reports\TransactionReportService;
use Illuminate\Support\Facades\Storage;
use Throwable;

class ExportController extends Controller
{
    public function __construct(
        protected TransactionReportService $reportService,
    ) {}

    /**
     * Export transactions in requested format.
     */
    public function export(ExportTransactionsRequest $request)
    {
        $reportData = $this->reportService->getReportData(
            $request->user(),
            $request->from_date,
            $request->to_date,
        );

        $exporter = match ($request->format) {
            "pdf" => new PdfReportExporter(),
            "csv" => new CsvReportExporter(),
        };

        $content = $exporter->export($reportData);
        $fileName = $exporter->fileName($reportData);

        $storagePath = $this->storeArchive(
            user: $request->user(),
            format: $request->format,
            fileName: $fileName,
            content: $content,
            fromDate: $request->from_date,
            toDate: $request->to_date,
        );

        return response()->streamDownload(
            function () use ($content) {
                echo $content;
            },
            $fileName,
            [
                "Content-Type" => $exporter->contentType(),
                "Content-Disposition" =>
                    'attachment; filename="' . $fileName . '"',
            ],
        );
    }

    private function storeArchive(
        User $user,
        string $format,
        string $fileName,
        string $content,
        ?string $fromDate,
        ?string $toDate,
    ): string {
        $disk = Storage::disk("local");
        $directory = "reports/{$user->id}";
        $path = $directory . "/" . $fileName;

        $disk->put($path, $content);

        try {
            ReportArchive::create([
                "user_id" => $user->id,
                "format" => $format,
                "file_name" => $fileName,
                "storage_path" => $path,
                "from_date" => $fromDate,
                "to_date" => $toDate,
                "file_size" => strlen($content),
            ]);
        } catch (Throwable $e) {
            $disk->delete($path);
            throw $e;
        }

        return $path;
    }
}
