import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Building2,
    Users,
    UtensilsCrossed,
    DollarSign,
    Truck,
    TrendingUp,
    Store,
    Clock,
    ChevronRight,
    CheckCircle2,
    Calendar,
    ArrowUpRight,
    Sparkles,
} from 'lucide-react';
import Card from '@/Components/Card';
import Badge from '@/Components/Badge';

export default function Dashboard({ stats, clientOverview, vendor, role }) {
    const isVendor = role === 'vendor_admin' || role === 'vendor_staff';

    const statIcons = {
        total_clients: Building2,
        total_employees: Users,
        today_meals: UtensilsCrossed,
        today_revenue: TrendingUp,
        pending_deliveries: Truck,
    };

    const statColors = {
        total_clients: 'from-blue-500 to-indigo-600',
        total_employees: 'from-emerald-500 to-teal-600',
        today_meals: 'from-amber-500 to-orange-600',
        today_revenue: 'from-violet-500 to-purple-600',
        pending_deliveries: 'from-rose-500 to-pink-600',
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                        Operational Dashboard
                    </h1>
                    <p className="text-xs text-slate-500 sm:text-sm mt-0.5">
                        Daily catering counts, office clients, and distribution overview
                    </p>
                </div>
            }
        >
            <Head title="Dashboard - Office Meal & Catering" />

            <div className="space-y-6">
                {/* Welcome & System Status Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 text-white shadow-md">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="space-y-1">
                            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-inset ring-emerald-500/30">
                                <Sparkles className="h-3.5 w-3.5" />
                                <span>Milestone 01 Foundation Live</span>
                            </div>
                            <h2 className="text-xl font-bold sm:text-2xl text-white tracking-tight">
                                Welcome back to {vendor?.business_name || 'ABC Catering'}
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                                Single-vendor management platform replacing manual notebook logs. All client office meals, daily headcounts, riders, and invoices centralized.
                            </p>
                        </div>
                        {isVendor && (
                            <div className="flex-shrink-0">
                                <Link
                                    href={route('vendor.profile')}
                                    className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-900 shadow-sm transition hover:bg-slate-100"
                                >
                                    <Store className="h-4 w-4 text-emerald-600" />
                                    <span>Manage Vendor Profile</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* 5 Core Metric Cards */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                            Operational Metrics (Today)
                        </h2>
                        <span className="text-xs text-slate-400">Real-time status</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        {Object.entries(stats).map(([key, item]) => {
                            const Icon = statIcons[key] || TrendingUp;
                            const gradient = statColors[key] || 'from-emerald-500 to-teal-600';

                            return (
                                <div
                                    key={key}
                                    className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md hover:border-slate-300"
                                >
                                    <div className="flex items-center justify-between">
                                        <div
                                            className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr ${gradient} text-white shadow-xs`}
                                        >
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                                            {item.change}
                                        </span>
                                    </div>
                                    <div className="mt-4">
                                        <h3 className="text-2xl font-black tracking-tight text-slate-900">
                                            {item.formatted || item.value}
                                        </h3>
                                        <p className="text-xs font-bold text-slate-700 mt-0.5">
                                            {item.label}
                                        </p>
                                        <p className="text-[11px] text-slate-500 mt-1">
                                            {item.subtitle}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Operational Highlights & Client Snapshot */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Client Meals Summary Table/Cards (2 Cols) */}
                    <div className="lg:col-span-2">
                        <Card
                            title="Client Organization Status"
                            subtitle="Overview of today's enrolled offices and meal status"
                            action={
                                <Badge variant="primary" size="sm">
                                    4 Offices Active
                                </Badge>
                            }
                            noPadding
                        >
                            {/* Desktop View Table */}
                            <div className="hidden sm:block overflow-x-auto">
                                <table className="w-full text-left text-xs text-slate-600">
                                    <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-3">Client Organization</th>
                                            <th className="px-6 py-3">Employees</th>
                                            <th className="px-6 py-3">Today's Meals</th>
                                            <th className="px-6 py-3">Lunch Time</th>
                                            <th className="px-6 py-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 font-medium">
                                        {clientOverview?.map((client, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                                                <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-2">
                                                    <Building2 className="h-4 w-4 text-slate-400" />
                                                    <span>{client.name}</span>
                                                </td>
                                                <td className="px-6 py-4">{client.employees} Staff</td>
                                                <td className="px-6 py-4 font-bold text-emerald-700">
                                                    {client.today_meals} Meals
                                                </td>
                                                <td className="px-6 py-4 text-slate-500">
                                                    {client.lunch_time}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge
                                                        variant={
                                                            client.status === 'Delivered'
                                                                ? 'success'
                                                                : client.status === 'On The Way'
                                                                ? 'warning'
                                                                : 'info'
                                                        }
                                                        size="sm"
                                                        dot
                                                    >
                                                        {client.status}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile View Cards */}
                            <div className="sm:hidden divide-y divide-slate-100 p-3 space-y-3">
                                {clientOverview?.map((client, idx) => (
                                    <div key={idx} className="rounded-xl border border-slate-100 p-3 bg-white shadow-2xs">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-bold text-xs text-slate-900">
                                                {client.name}
                                            </h4>
                                            <Badge
                                                variant={
                                                    client.status === 'Delivered'
                                                        ? 'success'
                                                        : client.status === 'On The Way'
                                                        ? 'warning'
                                                        : 'info'
                                                }
                                                size="sm"
                                                dot
                                            >
                                                {client.status}
                                            </Badge>
                                        </div>
                                        <div className="mt-2 grid grid-cols-3 gap-2 text-center bg-slate-50 p-2 rounded-lg text-xs">
                                            <div>
                                                <span className="text-[10px] text-slate-400 block">Employees</span>
                                                <span className="font-bold text-slate-700">{client.employees}</span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-slate-400 block">Today's Meals</span>
                                                <span className="font-bold text-emerald-700">{client.today_meals}</span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-slate-400 block">Lunch Time</span>
                                                <span className="font-bold text-slate-700">{client.lunch_time}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Quick Info & Business Overview (1 Col) */}
                    <div className="space-y-6">
                        <Card
                            title="Vendor Business Profile"
                            subtitle="Current operational identity"
                            action={
                                isVendor ? (
                                    <Link
                                        href={route('vendor.profile')}
                                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
                                    >
                                        Edit <ArrowUpRight className="h-3.5 w-3.5" />
                                    </Link>
                                ) : null
                            }
                        >
                            <div className="space-y-3 text-xs">
                                <div className="flex justify-between py-1.5 border-b border-slate-100">
                                    <span className="text-slate-500">Business Name</span>
                                    <span className="font-bold text-slate-900 text-right">
                                        {vendor?.business_name || 'ABC Catering'}
                                    </span>
                                </div>
                                <div className="flex justify-between py-1.5 border-b border-slate-100">
                                    <span className="text-slate-500">Owner</span>
                                    <span className="font-semibold text-slate-900">
                                        {vendor?.owner_name || 'Rafiqul Islam'}
                                    </span>
                                </div>
                                <div className="flex justify-between py-1.5 border-b border-slate-100">
                                    <span className="text-slate-500">Phone</span>
                                    <span className="font-semibold text-slate-900">
                                        {vendor?.phone || '+880 1712-345678'}
                                    </span>
                                </div>
                                <div className="flex justify-between py-1.5 border-b border-slate-100">
                                    <span className="text-slate-500">City / Zone</span>
                                    <span className="font-semibold text-slate-900">
                                        {vendor?.city || 'Dhaka'}
                                    </span>
                                </div>
                                <div className="flex justify-between py-1.5 border-b border-slate-100">
                                    <span className="text-slate-500">VAT / TIN (BIN)</span>
                                    <span className="font-mono text-slate-700">
                                        {vendor?.vat_tin || 'BIN-9876543210'}
                                    </span>
                                </div>
                                <div className="flex justify-between py-1.5">
                                    <span className="text-slate-500">Status</span>
                                    <Badge variant="success" size="sm" dot>
                                        Active & Licensed
                                    </Badge>
                                </div>
                            </div>
                        </Card>

                        {/* Testing Role Switcher Aid */}
                        <div className="rounded-2xl border border-slate-200/90 bg-slate-100/70 p-4">
                            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                <Users className="h-4 w-4 text-emerald-600" />
                                <span>Multi-Role Test Accounts</span>
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-1">
                                Password for all test seeders is <code className="bg-white px-1 py-0.5 rounded font-mono font-bold text-slate-800">password123</code>
                            </p>
                            <div className="mt-3 space-y-1.5 text-xs">
                                <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
                                    <span className="font-semibold text-slate-700">Vendor Admin</span>
                                    <span className="font-mono text-[11px] text-slate-500">admin@catering.com</span>
                                </div>
                                <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
                                    <span className="font-semibold text-slate-700">Vendor Staff</span>
                                    <span className="font-mono text-[11px] text-slate-500">staff@catering.com</span>
                                </div>
                                <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
                                    <span className="font-semibold text-slate-700">Client Admin</span>
                                    <span className="font-mono text-[11px] text-slate-500">client@office.com</span>
                                </div>
                                <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
                                    <span className="font-semibold text-slate-700">Delivery Rider</span>
                                    <span className="font-mono text-[11px] text-slate-500">rider@catering.com</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
