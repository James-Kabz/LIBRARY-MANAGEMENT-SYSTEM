<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'isbn' => $this->isbn,
            'published_year' => $this->published_year,
            'description' => $this->description,
            'cover_image' => $this->cover_image,
            'total_copies' => $this->total_copies,
            'available_copies' => $this->available_copies,
            'author' => $this->whenLoaded('author', function () {
                return new AuthorResource($this->author);
            }),
            'categories' => $this->whenLoaded('categories', function () {
                return CategoryResource::collection($this->categories);
            }),
            'is_available' => $this->isAvailable(),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
