<?php

namespace App\Http\Requests;

use App\Models\MealEntry;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SaveDailyMealsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->isVendorAdmin() || $this->user()->isVendorStaff() || $this->user()->isClientAdmin();
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Enforce client isolation for client admins
        if ($this->user()->isClientAdmin()) {
            $this->merge([
                'client_id' => $this->user()->client_id,
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'client_id' => ['required', 'exists:clients,id'],
            'date' => ['required', 'date'],
            'meal_type' => ['required', Rule::in(MealEntry::MEAL_TYPES)],
            'entries' => ['required', 'array'],
            'entries.*.employee_id' => ['required', 'exists:employees,id'],
            'entries.*.is_present' => ['required', 'boolean'],
            'entries.*.notes' => ['nullable', 'string', 'max:255'],
        ];
    }
}
