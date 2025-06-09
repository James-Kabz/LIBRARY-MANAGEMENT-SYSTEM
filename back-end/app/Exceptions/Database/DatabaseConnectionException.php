<?php

namespace App\Exceptions\Database;

use App\Exceptions\BaseCustomException;

/**
 * Class DatabaseConnectionException
 *
 * Custom exception for handling database connection issues.
 *
 * @author Christian Kelemba <christian.kelemba@stl-horizon.com>
 */
class DatabaseConnectionException extends BaseCustomException
{
    protected $statusCode = 503;
    protected $message = 'Database connection failed';

    public static function isConnectionError(string $message): bool
    {
        $errorCodes = [
            'SQLSTATE[HY000] [2002]', // Connection refused
            'SQLSTATE[HY000] [1049]', // Unknown database
            'SQLSTATE[HY000] [1045]', // Access denied
            'SQLSTATE[HY000] [2005]', // Unknown MySQL host
        ];

        foreach ($errorCodes as $code) {
            if (str_contains($message, $code)) {
                return true;
            }
        }

        return false;
    }
}
