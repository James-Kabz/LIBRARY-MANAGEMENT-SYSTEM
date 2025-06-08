<?php

namespace App\Services;

use App\Exceptions\UserNotFoundException;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;

class UserService
{
    /**
     * @var UserRepositoryInterface
     */
    protected $userRepository;

    /**
     * UserService constructor.
     *
     * @param UserRepositoryInterface $userRepository
     */
    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * Get all users with pagination.
     *
     * @param int $perPage
     * @return AnonymousResourceCollection
     */
    public function getAllUsers(int $perPage = 15): AnonymousResourceCollection
    {
        $users = $this->userRepository->paginate($perPage);
        return UserResource::collection($users);
    }

    /**
     * Get user by ID.
     *
     * @param int $id
     * @return UserResource
     * @throws UserNotFoundException
     */
    public function getUserById(int $id): UserResource
    {
        try {
            $user = $this->userRepository->findById($id, ['*'], ['reservations.book']);
            return new UserResource($user);
        } catch (\Exception $e) {
            throw new UserNotFoundException();
        }
    }

    /**
     * Create a new user.
     *
     * @param array $data
     * @return UserResource
     */
    public function createUser(array $data): UserResource
    {
        $data['password'] = Hash::make($data['password']);
        $user = $this->userRepository->create($data);
        
        // Assign default role
        $user->assignRole('member');
        
        return new UserResource($user);
    }

    /**
     * Update user.
     *
     * @param int $id
     * @param array $data
     * @return UserResource
     * @throws UserNotFoundException
     */
    public function updateUser(int $id, array $data): UserResource
    {
        try {
            if (isset($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            }
            
            $this->userRepository->update($id, $data);
            $user = $this->userRepository->findById($id);
            
            return new UserResource($user);
        } catch (\Exception $e) {
            throw new UserNotFoundException();
        }
    }

    /**
     * Delete user.
     *
     * @param int $id
     * @return bool
     * @throws UserNotFoundException
     */
    public function deleteUser(int $id): bool
    {
        try {
            return $this->userRepository->deleteById($id);
        } catch (\Exception $e) {
            throw new UserNotFoundException();
        }
    }

    /**
     * Get users with overdue books.
     *
     * @return AnonymousResourceCollection
     */
    public function getUsersWithOverdueBooks(): AnonymousResourceCollection
    {
        $users = $this->userRepository->getUsersWithOverdueBooks();
        return UserResource::collection($users);
    }

    /**
     * Get total users count.
     *
     * @return int
     */
    public function getTotalUsersCount(): int
    {
        return $this->userRepository->count();
    }

    /**
     * Get users joined in a specific month.
     *
     * @param string $month (Y-m format)
     * @return int
     */
    public function getUsersJoinedInMonth(string $month): int
    {
        return $this->userRepository->countUsersJoinedInMonth($month);
    }
}
