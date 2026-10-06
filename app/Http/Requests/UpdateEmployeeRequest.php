<?php

namespace App\Http\Requests;

use App\Models\Employee;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEmployeeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $employee = $this->route('employee');
        $user = $this->user();

        if ($user->hasVendorAccess()) {
            return true;
        }

        return $user->isClientAdmin() && (int) $user->client_id === (int) $employee->client_id;
    }

    /**
     * Prepare data before validation.
     */
    protected function prepareForValidation(): void
    {
        $employee = $this->route('employee');
        if ($this->user()->isClientAdmin()) {
            $this->merge([
                'client_id' => $employee->client_id,
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
        $employee = $this->route('employee');
        $clientId = $this->input('client_id') ?: $employee->client_id;

        return [
            'client_id' => ['required', 'exists:clients,id'],
            'name' => ['required', 'string', 'max:255'],
            'employee_id' => [
                'required',
                'string',
                'max:50',
                Rule::unique('employees', 'employee_id')
                    ->ignore($employee->id)
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
