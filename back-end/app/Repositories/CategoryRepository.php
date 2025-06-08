<?php

namespace App\Repositories;

use App\Models\Category;
use App\Repositories\Interfaces\CategoryRepositoryInterface;
use App\Exceptions\CategoryNotFoundException;
use Illuminate\Database\Eloquent\Collection;

class CategoryRepository extends BaseRepository implements CategoryRepositoryInterface
{
    /**
     * CategoryRepository constructor.
     *
     * @param Category $model
     */
    public function __construct(Category $model)
    {
        parent::__construct($model);
    }

    /**
     * @inheritDoc
     */
    public function getAllWithBooksCount(): Collection
    {
        return $this->model->withCount('books')->get();
    }

    /**
     * @inheritDoc
     */
    public function findByIdWithBooksCount(int $id): Category
    {
        $category = $this->model->withCount('books')->find($id);
        
        if (!$category) {
            throw new CategoryNotFoundException("Category with ID {$id} not found.");
        }
        
        return $category;
    }

    /**
     * @inheritDoc
     */
    public function getCategoriesWithStats(): Collection
    {
        return $this->model->withCount([
            'books',
            'books as available_books_count' => function ($query) {
                $query->where('available_copies', '>', 0);
            }
        ])->get();
    }

    /**
     * @inheritDoc
     */
    public function delete(int $id): bool
    {
        $category = $this->findById($id);
        return $category->delete();
    }

    /**
     * @inheritDoc
     */
    public function count(): int
    {
        return $this->model->count();
    }
}
