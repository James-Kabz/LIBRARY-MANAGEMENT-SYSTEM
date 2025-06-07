<?php

namespace App\Exceptions;

use Exception;

class BookNotAvailableException extends Exception
{
    public function __construct(string $message = "Book is not available for reservation", int $code = 400)
    {
        parent::__construct($message, $code);
    }
}
