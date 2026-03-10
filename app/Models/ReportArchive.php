<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReportArchive extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'format',
        'file_name',
        'storage_path',
        'from_date',
        'to_date',
        'file_size',
    ];

    protected $casts = [
        'from_date' => 'date',
        'to_date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
