<?php

require 'vendor/autoload.php';

use App\Models\Product;
use Illuminate\Support\Facades\DB;

// Cargar el entorno de Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== PRUEBA DE BÚSQUEDA DE PRODUCTOS ===\n\n";

// 1. Contar total de productos
$totalProducts = Product::count();
echo "Total de productos en la base de datos: {$totalProducts}\n\n";

// 2. Mostrar algunos productos de ejemplo
echo "--- Productos de ejemplo ---\n";
$sampleProducts = Product::select('id', 'name', 'short_description')
    ->limit(5)
    ->get();

foreach ($sampleProducts as $product) {
    echo "ID: {$product->id} - {$product->name}";
    if ($product->short_description) {
        echo " - {$product->short_description}";
    }
    echo "\n";
}

echo "\n--- Búsqueda de 'gorra' ---\n";
$gorras = Product::where('name', 'LIKE', '%gorra%')
    ->orWhere('short_description', 'LIKE', '%gorra%')
    ->orWhere('long_description', 'LIKE', '%gorra%')
    ->get(['id', 'name', 'short_description']);

if ($gorras->count() > 0) {
    echo "Encontradas {$gorras->count()} gorras:\n";
    foreach ($gorras as $gorra) {
        echo "  - ID: {$gorra->id} - {$gorra->name}\n";
    }
} else {
    echo "No se encontraron gorras en la base de datos.\n";
}

echo "\n--- Búsqueda de 'vestido' ---\n";
$vestidos = Product::where('name', 'LIKE', '%vestido%')
    ->orWhere('short_description', 'LIKE', '%vestido%')
    ->orWhere('long_description', 'LIKE', '%vestido%')
    ->get(['id', 'name', 'short_description']);

if ($vestidos->count() > 0) {
    echo "Encontrados {$vestidos->count()} vestidos:\n";
    foreach ($vestidos as $vestido) {
        echo "  - ID: {$vestido->id} - {$vestido->name}\n";
    }
} else {
    echo "No se encontraron vestidos en la base de datos.\n";
}

echo "\n--- Verificando qué palabras clave funcionan ---\n";
$keywords = ['camisa', 'pantalon', 'zapato', 'chaqueta', 'jersey'];
foreach ($keywords as $keyword) {
    $count = Product::where('name', 'LIKE', "%{$keyword}%")
        ->orWhere('short_description', 'LIKE', "%{$keyword}%")
        ->orWhere('long_description', 'LIKE', "%{$keyword}%")
        ->count();
    echo "{$keyword}: {$count} productos encontrados\n";
}