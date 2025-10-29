<?php

namespace App\Http\Controllers;

use App\Models\OrderItem;
use Illuminate\Http\Request;

class OrderItemController extends Controller
{
    /**
     * Display a listing of the resource (GET /api/order-items).
     * Muestra todos los ítems de todos los pedidos (solo para admin).
     */
    public function index()
    {
        return response()->json(OrderItem::with(['order', 'productDetail'])->get());
    }

    /**
     * Display the specified resource (GET /api/order-items/{id}).
     */
    public function show(OrderItem $orderItem)
    {
        $orderItem->load(['order', 'productDetail']);
        return response()->json($orderItem);
    }
    
    // store, update, destroy se dejan vacíos.
}