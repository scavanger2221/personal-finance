<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExportTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_export_pdf(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create(['user_id' => $user->id]);
        Transaction::factory()->count(5)->create([
            'user_id' => $user->id,
            'category_id' => $category->id,
        ]);

        $response = $this->actingAs($user)->get(route('exports.transactions', [
            'format' => 'pdf',
        ]));

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/pdf');
    }

    public function test_user_can_export_csv(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create(['user_id' => $user->id, 'name' => 'CSV Category']);
        Transaction::factory()->create([
            'user_id' => $user->id,
            'category_id' => $category->id,
            'description' => 'CSV Export Test',
        ]);

        $response = $this->actingAs($user)->get(route('exports.transactions', [
            'format' => 'csv',
        ]));

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'text/csv; charset=UTF-8');
        
        // Use streamDownload specific verification
        $this->assertStringContainsString('CSV Category', $response->streamedContent());
        $this->assertStringContainsString('CSV Export Test', $response->streamedContent());
    }

    public function test_user_cannot_export_without_authentication(): void
    {
        $response = $this->get(route('exports.transactions', [
            'format' => 'pdf',
        ]));

        $response->assertRedirect(route('login'));
    }
}
