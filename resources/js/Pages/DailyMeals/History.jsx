import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Badge from '@/Components/Badge';
import {
    History,
    Search,
    Sun,
    Moon,
    Building2,
    Calendar,
    Users,
    ShieldAlert,
    DollarSign,
    CalendarCheck,
    Filter,
} from 'lucide-react';

export default function HistoryPage({ mealEntries, clients = [], filters = {}, stats = {}, isClientAdmin = false }) {
    const [search, setSearch] = useState(filters.search || '');
    const [clientId, setClientId] = useState(filters.client_id || 'all');
    const [mealType, setMealType] = useState(filters.meal_type || 'all');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const handleFilterChange = (newFilters = {}) => {
        const query = {
            search: newFilters.search !== undefined ? newFilters.search : search,
            client_id: newFilters.client_id !== undefined ? newFilters.client_id : clientId,
            meal_type: newFilters.meal_type !== undefined ? newFilters.meal_type : mealType,
            date_from: newFilters.date_from !== undefined ? newFilters.date_from : dateFrom,
            date_to: newFilters.date_to !== undefined ? newFilters.date_to : dateTo,
        };

        Object.keys(query).forEach((key) => {
            if (!query[key] || query[key] === 'all') delete query[key];
        });

        router.get(route('daily-meals.history'), query, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        handleFilterChange();
    };

    return (
        <AuthenticatedLayout>
            <Head title="Meal Consumption History - Office Meal & Catering" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                            <History className="h-4 w-4" />
                            <span>Audit & Logs</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                            Meal Consumption History
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Complete log of all confirmed individual employee meals served and billed
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <Link
                            href={route('daily-meals.index')}
                            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
                        >
                            <CalendarCheck className="h-4 w-4 text-emerald-600" />
                            <span>Today's Hub</span>
                        </Link>
                    </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="p-4 sm:p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Meals Served</span>
                            <span className="p-2 rounded-xl bg-slate-100 text-slate-700">
                                <CalendarCheck className="h-4 w-4" />
                            </span>
                        </div>
                        <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">{stats.total_meals || 0}</p>
                        <p className="text-[11px] text-slate-400 mt-1">Filtered result count</p>
                    </Card>

                    <Card className="p-4 sm:p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Billed</span>
                            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                                <DollarSign className="h-4 w-4" />
                            </span>
                        </div>
                        <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-3">৳{stats.total_amount || '0.00'}</p>
                        <p className="text-[11px] text-slate-400 mt-1">Total revenue value</p>
                    </Card>

                    <Card className="p-4 sm:p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Unique Staff</span>
                            <span className="p-2 rounded-xl bg-sky-50 text-sky-600">
                                <Users className="h-4 w-4" />
                            </span>
                        </div>
                        <p className="text-2xl sm:text-3xl font-black text-sky-600 mt-3">{stats.unique_employees || 0}</p>
                        <p className="text-[11px] text-slate-400 mt-1">Individual employees</p>
                    </Card>
                </div>

                {/* Filter Toolbar */}
                <Card className="p-4">
                    <form onSubmit={handleSearchSubmit} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                            {/* Search */}
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                    Employee Search
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Name, ID, department..."
                                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>

                            {/* Client Filter (for vendor) */}
                            {!isClientAdmin && (
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                        Client Organization
                                    </label>
                                    <select
                                        value={clientId}
                                        onChange={(e) => {
                                            setClientId(e.target.value);
                                            handleFilterChange({ client_id: e.target.value });
                                        }}
                                        className="w-full py-2 px-3 text-xs rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                                    >
                                        <option value="all">All Clients</option>
                                        {clients.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Meal Shift */}
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
                                    className="w-full py-2 px-3 text-xs rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                                >
                                    <option value="all">All Shifts</option>
                                    <option value="Lunch">Lunch Only</option>
                                    <option value="Dinner">Dinner Only</option>
                                </select>
                            </div>

                            {/* Date From */}
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                    Date From
                                </label>
                                <input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => {
                                        setDateFrom(e.target.value);
                                        handleFilterChange({ date_from: e.target.value });
                                    }}
                                    className="w-full py-2 px-3 text-xs rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                                />
                            </div>

                            {/* Date To */}
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                    Date To
                                </label>
                                <input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => {
                                        setDateTo(e.target.value);
                                        handleFilterChange({ date_to: e.target.value });
                                    }}
                                    className="w-full py-2 px-3 text-xs rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    setClientId('all');
                                    setMealType('all');
                                    setDateFrom('');
                                    setDateTo('');
                                    handleFilterChange({ search: '', client_id: 'all', meal_type: 'all', date_from: '', date_to: '' });
                                }}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                            >
                                Reset
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition shadow-xs"
                            >
                                Filter Log
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
                                        <th className="py-3.5 px-4">Date</th>
                                        <th className="py-3.5 px-4">Employee</th>
                                        <th className="py-3.5 px-4">Client</th>
                                        <th className="py-3.5 px-4 text-center">Shift</th>
                                        <th className="py-3.5 px-4 text-right">Unit Rate</th>
                                        <th className="py-3.5 px-4 text-center">Cutoff Note</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {mealEntries.data.length > 0 ? (
                                        mealEntries.data.map((entry) => (
                                            <tr key={entry.id} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="py-3.5 px-4 font-semibold text-slate-900">
                                                    {entry.date}
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <div>
                                                        <span className="font-bold text-slate-900 block">{entry.employee?.name || 'Staff Member'}</span>
                                                        <span className="text-xs text-slate-400 font-mono">
                                                            {entry.employee?.employee_id} • {entry.employee?.department || 'General'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4 text-slate-700 font-medium">
                                                    {entry.client?.name}
                                                </td>
                                                <td className="py-3.5 px-4 text-center">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black ${
                                                        entry.meal_type === 'Lunch'
                                                            ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                                                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
                                                    }`}>
                                                        {entry.meal_type === 'Lunch' ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
                                                        <span>{entry.meal_type}</span>
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 text-right font-black text-emerald-600">
                                                    ৳{Number(entry.unit_price).toFixed(2)}
                                                </td>
                                                <td className="py-3.5 px-4 text-center">
                                                    {entry.is_overridden ? (
                                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                                            <ShieldAlert className="h-3 w-3" />
                                                            <span>Override</span>
                                                        </span>
                                                    ) : (
                                                        <span className="text-[11px] text-slate-400 font-medium">Standard</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="py-12 text-center text-slate-500">
                                                <History className="mx-auto h-10 w-10 text-slate-300 mb-2" />
                                                <p className="font-semibold text-slate-700">No meal records found</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                    {mealEntries.data.length > 0 ? (
                        mealEntries.data.map((entry) => (
                            <Card key={entry.id} className="p-4 space-y-2">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm">{entry.employee?.name}</h3>
                                        <p className="text-xs text-slate-400">{entry.client?.name}</p>
                                    </div>
                                    <span className="font-black text-emerald-600 text-sm">৳{Number(entry.unit_price).toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-500">
                                    <span>{entry.date}</span>
                                    <span className="font-bold text-slate-800">{entry.meal_type}</span>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <Card className="p-8 text-center text-slate-500">
                            <p className="font-semibold text-slate-700">No meal history found</p>
                        </Card>
                    )}
                </div>

                {/* Pagination */}
                {mealEntries.links && mealEntries.links.length > 3 && (
                    <div className="flex items-center justify-between py-2 text-xs text-slate-600">
                        <span>Showing {mealEntries.from || 0} to {mealEntries.to || 0} of {mealEntries.total} records</span>
                        <div className="flex items-center gap-1">
                            {mealEntries.links.map((link, idx) => (
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
