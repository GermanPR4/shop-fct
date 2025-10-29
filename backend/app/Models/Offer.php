<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Offer extends Model
{
    use HasFactory;

    /**
     * Los atributos que son asignables en masa.
     * Incluimos todos los campos de control de la oferta.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'product_id',
        'product_detail_id',
        'name',
        'discount_percentage',
        'start_date',
        'end_date',
        'active',
    ];

    /**
     * Los atributos que deberían ser casteados a tipos nativos.
     * Es crucial castear el porcentaje y las fechas.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'discount_percentage' => 'float',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'active' => 'boolean',
    ];

    // ----------------------------------------------------
    // RELACIONES DE ELOQUENT
    // ----------------------------------------------------

    /**
     * Relación Muchos-a-Uno (Opcional): La oferta pertenece a un producto genérico.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Relación Muchos-a-Uno (Opcional): La oferta pertenece a una variante específica.
     */
    public function productDetail()
    {
        return $this->belongsTo(ProductDetail::class);
    }

    // ----------------------------------------------------
    // SCOPES (Consultas Auxiliares)
    // ----------------------------------------------------

    /**
     * Scope para obtener solo ofertas activas y vigentes por fecha.
     */
    public function scopeVigente($query)
    {
        return $query->where('active', true)
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now());
    }
}