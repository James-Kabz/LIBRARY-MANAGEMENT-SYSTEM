<?php

namespace App\Exceptions\User;

use App\Exceptions\BaseCustomException;

/**
 * Class UserAuthenticationException
 *
 * Custom exception for handling user authentication.
 *
 * @author Christian Kelemba <christian.kelemba@stl-horizon.com>
 */
class UserAuthenticationException extends BaseCustomException
{
    protected $statusCode = 401;
    protected $message = 'User Not Authenticated';

    public static function invalidToken(): self
    {
        $e = new self();
        $e->statusCode = 401;
        $e->message = 'Invalid Token';
        return $e;
    }
}