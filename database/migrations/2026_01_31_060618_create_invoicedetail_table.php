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
        Schema::create('invoicedetail', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('invoice_id');
            $table->unsignedBigInteger('kegiatanarmada_id');
            $table->timestamps();

            $table->foreign('invoice_id')->references('id')->on('invoice')->onDelete('cascade');
            $table->foreign('kegiatanarmada_id')->references('id')->on('kegiatanarmada')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoicedetail');
    }
};
