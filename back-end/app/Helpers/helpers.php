<?php

use App\Helpers\ApiResponse;
use Illuminate\Http\JsonResponse;

if (!function_exists('api_success')) {
    /**
     * Return success response
     *
     * @param mixed $data
     * @param string $message
     * @param int $code
     * @return JsonResponse
     */
    function api_success($data = null, string $message = 'Operation successful', int $code = 200): JsonResponse
    {
        return ApiResponse::success($data, $message, $code);
    }
}

if (!function_exists('api_error')) {
    /**
     * Return error response
     *
     * @param string $message
     * @param int $code
     * @param mixed $errors
     * @return JsonResponse
     */
    function api_error(string $message = 'Operation failed', int $code = 400, $errors = null): JsonResponse
    {
        return ApiResponse::error($message, $code, $errors);
    }
}

if (!function_exists('api_validation_error')) {
    /**
     * Return validation error response
     *
     * @param mixed $errors
     * @param string $message
     * @return JsonResponse
     */
    function api_validation_error($errors, string $message = 'Validation failed'): JsonResponse
    {
        return ApiResponse::validationError($errors, $message);
    }
}
