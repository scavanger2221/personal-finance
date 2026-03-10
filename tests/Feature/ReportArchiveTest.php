<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\ReportArchive;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class ReportArchiveTest extends TestCase
{
    use RefreshDatabase;

    private function createTransaction(User $user): void
    {
        $category = Category::factory()->forUser($user->id)->income()->create();

        Transaction::factory()->forUser($user->id)->create([
            'category_id' => $category->id,
            'amount' => 250.00,
            'transaction_date' => now()->format('Y-m-d'),
        ]);
    }

    public function test_export_creates_archive_and_stores_file(): void
    {
        Storage::fake('local');

        $user = User::factory()->create();
        $this->createTransaction($user);

        $response = $this->actingAs($user)->get(route('exports.transactions', ['format' => 'pdf']));

        $response->assertStatus(200);

        $this->assertDatabaseCount('report_archives', 1);

        $archive = ReportArchive::first();

        Storage::assertExists($archive->storage_path);
    }

    public function test_index_only_shows_user_archives(): void
    {
        $user = User::factory()->create();
        ReportArchive::factory()->for($user, 'user')->count(2)->create();

        $other = User::factory()->create();
        ReportArchive::factory()->for($other, 'user')->count(1)->create();

        $response = $this->actingAs($user)->get(route('reports.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn (AssertableInertia $page) => $page->component('Reports/Index')->has('archives', 2)
        );
        $this->assertCount(2, ReportArchive::where('user_id', $user->id)->get());
    }

    public function test_user_can_search_their_archives(): void
    {
        $user = User::factory()->create();

        ReportArchive::factory()->for($user, 'user')->create([
            'file_name' => 'laporan-pdf-anggaran.pdf',
            'format' => 'pdf',
        ]);

        ReportArchive::factory()->for($user, 'user')->create([
            'file_name' => 'laporan-csv-harian.csv',
            'format' => 'csv',
        ]);

        $response = $this->actingAs($user)->get(route('reports.index', ['search' => 'pdf']));

        $response->assertStatus(200);
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Reports/Index')
            ->where('filters.search', 'pdf')
            ->has('archives', 1)
            ->where('archives.0.file_name', 'laporan-pdf-anggaran.pdf')
        );
    }

    public function test_user_can_download_own_archive(): void
    {
        Storage::fake('local');
        $user = User::factory()->create();
        $archive = ReportArchive::factory()->for($user)->create();

        Storage::put($archive->storage_path, 'content');

        $response = $this->actingAs($user)->get(route('reports.download', $archive));

        $response->assertStatus(200);
        $response->assertHeader('Content-Disposition');
    }

    public function test_user_cannot_download_other_users_archive(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $archive = ReportArchive::factory()->for($other)->create();

        $this->actingAs($user)
            ->get(route('reports.download', $archive))
            ->assertStatus(403);
    }

    public function test_user_can_delete_archive_and_file(): void
    {
        Storage::fake('local');
        $user = User::factory()->create();
        $archive = ReportArchive::factory()->for($user)->create();

        Storage::put($archive->storage_path, 'content');

        $response = $this->actingAs($user)->delete(route('reports.destroy', $archive));

        $response->assertRedirect(route('reports.index'));
        $this->assertDatabaseMissing('report_archives', ['id' => $archive->id]);
        Storage::assertMissing($archive->storage_path);
    }
}
