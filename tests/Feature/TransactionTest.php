<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class TransactionTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_their_transactions(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create(['user_id' => $user->id]);
        $transaction = Transaction::factory()->create([
            'user_id' => $user->id,
            'category_id' => $category->id,
            'description' => 'My Transaction',
            'amount' => 100.00,
        ]);
        
        $otherUser = User::factory()->create();
        $otherCategory = Category::factory()->create(['user_id' => $otherUser->id]);
        $otherTransaction = Transaction::factory()->create([
            'user_id' => $otherUser->id,
            'category_id' => $otherCategory->id,
            'description' => 'Other Transaction'
        ]);

        $response = $this->actingAs($user)->get(route('transactions.index'));

        $response->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Transactions/Index')
                ->has('transactions.data', 1)
                ->has('transactions.data.0', fn (Assert $page) => $page
                    ->where('description', 'My Transaction')
                    ->where('amount', "100.00")
                    ->etc()
                )
                ->has('categories')
            );
    }

    public function test_user_can_create_transaction(): void
    {
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);
        $user = User::factory()->create();
        $category = Category::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->post(route('transactions.store'), [
            'category_id' => $category->id,
            'amount' => 100.50,
            'description' => 'New Transaction',
            'transaction_date' => '2026-03-09',
        ]);

        $response->assertRedirect(route('transactions.index'));
        $this->assertDatabaseHas('transactions', [
            'user_id' => $user->id,
            'amount' => 100.50,
            'description' => 'New Transaction',
        ]);
    }

    public function test_user_cannot_create_transaction_for_other_users_category(): void
    {
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $otherCategory = Category::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($user)->post(route('transactions.store'), [
            'category_id' => $otherCategory->id,
            'amount' => 50.00,
            'transaction_date' => '2026-03-09',
        ]);

        $response->assertSessionHasErrors('category_id');
    }

    public function test_user_cannot_update_others_transaction(): void
    {
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);
        $user = User::factory()->create();
        $myCategory = Category::factory()->create(['user_id' => $user->id]);
        
        $otherUser = User::factory()->create();
        $otherTransaction = Transaction::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($user)->put(route('transactions.update', $otherTransaction->id), [
            'category_id' => $myCategory->id,
            'amount' => 100.00,
            'transaction_date' => '2026-03-09',
        ]);

        $response->assertStatus(403);
    }
}
