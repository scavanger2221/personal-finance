<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
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
        $category = $this->route('category') ?? $this->route('categories');

        // Jika $category hanya berupa ID (string/int), ambil objek modelnya
        if (is_numeric($category)) {
            $category = \App\Models\Category::find($category);
        }

        if (!$category) {
            return [];
        }

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('categories')->where(function ($query) use ($category) {
                    return $query->where('user_id', $this->user()->id)
                        ->where('type', $this->input('type', $category->type));
                })->ignore($category->id),
            ],
            'type' => ['required', new \Illuminate\Validation\Rules\Enum(\App\Enums\CategoryType::class)],
        ];
    }
}
