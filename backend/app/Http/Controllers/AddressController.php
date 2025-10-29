<?php

namespace App\Http\Controllers;

use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AddressController extends Controller
{
    /**
     * Display a listing of the resource (GET /api/addresses).
     * NOTA: Esta ruta debe estar dentro del middleware 'auth:sanctum'.
     */
    public function index(Request $request)
    {
        // Usamos $request->user() para obtener el usuario autenticado
        return response()->json($request->user()->addresses);
    }

    /**
     * Store a newly created resource in storage (POST /api/addresses).
     * NOTA: Esta ruta debe estar dentro del middleware 'auth:sanctum'.
     */
    public function store(Request $request)
    {
        // 1. Obtener el usuario autenticado
        $user = $request->user();

        // 2. Validar los datos
        $validated = $request->validate([
            'street' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'zip_code' => 'required|string|max:20',
            'country' => 'required|string|max:100',
            'is_shipping' => 'boolean',
            'is_billing' => 'boolean',
        ]);

        // 3. Crear la dirección asociada al usuario
        // Usamos la relación $user->addresses()
        $address = $user->addresses()->create($validated);
        
        return response()->json($address, 201);
    }
    
    // show, update, destroy se implementan si es necesario más adelante
}