<?php

namespace Database\Seeders;

use App\Models\Offer;
use App\Models\Product;
use App\Models\ProductDetail;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class OfferSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Obtener productos y detalles necesarios
        $sudadera = Product::where('name', 'Sudadera con Capucha (Unisex)')->first();

        // Obtener una variante específica (ej: la Sudadera Gris Talla M)
        $sudaderaGrisM = null;
        if ($sudadera) {
            $sudaderaGrisM = ProductDetail::where('product_id', $sudadera->id)
                ->where('color', 'Gris')
                ->where('size', 'M')
                ->first();
        }

        // --- Oferta 1: Descuento General (Se aplica a toda la Sudadera) ---
        if ($sudadera) {
            Offer::create([
                'product_id' => $sudadera->id,
                'name' => 'Oferta de Lanzamiento - Sudadera',
                'discount_percentage' => 10.00, // 10%
                'start_date' => Carbon::yesterday(), // Empezó ayer
                'end_date' => Carbon::now()->addWeeks(2), // Termina en 2 semanas
                'active' => true,
            ]);
        }

        // --- Oferta 2: Descuento Específico (Solo una variante) ---
        if ($sudaderaGrisM) {
            Offer::create([
                'product_detail_id' => $sudaderaGrisM->id,
                'name' => 'Liquidación Talla M Gris',
                'discount_percentage' => 25.00, // 25%
                'start_date' => Carbon::yesterday(),
                'end_date' => Carbon::now()->addDays(3), // Termina pronto
                'active' => true,
            ]);
        }
    }
}