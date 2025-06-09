<?php

namespace App\Exceptions;

class AuthorNotFoundException extends BaseCustomException
{
    protected $statusCode = 404;

    protected $message = 'Author not found';

    public static function authorsNotFound(): self
    {
        $e = new self();
        $e->message = 'Author not found';
        $e->statusCode = 404;
        return $e;
    }
}