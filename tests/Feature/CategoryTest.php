<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_their_categories(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create([
            'user_id' => $user->id,
            'name' => 'My Category',
            'type' => 'expense'
        ]);
        
        $otherUser = User::factory()->create();
        $otherCategory = Category::factory()->create([
            'user_id' => $otherUser->id,
            'name' => 'Other Category',
            'type' => 'expense'
        ]);

        $response = $this->actingAs($user)->get(route('categories.index'));

        $response->assertStatus(200)
            ->assertInertia(fn (Assert $page) => $page
                ->component('Categories/Index')
                ->has('categories', 1)
                ->has('categories.0', fn (Assert $page) => $page
                    ->where('name', 'My Category')
                    ->where('type', 'expense')
                    ->etc()
                )
            );
    }

    public function test_user_can_create_category(): void
    {
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('categories.store'), [
            'name' => 'New Category',
            'type' => 'expense',
        ]);

        $response->assertRedirect(route('categories.index'));
        $this->assertDatabaseHas('categories', [
            'user_id' => $user->id,
            'name' => 'New Category',
            'type' => 'expense',
        ]);
    }

    public function test_user_cannot_create_duplicate_category_name_for_same_type(): void
    {
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);
        $user = User::factory()->create();
        Category::factory()->create([
            'user_id' => $user->id,
            'name' => 'Duplicate',
            'type' => 'expense'
        ]);

        $response = $this->actingAs($user)->post(route('categories.store'), [
            'name' => 'Duplicate',
            'type' => 'expense',
        ]);

        $response->assertSessionHasErrors('name');
    }

    public function test_user_can_delete_empty_category(): void
    {
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);
        $user = User::factory()->create();
        $category = Category::factory()->create([
            'user_id' => $user->id,
            'name' => 'To Delete',
            'type' => 'expense'
        ]);

        $response = $this->actingAs($user)->delete(route('categories.destroy', $category->id));

        $response->assertRedirect(route('categories.index'));
        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }

    public function test_user_cannot_delete_category_with_transactions(): void
    {
        $this->withoutMiddleware(\App\Http\Middleware\VerifyCsrfToken::class);
        $user = User::factory()->create();
        $category = Category::factory()->create([
            'user_id' => $user->id,
            'name' => 'With Transactions',
            'type' => 'expense'
        ]);
        
        Transaction::factory()->create([
            'user_id' => $user->id,
            'category_id' => $category->id,
        ]);

        $response = $this->actingAs($user)->delete(route('categories.destroy', $category->id));

        $response->assertStatus(403);
        $this->assertDatabaseHas('categories', ['id' => $category->id]);
    }
}
