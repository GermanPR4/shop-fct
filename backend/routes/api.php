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

// ----------------------------------------------------
// AUTHENTICATION ROUTES
// ----------------------------------------------------
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ----------------------------------------------------
// RUTAS PÚBLICAS (Catálogo y Lectura)
// ----------------------------------------------------

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);

// ----------------------------------------------------
// RUTAS DE INVITADOS/USUARIOS (Requieren Sesión Web)
// ----------------------------------------------------

// Usamos el alias 'web' que está correctamente registrado en Laravel para cargar la sesión.
Route::middleware('web')->group(function () {
    
    // Rutas de Carrito (POST/GET/DELETE para añadir/obtener/eliminar items)
    Route::resource('cart', CartItemController::class)->except(['create', 'edit', 'show']);
    Route::put('cart/{cart}', [CartItemController::class, 'update']); 
    
    // Chat de IA: También necesita la sesión para rastrear al invitado (session_token)
    Route::post('/chat', [AiMessageController::class, 'store']);
    
    // Ruta para que la IA pueda añadir productos al carrito
    Route::post('/ai/add-to-cart', [AiMessageController::class, 'addToCart']); 
});


// ----------------------------------------------------
// RUTAS PROTEGIDAS (Requieren Sanctum, para Checkout y Perfil)
// ----------------------------------------------------

Route::middleware('auth:sanctum')->group(function () {
    // User profile and account management
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    // Gestión de Pedidos (Checkout y Historial)
    Route::post('/checkout', [OrderController::class, 'store']); 
    Route::get('/orders', [OrderController::class, 'index']); 

    // Gestión de Direcciones (CRUD del usuario)
    Route::resource('addresses', AddressController::class)->except(['create', 'edit', 'show']);

    // ----------------------------------------------------
    // MÓDULO DE ADMINISTRACIÓN (PROTEGIDO POR LOGIN)
    // ----------------------------------------------------
    
    // Mantenimiento de Usuarios
    Route::resource('admin/users', UserController::class)->except(['create', 'edit']);

    // Mantenimiento de Variantes de Productos
    Route::resource('admin/product-details', ProductDetailController::class)->except(['create', 'edit']);
    
    // Mantenimiento de Ofertas
    Route::resource('admin/offers', OfferController::class)->except(['create', 'edit']);

    // Consulta de Pedidos y Detalles
    Route::resource('admin/order-items', OrderItemController::class)->only(['index', 'show']);
});

// Ruta de prueba para verificar conectividad
Route::get('/test', function () {
    return response()->json([
        'message' => 'API funcionando correctamente',
        'timestamp' => now(),
        'environment' => app()->environment()
    ]);
});
