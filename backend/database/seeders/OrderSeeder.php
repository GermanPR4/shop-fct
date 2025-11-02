<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Order;
use App\Models\Product;
use App\Models\Address;
use App\Models\ProductDetail;
use App\Models\OrderItem;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Obtener o crear un cliente de prueba
        $customer = User::firstOrCreate(
            ['email' => 'cliente@prueba.com'],
            [
                'name' => 'Cliente de Prueba',
                'password' => bcrypt('password123'),
                'is_active' => true,
            ]
        );

        // 2. Obtener productos existentes
        $botas = Product::where('name', 'Timberland Botas Utility 6 pulgadas')->first();
        $gorra = Product::where('name', 'Adidas Gorra Adicolor Classic Trefoil Baseball')->first();

        // Crear dirección por seguridad
        $address = Address::firstOrCreate(
            ['user_id' => $customer->id, 'street' => 'Calle FCT Testing'],
            [
                'city' => 'Madrid',
                'zip_code' => '28001',
                'country' => 'España',
                'is_shipping' => true,
                'is_billing' => true
            ]
        );

        // Obtener variantes de productos
        $detalle_botas = ProductDetail::where('product_id', $botas?->id)->first();
        $detalle_gorra = ProductDetail::where('product_id', $gorra?->id)->first();

        // Verificar que todos los datos existen antes de crear el pedido
        if (!$customer || !$botas || !$gorra || !$detalle_botas || !$detalle_gorra) {
            echo "⚠️ Advertencia: No se pudo crear el pedido porque faltan datos (Usuario, Producto o Detalle). Ejecuta ProductSeeder primero.\n";
            return;
        }

        // 3. Crear el pedido
        $order = Order::create([
            'user_id' => $customer->id,
            'shipping_address_id' => $address->id,
            'billing_address_id' => $address->id,
            'total_price' => 0,
            'status' => 'delivered',
        ]);

        // 4. Crear ítems del pedido
        $item1 = OrderItem::create([
            'order_id' => $order->id,
            'product_detail_id' => $detalle_botas->id,
            'quantity' => 1,
            'price' => $botas->price,
        ]);

        $item2 = OrderItem::create([
            'order_id' => $order->id,
            'product_detail_id' => $detalle_gorra->id,
            'quantity' => 1,
            'price' => $gorra->price,
        ]);

        // 5. Actualizar precio total
        $total = $item1->price * $item1->quantity + $item2->price * $item2->quantity;
        $order->update(['total_price' => $total]);
    }
}
