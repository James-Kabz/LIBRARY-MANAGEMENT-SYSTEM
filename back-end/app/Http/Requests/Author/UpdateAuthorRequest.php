<?php

namespace App\Http\Requests\Author;

use App\Http\Requests\BaseFormRequest;

class UpdateAuthorRequest extends BaseFormRequest
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
            'name' => 'sometimes|string|max:255',
            'biography' => 'nullable|string',
            'birth_date' => 'nullable|date',
        ];
    }
}
