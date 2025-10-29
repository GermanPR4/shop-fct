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
        Schema::create('offers', function (Blueprint $table) {
            $table->id();

            // Identificador y descripción de la oferta
            $table->string('name');
            
            // Claves foráneas (FK) - Usamos nullable() porque una oferta se aplica a un producto O a un detalle.
            $table->foreignId('product_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('product_detail_id')->nullable()->constrained('product_details')->onDelete('cascade');
            
            // Campo del descuento
            $table->decimal('discount_percentage', 5, 2)->unsigned(); // Ej: 15.00 para 15%

            // Fechas de vigencia
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            
            // Control de estado
            $table->boolean('active')->default(true); // Se puede desactivar manualmente
            
            $table->timestamps();

            // Índice opcional para asegurar que no se solapen ofertas de un mismo producto
            // $table->unique(['product_id', 'product_detail_id', 'start_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offers');
    }
};