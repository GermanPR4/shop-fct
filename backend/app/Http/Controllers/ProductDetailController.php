<?php

namespace App\Http\Controllers;

use App\Models\ProductDetail;
use Illuminate\Http\Request;

class ProductDetailController extends Controller
{
    // index, show se usarían para listar todas las variantes o una específica

    /**
     * Store a newly created resource in storage (POST /api/product-details).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'color' => 'required|string|max:50',
            'size' => 'required|string|max:10',
            'stock' => 'required|integer|min:0',
            'image_url' => 'nullable|url',
        ]);

        $detail = ProductDetail::create($validated);
        return response()->json($detail, 201);
    }
    
    // El resto de métodos (update, destroy) se implementan para la gestión de inventario.
}