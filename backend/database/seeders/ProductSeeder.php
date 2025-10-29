<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductDetail;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // --- 1. OBTENER/CREAR CATEGORÍAS ---
        // (Asegúrate de que CategorySeeder se ejecuta antes en DatabaseSeeder.php)
        $casual = Category::firstOrCreate(['name' => 'Casual']);
        $sport = Category::firstOrCreate(['name' => 'Deportivo']);
        $winter = Category::firstOrCreate(['name' => 'Invierno']);
        $summer = Category::firstOrCreate(['name' => 'Veraniego']);
        $dress = Category::firstOrCreate(['name' => 'De Vestir']);
        $ofertas = Category::firstOrCreate(['name' => 'Ofertas']);

        // --- 2. CREAR PRODUCTOS Y VARIANTES ---

        // 1. Sudadera (Existente)
        $sudadera = Product::updateOrCreate(
            ['name' => 'Sudadera con Capucha (Unisex)'],
            [
                'short_description' => 'Sudadera de algodón suave con ajuste regular.',
                'long_description' => 'Sudadera perfecta para el día a día. Fabricada con 80% algodón y 20% poliéster. Ideal para vestir casual o climas fríos.',
                'price' => 39.99,
                'is_active' => true,
            ]
        );
        $detailsSudadera = [
            ['color' => 'Gris', 'size' => 'S', 'stock' => 15, 'image_url' => 'https://placehold.co/600x600/cccccc/777777?text=Sudadera+Gris'],
            ['color' => 'Gris', 'size' => 'M', 'stock' => 30, 'image_url' => 'https://placehold.co/600x600/cccccc/777777?text=Sudadera+Gris'],
            ['color' => 'Negro', 'size' => 'L', 'stock' => 20, 'image_url' => 'https://placehold.co/600x600/000000/ffffff?text=Sudadera+Negra'],
            ['color' => 'Azul Marino', 'size' => 'M', 'stock' => 10, 'image_url' => 'https://placehold.co/600x600/000080/ffffff?text=Sudadera+Azul'],
        ];
        foreach ($detailsSudadera as $detail)
            $sudadera->details()->updateOrCreate(['color' => $detail['color'], 'size' => $detail['size']], $detail);
        $sudadera->categories()->sync([$casual->id, $winter->id]);

        // 2. Zapatillas (Existente)
        $zapatillas = Product::updateOrCreate(
            ['name' => 'Zapatillas ProRunner 2.0'],
            [
                'short_description' => 'Calzado ligero para running y entrenamiento.',
                'long_description' => 'Tecnología de amortiguación avanzada. Transpirables y resistentes. Perfectas para largas distancias o gym. Upper de malla técnica.',
                'price' => 79.50,
                'is_active' => true,
            ]
        );
        $detailsZapatillas = [
            ['color' => 'Blanco/Azul', 'size' => '42', 'stock' => 12, 'image_url' => 'https://placehold.co/600x600/ffffff/0000ff?text=Zapas+BlancAzul'],
            ['color' => 'Negro/Rojo', 'size' => '43', 'stock' => 8, 'image_url' => 'https://placehold.co/600x600/000000/ff0000?text=Zapas+NegRojo'],
            ['color' => 'Blanco/Azul', 'size' => '44', 'stock' => 15, 'image_url' => 'https://placehold.co/600x600/ffffff/0000ff?text=Zapas+BlancAzul'],
        ];
        foreach ($detailsZapatillas as $detail)
            $zapatillas->details()->updateOrCreate(['color' => $detail['color'], 'size' => $detail['size']], $detail);
        $zapatillas->categories()->sync([$sport->id]);

        // 3. Camiseta Básica (Descripción completada)
        $camiseta = Product::updateOrCreate(
            ['name' => 'Camiseta Algodón Orgánico'],
            [
                'short_description' => 'Camiseta suave y cómoda para el día a día.',
                'long_description' => 'Un básico imprescindible. Fabricada en 100% algodón orgánico certificado. Corte regular y cuello redondo.',
                'price' => 19.95,
                'is_active' => true,
            ]
        );
        $detailsCamiseta = [
            ['color' => 'Blanco', 'size' => 'S', 'stock' => 50],
            ['color' => 'Blanco', 'size' => 'M', 'stock' => 60],
            ['color' => 'Negro', 'size' => 'M', 'stock' => 40],
            ['color' => 'Negro', 'size' => 'L', 'stock' => 35],
            ['color' => 'Verde Oliva', 'size' => 'M', 'stock' => 25],
        ];
        foreach ($detailsCamiseta as $detail)
            $camiseta->details()->updateOrCreate(['color' => $detail['color'], 'size' => $detail['size']], $detail);
        $camiseta->categories()->sync([$casual->id, $summer->id]);

        // 4. Pantalón Chino (Descripción completada)
        $pantalon = Product::updateOrCreate(
            ['name' => 'Pantalón Chino Slim Fit'],
            [
                'short_description' => 'Corte moderno y tejido elástico.',
                'long_description' => 'Pantalón versátil perfecto para la oficina o el fin de semana. Tejido de sarga de algodón elástico para máxima comodidad.',
                'price' => 45.00,
                'is_active' => true,
            ]
        );
        $detailsPantalon = [
            ['color' => 'Beige', 'size' => '30', 'stock' => 18],
            ['color' => 'Beige', 'size' => '32', 'stock' => 22],
            ['color' => 'Azul Marino', 'size' => '32', 'stock' => 15],
            ['color' => 'Azul Marino', 'size' => '34', 'stock' => 12],
        ];
        foreach ($detailsPantalon as $detail)
            $pantalon->details()->updateOrCreate(['color' => $detail['color'], 'size' => $detail['size']], $detail);
        $pantalon->categories()->sync([$dress->id, $casual->id]);

        // 5. Chaqueta Impermeable (NUEVO)
        $chaqueta = Product::updateOrCreate(
            ['name' => 'Chaqueta Impermeable Trail'],
            [
                'short_description' => 'Protección ligera contra viento y lluvia.',
                'long_description' => 'Ideal para actividades al aire libre. Tejido transpirable y costuras selladas. Capucha ajustable.',
                'price' => 95.00,
                'is_active' => true,
            ]
        );
        $detailsChaqueta = [
            ['color' => 'Negro', 'size' => 'M', 'stock' => 10, 'image_url' => 'https://placehold.co/600x600/000000/ffffff?text=Chaqueta+Negra'],
            ['color' => 'Negro', 'size' => 'L', 'stock' => 7, 'image_url' => 'https://placehold.co/600x600/000000/ffffff?text=Chaqueta+Negra'],
            ['color' => 'Verde Bosque', 'size' => 'M', 'stock' => 12, 'image_url' => 'https://placehold.co/600x600/228B22/ffffff?text=Chaqueta+Verde'],
        ];
        foreach ($detailsChaqueta as $detail)
            $chaqueta->details()->updateOrCreate(['color' => $detail['color'], 'size' => $detail['size']], $detail);
        $chaqueta->categories()->sync([$sport->id, $winter->id]);

        // 6. Vestido Verano (NUEVO)
        $vestido = Product::updateOrCreate(
            ['name' => 'Vestido Lino Estampado'],
            [
                'short_description' => 'Fresco y ligero, perfecto para días soleados.',
                'long_description' => 'Vestido de lino con estampado floral, tirantes finos y corte evasé. Ideal para un look casual de verano.',
                'price' => 55.50,
                'is_active' => true,
            ]
        );
        $detailsVestido = [
            ['color' => 'Blanco Floral', 'size' => 'S', 'stock' => 20],
            ['color' => 'Blanco Floral', 'size' => 'M', 'stock' => 25],
            ['color' => 'Azul Rayas', 'size' => 'M', 'stock' => 15],
        ];
        foreach ($detailsVestido as $detail)
            $vestido->details()->updateOrCreate(['color' => $detail['color'], 'size' => $detail['size']], $detail);
        $vestido->categories()->sync([$summer->id, $casual->id]);

        // 7. Zapatos de Vestir (NUEVO)
        $zapatos = Product::updateOrCreate(
            ['name' => 'Zapatos Oxford Piel'],
            [
                'short_description' => 'Zapato clásico de vestir para hombre.',
                'long_description' => 'Fabricados en piel de alta calidad con suela de cuero. Diseño elegante y atemporal.',
                'price' => 120.00,
                'is_active' => true,
            ]
        );
        $detailsZapatos = [
            ['color' => 'Negro', 'size' => '41', 'stock' => 10],
            ['color' => 'Negro', 'size' => '42', 'stock' => 15],
            ['color' => 'Marrón Oscuro', 'size' => '42', 'stock' => 8],
            ['color' => 'Marrón Oscuro', 'size' => '43', 'stock' => 9],
        ];
        foreach ($detailsZapatos as $detail)
            $zapatos->details()->updateOrCreate(['color' => $detail['color'], 'size' => $detail['size']], $detail);
        $zapatos->categories()->sync([$dress->id]);

        // 8. Gorra (NUEVO)
        $gorra = Product::updateOrCreate(
            ['name' => 'Gorra Baseball Logo Omni'],
            [
                'short_description' => 'Gorra de algodón con logo bordado.',
                'long_description' => 'Visera curvada y cierre ajustable. Un accesorio perfecto para un look casual o deportivo.',
                'price' => 22.00,
                'is_active' => true,
            ]
        );
        $detailsGorra = [
            ['color' => 'Negro', 'size' => 'Única', 'stock' => 50],
            ['color' => 'Blanco', 'size' => 'Única', 'stock' => 45],
            ['color' => 'Rojo', 'size' => 'Única', 'stock' => 30],
        ];
        foreach ($detailsGorra as $detail)
            $gorra->details()->updateOrCreate(['color' => $detail['color'], 'size' => $detail['size']], $detail);
        $gorra->categories()->sync([$casual->id, $sport->id, $summer->id]);
    }
}
