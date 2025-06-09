<?php

namespace App\Exceptions;

use Exception;

class UserNotFoundException extends BaseCustomException
{
    protected $statusCode = 404;

    protected $message = 'User not found';
    public function __construct(string $message = "User not found", int $code = 404)
    {
        parent::__construct($message, $code);
    }
}
