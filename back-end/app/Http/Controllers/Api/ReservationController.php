<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Reservation\StoreReservationRequest;
use App\Jobs\CheckOverdueReservations;
use App\Services\ReservationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\Cache;

class ReservationController extends Controller implements HasMiddleware
{
    /**
     * @var ReservationService
     */
    protected $reservationService;

    /**
     * ReservationController constructor.
     *
     * @param ReservationService $reservationService
     */

     public static function middleware()
     {
        return[
            new Middleware('auth:sanctum'),
            new Middleware('permission:view reservations')->only(['index', 'show', 'byUser', 'byBook']),
            new Middleware('permission:create reservations')->only(['store']),
            new Middleware('permission:edit reservations')->only(['returnBook']),
        ];
     }

    public function __construct(ReservationService $reservationService)
    {
        $this->reservationService = $reservationService;
    }

    /**
     * Trigger overdue check with optional immediate execution
     */
    private function triggerOverdueCheck(bool $immediate = false): void
    {
        if ($immediate) {
            CheckOverdueReservations::dispatch()->delay(now()->addSeconds(5));
        } else {
            $cacheKey = 'overdue_check_triggered';
            $cacheDuration = 300; // 5 minutes

            if (!Cache::has($cacheKey)) {
                CheckOverdueReservations::dispatch()->delay(now()->addSeconds(10));
                Cache::put($cacheKey, true, $cacheDuration);
            }
        }
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->get('per_page', 15);
        $reservations = $this->reservationService->getAllReservations($perPage);
        
        return api_success($reservations, 'Reservations retrieved successfully');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReservationRequest $request): JsonResponse
    {
        $reservation = $this->reservationService->createReservation($request->validated());
        
        return api_success($reservation, 'Book reserved successfully', 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        $reservation = $this->reservationService->getReservationById($id);
        
        return api_success($reservation, 'Reservation retrieved successfully');
    }

    /**
     * Return a book.
     */
    public function returnBook(int $id): JsonResponse
    {
        $reservation = $this->reservationService->returnBook($id);
        $this->triggerOverdueCheck(true);
        return api_success($reservation, 'Book returned successfully');
    }

    /**
     * Get reservations by user.
     */
    public function byUser(Request $request, int $userId): JsonResponse
    {
        $perPage = $request->get('per_page', 15);
        $reservations = $this->reservationService->getReservationsByUser($userId, $perPage);
        
        return api_success($reservations, 'User reservations retrieved successfully');
    }

    /**
     * Get reservations by book.
     */
    public function byBook(Request $request, int $bookId): JsonResponse
    {
        $perPage = $request->get('per_page', 15);
        $reservations = $this->reservationService->getReservationsByBook($bookId, $perPage);
        
        return api_success($reservations, 'Book reservations retrieved successfully');
    }
}
