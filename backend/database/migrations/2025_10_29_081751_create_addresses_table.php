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
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();

            // Clave foránea al usuario
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Campos de la dirección
            $table->string('street');
            $table->string('city');
            $table->string('zip_code');
            $table->string('country')->default('España'); // Puedes poner tu país por defecto

            // Banderas para tipo de dirección
            $table->boolean('is_shipping')->default(false);
            $table->boolean('is_billing')->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};