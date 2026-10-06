import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Sun,
    Moon,
    Building2,
    CalendarCheck,
    DollarSign,
    ArrowRight,
} from 'lucide-react';

export default function CalendarPage({
    month = '',
    monthLabel = '',
    prevMonth = '',
    nextMonth = '',
    daysData = {},
    totalMonthMeals = 0,
    totalMonthAmount = 0.00,
    clients = [],
    selectedClientId = 'all',
    isClientAdmin = false,
}) {
    const handleClientChange = (newClientId) => {
        router.get(
            route('daily-meals.calendar'),
            { month, client_id: newClientId !== 'all' ? newClientId : undefined },
            { preserveState: true, replace: true }
        );
    };

    // Generate days of current month
    const [year, monthNum] = month.split('-').map(Number);
    const firstDayIndex = new Date(year, monthNum - 1, 1).getDay(); // 0 is Sunday
    const daysInMonth = new Date(year, monthNum, 0).getDate();

    const todayStr = new Date().toISOString().slice(0, 10);

    const calendarCells = [];
    // Leading blanks
    for (let i = 0; i < firstDayIndex; i++) {
        calendarCells.push(null);
    }
    // Days
    for (let d = 1; d <= daysInMonth; d++) {
        const dateKey = `${year}-${String(monthNum).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        calendarCells.push({
            dayNumber: d,
            dateKey,
            data: daysData[dateKey] || null,
            isToday: dateKey === todayStr,
        });
    }

    return (
        <AuthenticatedLayout>
            <Head title={`Meal Calendar: ${monthLabel} - Office Meal & Catering`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                            <CalendarIcon className="h-4 w-4" />
                            <span>Monthly Calendar</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                            Meal Activity Calendar
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Visual overview of daily meal volume and expenditure for {monthLabel}
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

                {/* Month Navigator & Client Filter */}
                <Card className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('daily-meals.calendar', {
                                month: prevMonth,
                                client_id: selectedClientId !== 'all' ? selectedClientId : undefined,
                            })}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                            title="Previous Month"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Link>
                        <h2 className="text-lg font-black text-slate-900 min-w-[150px] text-center">
                            {monthLabel}
                        </h2>
                        <Link
                            href={route('daily-meals.calendar', {
                                month: nextMonth,
                                client_id: selectedClientId !== 'all' ? selectedClientId : undefined,
                            })}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                            title="Next Month"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Link>
                    </div>

                    <div className="flex items-center gap-3">
                        {!isClientAdmin && clients.length > 0 && (
                            <div className="flex items-center gap-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">
                                    Filter Client:
                                </label>
                                <select
                                    value={selectedClientId}
                                    onChange={(e) => handleClientChange(e.target.value)}
                                    className="text-xs sm:text-sm rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                                >
                                    <option value="all">All Organizations</option>
                                    {clients.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Summary Metrics */}
                <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4 sm:p-5">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Month Meals Consumed</span>
                        <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">{totalMonthMeals}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Total across month</p>
                    </Card>

                    <Card className="p-4 sm:p-5">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Month Billing Total</span>
                        <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">৳{Number(totalMonthAmount).toFixed(2)}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Calculated production amount</p>
                    </Card>
                </div>

                {/* Calendar Grid */}
                <Card className="p-4 sm:p-6 overflow-hidden border-slate-200">
                    {/* Day Headers */}
                    <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-black text-slate-400 uppercase tracking-wider">
                        <div>Sun</div>
                        <div>Mon</div>
                        <div>Tue</div>
                        <div>Wed</div>
                        <div>Thu</div>
                        <div>Fri</div>
                        <div>Sat</div>
                    </div>

                    {/* Cells */}
                    <div className="grid grid-cols-7 gap-2">
                        {calendarCells.map((cell, idx) => {
                            if (!cell) {
                                return <div key={idx} className="min-h-[90px] rounded-2xl bg-slate-50/40 opacity-40" />;
                            }

                            const hasData = cell.data && cell.data.total_meals > 0;

                            return (
                                <Link
                                    key={idx}
                                    href={route('daily-meals.roster', {
                                        date: cell.dateKey,
                                        meal_type: 'Lunch',
                                        client_id: selectedClientId !== 'all' ? selectedClientId : undefined,
                                    })}
                                    className={`min-h-[95px] p-2.5 rounded-2xl border transition-all flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 ${
                                        cell.isToday
                                            ? 'bg-emerald-50/40 border-emerald-400 ring-2 ring-emerald-400/40'
                                            : hasData
                                            ? 'bg-white border-slate-200'
                                            : 'bg-white/80 border-slate-100'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className={`text-xs font-black ${
                                            cell.isToday ? 'text-emerald-700' : 'text-slate-900'
                                        }`}>
                                            {cell.dayNumber}
                                        </span>
                                        {cell.isToday && (
                                            <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-emerald-600 text-white">
                                                Today
                                            </span>
                                        )}
                                    </div>

                                    {hasData ? (
                                        <div className="space-y-1 my-1">
                                            {cell.data.lunch_count > 0 && (
                                                <div className="flex items-center justify-between text-[11px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                                                    <span className="flex items-center gap-0.5"><Sun className="h-2.5 w-2.5" /> L</span>
                                                    <span>{cell.data.lunch_count}</span>
                                                </div>
                                            )}
                                            {cell.data.dinner_count > 0 && (
                                                <div className="flex items-center justify-between text-[11px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                                                    <span className="flex items-center gap-0.5"><Moon className="h-2.5 w-2.5" /> D</span>
                                                    <span>{cell.data.dinner_count}</span>
                                                </div>
                                            )}
                                            <div className="text-[10px] text-right font-black text-slate-700">
                                                ৳{Number(cell.data.total_amount).toFixed(0)}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-[10px] text-slate-300 italic text-center py-2">
                                            —
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
