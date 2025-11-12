<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // Este controlador solo debería ser accesible por administradores/empleados

    public function index(Request $request)
    {
        try {
            // Verificar que el usuario autenticado sea empleado o admin
            $user = $request->user();
            
            if (!$user) {
                return response()->json([
                    'message' => 'Usuario no autenticado'
                ], 401);
            }
            
            if (!in_array($user->role, ['employee', 'admin'])) {
                return response()->json([
                    'message' => 'No tienes permisos para acceder a esta sección'
                ], 403);
            }
            
            // Lista todos los usuarios con información estructurada para el admin panel
            $users = User::select(['id', 'name', 'email', 'role', 'phone', 'created_at', 'email_verified_at'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($userRecord) {
                    return [
                        'id' => $userRecord->id,
                        'name' => $userRecord->name,
                        'email' => $userRecord->email,
                        'role' => $userRecord->role ?? 'customer',
                        'phone' => $userRecord->phone ?? 'N/A',
                        'registered_at' => $userRecord->created_at ? $userRecord->created_at->format('d/m/Y H:i') : 'N/A',
                        'verified' => $userRecord->email_verified_at ? true : false,
                        'status' => $userRecord->email_verified_at ? 'Activo' : 'Pendiente verificación'
                    ];
                });

            return response()->json([
                'users' => $users,
                'total' => $users->count(),
                'message' => 'Usuarios obtenidos exitosamente'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error interno del servidor'
            ], 500);
        }
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