<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReservationResource extends JsonResource
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
            'user' => $this->whenLoaded('user', function () {
                return new UserResource($this->user);
            }),
            'book' => $this->whenLoaded('book', function () {
                return new BookResource($this->book);
            }),
            'reserved_at' => $this->reserved_at,
            'due_date' => $this->due_date,
            'returned_at' => $this->returned_at,
            'status' => $this->status,
            'is_overdue' => $this->isOverdue(),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
