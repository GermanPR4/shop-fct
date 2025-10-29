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
        Schema::create('ai_sessions', function (Blueprint $table) {
            $table->id();

            // Identificación del usuario (puede ser null si es invitado)
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');

            // Token para identificar la sesión (necesario para usuarios no logueados)
            $table->string('session_token')->unique();

            // Campo para saber cuándo fue el último mensaje (útil para limpiar sesiones antiguas)
            $table->timestamp('last_message_at')->useCurrent();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_sessions');
    }
};