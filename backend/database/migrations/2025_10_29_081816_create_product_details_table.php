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
        Schema::create('product_details', function (Blueprint $table) {
            $table->id();

            // Clave foránea al producto principal
            $table->foreignId('product_id')->constrained()->onDelete('cascade');

            // Campos de la variante (detalles)
            $table->string('color');
            $table->string('size');
            $table->string('image_url')->nullable(); // URL de la imagen específica de este color

            // Control de Stock
            $table->unsignedInteger('stock')->default(0); // unsignedInteger asegura que el stock no sea negativo

            // Índice para asegurar que no se repita la misma talla/color para un producto
            $table->unique(['product_id', 'color', 'size']);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_details');
    }
};
