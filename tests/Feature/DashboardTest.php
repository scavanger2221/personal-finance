<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_renders_with_correct_summary_data(): void
    {
        $user = User::factory()->create();
        
        $incomeCategory = Category::factory()->income()->create(['user_id' => $user->id]);
        $expenseCategory = Category::factory()->expense()->create(['user_id' => $user->id]);

        Transaction::factory()->create([
            'user_id' => $user->id,
            'category_id' => $incomeCategory->id,
            'amount' => 5000,
        ]);

        Transaction::factory()->create([
            'user_id' => $user->id,
            'category_id' => $expenseCategory->id,
            'amount' => 2000,
        ]);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard')
                ->has('summary', fn (Assert $page) => $page
                    ->where('totalIncome', 5000)
                    ->where('totalExpense', 2000)
                    ->where('netBalance', 3000)
                    ->has('categoryBreakdown')
                    ->has('recentTransactions', 2)
                    ->etc()
                )
            );
    }
}
