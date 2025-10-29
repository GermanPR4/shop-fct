<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // Este controlador solo debería ser accesible por administradores/empleados

    public function index()
    {
        // Lista todos los usuarios (solo para administración)
        return response()->json(User::all());
    }

    public function store(Request $request)
    {
        // Crear un nuevo usuario (posiblemente un nuevo empleado por el admin)
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|in:customer,employee,admin', // Validar que el rol sea uno de los permitidos
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        return response()->json($user, 201);
    }
    
    // Los demás métodos (show, update, destroy) quedan para el CRUD completo
}