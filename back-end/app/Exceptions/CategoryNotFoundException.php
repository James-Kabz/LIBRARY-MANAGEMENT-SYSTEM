<?php

namespace App\Exceptions;


class CategoryNotFoundException extends BaseCustomException
{
    protected $statusCode = 404;

    protected $message = "Category not found";
}
