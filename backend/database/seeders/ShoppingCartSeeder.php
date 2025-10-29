<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\ShoppingCart;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ShoppingCartSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Obtener al usuario cliente de prueba
        $user = User::where('email', 'cliente@prueba.com')->first();

        // 2. Crear un carrito para el usuario logueado (si existe)
        if ($user) {
            ShoppingCart::create([
                'user_id' => $user->id,
                // El token es redundante si hay user_id, pero lo ponemos para simular persistencia.
                'session_token' => Str::uuid(), 
            ]);
        }

        // 3. Crear un carrito para un usuario invitado
        ShoppingCart::create([
            'user_id' => null, // Es nulo porque es un invitado
            'session_token' => Str::uuid(), // Usamos un UUID para identificar al invitado
        ]);

        // NOTA: No añadimos ítems aquí, eso lo haremos en CartItemSeeder para mantener la separación.
    }
}