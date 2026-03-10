<?php

namespace Database\Factories;

use App\Models\ReportArchive;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReportArchiveFactory extends Factory
{
    protected $model = ReportArchive::class;

    public function definition(): array
    {
        $format = $this->faker->randomElement(['pdf', 'csv']);
        $extension = $format;

        return [
            'user_id' => User::factory(),
            'format' => $format,
            'file_name' => sprintf('laporan-%s-%s.%s', $format, now()->timestamp, $extension),
            'storage_path' => 'reports/'.$this->faker->uuid().'.'.$extension,
            'from_date' => now()->subWeeks(1)->toDateString(),
            'to_date' => now()->toDateString(),
            'file_size' => $this->faker->numberBetween(1_000, 50_000),
        ];
    }
}
