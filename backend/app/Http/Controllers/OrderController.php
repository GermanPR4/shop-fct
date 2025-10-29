<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\ShoppingCart;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    // Listar solo los pedidos del usuario autenticado
    // NOTA: Esta ruta debe estar dentro del middleware 'auth:sanctum'
    public function index(Request $request)
    {
        $user = $request->user();

        return response()->json($user->orders()->with('items.productDetail')->get());
    }

    // Método para crear el pedido (Checkout)
    // NOTA: Esta ruta debe estar dentro del middleware 'auth:sanctum'
    public function store(Request $request)
    {
        // 0. Obtener el usuario autenticado (garantizado por el middleware)
        $user = $request->user();

        // 1. Validar la entrada (direcciones)
        $validated = $request->validate([
            // Validamos que las direcciones existan Y que pertenezcan al usuario
            'shipping_address_id' => 'required|exists:addresses,id,user_id,' . $user->id,
            'billing_address_id' => 'required|exists:addresses,id,user_id,' . $user->id,
            // ... (Falta validación de pago)
        ]);

        // 2. Obtener el carrito del usuario y cargar los ítems
        // Usamos la relación shoppingCart() y first() para obtener el modelo o null.
        $cart = $user->shoppingCart()->with('items')->first();

        // Si el carrito no existe o está vacío
        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['message' => 'El carrito está vacío.'], 400);
        }

        // 3. (Lógica pendiente) Procesar el pago y descontar el stock

        // 4. Crear el pedido final
        $order = Order::create([
            'user_id' => $user->id, // Usamos el ID del objeto $user directamente
            'shipping_address_id' => $validated['shipping_address_id'],
            'billing_address_id' => $validated['billing_address_id'],
            'total_price' => 0, // TODO: Calcular precio real
            'status' => 'processing',
        ]);

        // TODO: (Lógica pendiente) Mover items de cart_items a order_items

        $cart->items()->delete(); // Vaciar el carrito

        return response()->json($order->load('items'), 201);
    }

    // Los demás métodos show, update, destroy quedan para el módulo Admin
}