<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// AÑADE ESTA RUTA DEBAJO
Route::get('/test', function () {
    return response()->json(['message' => '¡Hola! La conexión con Laravel funciona.']);
});