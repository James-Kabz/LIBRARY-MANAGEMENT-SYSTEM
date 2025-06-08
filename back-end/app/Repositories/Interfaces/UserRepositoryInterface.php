<?php

namespace App\Repositories\Interfaces;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

interface UserRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Find user by email.
     *
     * @param string $email
     * @return User|null
     */
    public function findByEmail(string $email): ?User;

    /**
     * Get users with overdue books.
     *
     * @return Collection
     */
    public function getUsersWithOverdueBooks(): Collection;

    /**
     * Count users joined in a specific month.
     *
     * @param string $month
     * @return int
     */
    public function countUsersJoinedInMonth(string $month): int;

    // count users
    public function count(): int;
}
