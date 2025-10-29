<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductDetail;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // NOTA: ASUMIMOS que CategorySeeder se ejecutará antes y ya existen categorías.

        // 1. Crear las categorías de ejemplo (si no existen, para la prueba)
        // Esto es una medida de seguridad, pero se recomienda crearlas en CategorySeeder.
        $casual = Category::firstOrCreate(['name' => 'Casual']);
        $sport = Category::firstOrCreate(['name' => 'Deportivo']);
        $winter = Category::firstOrCreate(['name' => 'Invierno']);

        // 2. Crear Productos y sus Variantes

        // --- Producto 1: Sudadera Básica (Muchas Variantes) ---
        $sudadera = Product::create([
            'name' => 'Sudadera con Capucha (Unisex)',
            'short_description' => 'Sudadera de algodón suave con ajuste regular.',
            'long_description' => 'Sudadera perfecta para el día a día. Fabricada con 80% algodón y 20% poliéster. Ideal para vestir casual o para climas fríos.',
            'price' => 39.99,
            'is_active' => true,
        ]);

        // Crear las variantes (Detalles)
        $detailsSudadera = [
            ['color' => 'Gris', 'size' => 'S', 'stock' => 15, 'image_url' => 'url_sudadera_gris_s.jpg'],
            ['color' => 'Gris', 'size' => 'M', 'stock' => 30, 'image_url' => 'url_sudadera_gris_m.jpg'],
            ['color' => 'Negro', 'size' => 'L', 'stock' => 20, 'image_url' => 'url_sudadera_negro_l.jpg'],
        ];

        foreach ($detailsSudadera as $detail) {
            $sudadera->details()->create($detail);
        }

        // Asignar Categorías (Muchos-a-Muchos)
        $sudadera->categories()->attach([$casual->id, $winter->id]);


        // --- Producto 2: Zapatillas de Running (Detalle Único) ---
        $zapatillas = Product::create([
            'name' => 'Zapatillas ProRunner 2.0',
            'short_description' => 'Calzado ligero para running y entrenamiento.',
            'long_description' => 'Tecnología de amortiguación avanzada. Transpirables y resistentes. Perfectas para largas distancias o gym.',
            'price' => 79.50,
            'is_active' => true,
        ]);

        // Crear las variantes (Solo un color y talla iniciales)
        $zapatillas->details()->create([
            'color' => 'Blanco/Azul',
            'size' => '42',
            'stock' => 12,
            'image_url' => 'url_zapatillas_42.jpg',
        ]);

        // Asignar Categorías
        $zapatillas->categories()->attach([$sport->id]);
    }
}