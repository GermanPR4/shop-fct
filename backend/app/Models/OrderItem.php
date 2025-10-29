<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    /**
     * Los atributos que son asignables en masa.
     * Es crucial permitir la asignación de precio, cantidad, y las FKs.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'order_id',
        'product_detail_id',
        'quantity',
        'price',
    ];

    /**
     * Los atributos que deberían ser casteados a tipos nativos.
     * Casteamos el precio para asegurar que siempre sea un número (float).
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price' => 'float',
    ];

    // ----------------------------------------------------
    // RELACIONES DE ELOQUENT
    // ----------------------------------------------------

    /**
     * Relación Muchos-a-Uno: El ítem pertenece a un pedido.
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Relación Muchos-a-Uno: El ítem corresponde a una variante específica (talla/color).
     */
    public function productDetail()
    {
        return $this->belongsTo(ProductDetail::class);
    }
}