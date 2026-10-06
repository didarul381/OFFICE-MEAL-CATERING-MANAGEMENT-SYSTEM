import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Modal from '@/Components/Modal';
import {
    CalendarDays,
    Plus,
    Copy,
    Sun,
    Moon,
    Building2,
    Globe,
    Edit3,
    Trash2,
    Eye,
    UtensilsCrossed,
    Calendar,
    Filter,
    ChevronLeft,
    ChevronRight,
    Sparkles,
} from 'lucide-react';

export default function Index({ dailyMenus, clients = [], filters = {}, isClientAdmin = false }) {
    const [date, setDate] = useState(filters.date || '');
    const [mealType, setMealType] = useState(filters.meal_type || 'all');
    const [clientId, setClientId] = useState(filters.client_id || 'all');

    // Duplicate Modal State
    const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
    const [selectedMenuToDuplicate, setSelectedMenuToDuplicate] = useState(null);
    const [targetDate, setTargetDate] = useState('');
    const [targetMealType, setTargetMealType] = useState('Lunch');
    const [targetClientId, setTargetClientId] = useState('');
    const [duplicating, setDuplicating] = useState(false);

    const handleFilterChange = (newFilters = {}) => {
        const query = {
            date: newFilters.date !== undefined ? newFilters.date : date,
            meal_type: newFilters.meal_type !== undefined ? newFilters.meal_type : mealType,
            client_id: newFilters.client_id !== undefined ? newFilters.client_id : clientId,
        };

        Object.keys(query).forEach((key) => {
            if (!query[key] || query[key] === 'all') delete query[key];
        });

        router.get(route('daily-menus.index'), query, {
            preserveState: true,
            replace: true,
        });
    };

    const openDuplicateModal = (menu) => {
        setSelectedMenuToDuplicate(menu);
        setTargetDate('');
        setTargetMealType(menu.meal_type);
        setTargetClientId(menu.client_id || '');
        setDuplicateModalOpen(true);
    };

    const handleDuplicateSubmit = (e) => {
        e.preventDefault();
        if (!selectedMenuToDuplicate || !targetDate) return;

        setDuplicating(true);
        router.post(
            route('daily-menus.duplicate', selectedMenuToDuplicate.id),
            {
                target_date: targetDate,
                target_meal_type: targetMealType,
                target_client_id: targetClientId || null,
            },
            {
                onFinish: () => {
                    setDuplicating(false);
                    setDuplicateModalOpen(false);
                },
            }
        );
    };

    const handleDelete = (menu) => {
        if (confirm(`Delete daily menu for ${menu.date} (${menu.meal_type})?`)) {
            router.delete(route('daily-menus.destroy', menu.id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Daily Menus - Office Meal & Catering" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                            <CalendarDays className="h-4 w-4" />
                            <span>Meal Scheduling</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                            Daily Catering Menus
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Schedule and publish daily lunch and dinner meal dishes for client offices
                        </p>
                    </div>

                    {!isClientAdmin && (
                        <div className="flex items-center gap-2.5">
                            <Link
                                href={route('menu-items.index')}
                                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
                            >
                                <UtensilsCrossed className="h-4 w-4 text-emerald-600" />
                                <span>Food Catalogue</span>
                            </Link>
                            <Link
                                href={route('daily-menus.create')}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/20 hover:bg-emerald-700 active:scale-98 transition"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Create Daily Menu</span>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Filters */}
                <Card className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        {/* Date Filter */}
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                Specific Date
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => {
                                    setDate(e.target.value);
                                    handleFilterChange({ date: e.target.value });
                                }}
                                className="w-full text-xs sm:text-sm rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                            />
                        </div>

                        {/* Meal Type Filter */}
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                Meal Shift
                            </label>
                            <select
                                value={mealType}
                                onChange={(e) => {
                                    setMealType(e.target.value);
                                    handleFilterChange({ meal_type: e.target.value });
                                }}
                                className="w-full text-xs sm:text-sm rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                            >
                                <option value="all">All Meal Shifts</option>
                                <option value="Lunch">Lunch Only</option>
                                <option value="Dinner">Dinner Only</option>
                            </select>
                        </div>

                        {/* Client Filter (for vendor) */}
                        {!isClientAdmin && (
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                    Target Audience
                                </label>
                                <select
                                    value={clientId}
                                    onChange={(e) => {
                                        setClientId(e.target.value);
                                        handleFilterChange({ client_id: e.target.value });
                                    }}
                                    className="w-full text-xs sm:text-sm rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                                >
                                    <option value="all">All Audiences</option>
                                    <option value="global">Global (All Clients)</option>
                                    {clients.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="flex items-end">
                            <button
                                type="button"
                                onClick={() => {
                                    setDate('');
                                    setMealType('all');
                                    setClientId('all');
                                    handleFilterChange({ date: '', meal_type: 'all', client_id: 'all' });
                                }}
                                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-xs sm:text-sm font-semibold hover:bg-slate-100 transition"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>
                </Card>

                {/* Daily Menu Cards Grid */}
                {dailyMenus.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {dailyMenus.data.map((menu) => (
                            <Card key={menu.id} className="p-5 flex flex-col justify-between hover:border-slate-300 transition-all shadow-xs">
                                <div>
                                    {/* Top Bar: Date & Meal Type */}
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`p-2 rounded-xl ${
                                                menu.meal_type === 'Lunch'
                                                    ? 'bg-amber-50 text-amber-600 border border-amber-100'
                                                    : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                                            }`}>
                                                {menu.meal_type === 'Lunch' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                                            </span>
                                            <div>
                                                <h3 className="font-black text-slate-900 text-base">
                                                    {menu.meal_type}
                                                </h3>
                                                <span className="text-xs font-semibold text-slate-500">
                                                    {menu.date}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Target Audience Badge */}
                                        {menu.client ? (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                                <Building2 className="h-3 w-3" />
                                                <span className="truncate max-w-[120px]">{menu.client.name}</span>
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                <Globe className="h-3 w-3" />
                                                <span>Global Menu</span>
                                            </span>
                                        )}
                                    </div>

                                    {/* Title and Base Price */}
                                    <div className="mt-3.5 pt-3 border-t border-slate-100">
                                        <h4 className="font-bold text-slate-900 text-sm">{menu.title || `${menu.meal_type} Menu`}</h4>
                                        {menu.base_price && (
                                            <p className="text-xs font-black text-emerald-600 mt-0.5">
                                                Base Price: ৳{Number(menu.base_price).toFixed(2)}
                                            </p>
                                        )}
                                    </div>

                                    {/* Included Dishes */}
                                    <div className="mt-3 space-y-1.5">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                            Menu Items ({menu.items?.length || 0})
                                        </span>
                                        <div className="space-y-1">
                                            {menu.items?.map((item, idx) => (
                                                <div key={idx} className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-50 border border-slate-100">
                                                    <span className="font-medium text-slate-800 truncate mr-2">
                                                        {item.menu_item?.name || 'Dish Item'}
                                                    </span>
                                                    {item.serving_portion && (
                                                        <span className="text-[11px] text-slate-400 shrink-0">
                                                            {item.serving_portion}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {menu.notes && (
                                        <p className="mt-2.5 text-[11px] text-slate-500 italic bg-amber-50/40 p-2 rounded-lg border border-amber-100/60">
                                            "{menu.notes}"
                                        </p>
                                    )}
                                </div>

                                {/* Actions Footer */}
                                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                                    <Link
                                        href={route('daily-menus.show', menu.id)}
                                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 p-1"
                                    >
                                        <Eye className="h-3.5 w-3.5" />
                                        <span>Details</span>
                                    </Link>

                                    {!isClientAdmin && (
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => openDuplicateModal(menu)}
                                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                                                title="Duplicate menu to another date"
                                            >
                                                <Copy className="h-3 w-3" />
                                                <span>Copy</span>
                                            </button>
                                            <Link
                                                href={route('daily-menus.edit', menu.id)}
                                                className="p-1 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition"
                                                title="Edit Menu"
                                            >
                                                <Edit3 className="h-3.5 w-3.5" />
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(menu)}
                                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                                                title="Delete Menu"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="p-12 text-center text-slate-500">
                        <CalendarDays className="mx-auto h-12 w-12 text-slate-300 mb-2" />
                        <h3 className="font-bold text-slate-800 text-base">No daily menus scheduled</h3>
                        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                            No menu matched your current filter criteria. Create a daily menu or adjust the filters.
                        </p>
                        {!isClientAdmin && (
                            <Link
                                href={route('daily-menus.create')}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold mt-4 hover:bg-emerald-700 transition"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Create First Menu</span>
                            </Link>
                        )}
                    </Card>
                )}

                {/* Pagination */}
                {dailyMenus.links && dailyMenus.links.length > 3 && (
                    <div className="flex items-center justify-between py-2 text-xs text-slate-600">
                        <span>Showing {dailyMenus.from || 0} to {dailyMenus.to || 0} of {dailyMenus.total} menus</span>
                        <div className="flex items-center gap-1">
                            {dailyMenus.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    preserveScroll
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1.5 rounded-lg font-medium transition ${
                                        link.active
                                            ? 'bg-emerald-600 text-white font-bold'
                                            : link.url
                                            ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                                            : 'text-slate-300 pointer-events-none'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Duplicate Modal */}
            <Modal show={duplicateModalOpen} onClose={() => setDuplicateModalOpen(false)} maxWidth="md">
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                                <Copy className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Duplicate Menu</h3>
                                <p className="text-xs text-slate-500">
                                    Copy dishes and structure to a target date
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleDuplicateSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Target Date <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={targetDate}
                                onChange={(e) => setTargetDate(e.target.value)}
                                className="w-full text-xs sm:text-sm rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Meal Shift <span className="text-rose-500">*</span>
                            </label>
                            <select
                                value={targetMealType}
                                onChange={(e) => setTargetMealType(e.target.value)}
                                className="w-full text-xs sm:text-sm rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                                required
                            >
                                <option value="Lunch">Lunch</option>
                                <option value="Dinner">Dinner</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Target Client (Optional)
                            </label>
                            <select
                                value={targetClientId}
                                onChange={(e) => setTargetClientId(e.target.value)}
                                className="w-full text-xs sm:text-sm rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                            >
                                <option value="">Global Menu (All Clients)</option>
                                {clients.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setDuplicateModalOpen(false)}
                                className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={duplicating || !targetDate}
                                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition disabled:opacity-50"
                            >
                                {duplicating ? 'Duplicating...' : 'Duplicate Menu'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
