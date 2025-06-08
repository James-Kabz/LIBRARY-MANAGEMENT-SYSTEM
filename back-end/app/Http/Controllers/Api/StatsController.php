<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\BookService;
use App\Services\UserService;
use App\Services\ReservationService;
use App\Services\CategoryService;
use App\Services\AuthorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class StatsController extends Controller implements HasMiddleware
{

    public static function middleware()
    {
        return [
            new Middleware('auth:sanctum'),
            new Middleware('permission:view reports')->only(['dashboard', 'reports']),
        ];
    }
    protected $bookService;
    protected $userService;
    protected $reservationService;
    protected $categoryService;
    protected $authorService;

    public function __construct(
        BookService $bookService,
        UserService $userService,
        ReservationService $reservationService,
        CategoryService $categoryService,
        AuthorService $authorService
    ) {
        $this->bookService = $bookService;
        $this->userService = $userService;
        $this->reservationService = $reservationService;
        $this->categoryService = $categoryService;
        $this->authorService = $authorService;
    }

    /**
     * Get dashboard statistics.
     */
    public function dashboard(): JsonResponse
    {
        try {
            $stats = [
                'total_books' => $this->bookService->getTotalBooksCount(),
                'available_books' => $this->bookService->getAvailableBooksCount(),
                'total_users' => $this->userService->getTotalUsersCount(),
                'total_categories' => $this->categoryService->getTotalCategoriesCount(),
                'total_authors' => $this->authorService->getTotalAuthorsCount(),
                'total_reservations' => $this->reservationService->getTotalReservationsCount(),
                'active_reservations' => $this->reservationService->getActiveReservationsCount(),
                'overdue_reservations' => $this->reservationService->getOverdueReservationsCount(),
                'returned_reservations' => $this->reservationService->getReturnedReservationsCount(),
            ];

            return api_success($stats, 'Dashboard statistics retrieved successfully');
        } catch (\Exception $e) {
            return api_error('Failed to retrieve dashboard statistics', 500);
        }
    }

    /**
     * Get detailed reports.
     */
    public function reports(): JsonResponse
    {
        try {
            $reports = [
                'overview' => [
                    'total_books' => $this->bookService->getTotalBooksCount(),
                    'available_books' => $this->bookService->getAvailableBooksCount(),
                    'total_users' => $this->userService->getTotalUsersCount(),
                    'total_reservations' => $this->reservationService->getTotalReservationsCount(),
                    'active_reservations' => $this->reservationService->getActiveReservationsCount(),
                    'overdue_reservations' => $this->reservationService->getOverdueReservationsCount(),
                ],
                'popular_books' => $this->bookService->getPopularBooks(5),
                'recent_reservations' => $this->reservationService->getRecentReservations(10),
                'categories_stats' => $this->categoryService->getCategoriesWithStats(),
                'monthly_stats' => $this->getMonthlyStats(),
            ];

            return api_success($reports, 'Reports data retrieved successfully');
        } catch (\Exception $e) {
            return api_error('Failed to retrieve reports data', 500);
        }
    }

    /**
     * Get monthly statistics.
     */
    private function getMonthlyStats(): array
    {
        $currentMonth = now()->format('Y-m');
        
        return [
            'books_added_this_month' => $this->bookService->getBooksAddedInMonth($currentMonth),
            'reservations_this_month' => $this->reservationService->getReservationsInMonth($currentMonth),
            'users_joined_this_month' => $this->userService->getUsersJoinedInMonth($currentMonth),
            'books_returned_this_month' => $this->reservationService->getBooksReturnedInMonth($currentMonth),
        ];
    }
}
