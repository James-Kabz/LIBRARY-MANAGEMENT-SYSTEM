<?php

namespace App\Exceptions;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;
use Illuminate\Support\Facades\Log;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            // Log critical errors
            if ($this->shouldReport($e)) {
                Log::critical($e->getMessage(), [
                    'exception' => get_class($e),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'trace' => $e->getTraceAsString(),
                ]);
            }
        });

        $this->renderable(function (Throwable $e, Request $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                if ($e instanceof ValidationException) {
                    return api_validation_error($e->errors(), $e->getMessage());
                }

                if ($e instanceof AuthenticationException) {
                    return api_error('Unauthenticated', 401);
                }

                if ($e instanceof AuthorizationException) {
                    return api_error('Unauthorized action', 403);
                }

                if ($e instanceof ModelNotFoundException || $e instanceof NotFoundHttpException) {
                    return api_error('Resource not found', 404);
                }

                if ($e instanceof BookNotFoundException) {
                    return api_error('Book not found', 404);
                }

                if ($e instanceof UserNotFoundException) {
                    return api_error('User not found', 404);
                }

                if ($e instanceof ReservationNotFoundException) {
                    return api_error('Reservation not found', 404);
                }

                if ($e instanceof BookNotAvailableException) {
                    return api_error('Book is not available for reservation', 400);
                }

                // Handle all other exceptions
                $statusCode = $this->isHttpException($e) ? $e->getCode() : 500;
                $message = $statusCode === 500 ? 'Server error' : $e->getMessage();
                
                return api_error($message, $statusCode);
            }

            return parent::render($request, $e);
        });
    }
}
