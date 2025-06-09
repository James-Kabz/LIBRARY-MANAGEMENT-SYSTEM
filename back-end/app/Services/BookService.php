<?php

namespace App\Services;

use App\Exceptions\BookNotFoundException;
use App\Http\Resources\BookResource;
use App\Repositories\Interfaces\BookRepositoryInterface;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class BookService
{
    /**
     * @var BookRepositoryInterface
     */
    protected $bookRepository;

    /**
     * BookService constructor.
     *
     * @param BookRepositoryInterface $bookRepository
     */
    public function __construct(BookRepositoryInterface $bookRepository)
    {
        $this->bookRepository = $bookRepository;
    }

    /**
     * Get all books with pagination.
     *
     * @param int $perPage
     * @return AnonymousResourceCollection
     */
    public function getAllBooks(int $perPage = 15): AnonymousResourceCollection
    {
        $books = $this->bookRepository->paginate($perPage, ['*'], ['author', 'categories']);
        return BookResource::collection($books);
    }

    /**
     * Get book by ID.
     *
     * @param int $id
     * @return BookResource
     * @throws BookNotFoundException
     */
    public function getBookById(int $id): BookResource
    {
        try {
            $book = $this->bookRepository->findById($id, ['*'], ['author', 'categories']);
            return new BookResource($book);
        } catch (\Exception $e) {
            throw  BookNotFoundException::bookNotFound();
        }
    }

    /**
     * Search books.
     *
     * @param string $query
     * @param int $perPage
     * @return AnonymousResourceCollection
     */
    public function searchBooks(string $query, int $perPage = 15): AnonymousResourceCollection
    {
        $books = $this->bookRepository->search($query, $perPage);
        return BookResource::collection($books);
    }

    /**
     * Get books by category.
     *
     * @param int $categoryId
     * @param int $perPage
     * @return AnonymousResourceCollection
     */
    public function getBooksByCategory(int $categoryId, int $perPage = 15): AnonymousResourceCollection
    {
        $books = $this->bookRepository->getByCategory($categoryId, $perPage);
        return BookResource::collection($books);
    }

    /**
     * Get books by author.
     *
     * @param int $authorId
     * @param int $perPage
     * @return AnonymousResourceCollection
     */
    public function getBooksByAuthor(int $authorId, int $perPage = 15): AnonymousResourceCollection
    {
        $books = $this->bookRepository->getByAuthor($authorId, $perPage);
        return BookResource::collection($books);
    }

    /**
     * Get available books.
     *
     * @param int $perPage
     * @return AnonymousResourceCollection
     */
    public function getAvailableBooks(int $perPage = 15): AnonymousResourceCollection
    {
        $books = $this->bookRepository->getAvailableBooks($perPage);
        return BookResource::collection($books);
    }

    /**
     * Create a new book.
     *
     * @param array $data
     * @return BookResource
     */
    public function createBook(array $data): BookResource
    {
        $categoryIds = $data['category_ids'] ?? [];
        unset($data['category_ids']);
        
        $book = $this->bookRepository->create($data);
        
        if (!empty($categoryIds)) {
            $book->categories()->sync($categoryIds);
        }
        
        return new BookResource($book->load(['author', 'categories']));
    }

    /**
     * Update book.
     *
     * @param int $id
     * @param array $data
     * @return BookResource
     * @throws BookNotFoundException
     */
    public function updateBook(int $id, array $data): BookResource
    {
        try {
            $categoryIds = $data['category_ids'] ?? null;
            unset($data['category_ids']);
            
            $this->bookRepository->update($id, $data);
            $book = $this->bookRepository->findById($id, ['*'], ['author', 'categories']);
            
            if ($categoryIds !== null) {
                $book->categories()->sync($categoryIds);
            }
            
            return new BookResource($book);
        } catch (\Exception $e) {
            throw BookNotFoundException::bookNotFound();
        }
    }

    /**
     * Delete book.
     *
     * @param int $id
     * @return bool
     * @throws BookNotFoundException
     */
    public function deleteBook(int $id): bool
    {
        try {
            return $this->bookRepository->deleteById($id);
        } catch (\Exception $e) {
            throw BookNotFoundException::bookNotFound();
        }
    }

    /**
     * Get total books count.
     *
     * @return int
     */
    public function getTotalBooksCount(): int
    {
        return $this->bookRepository->count();
    }

    /**
     * Get available books count.
     *
     * @return int
     */
    public function getAvailableBooksCount(): int
    {
        return $this->bookRepository->countAvailableBooks();
    }

    /**
     * Get popular books.
     *
     * @param int $limit
     * @return AnonymousResourceCollection
     */
    public function getPopularBooks(int $limit = 5): AnonymousResourceCollection
    {
        $books = $this->bookRepository->getPopularBooks($limit);
        return BookResource::collection($books);
    }

    /**
     * Get books added in a specific month.
     *
     * @param string $month (Y-m format)
     * @return int
     */
    public function getBooksAddedInMonth(string $month): int
    {
        return $this->bookRepository->countBooksAddedInMonth($month);
    }
}
