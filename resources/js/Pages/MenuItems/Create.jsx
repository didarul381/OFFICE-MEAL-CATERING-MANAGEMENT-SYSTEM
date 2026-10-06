import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import { UtensilsCrossed, ArrowLeft, Save, Sparkles } from 'lucide-react';

export default function Create({ categories = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        category: 'Main Course',
        description: '',
        default_price: '50.00',
        is_active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('menu-items.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Add Menu Item - Office Meal & Catering" />

            <div className="max-w-2xl mx-auto space-y-6">
                {/* Back button & Title */}
                <div className="flex items-center gap-3">
                    <Link
                        href={route('menu-items.index')}
                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 transition shadow-xs"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                            Add New Menu Item
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500">
                            Enroll a new dish into the catering food catalogue
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card className="p-5 sm:p-6 space-y-5">
                        {/* Item Name */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Dish / Item Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="e.g. Shahi Chicken Roast or Steamed Basmati Rice"
                                className="w-full text-xs sm:text-sm rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                                required
                            />
                            {errors.name && (
                                <p className="text-xs text-rose-600 mt-1">{errors.name}</p>
                            )}
                        </div>

                        {/* Category & Default Price */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Menu Category <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    className="w-full text-xs sm:text-sm rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                                    required
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <p className="text-xs text-rose-600 mt-1">{errors.category}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Default Price (৳) <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                                        ৳
                                    </span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.default_price}
                                        onChange={(e) => setData('default_price', e.target.value)}
                                        placeholder="0.00"
                                        className="w-full pl-8 pr-4 text-xs sm:text-sm rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 font-bold"
                                        required
                                    />
                                </div>
                                {errors.default_price && (
                                    <p className="text-xs text-rose-600 mt-1">{errors.default_price}</p>
                                )}
                                <span className="text-[11px] text-slate-400 mt-1 block">
                                    Can be customized per client in client contracts.
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Description / Serving Details
                            </label>
                            <textarea
                                rows={3}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Describe dish ingredients, portions, or preparation details..."
                                className="w-full text-xs sm:text-sm rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                            />
                            {errors.description && (
                                <p className="text-xs text-rose-600 mt-1">{errors.description}</p>
                            )}
                        </div>

                        {/* Active Toggle */}
                        <div className="pt-2 flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                            />
                            <label htmlFor="is_active" className="text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer">
                                Active item (available for daily menus and meal planners)
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                            <Link
                                href={route('menu-items.index')}
                                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/20 hover:bg-emerald-700 active:scale-98 transition disabled:opacity-50"
                            >
                                <Save className="h-4 w-4" />
                                <span>{processing ? 'Saving...' : 'Create Menu Item'}</span>
                            </button>
                        </div>
                    </Card>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
