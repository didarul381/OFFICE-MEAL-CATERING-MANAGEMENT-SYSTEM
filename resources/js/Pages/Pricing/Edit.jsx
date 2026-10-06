import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import { DollarSign, ArrowLeft, Save, Building2, Sun, Moon, Info, RotateCcw } from 'lucide-react';

export default function Edit({ client, menuItems = [], existingPrices = {} }) {
    // Prepare initial state of custom item prices
    const initialCustomPrices = menuItems.map((item) => ({
        menu_item_id: item.id,
        custom_price: existingPrices[item.id] !== undefined ? existingPrices[item.id] : '',
    }));

    const { data, setData, put, processing, errors } = useForm({
        lunch_rate: client.lunch_rate || '120.00',
        dinner_rate: client.dinner_rate || '140.00',
        custom_prices: initialCustomPrices,
    });

    const handleItemPriceChange = (menuItemId, value) => {
        const updated = data.custom_prices.map((p) => {
            if (p.menu_item_id === menuItemId) {
                return { ...p, custom_price: value };
            }
            return p;
        });
        setData('custom_prices', updated);
    };

    const handleClearOverride = (menuItemId) => {
        handleItemPriceChange(menuItemId, '');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('client-pricing.update', client.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Pricing Contract: ${client.name} - Office Meal & Catering`} />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <Link
                        href={route('client-pricing.index')}
                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 transition shadow-xs"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                            <Building2 className="h-3.5 w-3.5" />
                            <span>{client.name}</span>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                            Configure Client Contract Rates
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500">
                            Set baseline meal pricing packages and custom dish overrides for this organization
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Baseline Meal Package Rates */}
                    <Card className="p-5 sm:p-6 space-y-5 border-slate-200">
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                                <DollarSign className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Baseline Meal Package Rates</h3>
                                <p className="text-xs text-slate-500">
                                    Default unit price billed per employee meal for daily regular meal plans
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Lunch Rate */}
                            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Sun className="h-4 w-4 text-amber-600" />
                                    <label className="text-xs font-bold uppercase tracking-wider text-amber-900">
                                        Contract Lunch Rate (৳) <span className="text-rose-500">*</span>
                                    </label>
                                </div>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-amber-700">
                                        ৳
                                    </span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.lunch_rate}
                                        onChange={(e) => setData('lunch_rate', e.target.value)}
                                        className="w-full pl-8 pr-4 text-sm font-black rounded-xl border-amber-200 focus:border-amber-500 focus:ring-amber-500 bg-white"
                                        required
                                    />
                                </div>
                                {errors.lunch_rate && (
                                    <p className="text-xs text-rose-600">{errors.lunch_rate}</p>
                                )}
                                <span className="text-[11px] text-amber-700/80 block">
                                    Standard rate used in daily lunch meal count calculations.
                                </span>
                            </div>

                            {/* Dinner Rate */}
                            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Moon className="h-4 w-4 text-indigo-600" />
                                    <label className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                                        Contract Dinner Rate (৳) <span className="text-rose-500">*</span>
                                    </label>
                                </div>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-indigo-700">
                                        ৳
                                    </span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.dinner_rate}
                                        onChange={(e) => setData('dinner_rate', e.target.value)}
                                        className="w-full pl-8 pr-4 text-sm font-black rounded-xl border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 bg-white"
                                        required
                                    />
                                </div>
                                {errors.dinner_rate && (
                                    <p className="text-xs text-rose-600">{errors.dinner_rate}</p>
                                )}
                                <span className="text-[11px] text-indigo-700/80 block">
                                    Standard rate used in daily dinner and overtime calculations.
                                </span>
                            </div>
                        </div>
                    </Card>

                    {/* Dish-by-Dish Custom Price Overrides */}
                    <Card className="overflow-hidden border-slate-200">
                        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Individual Dish Overrides (Optional)</h3>
                                <p className="text-xs text-slate-500">
                                    Override catalogue price for specific premium or specialized dishes for {client.name}
                                </p>
                            </div>
                            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg self-start sm:self-auto">
                                Leave blank to use catalogue default
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <tr>
                                        <th className="py-3 px-4">Dish Name</th>
                                        <th className="py-3 px-4">Category</th>
                                        <th className="py-3 px-4 text-right">Default Rate</th>
                                        <th className="py-3 px-4 text-right">Custom Client Rate (৳)</th>
                                        <th className="py-3 px-4 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {menuItems.map((item) => {
                                        const customEntry = data.custom_prices.find((p) => p.menu_item_id === item.id);
                                        const customVal = customEntry?.custom_price || '';
                                        const isOverridden = customVal !== '' && Number(customVal) > 0;
                                        const diff = isOverridden ? Number(customVal) - Number(item.default_price) : 0;

                                        return (
                                            <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="py-3 px-4">
                                                    <span className="font-bold text-slate-900 block">{item.name}</span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                                                        {item.category}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-right text-slate-600 font-semibold">
                                                    ৳{Number(item.default_price).toFixed(2)}
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <div className="relative w-28">
                                                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                                                                ৳
                                                            </span>
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                min="0"
                                                                value={customVal}
                                                                onChange={(e) => handleItemPriceChange(item.id, e.target.value)}
                                                                placeholder={Number(item.default_price).toFixed(2)}
                                                                className={`w-full pl-6 pr-2 py-1 text-xs font-bold rounded-lg border text-right ${
                                                                    isOverridden
                                                                        ? 'border-emerald-500 bg-emerald-50/30 text-emerald-900 focus:ring-emerald-500'
                                                                        : 'border-slate-200 text-slate-700 focus:ring-emerald-500'
                                                                }`}
                                                            />
                                                        </div>
                                                        {isOverridden && (
                                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                                                diff < 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                                            }`}>
                                                                {diff < 0 ? `-৳${Math.abs(diff).toFixed(0)}` : `+৳${diff.toFixed(0)}`}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    {isOverridden && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleClearOverride(item.id)}
                                                            className="text-xs text-slate-400 hover:text-rose-600 transition p-1"
                                                            title="Reset to default rate"
                                                        >
                                                            <RotateCcw className="h-3.5 w-3.5" />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Link
                            href={route('client-pricing.index')}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/20 hover:bg-emerald-700 active:scale-98 transition disabled:opacity-50"
                        >
                            <Save className="h-4 w-4" />
                            <span>{processing ? 'Saving Rates...' : 'Save Contract Rates'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
