<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Deportivo',
            'De Vestir',
            'Casual',
            'Veraniego',
            'Invierno',
            'Ofertas', // Para destacar productos en promoción (útil para el frontend)
        ];

        foreach ($categories as $categoryName) {
            Category::firstOrCreate(['name' => $categoryName]);
        }
    }
}