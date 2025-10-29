<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource (GET /api/categories).
     */
    public function index()
    {
        // Devuelve todas las categorías (no necesita autenticación)
        return response()->json(Category::all());
    }
    
    // Los demás métodos (store, show, update, destroy) quedan para el módulo Admin
}