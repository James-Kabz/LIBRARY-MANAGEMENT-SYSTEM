<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class UserController extends Controller implements HasMiddleware
{
    /**
     * @var UserService
     */
    protected $userService;

    /**
     * UserController constructor.
     *
     * @param UserService $userService
     */

     public static function middleware()
     {
        return [
            new Middleware('auth:sanctum'),
            new Middleware('permission:view users')->only(['index', 'show']),
            new Middleware('permission:create users')->only(['store']),
            new Middleware('permission:edit users')->only(['update']),
            new Middleware('permission:delete users')->only(['destroy']),
        ];
     }
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->get('per_page', 15);
        $users = $this->userService->getAllUsers($perPage);
        
        return api_success($users, 'Users retrieved successfully');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = $this->userService->createUser($request->validated());
        
        return api_success($user, 'User created successfully', 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): JsonResponse
    {
        $user = $this->userService->getUserById($id);
        
        return api_success($user, 'User retrieved successfully');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, int $id): JsonResponse
    {
        $user = $this->userService->updateUser($id, $request->validated());
        
        return api_success($user, 'User updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        $this->userService->deleteUser($id);
        
        return api_success(null, 'User deleted successfully');
    }

    /**
     * Get users with overdue books.
     */
    public function overdueUsers(): JsonResponse
    {
        $users = $this->userService->getUsersWithOverdueBooks();
        
        return api_success($users, 'Users with overdue books retrieved successfully');
    }
}
