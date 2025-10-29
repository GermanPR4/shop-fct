<?php

namespace Database\Seeders;

use App\Models\CartItem;
use App\Models\ShoppingCart;
use App\Models\Product;
use App\Models\ProductDetail;
use Illuminate\Database\Seeder;

class CartItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Obtener el carrito de prueba (asumimos que existe un carrito de invitado)
        $guestCart = ShoppingCart::whereNull('user_id')->first();
        
        // 2. Obtener la variante de producto a añadir (ej: las zapatillas)
        $zapatillas = Product::where('name', 'Zapatillas ProRunner 2.0')->first();
        $detalle_zapatillas = null;

        if ($zapatillas) {
            // Buscamos cualquier detalle de las zapatillas
            $detalle_zapatillas = ProductDetail::where('product_id', $zapatillas->id)->first();
        }

        // 3. Añadir ítems al carrito si el carrito y el producto existen
        if ($guestCart && $detalle_zapatillas) {
            CartItem::create([
                'cart_id' => $guestCart->id,
                'product_detail_id' => $detalle_zapatillas->id,
                'quantity' => 1,
            ]);

            // Añadimos un segundo ítem al mismo carrito (ej: la sudadera)
            $sudadera = Product::where('name', 'Sudadera con Capucha (Unisex)')->first();
            $detalle_sudadera = ProductDetail::where('product_id', $sudadera->id)->where('color', 'Negro')->first();
            
            if ($detalle_sudadera) {
                CartItem::create([
                    'cart_id' => $guestCart->id,
                    'product_detail_id' => $detalle_sudadera->id,
                    'quantity' => 2,
                ]);
            }
        }
    }
}