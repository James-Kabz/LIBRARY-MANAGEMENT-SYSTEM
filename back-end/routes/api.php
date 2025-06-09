<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AuthorController;
use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\StatsController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Stats routes
    Route::get('/stats/dashboard', [StatsController::class, 'dashboard']);
    Route::get('/stats/reports', [StatsController::class, 'reports']);
    
    // User routes
    Route::apiResource('users', UserController::class);
    Route::get('/users/overdue/books', [UserController::class, 'overdueUsers']);
    
    // Book routes
    Route::get('/books/search', [BookController::class, 'search']);
    Route::get('/books/available', [BookController::class, 'available']);
    Route::get('/books/category/{categoryId}', [BookController::class, 'byCategory']);
    Route::get('/books/author/{authorId}', [BookController::class, 'byAuthor']);
    Route::apiResource('books', BookController::class);
    
    // Author routes
    Route::apiResource('authors', AuthorController::class);
    Route::get('/authors/search', [AuthorController::class, 'search']);
    
    // Category routes
    Route::apiResource('categories', CategoryController::class);
    
    // Reservation routes
    Route::apiResource('reservations', ReservationController::class)->except(['update', 'destroy']);
    Route::patch('/reservations/{id}/return', [ReservationController::class, 'returnBook']);
    Route::get('/reservations/user/{userId}', [ReservationController::class, 'byUser']);
    Route::get('/reservations/book/{bookId}', [ReservationController::class, 'byBook']);
});
