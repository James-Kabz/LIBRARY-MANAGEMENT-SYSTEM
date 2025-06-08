<?php

namespace App\Repositories;

use App\Models\Author;
use App\Repositories\Interfaces\AuthorRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

class AuthorRepository extends BaseRepository implements AuthorRepositoryInterface
{
    /**
     * AuthorRepository constructor.
     *
     * @param Author $model
     */
    public function __construct(Author $model)
    {
        parent::__construct($model);
    }

    /**
     * @inheritDoc
     */
    public function search(string $query, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->where('name', 'like', "%{$query}%")
            ->paginate($perPage);
    }

    /**
     * @inheritDoc
     */
    public function count(): int
    {
        return $this->model->count();
    }
}
