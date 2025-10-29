<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php', // Asegúrate de que esta línea esté descomentada
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Excluir rutas API de la protección CSRF
        $middleware->validateCsrfTokens(except: [
            'api/*',
        ]);

        // Aquí puedes añadir o modificar otros middlewares globales si es necesario
        // Ejemplo: Habilitar middleware de sesión para API (aunque lo hicimos en api.php)
        // $middleware->api(prepend: [
        //     \Illuminate\Session\Middleware\StartSession::class,
        // ]);
    
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // ...
    })->create();