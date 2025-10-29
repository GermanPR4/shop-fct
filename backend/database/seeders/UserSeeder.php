<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Usuario Administrador (Employee)
        User::create([
            'name' => 'Admin FCT',
            'email' => 'admin@fct.com',
            'password' => Hash::make('password'), // Contraseña: password
            'role' => 'employee', // Rol para acceder al módulo de administración
        ]);

        // 2. Usuario Cliente de Prueba
        User::create([
            'name' => 'Cliente Prueba',
            'email' => 'cliente@prueba.com',
            'password' => Hash::make('password'), // Contraseña: password
            'role' => 'customer', // Rol normal de cliente
        ]);

        // 3. Opcional: Generar 10 usuarios de prueba (Fakes) usando la Factory
        // User::factory(10)->create();
    }
}