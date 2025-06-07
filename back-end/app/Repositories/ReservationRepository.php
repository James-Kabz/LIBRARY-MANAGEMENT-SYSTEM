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
}
