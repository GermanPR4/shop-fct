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
        Schema::create('shopping_carts', function (Blueprint $table) {
            $table->id();

            // Clave foránea al usuario
            // Hacemos nullable() para permitir carritos de invitados
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');

            // Token único para identificar carritos de invitados o carritos inactivos
            $table->string('session_token')->unique()->nullable();
            
            // Índice único para asegurar que un usuario logueado solo tenga un carrito activo a la vez
            $table->unique('user_id');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shopping_carts');
    }
};