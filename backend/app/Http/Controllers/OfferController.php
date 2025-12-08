<?php

namespace App\Http\Controllers;

use App\Models\Offer;
use Illuminate\Http\Request;

class OfferController extends Controller
{
    /**
     * Display a listing of the resource (GET /api/offers).
     * Muestra todas las ofertas, incluyendo las no vigentes, para el módulo admin.
     */
    public function index()
    {
        return response()->json(Offer::all());
    }

    /**
     * Store a newly created resource in storage (POST /api/offers).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'discount_percentage' => 'required|numeric|min:0|max:100',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'product_id' => 'nullable|exists:products,id',
            'product_detail_id' => 'nullable|exists:product_details,id',
        ]);
        
        // TODO: Añadir lógica para asegurar que solo uno de los FK (product_id/product_detail_id) está presente.
        
        $offer = Offer::create($validated);
        return response()->json($offer, 201);
    }

    /**
     * Display the specified resource (GET /api/offers/{id}).
     */
    public function show(Offer $offer)
    {
        return response()->json($offer);
    }
    
    /**
     * Update the specified resource in storage (PUT/PATCH /api/admin/offers/{id}).
     */
    public function update(Request $request, Offer $offer)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'discount_percentage' => 'sometimes|required|numeric|min:0|max:100',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|required|date|after_or_equal:start_date',
            'product_id' => 'nullable|exists:products,id',
            'product_detail_id' => 'nullable|exists:product_details,id',
            'active' => 'sometimes|boolean',
        ]);
        
        $offer->update($validated);
        return response()->json($offer);
    }

    /**
     * Remove the specified resource from storage (DELETE /api/admin/offers/{id}).
     */
    public function destroy(Offer $offer)
    {
        $offer->delete();
        return response()->json(['message' => 'Oferta eliminada exitosamente'], 200);
    }
}