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

        // Habilitar CORS para rutas API
        $middleware->api(append: [
            \App\Http\Middleware\Cors::class,
        ]);
    
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // ...
    })->create();