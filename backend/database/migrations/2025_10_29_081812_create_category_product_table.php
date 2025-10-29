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
        Schema::create('category_product', function (Blueprint $table) {
            
            // Claves foráneas a las tablas relacionadas
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');

            // Definimos la clave primaria compuesta por ambas IDs
            $table->primary(['category_id', 'product_id']);

            // Añadimos el timestamp de creación
            $table->timestamp('created_at')->useCurrent();
            // Eliminamos updated_at, ya que estas filas raramente se actualizan
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('category_product');
    }
};