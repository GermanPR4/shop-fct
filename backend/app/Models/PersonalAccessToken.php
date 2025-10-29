<?php

namespace App\Models;

use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// NOTA: Renombramos la clase base a SanctumPersonalAccessToken para evitar conflictos de nombres
class PersonalAccessToken extends SanctumPersonalAccessToken 
{
    /**
     * Relación Muchos-a-Uno: Un token pertenece a un usuario (morphOne).
     *
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        // El 'tokenable' es la relación polimórfica que usa Sanctum.
        // En este caso, el tokenable siempre será un User.
        return $this->belongsTo(User::class, 'tokenable_id');
    }
}