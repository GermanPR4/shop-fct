<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource (GET /api/products).
     */
    public function index()
    {
        // Obtiene todos los productos activos y sus relaciones para el catálogo
        $products = Product::with(['details', 'categories', 'offers' => function($query) {
            $query->vigente(); // Carga solo ofertas vigentes
        }])->active()->get();

        return response()->json($products);
    }

    /**
     * Display the specified resource (GET /api/products/{id}).
     */
    public function show(Product $product)
    {
        // Devuelve el producto y todas sus relaciones para la página de detalle
        $product->load(['details', 'categories', 'offers' => function($query) {
            $query->vigente(); // Carga solo ofertas vigentes
        }]);
        
        return response()->json($product);
    }
    
    // Los demás métodos quedan para el módulo Admin
}