<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\Request;

/**
 * Class BaseCustomException
 *
 * Base class for custom exceptions with JSON response.
 *
 * @author Christian Kelemba <christian.kelemba@stl-horizon.com>
 */
abstract class BaseCustomException extends Exception
{
    protected $statusCode = 500;
    protected $success = false;

    public function render(Request $request)
    {
        return response()->json([
            'success' => $this->success,
            'message' => $this->getMessage(),
            'status' => (string) $this->getStatusCode()
        ], $this->getStatusCode());
    }

    public function getStatusCode()
    {
        return $this->statusCode;
    }
}