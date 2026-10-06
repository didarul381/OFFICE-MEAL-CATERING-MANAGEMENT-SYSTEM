import React from 'react';
import { Head, Link } from '@inertiajs/react';
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
    History,
    ArrowRight,
    CheckCircle2,
    Clock,
    AlertTriangle,
    DollarSign,
} from 'lucide-react';

export default function Index({ clientStatuses = [], stats = {}, today = '' }) {
    return (
        <AuthenticatedLayout>
            <Head title="Daily Meals Hub - Office Meal & Catering" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                            <CalendarCheck className="h-4 w-4" />
                            <span>Operational Hub</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                            Today's Daily Meals Overview
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            {stats.date_formatted || 'Daily attendance, headcount tracking, and order values'}
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <Link
                            href={route('daily-meals.calendar')}
                            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
                        >
                            <Calendar className="h-4 w-4 text-emerald-600" />
                            <span>Monthly Calendar</span>
                        </Link>
                        <Link
                            href={route('daily-meals.history')}
                            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
                        >
                            <History className="h-4 w-4 text-emerald-600" />
                            <span>Consumption History</span>
                        </Link>
                    </div>
                </div>

                {/* Summary Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <Card className="p-4 sm:p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Clients</span>
                            <span className="p-2 rounded-xl bg-slate-100 text-slate-700">
                                <Building2 className="h-4 w-4" />
                            </span>
                        </div>
                        <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">{stats.total_clients || 0}</p>
                        <p className="text-[11px] text-slate-400 mt-1">Active client offices</p>
                    </Card>

                    <Card className="p-4 sm:p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Today's Lunch</span>
                            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
                                <Sun className="h-4 w-4" />
                            </span>
                        </div>
                        <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-3">{stats.total_lunch_today || 0}</p>
                        <p className="text-[11px] text-slate-400 mt-1">Confirmed lunch count</p>
                    </Card>

                    <Card className="p-4 sm:p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Today's Dinner</span>
                            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                                <Moon className="h-4 w-4" />
                            </span>
                        </div>
                        <p className="text-2xl sm:text-3xl font-black text-indigo-600 mt-3">{stats.total_dinner_today || 0}</p>
                        <p className="text-[11px] text-slate-400 mt-1">Confirmed dinner count</p>
                    </Card>

                    <Card className="p-4 sm:p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Meals</span>
                            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                                <CalendarCheck className="h-4 w-4" />
                            </span>
                        </div>
                        <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-3">{stats.total_meals_today || 0}</p>
                        <p className="text-[11px] text-slate-400 mt-1">Combined day total</p>
                    </Card>
                </div>

                {/* Client Rosters Status Table */}
                <Card className="overflow-hidden border-slate-200">
                    <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                            <h2 className="text-base font-bold text-slate-900">Client Attendance & Production Rosters</h2>
                            <p className="text-xs text-slate-500">
                                Real-time meal numbers per client organization for today ({today})
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <tr>
                                    <th className="py-3.5 px-4">Client Organization</th>
                                    <th className="py-3.5 px-4 text-center">Enrolled Staff</th>
                                    <th className="py-3.5 px-4 text-center">Lunch Count</th>
                                    <th className="py-3.5 px-4 text-center">Dinner Count</th>
                                    <th className="py-3.5 px-4 text-right">Today's Total (৳)</th>
                                    <th className="py-3.5 px-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {clientStatuses.length > 0 ? (
                                    clientStatuses.map((item) => (
                                        <tr key={item.client.id} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="py-3.5 px-4">
                                                <div>
                                                    <span className="font-bold text-slate-900 block">{item.client.name}</span>
                                                    <span className="text-xs text-slate-500">{item.client.city}</span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 text-center text-slate-700 font-semibold">
                                                {item.client.number_of_employees || 0}
                                            </td>
                                            <td className="py-3.5 px-4 text-center">
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-700 border border-amber-200/60">
                                                    <Sun className="h-3 w-3" />
                                                    <span>{item.lunch_count} meals</span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 text-center">
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                                                    <Moon className="h-3 w-3" />
                                                    <span>{item.dinner_count} meals</span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 text-right font-black text-slate-900">
                                                ৳{Number(item.total_amount).toFixed(2)}
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={route('daily-meals.roster', {
                                                            client_id: item.client.id,
                                                            date: today,
                                                            meal_type: 'Lunch',
                                                        })}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700 active:scale-98 transition"
                                                    >
                                                        <span>Open Roster</span>
                                                        <ArrowRight className="h-3.5 w-3.5" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-12 text-center text-slate-500">
                                            <Building2 className="mx-auto h-10 w-10 text-slate-300 mb-2" />
                                            <p className="font-semibold text-slate-700">No active clients found</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
