import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Badge from '@/Components/Badge';
import {
    DollarSign,
    Search,
    Building2,
    Sliders,
    Eye,
    TrendingUp,
    UtensilsCrossed,
    Sun,
    Moon,
} from 'lucide-react';

export default function Index({ clients, filters = {}, stats = {} }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('client-pricing.index'), { search: search || undefined }, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Client Pricing & Contracts - Office Meal & Catering" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                            <DollarSign className="h-4 w-4" />
                            <span>Contract Rates</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                            Client-Specific Pricing Matrix
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Configure negotiated per-meal rates and individual dish overrides per client organization
                        </p>
                    </div>
                </div>

                {/* Metric Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="p-4 sm:p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Organizations</span>
                            <span className="p-2 rounded-xl bg-slate-100 text-slate-700">
                                <Building2 className="h-4 w-4" />
                            </span>
                        </div>
                        <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">{stats.total_clients || 0}</p>
                        <p className="text-[11px] text-slate-400 mt-1">Contracted clients</p>
                    </Card>

                    <Card className="p-4 sm:p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Avg. Lunch Rate</span>
                            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
                                <Sun className="h-4 w-4" />
                            </span>
                        </div>
                        <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-3">৳{stats.avg_lunch_rate || '0.00'}</p>
                        <p className="text-[11px] text-slate-400 mt-1">Standard executive lunch</p>
                    </Card>

                    <Card className="p-4 sm:p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Avg. Dinner Rate</span>
                            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                                <Moon className="h-4 w-4" />
                            </span>
                        </div>
                        <p className="text-2xl sm:text-3xl font-black text-indigo-600 mt-3">৳{stats.avg_dinner_rate || '0.00'}</p>
                        <p className="text-[11px] text-slate-400 mt-1">Overtime & night shift rate</p>
                    </Card>
                </div>

                {/* Search */}
                <Card className="p-4">
                    <form onSubmit={handleSearch} className="flex gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search client organization..."
                                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 bg-slate-50/50"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-semibold hover:bg-slate-800 transition"
                        >
                            Search
                        </button>
                    </form>
                </Card>

                {/* Desktop Table View */}
                <div className="hidden md:block">
                    <Card className="overflow-hidden border-slate-200">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <tr>
                                        <th className="py-3.5 px-4">Client Organization</th>
                                        <th className="py-3.5 px-4 text-center">Contact Person</th>
                                        <th className="py-3.5 px-4 text-right">Lunch Rate (৳)</th>
                                        <th className="py-3.5 px-4 text-right">Dinner Rate (৳)</th>
                                        <th className="py-3.5 px-4 text-center">Item Overrides</th>
                                        <th className="py-3.5 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {clients.data.length > 0 ? (
                                        clients.data.map((client) => (
                                            <tr key={client.id} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="py-3.5 px-4">
                                                    <div>
                                                        <span className="font-bold text-slate-900 block">{client.name}</span>
                                                        <span className="text-xs text-slate-500">{client.city}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4 text-center text-slate-600">
                                                    {client.contact_person}
                                                </td>
                                                <td className="py-3.5 px-4 text-right">
                                                    <span className="inline-flex items-center gap-1 font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60 text-xs sm:text-sm">
                                                        <Sun className="h-3 w-3" />
                                                        <span>৳{Number(client.lunch_rate || 120).toFixed(2)}</span>
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 text-right">
                                                    <span className="inline-flex items-center gap-1 font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200/60 text-xs sm:text-sm">
                                                        <Moon className="h-3 w-3" />
                                                        <span>৳{Number(client.dinner_rate || 140).toFixed(2)}</span>
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 text-center">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                        client.client_menu_prices_count > 0
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                            : 'bg-slate-100 text-slate-500'
                                                    }`}>
                                                        {client.client_menu_prices_count || 0} custom dish(es)
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={route('client-pricing.show', client.id)}
                                                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                                                            title="View Pricing Matrix"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                        <Link
                                                            href={route('client-pricing.edit', client.id)}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold border border-emerald-200 transition"
                                                        >
                                                            <Sliders className="h-3.5 w-3.5" />
                                                            <span>Configure Rates</span>
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="py-12 text-center text-slate-500">
                                                <Building2 className="mx-auto h-10 w-10 text-slate-300 mb-2" />
                                                <p className="font-semibold text-slate-700">No client organizations found</p>
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
                    {clients.data.length > 0 ? (
                        clients.data.map((client) => (
                            <Card key={client.id} className="p-4 space-y-3">
                                <div>
                                    <h3 className="font-bold text-slate-900 text-base">{client.name}</h3>
                                    <p className="text-xs text-slate-500">{client.contact_person} • {client.city}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <div>
                                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Lunch Rate</span>
                                        <span className="font-black text-amber-600 text-sm">৳{Number(client.lunch_rate || 120).toFixed(2)}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Dinner Rate</span>
                                        <span className="font-black text-indigo-600 text-sm">৳{Number(client.dinner_rate || 140).toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-xs text-slate-500">
                                        {client.client_menu_prices_count || 0} custom override(s)
                                    </span>
                                    <Link
                                        href={route('client-pricing.edit', client.id)}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700 transition"
                                    >
                                        <Sliders className="h-3 w-3" />
                                        <span>Configure</span>
                                    </Link>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <Card className="p-8 text-center text-slate-500">
                            <p className="font-semibold text-slate-700">No organizations found</p>
                        </Card>
                    )}
                </div>

                {/* Pagination */}
                {clients.links && clients.links.length > 3 && (
                    <div className="flex items-center justify-between py-2 text-xs text-slate-600">
                        <span>Showing {clients.from || 0} to {clients.to || 0} of {clients.total} clients</span>
                        <div className="flex items-center gap-1">
                            {clients.links.map((link, idx) => (
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
