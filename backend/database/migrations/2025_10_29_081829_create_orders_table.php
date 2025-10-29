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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            // Claves foráneas (FK)
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            // Las direcciones no se eliminan si se borra el pedido, por eso no llevan onDelete('cascade')
            $table->foreignId('shipping_address_id')->constrained('addresses'); // Dirección de envío
            $table->foreignId('billing_address_id')->constrained('addresses'); // Dirección de facturación

            // Campos del pedido
            $table->decimal('total_price', 10, 2)->unsigned(); // Precio total de la compra
            $table->string('status')->default('pending'); // Estado del pedido (pending, processing, shipped, delivered, cancelled)
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};