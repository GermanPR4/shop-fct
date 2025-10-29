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
        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();

            // Claves foráneas
            // 1. Enlace al carrito principal
            $table->foreignId('cart_id')->constrained('shopping_carts')->onDelete('cascade');
            // 2. Enlace a la variante de producto (talla/color)
            $table->foreignId('product_detail_id')->constrained('product_details')->onDelete('cascade');

            // Cantidad de la variante
            $table->unsignedSmallInteger('quantity')->default(1); // SmallInteger es suficiente para la cantidad, unsigned evita negativos

            // Índice para evitar añadir el mismo item dos veces al mismo carrito
            $table->unique(['cart_id', 'product_detail_id']);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cart_items');
    }
};