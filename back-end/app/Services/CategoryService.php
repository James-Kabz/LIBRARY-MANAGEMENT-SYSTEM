<?php

namespace App\Services;

use App\Http\Resources\CategoryResource;
use App\Repositories\Interfaces\CategoryRepositoryInterface;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CategoryService
{
    /**
     * @var CategoryRepositoryInterface
     */
    protected $categoryRepository;

    /**
     * CategoryService constructor.
     *
     * @param CategoryRepositoryInterface $categoryRepository
     */
    public function __construct(CategoryRepositoryInterface $categoryRepository)
    {
        $this->categoryRepository = $categoryRepository;
    }

    /**
     * Get all categories.
     *
     * @return AnonymousResourceCollection
     */
    public function getAllCategories(): AnonymousResourceCollection
    {
        $categories = $this->categoryRepository->all();
        return CategoryResource::collection($categories);
    }

    /**
     * Get category by ID.
     *
     * @param int $id
     * @return CategoryResource
     */
    public function getCategoryById(int $id): CategoryResource
    {
        $category = $this->categoryRepository->findById($id);
        return new CategoryResource($category);
    }

    /**
     * Create a new category.
     *
     * @param array $data
     * @return CategoryResource
     */
    public function createCategory(array $data): CategoryResource
    {
        $category = $this->categoryRepository->create($data);
        return new CategoryResource($category);
    }

    /**
     * Update category.
     *
     * @param int $id
     * @param array $data
     * @return CategoryResource
     */
    public function updateCategory(int $id, array $data): CategoryResource
    {
        $this->categoryRepository->update($id, $data);
        $category = $this->categoryRepository->findById($id);
        return new CategoryResource($category);
    }

    /**
     * Delete category.
     *
     * @param int $id
     * @return bool
     */
    public function deleteCategory(int $id): bool
    {
        return $this->categoryRepository->deleteById($id);
    }
}
