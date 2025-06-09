<?php

use App\Exceptions\Database\DatabaseConnectionException;
use App\Exceptions\Database\DatabaseErrorException;
use App\Exceptions\Database\DatabaseQueryException;
use App\Exceptions\System\ServiceUnavailableException;
use App\Exceptions\System\SystemErrorException;
use App\Exceptions\User\UserAuthenticationException;
use App\Exceptions\User\UserAuthorizationException;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Psr\Log\LogLevel;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
            'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
            'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
            'check.overdue' => App\Http\Middleware\CheckOverdueReservationsMiddleware::class
        ]);
    })
    ->withEvents([
        __DIR__.'../app/Listeners',
    ])
    ->withExceptions(function (Exceptions $exceptions) {
        // error logging
        $exceptions->level(SystemErrorException::class, LogLevel::CRITICAL);
        $exceptions->level(ServiceUnavailableException::class, LogLevel::EMERGENCY);

        // database exceptions
        $exceptions->level(PDOException::class, LogLevel::CRITICAL);

        // display database exceptions
        $exceptions->render(function (QueryException $e) {
            $message = $e->getMessage();
        
            if (DatabaseConnectionException::isConnectionError($message)) {
                Log::alert('Database connection issue: ' . $message);
                throw new DatabaseConnectionException();
            }
        
            if (DatabaseQueryException::isQueryError($message)) {
                Log::error('Database query issue: ' . $message);
        
                // Single email for testing
                // Mail::to('example@gmail.com')->send(new QueryExceptionMail($e));
        
                throw new DatabaseQueryException();
            }
        
            Log::critical('Unhandled database error: ' . $message);
            throw new DatabaseErrorException();
        });
        
        // user exceptions
        $exceptions->level(UserAuthenticationException::class, LogLevel::NOTICE);
        $exceptions->level(UserAuthorizationException::class, LogLevel::WARNING);
    })->create();
