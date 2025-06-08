<?php

namespace App\Repositories\Interfaces;

use Illuminate\Database\Eloquent\Collection;

interface CategoryRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get all categories with books count.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllWithBooksCount();

    /**
     * Find category by ID with books count.
     *
     * @param int $id
     * @return \App\Models\Category
     */
    public function findByIdWithBooksCount(int $id);


    /**
     * Get categories with statistics.
     *
     * @return Collection
     */
    public function getCategoriesWithStats(): Collection;

    /**
     * Delete category.
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id);

    // count categories
    public function count(): int;
}
