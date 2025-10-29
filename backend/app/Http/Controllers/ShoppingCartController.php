<?php

namespace App\Http\Controllers;

use App\Models\ShoppingCart;
use Illuminate\Http\Request;

class ShoppingCartController extends Controller
{
    // Solo necesitamos el método destroy para eliminar todo el carrito

    /**
     * Remove the specified resource from storage (DELETE /api/shopping-carts/{id}).
     * Elimina el carrito completo del usuario autenticado.
     */
    public function destroy(ShoppingCart $shoppingCart)
    {
        // TODO: Añadir lógica para asegurar que el usuario autenticado es dueño del carrito
        $shoppingCart->delete();
        return response()->json(null, 204);
    }
    
    // Los demás métodos se manejan en CartItemController
}