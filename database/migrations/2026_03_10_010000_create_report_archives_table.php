<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('report_archives', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('format', 10);
            $table->string('file_name');
            $table->string('storage_path');
            $table->date('from_date')->nullable();
            $table->date('to_date')->nullable();
            $table->unsignedBigInteger('file_size')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index(['user_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('report_archives');
    }
};
