<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Address;
use Illuminate\Database\Seeder;

class AddressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Obtener al usuario cliente de prueba
        $customer = User::where('email', 'cliente@prueba.com')->first();
        
        if ($customer) {
            // 2. Crear una dirección de ENVÍO por defecto
            Address::create([
                'user_id' => $customer->id,
                'street' => 'Calle de la FCT, 42',
                'city' => 'Madrid',
                'zip_code' => '28001',
                'country' => 'España',
                'is_shipping' => true,
                'is_billing' => false,
            ]);

            // 3. Crear una dirección de FACTURACIÓN por defecto
            Address::create([
                'user_id' => $customer->id,
                'street' => 'Av. de la Administración, 15',
                'city' => 'Madrid',
                'zip_code' => '28002',
                'country' => 'España',
                'is_shipping' => false,
                'is_billing' => true,
            ]);
        }

        // NOTA: Si necesitas direcciones para el Administrador, se crearían aquí también.
    }
}