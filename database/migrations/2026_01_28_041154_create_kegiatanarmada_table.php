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
        Schema::create('kegiatanarmada', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal');
            $table->unsignedBigInteger('jarak_id');
            $table->integer('rit')->nullable()->default(0);
            $table->string('satuan')->nullable();
            $table->integer('upahhariankenet')->default(0);
            $table->integer('umluarkotatelahterbayar')->default(0);
            $table->integer('umpengajuan')->default(0);
            $table->integer('insentifataulembur')->default(0);
            $table->integer('upah')->default(0);
            $table->integer('jumlah')->default(0);
            $table->integer('penjualan')->default(0);
            $table->integer('hargasolar')->default(0);
            $table->integer('nominalbiayasolar')->default(0);
            $table->unsignedBigInteger('oleh');
            $table->integer('status')->default(1);
            $table->timestamps();

            $table->foreign('jarak_id')->references('id')->on('jarakdanharga')->onDelete('cascade');
            $table->foreign('oleh')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kegiatanarmada');
    }
};
