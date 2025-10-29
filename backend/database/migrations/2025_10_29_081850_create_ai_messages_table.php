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
        Schema::create('ai_messages', function (Blueprint $table) {
            $table->id();

            // Clave foránea a la sesión de IA
            $table->foreignId('session_id')->constrained('ai_sessions')->onDelete('cascade');

            // Rol del mensaje: 'user' o 'assistant'
            $table->string('role')->default('user');
            
            // Contenido del mensaje
            $table->text('content');

            // Bandera para optimización: ¿Contiene palabras clave de producto?
            $table->boolean('is_product_query')->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_messages');
    }
};