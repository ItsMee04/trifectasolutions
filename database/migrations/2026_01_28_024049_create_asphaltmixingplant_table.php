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
        Schema::create('asphaltmixingplant', function (Blueprint $table) {
            $table->id();
            $table->string('kode', 100);
            $table->date('tanggal');
            $table->unsignedBigInteger('material_id');
            $table->unsignedBigInteger('kendaraan_id');
            $table->unsignedBigInteger('driver_id');
            $table->unsignedBigInteger('suplier_id');
            $table->unsignedBigInteger('beratjenis_id');
            $table->string('jenis');
            $table->decimal('volume', 8, 2)->default(0.0);
            $table->integer('berattotal')->default(0);
            $table->integer('beratkendaraan')->default(0);
            $table->integer('beratmuatan')->default(0);
            $table->integer('status')->default(1);
            $table->timestamps();

            $table->foreign('material_id')->references('id')->on('material')->onDelete('cascade');
            $table->foreign('kendaraan_id')->references('id')->on('kendaraan')->onDelete('cascade');
            $table->foreign('driver_id')->references('id')->on('kendaraan')->onDelete('cascade');
            $table->foreign('suplier_id')->references('id')->on('kendaraan')->onDelete('cascade');
            $table->foreign('beratjenis_id')->references('id')->on('beratjenis')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asphaltmixingplant');
    }
};
