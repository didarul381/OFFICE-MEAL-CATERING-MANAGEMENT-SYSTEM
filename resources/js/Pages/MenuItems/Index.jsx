import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Badge from '@/Components/Badge';
import {
    UtensilsCrossed,
    Plus,
    Search,
    Filter,
    Edit3,
    Trash2,
    Power,
    CheckCircle2,
    XCircle,
    Coffee,
    Sparkles,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

const CATEGORY_COLORS = {
    'Main Course': 'amber',
    'Protein': 'emerald',
    'Side Dish': 'sky',
    'Beverage': 'cyan',
    'Dessert': 'purple',
    'Other': 'slate',
};

export default function Index({ menuItems, filters = {}, categories = [], stats = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || 'all');
    const [status, setStatus] = useState(filters.status || 'all');

    const handleFilterChange = (newFilters = {}) => {
        const query = {
            search: newFilters.search !== undefined ? newFilters.search : search,
            category: newFilters.category !== undefined ? newFilters.category : category,
            status: newFilters.status !== undefined ? newFilters.status : status,
        };

        // Remove defaults
        Object.keys(query).forEach((key) => {
            if (!query[key] || query[key] === 'all') delete query[key];
        });

        router.get(route('menu-items.index'), query, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        handleFilterChange();
    };

    const handleToggleStatus = (item) => {
        router.post(route('menu-items.toggle-status', item.id), {}, {
            preserveScroll: true,
        });
    };

    const handleDelete = (item) => {
        if (confirm(`Are you sure you want to delete '${item.name}'?`)) {
            router.delete(route('menu-items.destroy', item.id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Food Menu Items - Office Meal & Catering" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                            <UtensilsCrossed className="h-4 w-4" />
                            <span>Menu Management</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                            Food & Dish Catalogue
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Configure standard recipes, default rates, and menu categories for office catering
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <Link
                            href={route('daily-menus.index')}
                            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
                        >
                            <Coffee className="h-4 w-4 text-emerald-600" />
                            <span>Daily Menus</span>
                        </Link>
                        <Link
                            href={route('menu-items.create')}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/20 hover:bg-emerald-700 active:scale-98 transition"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add Menu Item</span>
                        </Link>
                    </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <Card className="p-4 sm:p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Items</span>
                            <span className="p-2 rounded-xl bg-slate-100 text-slate-700">
                                <UtensilsCrossed className="h-4 w-4" />
                            </span>
                        </div>
                        <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">{stats.total || 0}</p>
                        <p className="text-[11px] text-slate-400 mt-1">Catalogue capacity</p>
                    </Card>

                    <Card className="p-4 sm:p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Dishes</span>
                            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                                <CheckCircle2 className="h-4 w-4" />
                            </span>
                        </div>
                        <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-3">{stats.active || 0}</p>
                        <p className="text-[11px] text-slate-400 mt-1">Available for daily menus</p>
                    </Card>

                    <Card className="p-4 sm:p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Main Courses</span>
                            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
                                <Sparkles className="h-4 w-4" />
                            </span>
                        </div>
                        <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-3">{stats.main_courses || 0}</p>
                        <p className="text-[11px] text-slate-400 mt-1">Rice, Biryani, Khichuri</p>
                    </Card>

                    <Card className="p-4 sm:p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Protein Dishes</span>
                            <span className="p-2 rounded-xl bg-sky-50 text-sky-600">
                                <UtensilsCrossed className="h-4 w-4" />
                            </span>
                        </div>
                        <p className="text-2xl sm:text-3xl font-black text-sky-600 mt-3">{stats.proteins || 0}</p>
                        <p className="text-[11px] text-slate-400 mt-1">Chicken, beef, fish, egg</p>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="p-4">
                    <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search dishes by name or description..."
                                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 bg-slate-50/50"
                            />
                        </div>

                        <div className="grid grid-cols-2 md:flex items-center gap-2.5">
                            <select
                                value={category}
                                onChange={(e) => {
                                    setCategory(e.target.value);
                                    handleFilterChange({ category: e.target.value });
                                }}
                                className="w-full md:w-44 py-2 px-3 text-xs sm:text-sm rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                            >
                                <option value="all">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>

                            <select
                                value={status}
                                onChange={(e) => {
                                    setStatus(e.target.value);
                                    handleFilterChange({ status: e.target.value });
                                }}
                                className="w-full md:w-36 py-2 px-3 text-xs sm:text-sm rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                            >
                                <option value="all">All Statuses</option>
                                <option value="active">Active Only</option>
                                <option value="inactive">Inactive</option>
                            </select>

                            <button
                                type="submit"
                                className="col-span-2 md:col-auto px-4 py-2 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-semibold hover:bg-slate-800 transition shadow-xs"
                            >
                                Filter
                            </button>
                        </div>
                    </form>
                </Card>

                {/* Desktop Table View */}
                <div className="hidden md:block">
                    <Card className="overflow-hidden border-slate-200">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <tr>
                                        <th className="py-3.5 px-4">Item Name</th>
                                        <th className="py-3.5 px-4">Category</th>
                                        <th className="py-3.5 px-4 text-right">Default Rate</th>
                                        <th className="py-3.5 px-4 text-center">Status</th>
                                        <th className="py-3.5 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {menuItems.data.length > 0 ? (
                                        menuItems.data.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="py-3.5 px-4">
                                                    <div>
                                                        <span className="font-bold text-slate-900 block">{item.name}</span>
                                                        {item.description && (
                                                            <span className="text-xs text-slate-500 line-clamp-1 max-w-md">
                                                                {item.description}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-${CATEGORY_COLORS[item.category] || 'slate'}-50 text-${CATEGORY_COLORS[item.category] || 'slate'}-700 border border-${CATEGORY_COLORS[item.category] || 'slate'}-200`}>
                                                        {item.category}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 text-right font-black text-slate-900">
                                                    ৳{Number(item.default_price).toFixed(2)}
                                                </td>
                                                <td className="py-3.5 px-4 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleStatus(item)}
                                                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition ${
                                                            item.is_active
                                                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200'
                                                        }`}
                                                        title="Click to toggle status"
                                                    >
                                                        <Power className="h-3 w-3" />
                                                        <span>{item.is_active ? 'Active' : 'Inactive'}</span>
                                                    </button>
                                                </td>
                                                <td className="py-3.5 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <Link
                                                            href={route('menu-items.edit', item.id)}
                                                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition"
                                                            title="Edit item"
                                                        >
                                                            <Edit3 className="h-4 w-4" />
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(item)}
                                                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                                                            title="Delete item"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="py-12 text-center text-slate-500">
                                                <UtensilsCrossed className="mx-auto h-10 w-10 text-slate-300 mb-2" />
                                                <p className="font-semibold text-slate-700">No menu items found</p>
                                                <p className="text-xs text-slate-400 mt-1">Try adjusting your search filters or create a new item.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                    {menuItems.data.length > 0 ? (
                        menuItems.data.map((item) => (
                            <Card key={item.id} className="p-4 space-y-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-base">{item.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                                                {item.category}
                                            </span>
                                            <span className="text-sm font-black text-emerald-600">
                                                ৳{Number(item.default_price).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleToggleStatus(item)}
                                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition ${
                                            item.is_active
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                                        }`}
                                    >
                                        <Power className="h-3 w-3" />
                                        <span>{item.is_active ? 'Active' : 'Inactive'}</span>
                                    </button>
                                </div>

                                {item.description && (
                                    <p className="text-xs text-slate-500 line-clamp-2">
                                        {item.description}
                                    </p>
                                )}

                                <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                                    <Link
                                        href={route('menu-items.edit', item.id)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
                                    >
                                        <Edit3 className="h-3.5 w-3.5" />
                                        <span>Edit</span>
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(item)}
                                        className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 transition"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <Card className="p-8 text-center text-slate-500">
                            <UtensilsCrossed className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                            <p className="font-semibold text-slate-700">No dishes match filter</p>
                        </Card>
                    )}
                </div>

                {/* Pagination */}
                {menuItems.links && menuItems.links.length > 3 && (
                    <div className="flex items-center justify-between py-2 text-xs text-slate-600">
                        <span>Showing {menuItems.from || 0} to {menuItems.to || 0} of {menuItems.total} items</span>
                        <div className="flex items-center gap-1">
                            {menuItems.links.map((link, idx) => (
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
        </AuthenticatedLayout>
    );
}
