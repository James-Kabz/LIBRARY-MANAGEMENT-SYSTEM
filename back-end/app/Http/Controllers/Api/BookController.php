<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Book\StoreBookRequest;
use App\Http\Requests\Book\UpdateBookRequest;
use App\Services\BookService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class BookController extends Controller implements HasMiddleware
{
    /**
     * @var BookService
     */
    protected $bookService;

    /**
     * BookController constructor.
     *
     * @param BookService $bookService
     */

     public static function middleware()
     {
         return[
            new Middleware('auth:sanctum'),
            new Middleware('permission:view books')->only(['index', 'show', 'search', 'available']),
            new Middleware('permission:create books')->only(['store']),
            new Middleware('permission:edit books')->only(['update']),
            new Middleware('permission:delete books')->only(['destroy']),
         ];
     }
    public function __construct(BookService $bookService)
    {
        $this->bookService = $bookService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->get('per_page', 15);
        $books = $this->bookService->getAllBooks($perPage);
        
        return api_success($books, 'Books retrieved successfully');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBookRequest $request): JsonResponse
    {
        $book = $this->bookService->createBook($request->validated());
        
        return api_success($book, 'Book created successfully', 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        $book = $this->bookService->getBookById($id);
        
        return api_success($book, 'Book retrieved successfully');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBookRequest $request, int $id): JsonResponse
    {
        $book = $this->bookService->updateBook($id, $request->validated());
        
        return api_success($book, 'Book updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->bookService->deleteBook($id);
        
        return api_success(null, 'Book deleted successfully');
    }

    /**
     * Search books.
     */
    public function search(Request $request): JsonResponse
    {
        $query = $request->get('q');
        $perPage = $request->get('per_page', 15);
        
        if (!$query) {
            return api_error('Search query is required', 400);
        }
        
        $books = $this->bookService->searchBooks($query, $perPage);
        
        return api_success($books, 'Books search results retrieved successfully');
    }

    /**
     * Get available books.
     */
    public function available(Request $request): JsonResponse
    {
        $perPage = $request->get('per_page', 15);
        $books = $this->bookService->getAvailableBooks($perPage);
        
        return api_success($books, 'Available books retrieved successfully');
    }

    /**
     * Get books by category.
     */
    public function byCategory(Request $request, int $categoryId): JsonResponse
    {
        $perPage = $request->get('per_page', 15);
        $books = $this->bookService->getBooksByCategory($categoryId, $perPage);
        
        return api_success($books, 'Books by category retrieved successfully');
    }

    /**
     * Get books by author.
     */
    public function byAuthor(Request $request, int $authorId): JsonResponse
    {
        $perPage = $request->get('per_page', 15);
        $books = $this->bookService->getBooksByAuthor($authorId, $perPage);
        
        return api_success($books, 'Books by author retrieved successfully');
    }
}
