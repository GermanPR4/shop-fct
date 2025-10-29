<?php

namespace Database\Seeders;

use App\Models\AiMessage;
use App\Models\AiSession;
use Illuminate\Database\Seeder;

class AiMessageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Obtener una sesión de IA de prueba (asumimos que existe la sesión del invitado)
        $session = AiSession::where('user_id', null)->first();

        if ($session) {
            // 2. Simular la conversación

            // Mensaje 1 (Usuario - Consulta de producto)
            AiMessage::create([
                'session_id' => $session->id,
                'role' => 'user',
                'content' => 'Hola, estoy buscando algo cómodo y cálido para usar este invierno.',
                'is_product_query' => true, // Marcamos que es una consulta de producto
            ]);

            // Mensaje 2 (Asistente - Respuesta con contexto de producto)
            AiMessage::create([
                'session_id' => $session->id,
                'role' => 'assistant',
                'content' => '¡Claro! Tenemos varias sudaderas con capucha. ¿Prefieres algo de la colección casual o algo más deportivo?',
                'is_product_query' => false,
            ]);

            // Mensaje 3 (Usuario - Filtro de producto)
            AiMessage::create([
                'session_id' => $session->id,
                'role' => 'user',
                'content' => 'Mmm, mejor casual, y si puede ser de color gris.',
                'is_product_query' => true,
            ]);
        }
    }
}