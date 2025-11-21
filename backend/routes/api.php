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
// SOLUCIÓN AL ERROR: "Route [login] not defined"
// ----------------------------------------------------
// Laravel intenta redirigir aquí si falla la autenticación.
// Definimos esta ruta para que devuelva JSON en lugar de intentar cargar una vista.
Route::get('/login', function () {
    return response()->json(['message' => 'Unauthenticated. Please log in.'], 401);
})->name('login');

// ----------------------------------------------------
// AUTHENTICATION ROUTES
// ----------------------------------------------------
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']); // Login real (POST)

// ----------------------------------------------------
// RUTAS PÚBLICAS (Catálogo y Lectura)
// ----------------------------------------------------

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);

// ----------------------------------------------------
// RUTAS DE INVITADOS/USUARIOS (Requieren Sesión Web)
// ----------------------------------------------------
// NOTA: Asegúrate de que tu frontend envíe las cookies de sesión
// y que 'config/cors.php' permita 'supports_credentials' => true.

Route::middleware('web')->group(function () {
    
    // Rutas de Carrito (POST/GET/DELETE para añadir/obtener/eliminar items)
    Route::resource('cart', CartItemController::class)->except(['create', 'edit', 'show']);
    Route::put('cart/{cart}', [CartItemController::class, 'update']); 
    
    // Chat de IA: También necesita la sesión para rastrear al invitado (session_token)
    Route::post('/chat', [AiMessageController::class, 'store']); 
});


// ----------------------------------------------------
// RUTAS PROTEGIDAS (Requieren Sanctum)
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
    // MÓDULO DE ADMINISTRACIÓN
    // ----------------------------------------------------
    // RECOMENDACIÓN: En el futuro, añade un middleware extra aquí como 'can:admin'
    // para que los usuarios normales no puedan acceder a estas rutas.
    
    Route::prefix('admin')->group(function () {
        
        // Mantenimiento de Productos
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{product}', [ProductController::class, 'update']);
        Route::delete('/products/{product}', [ProductController::class, 'destroy']);
        
        // Mantenimiento de Usuarios
        Route::resource('users', UserController::class)->except(['create', 'edit']);

        // Mantenimiento de Variantes de Productos
        Route::resource('product-details', ProductDetailController::class)->except(['create', 'edit']);
        
        // Mantenimiento de Ofertas
        Route::resource('offers', OfferController::class)->except(['create', 'edit']);

        // Consulta de Pedidos y Detalles
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