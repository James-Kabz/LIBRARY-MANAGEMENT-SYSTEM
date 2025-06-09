<?php

namespace App\Exceptions\Database;

use App\Exceptions\BaseCustomException;

/**
 * Class DatabaseQueryException
 *
 * Custom exception for handling database query issues.
 *
 * @author Christian Kelemba <christian.kelemba@stl-horizon.com>
 */
class DatabaseQueryException extends BaseCustomException
{
    protected $statusCode = 400;
    protected $message = 'Database query error occurred';

    public static function isQueryError(string $message): bool
    {
        $errorCodes = [
            'SQLSTATE[42S02]', // Base table or view not found
            'SQLSTATE[42S22]', // Column not found
            'SQLSTATE[23000]', // Integrity constraint violation
            'SQLSTATE[42000]', // Syntax error or access violation
        ];

        foreach ($errorCodes as $code) {
            if (str_contains($message, $code)) {
                return true;
            }
        }

        return false;
    }
}