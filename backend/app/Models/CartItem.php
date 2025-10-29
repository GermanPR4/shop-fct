<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;

    /**
     * Los atributos que son asignables en masa.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'cart_id',
        'product_detail_id',
        'quantity',
    ];

    // ----------------------------------------------------
    // RELACIONES DE ELOQUENT
    // ----------------------------------------------------

    /**
     * Relación Muchos-a-Uno: El ítem pertenece a un carrito de compra.
     */
    public function cart()
    {
        return $this->belongsTo(ShoppingCart::class);
    }

    /**
     * Relación Muchos-a-Uno: El ítem corresponde a una variante específica (talla/color).
     */
    public function productDetail()
    {
        return $this->belongsTo(ProductDetail::class);
    }
}