<?php

namespace App\Services;

use App\Events\BookReserved;
use App\Events\BookReturned;
use App\Events\ReservationOverdue;
use App\Exceptions\BookNotAvailableException;
use App\Exceptions\BookNotFoundException;
use App\Exceptions\ReservationNotFoundException;
use App\Exceptions\UserNotFoundException;
use App\Http\Resources\ReservationResource;
use App\Models\Book;
use App\Models\Reservation;
use App\Repositories\Interfaces\BookRepositoryInterface;
use App\Repositories\Interfaces\ReservationRepositoryInterface;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ReservationService
{
    /**
     * @var ReservationRepositoryInterface
     */
    protected $reservationRepository;

    /**
     * @var BookRepositoryInterface
     */
    protected $bookRepository;

    /**
     * @var UserRepositoryInterface
     */
    protected $userRepository;

    /**
     * ReservationService constructor.
     *
     * @param ReservationRepositoryInterface $reservationRepository
     * @param BookRepositoryInterface $bookRepository
     * @param UserRepositoryInterface $userRepository
     */
    public function __construct(
        ReservationRepositoryInterface $reservationRepository,
        BookRepositoryInterface $bookRepository,
        UserRepositoryInterface $userRepository
    ) {
        $this->reservationRepository = $reservationRepository;
        $this->bookRepository = $bookRepository;
        $this->userRepository = $userRepository;
    }

    /**
     * Get all reservations with pagination.
     *
     * @param int $perPage
     * @return AnonymousResourceCollection
     */
    public function getAllReservations(int $perPage = 15): AnonymousResourceCollection
    {
        $reservations = $this->reservationRepository->paginate($perPage, ['*'], ['user', 'book', 'book.author']);
        return ReservationResource::collection($reservations);
    }

    /**
     * Get reservation by ID.
     *
     * @param int $id
     * @return ReservationResource
     * @throws ReservationNotFoundException
     */
    public function getReservationById(int $id): ReservationResource
    {
        try {
            $reservation = $this->reservationRepository->findById($id, ['*'], ['user', 'book', 'book.author']);
            return new ReservationResource($reservation);
        } catch (\Exception $e) {
            throw new ReservationNotFoundException();
        }
    }

    /**
     * Get reservations by user.
     *
     * @param int $userId
     * @param int $perPage
     * @return AnonymousResourceCollection
     * @throws UserNotFoundException
     */
    public function getReservationsByUser(int $userId, int $perPage = 15): AnonymousResourceCollection
    {
        try {
            // Check if user exists
            $this->userRepository->findById($userId);
            
            $reservations = $this->reservationRepository->getByUser($userId, $perPage);
            return ReservationResource::collection($reservations);
        } catch (\Exception $e) {
            throw new UserNotFoundException();
        }
    }

    /**
     * Get reservations by book.
     *
     * @param int $bookId
     * @param int $perPage
     * @return AnonymousResourceCollection
     * @throws BookNotFoundException
     */
    public function getReservationsByBook(int $bookId, int $perPage = 15): AnonymousResourceCollection
    {
        try {
            // Check if book exists
            $this->bookRepository->findById($bookId);
            
            $reservations = $this->reservationRepository->getByBook($bookId, $perPage);
            return ReservationResource::collection($reservations);
        } catch (\Exception $e) {
            throw new BookNotFoundException();
        }
    }

    /**
     * Create a new reservation.
     *
     * @param array $data
     * @return ReservationResource
     * @throws BookNotFoundException
     * @throws UserNotFoundException
     * @throws BookNotAvailableException
     */
    public function createReservation(array $data): ReservationResource
    {
        try {
            // Check if user exists
            $user = $this->userRepository->findById($data['user_id']);
            
            // Check if book exists
            $book = $this->bookRepository->findById($data['book_id']);
            
            // Check if book is available
            if (!$book->isAvailable()) {
                throw new BookNotAvailableException();
            }
            
            // Set reservation data
            $data['reserved_at'] = now();
            $data['due_date'] = Carbon::now()->addDays(14); // 2 weeks by default
            $data['status'] = 'borrowed';
            
            // Create reservation
            $reservation = $this->reservationRepository->create($data);
            
            // Update book availability
            $this->bookRepository->updateAvailability($book->id, -1);
            
            // Dispatch event
            event(new BookReserved($reservation));
            
            return new ReservationResource($reservation->load(['user', 'book', 'book.author']));
        } catch (BookNotFoundException $e) {
            throw $e;
        } catch (UserNotFoundException $e) {
            throw $e;
        } catch (BookNotAvailableException $e) {
            throw $e;
        }
    }

    /**
     * Return a book.
     *
     * @param int $id
     * @return ReservationResource
     * @throws ReservationNotFoundException
     */
    public function returnBook(int $id): ReservationResource
    {
        try {
            $reservation = $this->reservationRepository->findById($id);
            
            // Mark as returned
            $this->reservationRepository->markAsReturned($id);
            
            // Update book availability
            $this->bookRepository->updateAvailability($reservation->book_id, 1);
            
            // Refresh reservation
            $reservation = $this->reservationRepository->findById($id, ['*'], ['user', 'book', 'book.author']);
            
            // Dispatch event
            event(new BookReturned($reservation));
            
            return new ReservationResource($reservation);
        } catch (\Exception $e) {
            throw new ReservationNotFoundException();
        }
    }

    /**
     * Check for overdue reservations and send notifications.
     *
     * @return void
     */
    public function checkOverdueReservations(): void
    {
        $overdueReservations = $this->reservationRepository->getOverdueReservations();
        
        foreach ($overdueReservations as $reservation) {
            event(new ReservationOverdue($reservation));
        }
    }

    /**
     * Get total reservations count.
     *
     * @return int
     */
    public function getTotalReservationsCount(): int
    {
        return $this->reservationRepository->count();
    }

    /**
     * Get active reservations count.
     *
     * @return int
     */
    public function getActiveReservationsCount(): int
    {
        return $this->reservationRepository->countActiveReservations();
    }

    /**
     * Get overdue reservations count.
     *
     * @return int
     */
    public function getOverdueReservationsCount(): int
    {
        return $this->reservationRepository->countOverdueReservations();
    }

    /**
     * Get returned reservations count.
     *
     * @return int
     */
    public function getReturnedReservationsCount(): int
    {
        return $this->reservationRepository->countReturnedReservations();
    }

    /**
     * Get recent reservations.
     *
     * @param int $limit
     * @return AnonymousResourceCollection
     */
    public function getRecentReservations(int $limit = 10): AnonymousResourceCollection
    {
        $reservations = $this->reservationRepository->getRecentReservations($limit);
        return ReservationResource::collection($reservations);
    }

    /**
     * Get reservations in a specific month.
     *
     * @param string $month (Y-m format)
     * @return int
     */
    public function getReservationsInMonth(string $month): int
    {
        return $this->reservationRepository->countReservationsInMonth($month);
    }

    /**
     * Get books returned in a specific month.
     *
     * @param string $month (Y-m format)
     * @return int
     */
    public function getBooksReturnedInMonth(string $month): int
    {
        return $this->reservationRepository->countBooksReturnedInMonth($month);
    }
}
