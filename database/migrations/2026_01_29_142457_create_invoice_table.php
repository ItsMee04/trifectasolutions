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
        Schema::create('invoice', function (Blueprint $table) {
            $table->id();
            $table->string('nomorinvoice', 100);
            $table->string('pengambilan', 100);
            $table->string('tujuan', 100);
            $table->string('kategori', 100);
            $table->date('periodeawal');
            $table->date('periodeakhir');
            $table->unsignedBigInteger('oleh');
            $table->timestamps();

            $table->foreign('oleh')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoice');
    }
};
