<?php

namespace App\Http\Requests\Book;

use App\Http\Requests\BaseFormRequest;
use Illuminate\Validation\Rule;

class UpdateBookRequest extends BaseFormRequest
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
            'title' => 'sometimes|string|max:255',
            'isbn' => [
                'sometimes',
                'string',
                'max:20',
                Rule::unique('books')->ignore($this->route('book')),
            ],
            'published_year' => 'sometimes|integer|min:1000|max:' . (date('Y') + 1),
            'description' => 'nullable|string',
            'cover_image' => 'nullable|string|max:255',
            'total_copies' => 'sometimes|integer|min:0',
            'available_copies' => 'sometimes|integer|min:0|lte:total_copies',
            'author_id' => 'sometimes|integer|exists:authors,id',
            'category_ids' => 'sometimes|array',
            'category_ids.*' => 'integer|exists:categories,id',
        ];
    }
}
