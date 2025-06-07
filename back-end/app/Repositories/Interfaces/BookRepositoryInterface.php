<?php

namespace App\Repositories\Interfaces;

use App\Models\Book;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface BookRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Search books by title, author, or ISBN.
     *
     * @param string $query
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function search(string $query, int $perPage = 15): LengthAwarePaginator;

    /**
     * Get books by category.
     *
     * @param int $categoryId
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getByCategory(int $categoryId, int $perPage = 15): LengthAwarePaginator;

    /**
     * Get books by author.
     *
     * @param int $authorId
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getByAuthor(int $authorId, int $perPage = 15): LengthAwarePaginator;

    /**
     * Get available books.
     *
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getAvailableBooks(int $perPage = 15): LengthAwarePaginator;

    /**
     * Update book availability.
     *
     * @param int $bookId
     * @param int $change
     * @return bool
     */
    public function updateAvailability(int $bookId, int $change): bool;
}
