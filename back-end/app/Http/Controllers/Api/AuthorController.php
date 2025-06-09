<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\AuthorNotFoundException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Author\StoreAuthorRequest;
use App\Http\Requests\Author\UpdateAuthorRequest;
use App\Services\AuthorService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class AuthorController extends Controller implements HasMiddleware
{
    /**
     * @var AuthorService
     */
    protected $authorService;

    /**
     * AuthorController constructor.
     *
     * @param AuthorService $authorService
     */

     public static function middleware()
     {
        return [
            new Middleware('auth:sanctum'),
            new Middleware('permission:view authors')->only(['index', 'show', 'search']),
            new Middleware('permission:create authors')->only(['store']),
            new Middleware('permission:edit authors')->only(['update']),
            new Middleware('permission:delete authors')->only(['destroy']),
        ];
     }
    public function __construct(AuthorService $authorService)
    {
        $this->authorService = $authorService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->get('per_page', 15);
        $authors = $this->authorService->getAllAuthors($perPage);

        if (!$authors)
        {
            throw AuthorNotFoundException::authorsNotFound();
        }
        
        return api_success($authors, 'Authors retrieved successfully');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAuthorRequest $request): JsonResponse
    {
        $author = $this->authorService->createAuthor($request->validated());
        
        return api_success($author, 'Author created successfully', 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        $author = $this->authorService->getAuthorById($id);
        
        return api_success($author, 'Author retrieved successfully');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAuthorRequest $request, int $id): JsonResponse
    {
        $author = $this->authorService->updateAuthor($id, $request->validated());
        
        return api_success($author, 'Author updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->authorService->deleteAuthor($id);
        
        return api_success(null, 'Author deleted successfully');
    }

    /**
     * Search authors.
     */
    public function search(Request $request): JsonResponse
    {
        $query = $request->get('q');
        $perPage = $request->get('per_page', 15);
        
        if (!$query) {
            return api_error('Search query is required', 400);
        }
        
        $authors = $this->authorService->searchAuthors($query, $perPage);
        
        return api_success($authors, 'Authors search results retrieved successfully');
    }
}
