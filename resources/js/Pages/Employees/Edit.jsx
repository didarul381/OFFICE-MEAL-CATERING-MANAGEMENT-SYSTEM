import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    Users,
    ArrowLeft,
    Save,
    Building2,
    Phone,
    Mail,
    Utensils,
    Sun,
    Moon,
    Calendar,
    Trash2,
} from 'lucide-react';
import Card from '@/Components/Card';

export default function Edit({ employee, clients, mealPreferences, isClientAdmin }) {
    const { data, setData, put, processing, errors } = useForm({
        client_id: employee.client_id,
        name: employee.name || '',
        employee_id: employee.employee_id || '',
        phone: employee.phone || '',
        email: employee.email || '',
        department: employee.department || '',
        designation: employee.designation || '',
        meal_preference: employee.meal_preference || 'Standard',
        lunch_enabled: employee.lunch_enabled,
        dinner_enabled: employee.dinner_enabled,
        status: employee.status || 'active',
        joining_date: employee.joining_date ? employee.joining_date.substring(0, 10) : '',
        notes: employee.notes || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('employees.update', employee.id));
    };

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete employee ${employee.name}?`)) {
            router.delete(route('employees.destroy', employee.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('employees.show', employee.id)}
                            className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                                Edit {employee.name}
                            </h1>
                            <p className="text-xs text-slate-500 sm:text-sm mt-0.5">
                                Modify employee information, dietary preference, and active meal shifts
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleDelete}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
                    >
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Delete Employee</span>
                    </button>
                </div>
            }
        >
            <Head title={`Edit ${employee.name} - Office Meal & Catering`} />

            <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
                {/* 1. Client Organization & Identity */}
                <Card
                    title="Employee Identity & Organization"
                    subtitle="Corporate badge ID and primary identification"
                >
                    <div className="space-y-4">
                        {!isClientAdmin && clients?.length > 0 && (
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Client Organization <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                                    <select
                                        value={data.client_id}
                                        onChange={(e) => setData('client_id', e.target.value)}
                                        className="w-full rounded-xl border-slate-200 pl-10 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                        required
                                    >
                                        {clients.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                {errors.client_id && (
                                    <p className="text-xs text-rose-600 mt-1">{errors.client_id}</p>
                                )}
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Full Name <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-xl border-slate-200 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    required
                                />
                                {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Employee ID / Badge No <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.employee_id}
                                    onChange={(e) => setData('employee_id', e.target.value)}
                                    className="w-full rounded-xl border-slate-200 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500 font-mono font-semibold"
                                    required
                                />
                                {errors.employee_id && (
                                    <p className="text-xs text-rose-600 mt-1">{errors.employee_id}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full rounded-xl border-slate-200 pl-10 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                </div>
                                {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Corporate Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full rounded-xl border-slate-200 pl-10 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                </div>
                                {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Department
                                </label>
                                <input
                                    type="text"
                                    value={data.department}
                                    onChange={(e) => setData('department', e.target.value)}
                                    className="w-full rounded-xl border-slate-200 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Designation
                                </label>
                                <input
                                    type="text"
                                    value={data.designation}
                                    onChange={(e) => setData('designation', e.target.value)}
                                    className="w-full rounded-xl border-slate-200 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Joining Date
                                </label>
                                <input
                                    type="date"
                                    value={data.joining_date}
                                    onChange={(e) => setData('joining_date', e.target.value)}
                                    className="w-full rounded-xl border-slate-200 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* 2. Meal Preferences & Shift Allowances */}
                <Card
                    title="Meal Preferences & Shift Enablement"
                    subtitle="Configure individual dietary preferences and scheduled meal shifts"
                >
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Meal Preference <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <Utensils className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                                    <select
                                        value={data.meal_preference}
                                        onChange={(e) => setData('meal_preference', e.target.value)}
                                        className="w-full rounded-xl border-slate-200 pl-10 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    >
                                        {mealPreferences.map((pref) => (
                                            <option key={pref} value={pref}>{pref}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Roster Status <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full rounded-xl border-slate-200 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                >
                                    <option value="active">Active (Receiving Meals)</option>
                                    <option value="inactive">Inactive (Suspended)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                Daily Meal Shift Allowances
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <label className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={data.lunch_enabled}
                                        onChange={(e) => setData('lunch_enabled', e.target.checked)}
                                        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <div>
                                        <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-slate-800">
                                            <Sun className="h-4 w-4 text-amber-500" />
                                            <span>Lunch Shift Enabled</span>
                                        </div>
                                        <p className="text-[11px] text-slate-500 mt-0.5">
                                            Included in daily lunch meal counts
                                        </p>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={data.dinner_enabled}
                                        onChange={(e) => setData('dinner_enabled', e.target.checked)}
                                        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <div>
                                        <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-slate-800">
                                            <Moon className="h-4 w-4 text-indigo-500" />
                                            <span>Dinner Shift Enabled</span>
                                        </div>
                                        <p className="text-[11px] text-slate-500 mt-0.5">
                                            Included in daily dinner / overtime meal counts
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Dietary Notes / Allergies
                            </label>
                            <input
                                type="text"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                className="w-full rounded-xl border-slate-200 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500"
                            />
                        </div>
                    </div>
                </Card>

                {/* Form Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                    <Link
                        href={route('employees.show', employee.id)}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 focus:outline-hidden disabled:opacity-50 transition-all"
                    >
                        <Save className="h-4 w-4" />
                        <span>{processing ? 'Saving...' : 'Update Employee'}</span>
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
