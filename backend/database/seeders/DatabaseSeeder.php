<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // El método 'call' ejecuta otros Seeders en el orden especificado.
        $this->call([
            // 1. Usuarios (Base)
            UserSeeder::class,
            AddressSeeder::class, // Las direcciones dependen de que existan los usuarios.
            
            // 2. Catálogo (Base del inventario)
            CategorySeeder::class,
            ProductSeeder::class, 
            ProductDetailSeeder::class, // (Vacío, pero se ejecuta)

            // 3. Carrito y Pedidos (Dependientes de Usuarios y Productos)
            ShoppingCartSeeder::class,
            CartItemSeeder::class, 
            OrderSeeder::class, 
            OrderItemSeeder::class, // (Vacío, pero se ejecuta)

            // 4. Ofertas (Dependientes de Productos/Detalles)
            OfferSeeder::class,

            // 5. Inteligencia Artificial (Dependientes de Usuarios/Sesiones)
            AiSessionSeeder::class,
            AiMessageSeeder::class,
        ]);
    }
}