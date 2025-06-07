<?php

namespace App\Repositories\Interfaces;

use App\Models\Reservation;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface ReservationRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get reservations by user.
     *
     * @param int $userId
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getByUser(int $userId, int $perPage = 15): LengthAwarePaginator;

    /**
     * Get reservations by book.
     *
     * @param int $bookId
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getByBook(int $bookId, int $perPage = 15): LengthAwarePaginator;

    /**
     * Get overdue reservations.
     *
     * @return Collection
     */
    public function getOverdueReservations(): Collection;

    /**
     * Mark reservation as returned.
     *
     * @param int $reservationId
     * @return bool
     */
    public function markAsReturned(int $reservationId): bool;
}
