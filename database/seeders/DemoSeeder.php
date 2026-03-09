<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::factory()->create([
            'name' => 'Demo User',
            'email' => 'demo@example.com',
            'password' => bcrypt('password'),
        ]);

        $incomeCategories = ['Salary', 'Freelance', 'Investment', 'Gift'];
        $expenseCategories = ['Rent', 'Groceries', 'Utilities', 'Transportation', 'Entertainment', 'Health'];

        foreach ($incomeCategories as $name) {
            Category::factory()->income()->create([
                'user_id' => $user->id,
                'name' => $name,
            ]);
        }

        foreach ($expenseCategories as $name) {
            Category::factory()->expense()->create([
                'user_id' => $user->id,
                'name' => $name,
            ]);
        }

        $categories = Category::where('user_id', $user->id)->get();

        foreach ($categories as $category) {
            Transaction::factory()->count(10)->create([
                'user_id' => $user->id,
                'category_id' => $category->id,
            ]);
        }
    }
}
