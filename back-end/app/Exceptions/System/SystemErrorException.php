<?php

namespace App\Exceptions\System;

use App\Exceptions\BaseCustomException;

/**
 * Class SystemErrorException
 *
 * Custom exception for handling system error exception.
 *
 * @author Christian Kelemba <christian.kelemba@stl-horizon.com>
 */
class SystemErrorException extends BaseCustomException
{
    protected $statusCode = 500;

    protected $message = 'A critical system error has occurred.';
}
