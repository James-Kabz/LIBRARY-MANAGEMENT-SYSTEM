<?php

namespace App\Exceptions;

use Exception;

class BookNotFoundException extends Exception
{
    public function __construct(string $message = "Book not found", int $code = 404)
    {
        parent::__construct($message, $code);
    }
}
