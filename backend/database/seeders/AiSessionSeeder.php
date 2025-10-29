<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\AiSession;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AiSessionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Obtener al usuario cliente de prueba
        $user = User::where('email', 'cliente@prueba.com')->first();

        // 2. Crear una sesión para el usuario logueado
        if ($user) {
            AiSession::create([
                'user_id' => $user->id,
                'session_token' => Str::uuid(), 
                'last_message_at' => now(), 
            ]);
        }

        // 3. Crear una sesión para un usuario invitado
        AiSession::create([
            'user_id' => null, // Es nulo porque es un invitado
            'session_token' => Str::uuid(), // Token único para identificar al invitado
            'last_message_at' => now(), 
        ]);
    }
}