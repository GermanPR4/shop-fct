<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShoppingCart extends Model
{
    use HasFactory;

    /**
     * Los atributos que son asignables en masa.
     * Permitimos asignar el ID de usuario y el token de sesión.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'session_token',
    ];

    // ----------------------------------------------------
    // RELACIONES DE ELOQUENT
    // ----------------------------------------------------

    /**
     * Relación Muchos-a-Uno: Un carrito pertenece a un usuario (o es nulo).
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relación Uno-a-Muchos: Un carrito contiene muchos ítems.
     */
    public function items()
    {
        return $this->hasMany(CartItem::class, 'cart_id');
    }
}