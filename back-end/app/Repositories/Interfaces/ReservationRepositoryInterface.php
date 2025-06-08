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

    /**
     * Count active reservations.
     *
     * @return int
     */
    public function countActiveReservations(): int;

    /**
     * Count overdue reservations.
     *
     * @return int
     */
    public function countOverdueReservations(): int;

    /**
     * Count returned reservations.
     *
     * @return int
     */
    public function countReturnedReservations(): int;

    /**
     * Get recent reservations.
     *
     * @param int $limit
     * @return Collection
     */
    public function getRecentReservations(int $limit = 10): Collection;

    /**
     * Count reservations in a specific month.
     *
     * @param string $month
     * @return int
     */
    public function countReservationsInMonth(string $month): int;

    /**
     * Count books returned in a specific month.
     *
     * @param string $month
     * @return int
     */
    public function countBooksReturnedInMonth(string $month): int;

    // count reservations
    public function count(): int;
}
