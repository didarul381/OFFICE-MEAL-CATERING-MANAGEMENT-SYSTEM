<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateClientPricingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->isVendorAdmin() || $this->user()->isVendorStaff();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'lunch_rate' => ['required', 'numeric', 'min:0', 'max:99999.99'],
            'dinner_rate' => ['required', 'numeric', 'min:0', 'max:99999.99'],
            'custom_prices' => ['nullable', 'array'],
            'custom_prices.*.menu_item_id' => ['required', 'exists:menu_items,id'],
            'custom_prices.*.custom_price' => ['required', 'numeric', 'min:0', 'max:99999.99'],
        ];
    }
}
