<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    /**
     * Los atributos que son asignables en masa.
     * Permitiremos asignar el usuario, las IDs de dirección y el precio total.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'shipping_address_id',
        'billing_address_id',
        'total_price',
        'status',
    ];

    /**
     * Los atributos que deberían ser casteados a tipos nativos.
     * Aseguramos que el precio total sea tratado como un decimal.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'total_price' => 'float',
    ];

    // ----------------------------------------------------
    // RELACIONES DE ELOQUENT
    // ----------------------------------------------------

    /**
     * Relación Muchos-a-Uno: El pedido pertenece a un usuario.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relación Muchos-a-Uno: El pedido tiene una dirección de envío.
     */
    public function shippingAddress()
    {
        return $this->belongsTo(Address::class, 'shipping_address_id');
    }

    /**
     * Relación Muchos-a-Uno: El pedido tiene una dirección de facturación.
     */
    public function billingAddress()
    {
        return $this->belongsTo(Address::class, 'billing_address_id');
    }

    /**
     * Relación Uno-a-Muchos: Un pedido tiene muchos ítems.
     */
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}