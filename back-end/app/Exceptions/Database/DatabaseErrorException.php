<?php

namespace App\Exceptions\Database;

use App\Exceptions\BaseCustomException;

/**
 * Class DatabaseErrorException
 *
 * Custom exception for handling database error issues.
 *
 * @author Christian Kelemba <christian.kelemba@stl-horizon.com>
 */
class DatabaseErrorException extends BaseCustomException
{
    protected $statusCode = 500;
    protected $message = 'Critical database error occurred';
}