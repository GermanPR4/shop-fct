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
        // 1. Obtener los datos necesarios
        $customer = User::where('email', 'cliente@prueba.com')->first();
        $sudadera = Product::where('name', 'Sudadera con Capucha (Unisex)')->first();
        $zapatillas = Product::where('name', 'Zapatillas ProRunner 2.0')->first();
        
        // Asumimos que OrderSeeder se ejecuta después de AddressSeeder, pero crearemos una dirección por seguridad
        $address = Address::firstOrCreate(
            ['user_id' => $customer->id, 'street' => 'Calle FCT Testing'],
            ['city' => 'Madrid', 'zip_code' => '28001', 'country' => 'España', 'is_shipping' => true, 'is_billing' => true]
        );

        // Obtener dos variantes de producto que existen
        $detalle_sudadera = ProductDetail::where('product_id', $sudadera->id)->where('color', 'Gris')->where('size', 'M')->first();
        $detalle_zapatillas = ProductDetail::where('product_id', $zapatillas->id)->first(); // Cualquier variante

        // Verificar que todos los datos existen antes de crear el pedido
        if (!$customer || !$sudadera || !$zapatillas || !$detalle_sudadera || !$detalle_zapatillas) {
            echo "Advertencia: No se pudo crear el pedido porque faltan datos (Usuario, Producto o Detalle). Ejecuta ProductSeeder primero.\n";
            return;
        }

        // 2. Crear el Pedido Principal
        $order = Order::create([
            'user_id' => $customer->id,
            'shipping_address_id' => $address->id,
            'billing_address_id' => $address->id,
            'total_price' => 0, // Lo calcularemos en el siguiente paso
            'status' => 'delivered', // Para simular un pedido histórico
        ]);

        // 3. Crear los Ítems del Pedido y calcular el total

        // Ítem 1: Sudadera
        $item1 = OrderItem::create([
            'order_id' => $order->id,
            'product_detail_id' => $detalle_sudadera->id,
            'quantity' => 1,
            'price' => 39.99 * 0.90, // Precio con el 10% de descuento (simulado)
        ]);

        // Ítem 2: Zapatillas
        $item2 = OrderItem::create([
            'order_id' => $order->id,
            'product_detail_id' => $detalle_zapatillas->id,
            'quantity' => 1,
            'price' => 79.50, // Precio completo
        ]);

        // 4. Actualizar el precio total del pedido
        $total = $item1->price * $item1->quantity + $item2->price * $item2->quantity;
        $order->update(['total_price' => $total]);
    }
}