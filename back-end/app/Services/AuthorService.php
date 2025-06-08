<?php

namespace App\Services;

use App\Http\Resources\AuthorResource;
use App\Repositories\Interfaces\AuthorRepositoryInterface;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AuthorService
{
    /**
     * @var AuthorRepositoryInterface
     */
    protected $authorRepository;

    /**
     * AuthorService constructor.
     *
     * @param AuthorRepositoryInterface $authorRepository
     */
    public function __construct(AuthorRepositoryInterface $authorRepository)
    {
        $this->authorRepository = $authorRepository;
    }

    /**
     * Get all authors.
     *
     * @param int $perPage
     * @return AnonymousResourceCollection
     */
    public function getAllAuthors(int $perPage = 15): AnonymousResourceCollection
    {
        $authors = $this->authorRepository->paginate($perPage);
        return AuthorResource::collection($authors);
    }

    /**
     * Get author by ID.
     *
     * @param int $id
     * @return AuthorResource
     */
    public function getAuthorById(int $id): AuthorResource
    {
        $author = $this->authorRepository->findById($id, ['*'], ['books']);
        return new AuthorResource($author);
    }

    /**
     * Search authors.
     *
     * @param string $query
     * @param int $perPage
     * @return AnonymousResourceCollection
     */
    public function searchAuthors(string $query, int $perPage = 15): AnonymousResourceCollection
    {
        $authors = $this->authorRepository->search($query, $perPage);
        return AuthorResource::collection($authors);
    }

    /**
     * Create a new author.
     *
     * @param array $data
     * @return AuthorResource
     */
    public function createAuthor(array $data): AuthorResource
    {
        $author = $this->authorRepository->create($data);
        return new AuthorResource($author);
    }

    /**
     * Update author.
     *
     * @param int $id
     * @param array $data
     * @return AuthorResource
     */
    public function updateAuthor(int $id, array $data): AuthorResource
    {
        $this->authorRepository->update($id, $data);
        $author = $this->authorRepository->findById($id);
        return new AuthorResource($author);
    }

    /**
     * Delete author.
     *
     * @param int $id
     * @return bool
     */
    public function deleteAuthor(int $id): bool
    {
        return $this->authorRepository->deleteById($id);
    }

    /**
     * Get total authors count.
     *
     * @return int
     */
    public function getTotalAuthorsCount(): int
    {
        return $this->authorRepository->count();
    }
}
