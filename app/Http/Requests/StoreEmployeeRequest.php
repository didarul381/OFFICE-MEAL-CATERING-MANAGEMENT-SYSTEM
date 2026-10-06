<?php

namespace App\Http\Requests;

use App\Models\Employee;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEmployeeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();
        if ($user->hasVendorAccess()) {
            return true;
        }

        return $user->isClientAdmin() && ! empty($user->client_id);
    }

    /**
     * Prepare data before validation to guarantee client isolation.
     */
    protected function prepareForValidation(): void
    {
        // For client admin: NEVER trust client_id from input; enforce user's client_id
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
        $clientId = $this->input('client_id') ?: ($this->user()->isClientAdmin() ? $this->user()->client_id : null);

        return [
            'client_id' => ['required', 'exists:clients,id'],
            'name' => ['required', 'string', 'max:255'],
            'employee_id' => [
                'required',
                'string',
                'max:50',
                Rule::unique('employees', 'employee_id')
                    ->where(fn ($query) => $query->where('client_id', $clientId)->whereNull('deleted_at')),
            ],
            'phone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:255'],
            'department' => ['nullable', 'string', 'max:100'],
            'designation' => ['nullable', 'string', 'max:100'],
            'meal_preference' => ['required', 'string', Rule::in(Employee::MEAL_PREFERENCES)],
            'lunch_enabled' => ['boolean'],
            'dinner_enabled' => ['boolean'],
            'status' => ['required', 'in:active,inactive'],
            'joining_date' => ['nullable', 'date'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
