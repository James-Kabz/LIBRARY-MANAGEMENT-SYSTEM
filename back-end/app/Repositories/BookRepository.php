<?php

namespace App\Repositories;

use App\Models\Book;
use App\Repositories\Interfaces\BookRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class BookRepository extends BaseRepository implements BookRepositoryInterface
{
    /**
     * BookRepository constructor.
     *
     * @param Book $model
     */
    public function __construct(Book $model)
    {
        parent::__construct($model);
    }

    /**
     * @inheritDoc
     */
    public function search(string $query, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->where('title', 'like', "%{$query}%")
            ->orWhere('isbn', 'like', "%{$query}%")
            ->orWhereHas('author', function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%");
            })
            ->with(['author', 'categories'])
            ->paginate($perPage);
    }

    /**
     * @inheritDoc
     */
    public function getByCategory(int $categoryId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->whereHas('categories', function ($query) use ($categoryId) {
            $query->where('categories.id', $categoryId);
        })->with(['author', 'categories'])->paginate($perPage);
    }

    /**
     * @inheritDoc
     */
    public function getByAuthor(int $authorId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->where('author_id', $authorId)
            ->with(['author', 'categories'])
            ->paginate($perPage);
    }

    /**
     * @inheritDoc
     */
    public function getAvailableBooks(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->where('available_copies', '>', 0)
            ->with(['author', 'categories'])
            ->paginate($perPage);
    }

    /**
     * @inheritDoc
     */
    public function updateAvailability(int $bookId, int $change): bool
    {
        $book = $this->findById($bookId);
        $book->available_copies += $change;
        return $book->save();
    }

    /**
     * @inheritDoc
     */
    public function countAvailableBooks(): int
    {
        return $this->model->where('available_copies', '>', 0)->count();
    }

    /**
     * @inheritDoc
     */
    public function getPopularBooks(int $limit = 5): Collection
    {
        return $this->model->withCount('reservations')
            ->orderBy('reservations_count', 'desc')
            ->with(['author', 'categories'])
            ->limit($limit)
            ->get();
    }

    /**
     * @inheritDoc
     */
    public function countBooksAddedInMonth(string $month): int
    {
        return $this->model->whereYear('created_at', substr($month, 0, 4))
            ->whereMonth('created_at', substr($month, 5, 2))
            ->count();
    }

    // count books
    public function count(): int
    {
        return $this->model->count();
    }
}
