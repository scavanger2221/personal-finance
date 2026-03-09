<?php

namespace App\Models;

use App\Enums\CategoryType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class Category extends Model
{
    /** @use HasFactory<\Database\Factories\CategoryFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'type',
    ];

    protected $casts = [
        'type' => CategoryType::class,
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function scopeForUser(Builder $query, int $userId): Builder
    {
        return $query->where('categories.user_id', $userId);
    }

    public function scopeIncome(Builder $query): Builder
    {
        return $query->where('type', CategoryType::INCOME);
    }

    public function scopeExpense(Builder $query): Builder
    {
        return $query->where('type', CategoryType::EXPENSE);
    }
}
