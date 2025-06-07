<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Services\CategoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class CategoryController extends Controller implements HasMiddleware
{
    /**
     * @var CategoryService
     */
    protected $categoryService;

    /**
     * CategoryController constructor.
     *
     * @param CategoryService $categoryService
     */

     public static function middleware()
     {
        return[
            new Middleware('auth:sanctum'),
            new Middleware('permission:view categories')->only(['index', 'show']),
            new Middleware('permission:create categories')->only(['store']),
            new Middleware('permission:edit categories')->only(['update']),
            new Middleware('permission:delete categories')->only(['destroy']),
        ];
     }
    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $categories = $this->categoryService->getAllCategories();
        
        return api_success($categories, 'Categories retrieved successfully');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $category = $this->categoryService->createCategory($request->validated());
        
        return api_success($category, 'Category created successfully', 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        $category = $this->categoryService->getCategoryById($id);
        
        return api_success($category, 'Category retrieved successfully');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, int $id): JsonResponse
    {
        $category = $this->categoryService->updateCategory($id, $request->validated());
        
        return api_success($category, 'Category updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->categoryService->deleteCategory($id);
        
        return api_success(null, 'Category deleted successfully');
    }
}
