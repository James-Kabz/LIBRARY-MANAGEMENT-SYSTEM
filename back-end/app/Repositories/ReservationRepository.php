<?php

namespace App\Repositories;

use App\Models\Reservation;
use App\Repositories\Interfaces\ReservationRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class ReservationRepository extends BaseRepository implements ReservationRepositoryInterface
{
    /**
     * ReservationRepository constructor.
     *
     * @param Reservation $model
     */
    public function __construct(Reservation $model)
    {
        parent::__construct($model);
    }

    /**
     * @inheritDoc
     */
    public function getByUser(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->where('user_id', $userId)
            ->with(['book', 'book.author'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * @inheritDoc
     */
    public function getByBook(int $bookId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->where('book_id', $bookId)
            ->with(['user'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * @inheritDoc
     */
    public function getOverdueReservations(): Collection
    {
        return $this->model->where('status', 'borrowed')
            ->where('due_date', '<', now())
            ->whereNull('returned_at')
            ->with(['user', 'book'])
            ->get();
    }

    /**
     * @inheritDoc
     */
    public function markAsReturned(int $reservationId): bool
    {
        $reservation = $this->findById($reservationId);
        $reservation->returned_at = now();
        $reservation->status = 'returned';
        return $reservation->save();
    }

    /**
     * @inheritDoc
     */
    public function countActiveReservations(): int
    {
        return $this->model->where('status', 'borrowed')
            ->whereNull('returned_at')
            ->count();
    }

    /**
     * @inheritDoc
     */
    public function countOverdueReservations(): int
    {
        return $this->model->where('status', 'borrowed')
            ->where('due_date', '<', now())
            ->whereNull('returned_at')
            ->count();
    }

    /**
     * @inheritDoc
     */
    public function countReturnedReservations(): int
    {
        return $this->model->where('status', 'returned')
            ->whereNotNull('returned_at')
            ->count();
    }

    /**
     * @inheritDoc
     */
    public function getRecentReservations(int $limit = 10): Collection
    {
        return $this->model->with(['user', 'book', 'book.author'])
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * @inheritDoc
     */
    public function countReservationsInMonth(string $month): int
    {
        return $this->model->whereYear('created_at', substr($month, 0, 4))
            ->whereMonth('created_at', substr($month, 5, 2))
            ->count();
    }

    /**
     * @inheritDoc
     */
    public function countBooksReturnedInMonth(string $month): int
    {
        return $this->model->where('status', 'returned')
            ->whereNotNull('returned_at')
            ->whereYear('returned_at', substr($month, 0, 4))
            ->whereMonth('returned_at', substr($month, 5, 2))
            ->count();
    }

    // count reservations
    public function count(): int
    {
        return $this->model->count();
    }
}
