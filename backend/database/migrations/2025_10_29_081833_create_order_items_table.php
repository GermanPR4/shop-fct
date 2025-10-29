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
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();

            // Claves foráneas (FK)
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            // Enlaza a la variante específica que se compró
            $table->foreignId('product_detail_id')->constrained('product_details');

            // Campos de la línea de pedido
            $table->unsignedInteger('quantity');
            // Precio unitario al momento de la compra (CRUCIAL para contabilidad)
            $table->decimal('price', 10, 2)->unsigned(); 
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};