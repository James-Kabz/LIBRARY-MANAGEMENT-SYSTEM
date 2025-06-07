<?php

namespace App\Http\Requests\Book;

use App\Http\Requests\BaseFormRequest;

class StoreBookRequest extends BaseFormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'isbn' => 'required|string|max:20|unique:books',
            'published_year' => 'required|integer|min:1000|max:' . (date('Y') + 1),
            'description' => 'nullable|string',
            'cover_image' => 'nullable|string|max:255',
            'total_copies' => 'required|integer|min:0',
            'available_copies' => 'required|integer|min:0|lte:total_copies',
            'author_id' => 'required|integer|exists:authors,id',
            'category_ids' => 'sometimes|array',
            'category_ids.*' => 'integer|exists:categories,id',
        ];
    }
}
