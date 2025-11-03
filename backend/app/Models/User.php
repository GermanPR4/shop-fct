<?php

namespace App\Models;

// Asegúrate de que todas las clases de modelos están importadas
use App\Models\Address;
use App\Models\Order;
use App\Models\ShoppingCart;
use App\Models\AiSession;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * App\Models\User
 * 
 * @property int $id
 * @property string $name
 * @property string $email
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property string $role
 * @property string|null $phone
 * @property string|null $address
 * @property \Illuminate\Support\Carbon|null $birth_date
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * 
 * @method \Laravel\Sanctum\NewAccessToken createToken(string $name, array $abilities = ['*'], \DateTimeInterface $expiresAt = null)
 * @method \Illuminate\Database\Eloquent\Relations\MorphMany tokens()
 * @method \Laravel\Sanctum\PersonalAccessToken|null currentAccessToken()
 * @method void tokenCan(string $ability)
 * @method bool tokenCant(string $ability)
 * @method \Illuminate\Database\Eloquent\Collection|\Laravel\Sanctum\PersonalAccessToken[] tokens
 * 
 * @mixin \Eloquent
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Los atributos que son asignables en masa.
     * Añadimos el campo 'role' que creamos en la migración.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role', // ¡Añadir este campo es crucial!
        'phone',
        'address', 
        'birth_date',
    ];

    /**
     * Los atributos que deberían estar ocultos para las arrays.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Los atributos que deberían ser casteados a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // ----------------------------------------------------
    // RELACIONES DE ELOQUENT
    // ----------------------------------------------------

    /**
     * Relación Uno-a-Muchos: Un usuario puede tener muchas direcciones.
     */
    public function addresses()
    {
        return $this->hasMany(Address::class);
    }

    /**
     * Relación Uno-a-Muchos: Un usuario puede tener muchos pedidos.
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Relación Uno-a-Uno: Un usuario tiene un único carrito de compra activo.
     */
    public function shoppingCart()
    {
        return $this->hasOne(ShoppingCart::class);
    }

    /**
     * Relación Uno-a-Muchos: Un usuario puede tener muchas sesiones de IA.
     */
    public function aiSessions()
    {
        return $this->hasMany(AiSession::class);
    }

    // ----------------------------------------------------
    // SCOPES (Funciones Auxiliares)
    // ----------------------------------------------------

    /**
     * Scope para verificar si el usuario es un administrador/empleado.
     */
    public function isAdminOrEmployee(): bool
    {
        return $this->role === 'admin' || $this->role === 'employee';
    }
}