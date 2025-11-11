<?php

namespace Database\Seeders;

use App\Models\Offer;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class OfferSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Buscar la chaqueta MONTIREX Trail 3.0
        $chaqueta = Product::where('name', 'MONTIREX Chaqueta Trail 3.0')->first();

        if ($chaqueta) {
            Offer::create([
                'product_id' => $chaqueta->id,
                'name' => 'Oferta Especial - Chaqueta Trail 3.0',
                'discount_percentage' => 60.00, // 60% de descuento
                'start_date' => Carbon::today(), // Empieza hoy
                'end_date' => Carbon::now()->addWeeks(2), // Termina en 2 semanas
                'active' => true,
            ]);
        }
    }
}