<?php

namespace App\Exceptions\User;

use App\Exceptions\BaseCustomException;

/**
 * Class UserAuthorizationException
 *
 * Custom exception for handling user authorization exception.
 *
 * @author Christian Kelemba <christian.kelemba@stl-horizon.com>
 */
class UserAuthorizationException extends BaseCustomException
{
    protected $statusCode = 401;
    protected $message = 'Unauthorized action';
}
