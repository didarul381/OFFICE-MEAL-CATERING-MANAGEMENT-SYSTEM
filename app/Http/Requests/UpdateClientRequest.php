<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateClientRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->hasVendorAccess();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'contact_person' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'email' => ['required', 'email', 'max:255'],
            'address' => ['required', 'string', 'max:500'],
            'city' => ['required', 'string', 'max:100'],
            'delivery_address' => ['nullable', 'string', 'max:500'],
            'number_of_employees' => ['nullable', 'integer', 'min:0'],
            'meal_types' => ['nullable', 'array'],
            'meal_types.*' => ['string', 'in:lunch,dinner'],
            'office_start_time' => ['nullable', 'string', 'max:10'],
            'lunch_cutoff_time' => ['nullable', 'string', 'max:10'],
            'dinner_cutoff_time' => ['nullable', 'string', 'max:10'],
            'special_instructions' => ['nullable', 'string', 'max:1000'],
            'status' => ['required', 'in:active,inactive'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
