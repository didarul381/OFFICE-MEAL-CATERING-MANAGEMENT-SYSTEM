import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Users,
    Plus,
    Upload,
    Search,
    Filter,
    Building2,
    Phone,
    Mail,
    Eye,
    Edit3,
    Trash2,
    Power,
    Check,
    X,
    Utensils,
    Moon,
    Sun,
    ChevronLeft,
    ChevronRight,
    UserCheck,
    CheckCircle2,
} from 'lucide-react';
import Card from '@/Components/Card';
import Badge from '@/Components/Badge';
import EmployeeImportModal from '@/Components/EmployeeImportModal';

export default function Index({
    employees,
    clients,
    departments,
    mealPreferences,
    filters,
    metrics,
    isClientAdmin,
    userClientId,
}) {
    const [search, setSearch] = useState(filters.search || '');
    const [clientId, setClientId] = useState(filters.client_id || 'all');
    const [status, setStatus] = useState(filters.status || 'all');
    const [department, setDepartment] = useState(filters.department || 'all');
    const [mealPreference, setMealPreference] = useState(filters.meal_preference || 'all');
    const [importModalOpen, setImportModalOpen] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters({ search, client_id: clientId, status, department, meal_preference: mealPreference });
    };

    const applyFilters = (newFilters) => {
        router.get(
            route('employees.index'),
            newFilters,
            { preserveState: true, replace: true }
        );
    };

    const handleToggleStatus = (employee) => {
        if (confirm(`Change status of ${employee.name} to ${employee.status === 'active' ? 'Inactive' : 'Active'}?`)) {
            router.post(route('employees.toggle-status', employee.id), {}, { preserveScroll: true });
        }
    };

    const handleDelete = (employee) => {
        if (confirm(`Are you sure you want to remove ${employee.name}?`)) {
            router.delete(route('employees.destroy', employee.id), { preserveScroll: true });
        }
    };

    const getPreferenceBadgeVariant = (pref) => {
        switch (pref) {
            case 'Vegetarian':
                return 'success';
            case 'No Beef':
                return 'warning';
            case 'Halal':
                return 'info';
            case 'Non-Veg':
                return 'purple';
            default:
                return 'neutral';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                            {isClientAdmin ? 'Office Employee Roster' : 'All Client Employees'}
                        </h1>
                        <p className="text-xs text-slate-500 sm:text-sm mt-0.5">
                            Manage employee meal preferences, lunch/dinner allowances, and enrollment
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setImportModalOpen(true)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all shadow-2xs"
                        >
                            <Upload className="h-4 w-4 text-emerald-600" />
                            <span>Import CSV</span>
                        </button>

                        <Link
                            href={route('employees.create')}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add Employee</span>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Employee Roster - Office Meal & Catering" />

            <div className="space-y-6">
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Total Enrolled
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                            {metrics.total}
                        </h3>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Active Roster
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">
                            {metrics.active}
                        </h3>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Lunch Enabled
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-blue-700 mt-1">
                            {metrics.lunch_enabled}
                        </h3>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Dinner Enabled
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-violet-700 mt-1">
                            {metrics.dinner_enabled}
                        </h3>
                    </div>
                </div>

                {/* Filters & Search Bar */}
                <Card noPadding>
                    <div className="p-4 sm:p-5 flex flex-col lg:flex-row items-center justify-between gap-3 bg-slate-50/50 rounded-2xl">
                        <form onSubmit={handleSearch} className="w-full lg:max-w-md relative">
                            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name, ID (e.g. EMP-101), phone, or dept..."
                                className="w-full rounded-xl border-slate-200 pl-10 pr-20 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                            />
                            <button
                                type="submit"
                                className="absolute right-1.5 top-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                            >
                                Search
                            </button>
                        </form>

                        <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
                            {/* Client Filter (Vendor only) */}
                            {!isClientAdmin && clients?.length > 0 && (
                                <select
                                    value={clientId}
                                    onChange={(e) => {
                                        setClientId(e.target.value);
                                        applyFilters({ search, client_id: e.target.value, status, department, meal_preference: mealPreference });
                                    }}
                                    className="rounded-xl border-slate-200 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500 bg-white py-2"
                                >
                                    <option value="all">All Clients</option>
                                    {clients.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            )}

                            {/* Status Filter */}
                            <select
                                value={status}
                                onChange={(e) => {
                                    setStatus(e.target.value);
                                    applyFilters({ search, client_id: clientId, status: e.target.value, department, meal_preference: mealPreference });
                                }}
                                className="rounded-xl border-slate-200 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500 bg-white py-2"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active Only</option>
                                <option value="inactive">Inactive Only</option>
                            </select>

                            {/* Department Filter */}
                            {departments?.length > 0 && (
                                <select
                                    value={department}
                                    onChange={(e) => {
                                        setDepartment(e.target.value);
                                        applyFilters({ search, client_id: clientId, status, department: e.target.value, meal_preference: mealPreference });
                                    }}
                                    className="rounded-xl border-slate-200 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500 bg-white py-2"
                                >
                                    <option value="all">All Depts</option>
                                    {departments.map((d, i) => (
                                        <option key={i} value={d}>{d}</option>
                                    ))}
                                </select>
                            )}

                            {/* Meal Preference Filter */}
                            <select
                                value={mealPreference}
                                onChange={(e) => {
                                    setMealPreference(e.target.value);
                                    applyFilters({ search, client_id: clientId, status, department, meal_preference: e.target.value });
                                }}
                                className="rounded-xl border-slate-200 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500 bg-white py-2"
                            >
                                <option value="all">All Meals</option>
                                {mealPreferences.map((p, i) => (
                                    <option key={i} value={p}>{p}</option>
                                ))}
                            </select>

                            {(search || (clientId !== 'all' && !isClientAdmin) || status !== 'all' || department !== 'all' || mealPreference !== 'all') && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch('');
                                        setClientId('all');
                                        setStatus('all');
                                        setDepartment('all');
                                        setMealPreference('all');
                                        applyFilters({ search: '', client_id: 'all', status: 'all', department: 'all', meal_preference: 'all' });
                                    }}
                                    className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors whitespace-nowrap"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Desktop Data Table */}
                <div className="hidden md:block">
                    <Card noPadding>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-600">
                                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4">Employee & ID</th>
                                        {!isClientAdmin && <th className="px-6 py-4">Client Organization</th>}
                                        <th className="px-6 py-4">Department & Role</th>
                                        <th className="px-6 py-4">Meal Preference</th>
                                        <th className="px-6 py-4">Meal Shifts</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-medium">
                                    {employees.data?.length > 0 ? (
                                        employees.data.map((emp) => (
                                            <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                                                <td className="px-6 py-4">
                                                    <Link
                                                        href={route('employees.show', emp.id)}
                                                        className="font-bold text-slate-900 hover:text-emerald-700 text-sm block"
                                                    >
                                                        {emp.name}
                                                    </Link>
                                                    <span className="font-mono text-[11px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                                                        {emp.employee_id}
                                                    </span>
                                                </td>

                                                {!isClientAdmin && (
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                                                            <Building2 className="h-3.5 w-3.5 text-slate-400" />
                                                            <span>{emp.client?.name}</span>
                                                        </div>
                                                    </td>
                                                )}

                                                <td className="px-6 py-4">
                                                    <p className="font-semibold text-slate-800">{emp.department || 'General'}</p>
                                                    <p className="text-[11px] text-slate-400">{emp.designation || 'Staff'}</p>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <Badge variant={getPreferenceBadgeVariant(emp.meal_preference)} size="sm">
                                                        {emp.meal_preference}
                                                    </Badge>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1.5">
                                                        <span
                                                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                                                                emp.lunch_enabled
                                                                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                                                    : 'bg-slate-100 text-slate-400'
                                                            }`}
                                                            title="Lunch Shift"
                                                        >
                                                            <Sun className="h-3 w-3" />
                                                            <span>Lunch</span>
                                                        </span>

                                                        <span
                                                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                                                                emp.dinner_enabled
                                                                    ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                                                                    : 'bg-slate-100 text-slate-400'
                                                            }`}
                                                            title="Dinner Shift"
                                                        >
                                                            <Moon className="h-3 w-3" />
                                                            <span>Dinner</span>
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <Badge
                                                        variant={emp.status === 'active' ? 'success' : 'danger'}
                                                        size="sm"
                                                        dot
                                                    >
                                                        {emp.status === 'active' ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </td>

                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Link
                                                            href={route('employees.show', emp.id)}
                                                            className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50"
                                                            title="View Employee"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                        <Link
                                                            href={route('employees.edit', emp.id)}
                                                            className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                                                            title="Edit Employee"
                                                        >
                                                            <Edit3 className="h-4 w-4" />
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleToggleStatus(emp)}
                                                            className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-amber-50"
                                                            title={emp.status === 'active' ? 'Deactivate' : 'Activate'}
                                                        >
                                                            <Power className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(emp)}
                                                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                                                            title="Delete Employee"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={isClientAdmin ? '6' : '7'} className="px-6 py-12 text-center text-slate-400">
                                                <Users className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                                                <p className="font-semibold text-slate-600 text-sm">No employees found.</p>
                                                <p className="text-xs text-slate-400 mt-1">Enroll an employee or use bulk CSV import.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Mobile Cards View */}
                <div className="md:hidden space-y-3">
                    {employees.data?.length > 0 ? (
                        employees.data.map((emp) => (
                            <div
                                key={emp.id}
                                className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-3"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <Link
                                            href={route('employees.show', emp.id)}
                                            className="font-bold text-slate-900 text-base hover:text-emerald-700 block"
                                        >
                                            {emp.name}
                                        </Link>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="font-mono text-[11px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                                                {emp.employee_id}
                                            </span>
                                            {!isClientAdmin && (
                                                <span className="text-xs text-slate-500 font-medium truncate max-w-[150px]">
                                                    {emp.client?.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <Badge
                                        variant={emp.status === 'active' ? 'success' : 'danger'}
                                        size="sm"
                                        dot
                                    >
                                        {emp.status === 'active' ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>

                                <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                                    <div>
                                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">Preference</span>
                                        <span className="font-bold text-slate-800">{emp.meal_preference}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">Lunch Shift</span>
                                        <span className={`font-bold ${emp.lunch_enabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                                            {emp.lunch_enabled ? 'YES' : 'NO'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">Dinner Shift</span>
                                        <span className={`font-bold ${emp.dinner_enabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                                            {emp.dinner_enabled ? 'YES' : 'NO'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                                    <span className="text-slate-500 font-medium">
                                        {emp.department || 'General Staff'}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={route('employees.show', emp.id)}
                                            className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs"
                                        >
                                            View
                                        </Link>
                                        <Link
                                            href={route('employees.edit', emp.id)}
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
                            <Users className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                            <p className="font-semibold text-slate-700 text-sm">No employees found.</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {employees.links && employees.links.length > 3 && (
                    <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-6 rounded-2xl shadow-2xs">
                        <div className="text-xs text-slate-500">
                            Showing <span className="font-bold text-slate-700">{employees.from || 0}</span> to{' '}
                            <span className="font-bold text-slate-700">{employees.to || 0}</span> of{' '}
                            <span className="font-bold text-slate-700">{employees.total || 0}</span> employees
                        </div>
                        <div className="flex items-center gap-1">
                            {employees.links.map((link, idx) => {
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

            {/* CSV Import Modal */}
            <EmployeeImportModal
                show={importModalOpen}
                onClose={() => setImportModalOpen(false)}
                clients={clients}
                isClientAdmin={isClientAdmin}
                userClientId={userClientId}
            />
        </AuthenticatedLayout>
    );
}
