import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import { CalendarDays, ArrowLeft, Plus, Trash2, Save } from 'lucide-react';

export default function Edit({ dailyMenu, menuItems = [], clients = [] }) {
    const initialItems = dailyMenu.items?.map((item) => ({
        menu_item_id: item.menu_item_id,
        name: item.menu_item?.name || 'Dish Item',
        category: item.menu_item?.category || 'Main Course',
        serving_portion: item.serving_portion || 'Standard portion',
        notes: item.notes || '',
    })) || [];

    const { data, setData, put, processing, errors } = useForm({
        date: dailyMenu.date || '',
        meal_type: dailyMenu.meal_type || 'Lunch',
        client_id: dailyMenu.client_id || '',
        title: dailyMenu.title || '',
        base_price: dailyMenu.base_price || '',
        notes: dailyMenu.notes || '',
        is_published: Boolean(dailyMenu.is_published),
        items: initialItems,
    });

    const [selectedItemId, setSelectedItemId] = useState('');
    const [portion, setPortion] = useState('Standard portion');

    const handleAddItem = () => {
        if (!selectedItemId) return;

        const menuItem = menuItems.find((i) => i.id === Number(selectedItemId));
        if (!menuItem) return;

        if (data.items.some((i) => i.menu_item_id === menuItem.id)) {
            alert('Item is already in this daily menu.');
            return;
        }

        const newItems = [
            ...data.items,
            {
                menu_item_id: menuItem.id,
                name: menuItem.name,
                category: menuItem.category,
                serving_portion: portion || 'Standard portion',
                notes: '',
            },
        ];

        setData('items', newItems);
        setSelectedItemId('');
        setPortion('Standard portion');
    };

    const handleRemoveItem = (index) => {
        const updated = data.items.filter((_, idx) => idx !== index);
        setData('items', updated);
    };

    const handleItemPortionChange = (index, val) => {
        const updated = [...data.items];
        updated[index].serving_portion = val;
        setData('items', updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (data.items.length === 0) {
            alert('Please include at least one dish in this menu.');
            return;
        }
        put(route('daily-menus.update', dailyMenu.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edit Menu - ${dailyMenu.date} (${dailyMenu.meal_type})`} />

            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <Link
                        href={route('daily-menus.index')}
                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 transition shadow-xs"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                            Edit Daily Menu
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500">
                            Update dishes and pricing for {dailyMenu.date} ({dailyMenu.meal_type})
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Menu Details */}
                    <Card className="p-5 sm:p-6 space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Date <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                    className="w-full text-xs sm:text-sm rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                                    required
                                />
                                {errors.date && <p className="text-xs text-rose-600 mt-1">{errors.date}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Meal Shift <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={data.meal_type}
                                    onChange={(e) => setData('meal_type', e.target.value)}
                                    className="w-full text-xs sm:text-sm rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                                    required
                                >
                                    <option value="Lunch">Lunch</option>
                                    <option value="Dinner">Dinner</option>
                                </select>
                                {errors.meal_type && <p className="text-xs text-rose-600 mt-1">{errors.meal_type}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Target Audience
                                </label>
                                <select
                                    value={data.client_id}
                                    onChange={(e) => setData('client_id', e.target.value)}
                                    className="w-full text-xs sm:text-sm rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                                >
                                    <option value="">Global Menu (All Clients)</option>
                                    {clients.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                {errors.client_id && <p className="text-xs text-rose-600 mt-1">{errors.client_id}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Menu Title
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="w-full text-xs sm:text-sm rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                                />
                                {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Base Price (৳)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.base_price}
                                    onChange={(e) => setData('base_price', e.target.value)}
                                    className="w-full text-xs sm:text-sm rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 font-bold"
                                />
                                {errors.base_price && <p className="text-xs text-rose-600 mt-1">{errors.base_price}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                Kitchen Notes
                            </label>
                            <textarea
                                rows={2}
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                className="w-full text-xs sm:text-sm rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                            />
                        </div>
                    </Card>

                    {/* Dish Selection & Building */}
                    <Card className="p-5 sm:p-6 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Included Dishes</h3>
                                <p className="text-xs text-slate-500">
                                    Adjust food dishes and serving portions
                                </p>
                            </div>
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                                {data.items.length} item(s) selected
                            </span>
                        </div>

                        {/* Dish Selector Bar */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="sm:col-span-7">
                                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Select Food Item</label>
                                <select
                                    value={selectedItemId}
                                    onChange={(e) => setSelectedItemId(e.target.value)}
                                    className="w-full text-xs sm:text-sm rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                                >
                                    <option value="">-- Choose a dish from catalogue --</option>
                                    {menuItems.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name} ({item.category}) - ৳{Number(item.default_price).toFixed(2)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="sm:col-span-3">
                                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Portion / Serving</label>
                                <input
                                    type="text"
                                    value={portion}
                                    onChange={(e) => setPortion(e.target.value)}
                                    placeholder="Portion"
                                    className="w-full text-xs sm:text-sm rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                                />
                            </div>

                            <div className="sm:col-span-2 flex items-end">
                                <button
                                    type="button"
                                    onClick={handleAddItem}
                                    disabled={!selectedItemId}
                                    className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition disabled:opacity-50"
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        {/* List of Added Dishes */}
                        <div className="space-y-2 pt-2">
                            {data.items.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 shadow-xs"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center">
                                            {index + 1}
                                        </span>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{item.name}</h4>
                                            <span className="text-[11px] text-slate-400">{item.category}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <input
                                            type="text"
                                            value={item.serving_portion}
                                            onChange={(e) => handleItemPortionChange(index, e.target.value)}
                                            className="w-32 text-xs py-1 px-2 rounded-lg border-slate-200 focus:ring-emerald-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveItem(index)}
                                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3">
                        <Link
                            href={route('daily-menus.index')}
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
                            <span>{processing ? 'Saving...' : 'Update Daily Menu'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
