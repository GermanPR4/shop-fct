<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductDetail extends Model
{
    use HasFactory;

    /**
     * Los atributos que son asignables en masa.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'product_id',
        'color',
        'size',
        'image_url',
        'stock',
    ];

    // ----------------------------------------------------
    // RELACIONES DE ELOQUENT
    // ----------------------------------------------------

    /**
     * Relación Muchos-a-Uno: La variante pertenece a un producto principal.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Relación Uno-a-Muchos: Una variante puede estar en muchos ítems de pedidos.
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Relación Uno-a-Muchos: Una variante puede estar en muchos ítems de carrito.
     */
    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Relación Uno-a-Muchos: Una variante puede tener muchas ofertas específicas.
     */
    public function offers()
    {
        return $this->hasMany(Offer::class);
    }
}