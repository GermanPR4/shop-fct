<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    /**
     * Los atributos que son asignables en masa.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'short_description',
        'long_description',
        'price',
        'is_active',
    ];

    /**
     * Los atributos que deberían ser casteados a tipos nativos.
     * Aseguramos que el precio sea tratado como un número decimal (float).
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price' => 'float', // <-- ¡Añadido!
        'is_active' => 'boolean', // <-- También útil para el campo boolean
    ];

    // ----------------------------------------------------
    // RELACIONES DE ELOQUENT
    // ----------------------------------------------------

    /**
     * Relación Uno-a-Muchos: Un producto tiene muchas variantes (tallas, colores).
     */
    public function details()
    {
        return $this->hasMany(ProductDetail::class);
    }

    /**
     * Relación Muchos-a-Muchos: Un producto pertenece a muchas categorías.
     * Se conecta a través de la tabla pivote 'category_product'.
     */
    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }

    /**
     * Relación Uno-a-Muchos: Un producto puede tener muchas ofertas aplicadas a él.
     */
    public function offers()
    {
        return $this->hasMany(Offer::class);
    }

    // ----------------------------------------------------
    // SCOPES (Consultas Auxiliares)
    // ----------------------------------------------------

    /**
     * Scope para obtener solo productos activos.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}