<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AiMessage extends Model
{
    use HasFactory;

    /**
     * Los atributos que son asignables en masa.
     * Incluimos todos los campos esenciales para la conversación.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'session_id',
        'role',
        'content',
        'is_product_query',
    ];

    /**
     * Los atributos que deberían ser casteados a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_product_query' => 'boolean',
    ];

    // ----------------------------------------------------
    // RELACIONES DE ELOQUENT
    // ----------------------------------------------------

    /**
     * Relación Muchos-a-Uno: El mensaje pertenece a una sesión de IA.
     */
    public function session()
    {
        return $this->belongsTo(AiSession::class, 'session_id');
    }
}