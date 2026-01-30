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
        Schema::create('jarakdanharga', function (Blueprint $table) {
            $table->id();
            $table->nullableMorphs('source');
            $table->string('kode', 100);
            $table->date('tanggal');
            $table->string('pengambilan', 100);
            $table->string('tujuan', 100);
            $table->decimal('jarak', 5, 2)->default(0.0);
            $table->integer('hargaupah')->default(0);
            $table->integer('hargajasa')->default(0);
            $table->integer('status')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jarakdanharga');
    }
};
