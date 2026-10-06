import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Users,
    ArrowLeft,
    Edit3,
    Building2,
    Phone,
    Mail,
    Utensils,
    Sun,
    Moon,
    Calendar,
    Power,
    CheckCircle2,
    Briefcase,
    Shield,
    FileText,
    TrendingUp,
} from 'lucide-react';
import Card from '@/Components/Card';
import Badge from '@/Components/Badge';

export default function Show({ employee, mealSummary, canEdit, canDelete }) {
    const handleToggleStatus = () => {
        if (confirm(`Change status of ${employee.name} to ${employee.status === 'active' ? 'Inactive' : 'Active'}?`)) {
            router.post(route('employees.toggle-status', employee.id), {}, { preserveScroll: true });
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

    const formattedJoiningDate = employee.joining_date
        ? new Date(employee.joining_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          })
        : 'Not recorded';

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('employees.index')}
                            className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                                    {employee.name}
                                </h1>
                                <Badge
                                    variant={employee.status === 'active' ? 'success' : 'danger'}
                                    size="sm"
                                    dot
                                >
                                    {employee.status === 'active' ? 'Active' : 'Inactive'}
                                </Badge>
                            </div>
                            <p className="text-xs text-slate-500 sm:text-sm mt-0.5">
                                <span className="font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded mr-1.5">
                                    {employee.employee_id}
                                </span>
                                {employee.client?.name}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {canEdit && (
                            <>
                                <button
                                    type="button"
                                    onClick={handleToggleStatus}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
                                >
                                    <Power className="h-3.5 w-3.5 text-slate-500" />
                                    <span>{employee.status === 'active' ? 'Suspend Meals' : 'Activate Meals'}</span>
                                </button>

                                <Link
                                    href={route('employees.edit', employee.id)}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
                                >
                                    <Edit3 className="h-3.5 w-3.5" />
                                    <span>Edit Employee</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            }
        >
            <Head title={`${employee.name} (${employee.employee_id}) - Employee Profile`} />

            <div className="space-y-6 max-w-4xl mx-auto">
                {/* Top Profile Summary Card */}
                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-2xl flex items-center justify-center shadow-md">
                            {employee.name.charAt(0)}
                        </div>
                        <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                                    {employee.name}
                                </h2>
                                <Badge variant={getPreferenceBadgeVariant(employee.meal_preference)} size="sm">
                                    {employee.meal_preference}
                                </Badge>
                            </div>
                            <p className="text-sm text-slate-600 font-medium">
                                {employee.designation || 'Staff Member'} · {employee.department || 'General Department'}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                                <Link
                                    href={route('clients.show', employee.client_id)}
                                    className="font-semibold text-emerald-700 hover:underline"
                                >
                                    {employee.client?.name}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3 Overview Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Lunch Shift
                            </span>
                            <Sun className="h-4 w-4 text-amber-500" />
                        </div>
                        <h3 className="text-lg font-black text-slate-900 mt-1">
                            {employee.lunch_enabled ? 'Active / Included' : 'Disabled'}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {mealSummary.this_month_lunch} lunches consumed this month
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Dinner Shift
                            </span>
                            <Moon className="h-4 w-4 text-indigo-500" />
                        </div>
                        <h3 className="text-lg font-black text-slate-900 mt-1">
                            {employee.dinner_enabled ? 'Active / Included' : 'Disabled'}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {mealSummary.this_month_dinner} dinners consumed this month
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Total Meals (Month)
                            </span>
                            <TrendingUp className="h-4 w-4 text-emerald-600" />
                        </div>
                        <h3 className="text-lg font-black text-emerald-700 mt-1">
                            {mealSummary.total_meals} Meals
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Last counted: {mealSummary.last_meal_date}
                        </p>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Card
                        title="Contact & Personal Information"
                        subtitle="Direct communication and employee records"
                    >
                        <div className="space-y-3 text-xs">
                            <div className="flex justify-between py-1.5 border-b border-slate-100">
                                <span className="text-slate-500">Employee ID</span>
                                <span className="font-mono font-bold text-slate-800">{employee.employee_id}</span>
                            </div>

                            <div className="flex justify-between py-1.5 border-b border-slate-100">
                                <span className="text-slate-500">Phone</span>
                                {employee.phone ? (
                                    <a href={`tel:${employee.phone}`} className="font-bold text-emerald-600 hover:underline">
                                        {employee.phone}
                                    </a>
                                ) : (
                                    <span className="text-slate-400">Not provided</span>
                                )}
                            </div>

                            <div className="flex justify-between py-1.5 border-b border-slate-100">
                                <span className="text-slate-500">Email</span>
                                {employee.email ? (
                                    <a href={`mailto:${employee.email}`} className="font-semibold text-slate-800 hover:underline">
                                        {employee.email}
                                    </a>
                                ) : (
                                    <span className="text-slate-400">Not provided</span>
                                )}
                            </div>

                            <div className="flex justify-between py-1.5 border-b border-slate-100">
                                <span className="text-slate-500">Joining Date</span>
                                <span className="font-semibold text-slate-800">{formattedJoiningDate}</span>
                            </div>

                            <div className="flex justify-between py-1.5">
                                <span className="text-slate-500">Roster Status</span>
                                <Badge variant={employee.status === 'active' ? 'success' : 'danger'} size="sm" dot>
                                    {employee.status === 'active' ? 'Active' : 'Inactive'}
                                </Badge>
                            </div>
                        </div>
                    </Card>

                    <Card
                        title="Meal Settings & Notes"
                        subtitle="Daily meal schedule parameters"
                    >
                        <div className="space-y-3 text-xs">
                            <div className="flex justify-between py-1.5 border-b border-slate-100">
                                <span className="text-slate-500">Meal Preference</span>
                                <Badge variant={getPreferenceBadgeVariant(employee.meal_preference)} size="sm">
                                    {employee.meal_preference}
                                </Badge>
                            </div>

                            <div className="flex justify-between py-1.5 border-b border-slate-100">
                                <span className="text-slate-500">Lunch Shift Enrollment</span>
                                <span className={`font-bold ${employee.lunch_enabled ? 'text-emerald-700' : 'text-slate-400'}`}>
                                    {employee.lunch_enabled ? 'YES (Default Included)' : 'NO (Excluded)'}
                                </span>
                            </div>

                            <div className="flex justify-between py-1.5 border-b border-slate-100">
                                <span className="text-slate-500">Dinner Shift Enrollment</span>
                                <span className={`font-bold ${employee.dinner_enabled ? 'text-emerald-700' : 'text-slate-400'}`}>
                                    {employee.dinner_enabled ? 'YES (Default Included)' : 'NO (Excluded)'}
                                </span>
                            </div>

                            <div className="py-1.5">
                                <span className="text-slate-500 block mb-1">Dietary Notes / Allergies:</span>
                                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-700 italic">
                                    {employee.notes || 'No special dietary instructions.'}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
