<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use HasFactory;

    /**
     * Los atributos que son asignables en masa.
     * Permite crear una dirección enviando todos estos campos.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'street',
        'city',
        'zip_code',
        'country',
        'is_shipping',
        'is_billing',
    ];

    // ----------------------------------------------------
    // RELACIONES DE ELOQUENT
    // ----------------------------------------------------

    /**
     * Relación Muchos-a-Uno: Una dirección pertenece a un usuario.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}