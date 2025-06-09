<?php

namespace App\Exceptions;


class BookNotFoundException extends BaseCustomException
{
    protected $statusCode = 404;

    protected $message = 'Book not found';

    public static function bookNotFound(): self
    {
        $e = new self();
        $e->message = 'Book not found';
        $e->statusCode = 404;
        return $e;
    }

    public static function bookNotAvailableForReservation(): self
    {
        $e = new self();
        $e->message = 'Book is not available for reservation';
        $e->statusCode = 400;
        return $e;
    }

}
