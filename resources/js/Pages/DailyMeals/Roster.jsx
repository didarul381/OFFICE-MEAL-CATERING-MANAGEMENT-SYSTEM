import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import Badge from '@/Components/Badge';
import {
    CalendarCheck,
    Sun,
    Moon,
    Users,
    Building2,
    Calendar,
    Check,
    X,
    Search,
    Clock,
    Lock,
    ShieldAlert,
    Save,
    ChevronLeft,
    ChevronRight,
    UtensilsCrossed,
    Info,
    RotateCcw,
    CheckSquare,
    Square,
} from 'lucide-react';

export default function Roster({
    client,
    clients = [],
    date = '',
    mealType = 'Lunch',
    employees = [],
    existingEntries = {},
    cutoffInfo = {},
    unitPrice = 0.00,
    todaysMenu = null,
    isClientAdmin = false,
    isVendorAdmin = false,
}) {
    const isLunch = mealType === 'Lunch';
    const [search, setSearch] = useState('');

    // Initialize state of YES/NO attendance for each employee
    // Prioritize existing saved entries from DB; if no entry, use employee's default enrollment
    const initialAttendance = useMemo(() => {
        const state = {};
        employees.forEach((emp) => {
            if (existingEntries[emp.id] !== undefined) {
                state[emp.id] = existingEntries[emp.id].status === 'consumed';
            } else {
                state[emp.id] = emp.default_enabled;
            }
        });
        return state;
    }, [employees, existingEntries]);

    const [attendance, setAttendance] = useState(initialAttendance);
    const [submitting, setSubmitting] = useState(false);

    // Keep state in sync when client, date, or mealType changes
    useEffect(() => {
        setAttendance(initialAttendance);
    }, [initialAttendance]);

    // Handle shift change or client/date change
    const handleParamChange = (newParams) => {
        const query = {
            client_id: newParams.client_id !== undefined ? newParams.client_id : (client?.id || ''),
            date: newParams.date !== undefined ? newParams.date : date,
            meal_type: newParams.meal_type !== undefined ? newParams.meal_type : mealType,
        };

        router.get(route('daily-meals.roster'), query, {
            preserveState: false,
            replace: true,
        });
    };

    // Toggle single employee attendance
    const toggleEmployee = (empId) => {
        if (!cutoffInfo.allowed) return;
        setAttendance((prev) => ({
            ...prev,
            [empId]: !prev[empId],
        }));
    };

    // Bulk actions
    const handleSelectAll = () => {
        if (!cutoffInfo.allowed) return;
        const updated = {};
        employees.forEach((e) => {
            updated[e.id] = true;
        });
        setAttendance(updated);
    };

    const handleUnselectAll = () => {
        if (!cutoffInfo.allowed) return;
        const updated = {};
        employees.forEach((e) => {
            updated[e.id] = false;
        });
        setAttendance(updated);
    };

    const handleResetDefaults = () => {
        if (!cutoffInfo.allowed) return;
        const updated = {};
        employees.forEach((e) => {
            updated[e.id] = e.default_enabled;
        });
        setAttendance(updated);
    };

    // Filter employees by search query
    const filteredEmployees = useMemo(() => {
        if (!search.trim()) return employees;
        const s = search.toLowerCase();
        return employees.filter(
            (e) =>
                e.name.toLowerCase().includes(s) ||
                e.employee_id.toLowerCase().includes(s) ||
                (e.department && e.department.toLowerCase().includes(s))
        );
    }, [employees, search]);

    // Dynamic calculations
    const selectedCount = useMemo(() => {
        return Object.values(attendance).filter(Boolean).length;
    }, [attendance]);

    const unselectedCount = employees.length - selectedCount;
    const totalAmount = (selectedCount * unitPrice).toFixed(2);

    // Submit roster
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!cutoffInfo.allowed) return;

        const entriesPayload = employees.map((emp) => ({
            employee_id: emp.id,
            is_present: Boolean(attendance[emp.id]),
            notes: '',
        }));

        setSubmitting(true);
        router.post(
            route('daily-meals.store'),
            {
                client_id: client.id,
                date: date,
                meal_type: mealType,
                entries: entriesPayload,
            },
            {
                preserveScroll: true,
                onFinish: () => setSubmitting(false),
            }
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Meal Roster - ${client?.name || 'Daily Meals'} (${mealType})`} />

            <div className="space-y-6 pb-20">
                {/* Header & Controls */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                            <CalendarCheck className="h-4 w-4" />
                            <span>Daily Attendance Roster</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                            {client ? client.name : 'Daily Meal Entry'}
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Select present staff to calculate kitchen food quantity and billing total
                        </p>
                    </div>

                    {/* Meal Shift Tabs (Lunch / Dinner) */}
                    <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start lg:self-auto">
                        <button
                            type="button"
                            onClick={() => handleParamChange({ meal_type: 'Lunch' })}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                                isLunch
                                    ? 'bg-white text-amber-950 shadow-sm border border-amber-200/60 font-black'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <Sun className={`h-4 w-4 ${isLunch ? 'text-amber-500' : 'text-slate-400'}`} />
                            <span>Lunch Shift</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleParamChange({ meal_type: 'Dinner' })}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                                !isLunch
                                    ? 'bg-white text-indigo-950 shadow-sm border border-indigo-200/60 font-black'
                                    : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            <Moon className={`h-4 w-4 ${!isLunch ? 'text-indigo-600' : 'text-slate-400'}`} />
                            <span>Dinner Shift</span>
                        </button>
                    </div>
                </div>

                {/* Filters & Date Bar */}
                <Card className="p-4 sm:p-5 border-slate-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {/* Client Selector (for Vendor) */}
                        {!isClientAdmin && clients.length > 0 && (
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Client Organization
                                </label>
                                <select
                                    value={client?.id || ''}
                                    onChange={(e) => handleParamChange({ client_id: e.target.value })}
                                    className="w-full text-xs sm:text-sm rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                                >
                                    {clients.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Date Picker */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Meal Service Date
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => handleParamChange({ date: e.target.value })}
                                    className="w-full text-xs sm:text-sm rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                                />
                            </div>
                        </div>

                        {/* Rate Badge */}
                        <div className="sm:col-span-2 lg:col-span-1 flex items-end">
                            <div className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500">Agreed Contract Rate:</span>
                                <span className="text-sm font-black text-emerald-600">
                                    ৳{Number(unitPrice).toFixed(2)} <span className="text-xs text-slate-400 font-normal">/ meal</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Cutoff Status Alert */}
                {cutoffInfo && (
                    <div>
                        {cutoffInfo.is_override ? (
                            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
                                <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                                <div className="text-xs sm:text-sm">
                                    <span className="font-bold block">Vendor Admin Override Active</span>
                                    <span>Cutoff time ({cutoffInfo.cutoff_time}) has passed. As an authorized administrator, you can modify and lock rosters.</span>
                                </div>
                            </div>
                        ) : !cutoffInfo.allowed ? (
                            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3">
                                <Lock className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                                <div className="text-xs sm:text-sm">
                                    <span className="font-bold block">Roster Submission Locked</span>
                                    <span>{cutoffInfo.reason}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-900 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-emerald-600 shrink-0" />
                                    <span>
                                        Cutoff time for <strong>{mealType}</strong> is <strong>{cutoffInfo.cutoff_time}</strong>. Attendance is currently open for modifications.
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Sticky Calculation Header */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm sticky top-4 z-20">
                    <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Staff</span>
                        <span className="text-xl sm:text-2xl font-black text-slate-900">{employees.length}</span>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Meals (YES)</span>
                        <span className="text-xl sm:text-2xl font-black text-emerald-600">{selectedCount}</span>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Opt-Out (NO)</span>
                        <span className="text-xl sm:text-2xl font-black text-slate-400">{unselectedCount}</span>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Total Amount</span>
                        <span className="text-xl sm:text-2xl font-black text-emerald-700">৳{totalAmount}</span>
                    </div>
                </div>

                {/* Today's Menu Highlight (if available) */}
                {todaysMenu && todaysMenu.items?.length > 0 && (
                    <Card className="p-4 bg-amber-50/40 border-amber-200/60">
                        <div className="flex items-center justify-between pb-2 border-b border-amber-200/40 mb-2">
                            <div className="flex items-center gap-2">
                                <UtensilsCrossed className="h-4 w-4 text-amber-600" />
                                <span className="text-xs font-bold text-amber-950">
                                    Menu for Today: {todaysMenu.title || `${mealType} Menu`}
                                </span>
                            </div>
                            <span className="text-[11px] text-amber-800 font-semibold">
                                {todaysMenu.items.length} dishes included
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs">
                            {todaysMenu.items.map((it, idx) => (
                                <span key={idx} className="bg-white/80 px-2.5 py-1 rounded-lg border border-amber-200/50 text-slate-800 font-medium">
                                    {it.menu_item?.name} {it.serving_portion && <span className="text-slate-400 text-[11px]">({it.serving_portion})</span>}
                                </span>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Bulk Actions & Search Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                    {/* Search */}
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search employee by name or ID..."
                            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                        />
                    </div>

                    {/* Bulk Actions */}
                    {cutoffInfo.allowed && (
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                            <button
                                type="button"
                                onClick={handleSelectAll}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
                            >
                                <CheckSquare className="h-3.5 w-3.5 text-emerald-600" />
                                <span>Select All</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleUnselectAll}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
                            >
                                <Square className="h-3.5 w-3.5 text-slate-400" />
                                <span>Unselect All</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleResetDefaults}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
                                title="Reset to standard employee preferences"
                            >
                                <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
                                <span>Reset</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Employee Cards List (Mobile-First Touch Friendly) */}
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {filteredEmployees.length > 0 ? (
                            filteredEmployees.map((emp) => {
                                const isPresent = Boolean(attendance[emp.id]);

                                return (
                                    <div
                                        key={emp.id}
                                        onClick={() => toggleEmployee(emp.id)}
                                        className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-center justify-between gap-3 ${
                                            isPresent
                                                ? 'bg-emerald-50/40 border-emerald-300 shadow-xs ring-1 ring-emerald-300/60'
                                                : 'bg-white border-slate-200 hover:border-slate-300'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            {/* Avatar or initial */}
                                            <div
                                                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 transition ${
                                                    isPresent
                                                        ? 'bg-emerald-600 text-white'
                                                        : 'bg-slate-100 text-slate-400'
                                                }`}
                                            >
                                                {emp.name.charAt(0)}
                                            </div>

                                            <div className="min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <h4 className="font-bold text-slate-900 text-sm truncate">
                                                        {emp.name}
                                                    </h4>
                                                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                                                        {emp.employee_id}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                                                    <span className="truncate">{emp.department || 'General'}</span>
                                                    <span>•</span>
                                                    <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                                                        {emp.meal_preference}
                                                    </span>
                                                </div>

                                                {emp.dietary_notes && (
                                                    <p className="text-[11px] text-amber-700 mt-1 truncate">
                                                        Diet: {emp.dietary_notes}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Large Touch Target Toggle Pill */}
                                        <div className="shrink-0">
                                            <div
                                                className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition active:scale-95 shadow-xs ${
                                                    isPresent
                                                        ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                                                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                                }`}
                                            >
                                                {isPresent ? (
                                                    <>
                                                        <Check className="h-4 w-4 stroke-[3]" />
                                                        <span>YES</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <X className="h-4 w-4" />
                                                        <span>NO</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                                <Users className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                                <p className="font-semibold text-slate-700">No employees match search</p>
                            </div>
                        )}
                    </div>

                    {/* Bottom Sticky Action Bar */}
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-xl z-30 flex items-center justify-between max-w-7xl mx-auto">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-500 hidden sm:inline">
                                Ready to save {mealType} roster for {client?.name}:
                            </span>
                            <span className="text-base font-black text-slate-900">
                                {selectedCount} Meals • ৳{totalAmount}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="submit"
                                disabled={submitting || !cutoffInfo.allowed}
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-500/25 hover:bg-emerald-700 active:scale-98 transition disabled:opacity-50"
                            >
                                <Save className="h-4 w-4" />
                                <span>{submitting ? 'Confirming...' : 'Confirm & Save Roster'}</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
