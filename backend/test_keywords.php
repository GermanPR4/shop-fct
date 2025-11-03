<?php

require 'vendor/autoload.php';

// Cargar el entorno de Laravel
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Crear una instancia del controlador para probar los métodos
$controller = new \App\Http\Controllers\AiMessageController();

echo "=== PRUEBA DE FUNCIONES DE IA ===\n\n";

// Usar reflexión para acceder a métodos privados
$reflection = new ReflectionClass($controller);

$extractKeywordsMethod = $reflection->getMethod('extractKeywords');
$extractKeywordsMethod->setAccessible(true);

$searchProductsMethod = $reflection->getMethod('searchProducts');
$searchProductsMethod->setAccessible(true);

// Probar extracción de palabras clave
$testMessages = [
    "Hola, tienen gorras?",
    "Busco un vestido rojo",
    "¿Tienes camisas azules?",
    "Me gusta la sudadera de nike",
    "Necesito pantalones de vestir"
];

foreach ($testMessages as $message) {
    echo "Mensaje: '{$message}'\n";
    $keywords = $extractKeywordsMethod->invoke($controller, $message);
    echo "Keywords extraídas: " . implode(', ', $keywords) . "\n";
    
    if (!empty($keywords)) {
        $products = $searchProductsMethod->invoke($controller, $keywords);
        echo "Productos encontrados: {$products->count()}\n";
        if ($products->count() > 0) {
            foreach ($products as $product) {
                echo "  - {$product->name}\n";
            }
        }
    }
    echo "\n";
}