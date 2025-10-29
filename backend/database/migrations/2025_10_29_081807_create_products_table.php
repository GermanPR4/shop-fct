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
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            // Campos principales del producto
            $table->string('name')->unique();
            $table->string('short_description')->nullable();
            $table->text('long_description')->nullable();
            
            // Precio base (para una moneda)
            $table->decimal('price', 10, 2)->unsigned(); // unsigned asegura que el precio no sea negativo

            // Campo para saber si está disponible o no (independientemente del stock de variantes)
            $table->boolean('is_active')->default(true); 

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};