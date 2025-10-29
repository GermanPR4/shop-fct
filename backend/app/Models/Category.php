<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    /**
     * Los atributos que son asignables en masa.
     * Permitirá crear categorías solo con el nombre.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
    ];

    // ----------------------------------------------------
    // RELACIONES DE ELOQUENT
    // ----------------------------------------------------

    /**
     * Relación Muchos-a-Muchos: Una categoría puede tener muchos productos.
     * Se conecta a través de la tabla 'category_product'.
     */
    public function products()
    {
        return $this->belongsToMany(Product::class);
    }
}