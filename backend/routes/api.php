<?php

use App\Http\Controllers\AddressController;
use App\Http\Controllers\AiMessageController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CartItemController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductDetailController;
use App\Http\Controllers\OrderItemController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/**
 * Ruta requerida por Laravel para redirección de autenticación.
 * Devuelve JSON en lugar de una vista para compatibilidad con APIs.
 */
Route::get('/login', function () {
    return response()->json(['message' => 'Unauthenticated. Please log in.'], 401);
})->name('login');

/* ============================================================================
   AUTENTICACIÓN
   ============================================================================ */

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/* ============================================================================
   RUTAS PÚBLICAS - Catálogo de productos y categorías
   ============================================================================ */

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);

/* ============================================================================
   CARRITO Y CHAT - Requieren sesión web (invitados y usuarios)
   ============================================================================ */

Route::middleware('web')->group(function () {
    
    // Gestión del carrito de compras
    Route::resource('cart', CartItemController::class)->except(['create', 'edit', 'show']);
    Route::put('cart/{cart}', [CartItemController::class, 'update']); 
    
    // Chat con IA (usa session_token para invitados)
    Route::post('/chat', [AiMessageController::class, 'store']); 
});

/* ============================================================================
   RUTAS PROTEGIDAS - Requieren autenticación con Sanctum
   ============================================================================ */

Route::middleware('auth:sanctum')->group(function () {
    
    // Gestión de perfil y cuenta
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    // Pedidos y checkout
    Route::post('/checkout', [OrderController::class, 'store']); 
    Route::get('/orders', [OrderController::class, 'index']); 

    // Direcciones de envío
    Route::resource('addresses', AddressController::class)->except(['create', 'edit', 'show']);

    /* ========================================================================
       PANEL DE ADMINISTRACIÓN
       Nota: Considerar añadir middleware de roles (ej: 'can:admin')
       ======================================================================== */
    
    Route::prefix('admin')->group(function () {
        
        // Gestión de productos
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{product}', [ProductController::class, 'update']);
        Route::delete('/products/{product}', [ProductController::class, 'destroy']);
        
        // Gestión de usuarios
        Route::resource('users', UserController::class)->except(['create', 'edit']);

        // Variantes de productos
        Route::resource('product-details', ProductDetailController::class)->except(['create', 'edit']);
        
        // Ofertas y promociones
        Route::resource('offers', OfferController::class)->except(['create', 'edit']);

        // Consulta de pedidos
        Route::resource('order-items', OrderItemController::class)->only(['index', 'show']);
    });
});

// Ruta de prueba para verificar conectividad
Route::get('/test', function () {
    return response()->json([
        'message' => 'API funcionando correctamente',
        'timestamp' => now(),
        'environment' => app()->environment()
    ]);
});