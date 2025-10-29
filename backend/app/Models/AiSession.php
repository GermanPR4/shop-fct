<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AiSession extends Model
{
    use HasFactory;

    /**
     * Los atributos que son asignables en masa.
     * Permitimos la asignación del usuario y el token de sesión.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'session_token',
        'last_message_at',
    ];

    /**
     * Los atributos que deberían ser casteados a tipos nativos.
     * Aseguramos que la fecha del último mensaje sea tratada como un objeto de fecha.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'last_message_at' => 'datetime',
    ];

    // ----------------------------------------------------
    // RELACIONES DE ELOQUENT
    // ----------------------------------------------------

    /**
     * Relación Muchos-a-Uno (Opcional): La sesión pertenece a un usuario.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relación Uno-a-Muchos: Una sesión tiene muchos mensajes.
     */
    public function messages()
    {
        return $this->hasMany(AiMessage::class, 'session_id');
    }
}