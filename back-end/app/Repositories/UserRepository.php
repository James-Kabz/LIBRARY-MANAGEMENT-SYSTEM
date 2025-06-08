<?php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class UserRepository extends BaseRepository implements UserRepositoryInterface
{
    /**
     * UserRepository constructor.
     *
     * @param User $model
     */
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    /**
     * @inheritDoc
     */
    public function findByEmail(string $email): ?User
    {
        return $this->model->where('email', $email)->first();
    }

    /**
     * @inheritDoc
     */
    public function getUsersWithOverdueBooks(): Collection
    {
        return $this->model->whereHas('reservations', function ($query) {
            $query->where('status', 'borrowed')
                  ->where('due_date', '<', now())
                  ->whereNull('returned_at');
        })->with(['reservations' => function ($query) {
            $query->where('status', 'borrowed')
                  ->where('due_date', '<', now())
                  ->whereNull('returned_at')
                  ->with('book');
        }])->get();
    }

    /**
     * @inheritDoc
     */
    public function countUsersJoinedInMonth(string $month): int
    {
        return $this->model->whereYear('created_at', substr($month, 0, 4))
            ->whereMonth('created_at', substr($month, 5, 2))
            ->count();
    }

    // count users
    public function count(): int
    {
        return $this->model->count();
    }
}
