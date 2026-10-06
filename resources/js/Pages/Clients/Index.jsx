import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Building2,
    Plus,
    Search,
    Filter,
    Phone,
    Mail,
    MapPin,
    Users,
    Clock,
    MoreVertical,
    Eye,
    Edit3,
    Trash2,
    Power,
    ChevronLeft,
    ChevronRight,
    Utensils,
    CheckCircle2,
    XCircle,
    ArrowUpDown,
} from 'lucide-react';
import Card from '@/Components/Card';
import Badge from '@/Components/Badge';

export default function Index({ clients, filters, cities, metrics, canCreate }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [city, setCity] = useState(filters.city || 'all');
    const [activeMenu, setActiveMenu] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('clients.index'),
            { search, status, city },
            { preserveState: true, replace: true }
        );
    };

    const handleFilterChange = (newStatus, newCity) => {
        setStatus(newStatus);
        setCity(newCity);
        router.get(
            route('clients.index'),
            { search, status: newStatus, city: newCity },
            { preserveState: true, replace: true }
        );
    };

    const handleToggleStatus = (client) => {
        if (confirm(`Are you sure you want to mark ${client.name} as ${client.status === 'active' ? 'Inactive' : 'Active'}?`)) {
            router.post(route('clients.toggle-status', client.id), {}, { preserveScroll: true });
        }
    };

    const handleDelete = (client) => {
        if (confirm(`Are you sure you want to delete ${client.name}? This will move the organization to trash.`)) {
            router.delete(route('clients.destroy', client.id), { preserveScroll: true });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                            Client Organizations
                        </h1>
                        <p className="text-xs text-slate-500 sm:text-sm mt-0.5">
                            Manage contracted offices, delivery cutoff windows, and meal allocations
                        </p>
                    </div>
                    {canCreate && (
                        <div>
                            <Link
                                href={route('clients.create')}
                                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Add Client Organization</span>
                            </Link>
                        </div>
                    )}
                </div>
            }
        >
            <Head title="Client Organizations - Office Meal & Catering" />

            <div className="space-y-6">
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Building2 className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500">Total Client Offices</p>
                            <h3 className="text-xl font-black text-slate-900">{metrics.total_clients}</h3>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500">Active Contracts</p>
                            <h3 className="text-xl font-black text-emerald-700">{metrics.active_clients}</h3>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500">Contracted Staff</p>
                            <h3 className="text-xl font-black text-slate-900">{metrics.total_contracted_employees}</h3>
                        </div>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <Card noPadding>
                    <div className="p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-50/50 rounded-2xl">
                        <form onSubmit={handleSearch} className="w-full md:max-w-md relative">
                            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search organization, contact, phone, or email..."
                                className="w-full rounded-xl border-slate-200 pl-10 pr-20 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                            />
                            <button
                                type="submit"
                                className="absolute right-1.5 top-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                            >
                                Search
                            </button>
                        </form>

                        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                            {/* Status Filter */}
                            <select
                                value={status}
                                onChange={(e) => handleFilterChange(e.target.value, city)}
                                className="rounded-xl border-slate-200 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500 bg-white py-2"
                            >
                                <option value="all">All Statuses</option>
                                <option value="active">Active Only</option>
                                <option value="inactive">Inactive Only</option>
                            </select>

                            {/* City Filter */}
                            <select
                                value={city}
                                onChange={(e) => handleFilterChange(status, e.target.value)}
                                className="rounded-xl border-slate-200 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500 bg-white py-2"
                            >
                                <option value="all">All Cities</option>
                                {cities?.map((c, i) => (
                                    <option key={i} value={c}>{c}</option>
                                ))}
                            </select>

                            {(search || status !== 'all' || city !== 'all') && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch('');
                                        handleFilterChange('all', 'all');
                                    }}
                                    className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors whitespace-nowrap"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Clients Desktop Data Table */}
                <div className="hidden md:block">
                    <Card noPadding>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-600">
                                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4">Organization & City</th>
                                        <th className="px-6 py-4">Contact Person</th>
                                        <th className="px-6 py-4">Headcount</th>
                                        <th className="px-6 py-4">Meal Types</th>
                                        <th className="px-6 py-4">Cutoff Times</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-medium">
                                    {clients.data?.length > 0 ? (
                                        clients.data.map((client) => (
                                            <tr key={client.id} className="hover:bg-slate-50/70 transition-colors">
                                                <td className="px-6 py-4">
                                                    <Link
                                                        href={route('clients.show', client.id)}
                                                        className="font-bold text-slate-900 hover:text-emerald-700 text-sm block"
                                                    >
                                                        {client.name}
                                                    </Link>
                                                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mt-0.5">
                                                        <MapPin className="h-3 w-3 flex-shrink-0" />
                                                        <span className="truncate max-w-[200px]">{client.city}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="font-semibold text-slate-800">{client.contact_person}</p>
                                                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                                                        <span className="flex items-center gap-1">
                                                            <Phone className="h-3 w-3 text-slate-400" />
                                                            {client.phone}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg text-slate-800 font-bold">
                                                        <Users className="h-3.5 w-3.5 text-slate-500" />
                                                        <span>{client.number_of_employees}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-1">
                                                        {client.meal_types?.map((type, tIdx) => (
                                                            <span
                                                                key={tIdx}
                                                                className="capitalize bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2 py-0.5 rounded text-[11px] font-semibold"
                                                            >
                                                                {type}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-[11px] text-slate-500">
                                                    {client.lunch_cutoff_time && (
                                                        <p>Lunch: <strong className="text-slate-800">{client.lunch_cutoff_time}</strong></p>
                                                    )}
                                                    {client.dinner_cutoff_time && (
                                                        <p>Dinner: <strong className="text-slate-800">{client.dinner_cutoff_time}</strong></p>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge
                                                        variant={client.status === 'active' ? 'success' : 'danger'}
                                                        size="sm"
                                                        dot
                                                    >
                                                        {client.status === 'active' ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Link
                                                            href={route('clients.show', client.id)}
                                                            className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50"
                                                            title="View Client Details"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                        <Link
                                                            href={route('clients.edit', client.id)}
                                                            className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                                                            title="Edit Client"
                                                        >
                                                            <Edit3 className="h-4 w-4" />
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleToggleStatus(client)}
                                                            className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-amber-50"
                                                            title={client.status === 'active' ? 'Deactivate' : 'Activate'}
                                                        >
                                                            <Power className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(client)}
                                                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                                                            title="Delete Client"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                                                <Building2 className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                                                <p className="font-semibold text-slate-600 text-sm">No client organizations found.</p>
                                                <p className="text-xs text-slate-400 mt-1">Try refining your search or add a new office.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Mobile Cards View (Touch-First) */}
                <div className="md:hidden space-y-3">
                    {clients.data?.length > 0 ? (
                        clients.data.map((client) => (
                            <div
                                key={client.id}
                                className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-3"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <Link
                                            href={route('clients.show', client.id)}
                                            className="font-bold text-slate-900 text-base hover:text-emerald-700 block leading-snug"
                                        >
                                            {client.name}
                                        </Link>
                                        <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-0.5">
                                            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                                            <span>{client.city}</span>
                                        </div>
                                    </div>
                                    <Badge
                                        variant={client.status === 'active' ? 'success' : 'danger'}
                                        size="sm"
                                        dot
                                    >
                                        {client.status === 'active' ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>

                                <div className="rounded-xl bg-slate-50 p-3 grid grid-cols-3 gap-2 text-center text-xs">
                                    <div>
                                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">Headcount</span>
                                        <span className="font-black text-slate-800 text-sm">{client.number_of_employees}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">Meals</span>
                                        <span className="font-bold text-emerald-700 text-xs">
                                            {client.meal_types?.join(', ') || 'Lunch'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">Cutoff</span>
                                        <span className="font-bold text-slate-700 text-xs">
                                            {client.lunch_cutoff_time || '10:00'}
                                        </span>
                                    </div>
                                </div>

                                <div className="text-xs text-slate-600 flex items-center justify-between pt-1 border-t border-slate-100">
                                    <div>
                                        <p className="font-semibold text-slate-800">{client.contact_person}</p>
                                        <p className="text-[11px] text-slate-400">{client.phone}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={route('clients.show', client.id)}
                                            className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs"
                                        >
                                            View
                                        </Link>
                                        <Link
                                            href={route('clients.edit', client.id)}
                                            className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs"
                                        >
                                            Edit
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-400">
                            <Building2 className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                            <p className="font-semibold text-slate-700 text-sm">No client offices found.</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {clients.links && clients.links.length > 3 && (
                    <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-6 rounded-2xl shadow-2xs">
                        <div className="text-xs text-slate-500">
                            Showing <span className="font-bold text-slate-700">{clients.from || 0}</span> to{' '}
                            <span className="font-bold text-slate-700">{clients.to || 0}</span> of{' '}
                            <span className="font-bold text-slate-700">{clients.total || 0}</span> clients
                        </div>
                        <div className="flex items-center gap-1">
                            {clients.links.map((link, idx) => {
                                if (!link.url) {
                                    return (
                                        <span
                                            key={idx}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className="px-2.5 py-1 text-xs text-slate-400 opacity-50 cursor-not-allowed"
                                        />
                                    );
                                }
                                return (
                                    <Link
                                        key={idx}
                                        href={link.url}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                            link.active
                                                ? 'bg-emerald-600 text-white'
                                                : 'text-slate-600 hover:bg-slate-100'
                                        }`}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
