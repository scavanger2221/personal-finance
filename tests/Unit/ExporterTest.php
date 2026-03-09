<?php

namespace Tests\Unit;

use App\Models\Transaction;
use App\Services\Reports\CsvReportExporter;
use App\Services\Reports\PdfReportExporter;
use App\Services\Reports\TransactionReportData;
use Illuminate\Support\Collection;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class ExporterTest extends TestCase
{
    private function getMockReportData(): TransactionReportData
    {
        return new TransactionReportData(
            transactions: new Collection(),
            totalIncome: 1000.00,
            totalExpense: 500.00,
            netBalance: 500.00
        );
    }

    public function test_csv_exporter_returns_correct_metadata(): void
    {
        $exporter = new CsvReportExporter();
        $this->assertEquals('text/csv', $exporter->contentType());
        $this->assertStringContainsString('.csv', $exporter->fileName($this->getMockReportData()));
    }

    public function test_csv_exporter_produces_content(): void
    {
        $exporter = new CsvReportExporter();
        $content = $exporter->export($this->getMockReportData());
        $this->assertNotEmpty($content);
        $this->assertStringContainsString('Laporan Transaksi', $content);
        $this->assertStringContainsString('1,000.00', $content);
    }

    public function test_pdf_exporter_returns_correct_metadata(): void
    {
        $exporter = new PdfReportExporter();
        $this->assertEquals('application/pdf', $exporter->contentType());
        $this->assertStringContainsString('.pdf', $exporter->fileName($this->getMockReportData()));
    }
}
