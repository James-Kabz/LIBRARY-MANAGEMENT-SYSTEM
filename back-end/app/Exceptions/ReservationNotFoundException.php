<?php

namespace App\Exceptions;


class ReservationNotFoundException extends BaseCustomException
{
    protected $statusCode = 404;

    protected $message = "Reservation not found";
}
