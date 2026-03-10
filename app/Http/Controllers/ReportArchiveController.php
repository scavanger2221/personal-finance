<?php

namespace App\Http\Controllers;

use App\Models\ReportArchive;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ReportArchiveController extends Controller
{
    public function index(): Response
    {
        $query = Auth::user()->reportArchives()
            ->latest('created_at');

        if (request()->has('search') && request()->search) {
            $search = request()->search;

            $query->where(function ($builder) use ($search) {
                $builder->where('file_name', 'ilike', "%{$search}%")
                    ->orWhere('format', 'ilike', "%{$search}%");
            });
        }

        $archives = $query
            ->get()
            ->map(fn (ReportArchive $archive) => [
                'id' => $archive->id,
                'file_name' => $archive->file_name,
                'format' => Str::upper($archive->format),
                'period' => $this->formatPeriod($archive->from_date, $archive->to_date),
                'file_size' => $archive->file_size,
                'created_at' => $archive->created_at->toDateTimeString(),
            ]);

        return Inertia::render('Reports/Index', [
            'archives' => $archives,
            'filters' => request()->only(['search']),
        ]);
    }

    public function download(ReportArchive $reportArchive)
    {
        $this->authorize('view', $reportArchive);

        $disk = Storage::disk('local');

        if (! $disk->exists($reportArchive->storage_path)) {
            return Redirect::route('reports.index')->with('error', 'File arsip tidak ditemukan.');
        }

        return $disk->download($reportArchive->storage_path, $reportArchive->file_name);
    }

    public function destroy(ReportArchive $reportArchive): RedirectResponse
    {
        $this->authorize('delete', $reportArchive);

        $disk = Storage::disk('local');

        if ($disk->exists($reportArchive->storage_path)) {
            $disk->delete($reportArchive->storage_path);
        }

        $reportArchive->delete();

        return Redirect::route('reports.index')->with('success', 'Arsip laporan berhasil dihapus.');
    }

    private function formatPeriod(?Carbon $from, ?Carbon $to): string
    {
        if ($from && $to) {
            return $from->format('Y-m-d').' sampai '.$to->format('Y-m-d');
        }

        if ($from) {
            return 'Mulai '.$from->format('Y-m-d');
        }

        if ($to) {
            return 'Sampai '.$to->format('Y-m-d');
        }

        return 'Semua periode';
    }
}
