<?php

namespace App\Http\Controllers;

use App\Models\AiSession;
use Illuminate\Http\Request;

// AI Session Controller: No necesitas Store ni Index
// Lo manejamos implícitamente a través del mensaje

// AI Message Controller (El motor del chat)
// (Ejemplo para AiMessageController.php)
class AiSessionController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'session_token' => 'required|string',
            'message' => 'required|string|max:500',
        ]);
        
        
        return response()->json(['message' => 'Lógica de IA pendiente de implementación.'], 200);
    }
}
