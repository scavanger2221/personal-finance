<?php

namespace Tests\Unit;

use App\Enums\CategoryType;
use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use App\Services\Reports\TransactionReportService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_calculates_correct_totals(): void
    {
        $user = User::factory()->create();
        $incomeCategory = Category::factory()->income()->create(['user_id' => $user->id]);
        $expenseCategory = Category::factory()->expense()->create(['user_id' => $user->id]);

        Transaction::factory()->create([
            'user_id' => $user->id,
            'category_id' => $incomeCategory->id,
            'amount' => 1000,
        ]);

        Transaction::factory()->create([
            'user_id' => $user->id,
            'category_id' => $expenseCategory->id,
            'amount' => 400,
        ]);

        $service = new TransactionReportService();
        $reportData = $service->getReportData($user);

        $this->assertEquals(1000, $reportData->totalIncome);
        $this->assertEquals(400, $reportData->totalExpense);
        $this->assertEquals(600, $reportData->netBalance);
    }

    public function test_it_filters_by_date_range(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->income()->create(['user_id' => $user->id]);

        Transaction::factory()->create([
            'user_id' => $user->id,
            'category_id' => $category->id,
            'transaction_date' => '2026-01-01',
            'amount' => 100,
        ]);

        Transaction::factory()->create([
            'user_id' => $user->id,
            'category_id' => $category->id,
            'transaction_date' => '2026-02-01',
            'amount' => 200,
        ]);

        $service = new TransactionReportService();
        
        $reportData = $service->getReportData($user, '2026-01-01', '2026-01-15');
        $this->assertCount(1, $reportData->transactions);
        $this->assertEquals(100, $reportData->totalIncome);

        $reportData = $service->getReportData($user, '2026-01-01', '2026-02-01');
        $this->assertCount(2, $reportData->transactions);
        $this->assertEquals(300, $reportData->totalIncome);
    }
}
