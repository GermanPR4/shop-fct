<?php

namespace App\Http\Controllers;

use App\Models\ShoppingCart;
use App\Models\CartItem;
use Illuminate\Http\Request;

class CartItemController extends Controller
{
    // Función de ayuda para obtener el carrito del usuario o invitado
    private function getCart(Request $request): ShoppingCart
    {
        $userId = $request->user()?->id; // Usamos el operador nullsafe (?->) para obtener el ID o null
        $sessionToken = $request->user() ? null : $request->session()->getId();

        // 1. Intentar encontrar por user_id (si está logueado)
        if ($userId) {
            return ShoppingCart::firstOrCreate(
                ['user_id' => $userId],
                ['session_token' => $sessionToken] // El token se añade por si acaso, aunque user_id es prioritario
            );
        }

        // 2. Intentar encontrar o crear por session_token (si es invitado)
        return ShoppingCart::firstOrCreate(
            ['session_token' => $sessionToken],
            ['user_id' => null] // Aseguramos que user_id es null
        );
    }

    /**
     * Display the shopping cart content (GET /api/cart).
     */
    public function index(Request $request)
    {
        $cart = $this->getCart($request);
        
        // Carga los ítems del carrito y los detalles del producto
        $cart->load(['items.productDetail.product']); 
        
        return response()->json($cart);
    }

    /**
     * Add or update an item in the cart (POST /api/cart).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_detail_id' => 'required|exists:product_details,id',
            'quantity' => 'required|integer|min:1',
        ]);
        
        $cart = $this->getCart($request);

        // Intenta encontrar el ítem existente o crea uno nuevo
        $item = $cart->items()->firstOrNew(['product_detail_id' => $validated['product_detail_id']]);

        if ($item->exists) {
            $item->quantity += $validated['quantity'];
        } else {
            $item->quantity = $validated['quantity'];
        }

        // TODO: (Lógica pendiente) Verificar que el stock sea suficiente
        
        $item->save();
        
        return response()->json($cart->load('items'), 201);
    }

    /**
     * Update the specified resource in storage (PUT/PATCH /api/cart/{id}).
     * Usamos el ID del CartItem como parámetro
     */
    public function update(Request $request, CartItem $cart)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        // TODO: (Lógica pendiente) Asegurar que el usuario sea dueño del carrito
        
        $cart->quantity = $validated['quantity'];
        $cart->save();

        return response()->json($cart, 200);
    }

    /**
     * Remove the specified item from storage (DELETE /api/cart/{id}).
     */
    public function destroy(CartItem $cartItem)
    {
        // TODO: Asegurar que el usuario es dueño del carrito antes de borrar
        $cartItem->delete();
        return response()->json(null, 204);
    }
}