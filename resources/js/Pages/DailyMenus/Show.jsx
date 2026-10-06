import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import {
    CalendarDays,
    ArrowLeft,
    Sun,
    Moon,
    Building2,
    Globe,
    Edit3,
    UtensilsCrossed,
    Sparkles,
    CheckCircle2,
} from 'lucide-react';

export default function Show({ dailyMenu, canManage = false }) {
    const isLunch = dailyMenu.meal_type === 'Lunch';

    return (
        <AuthenticatedLayout>
            <Head title={`Daily Menu - ${dailyMenu.date} (${dailyMenu.meal_type})`} />

            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('daily-menus.index')}
                            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 transition shadow-xs"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                                <CalendarDays className="h-3.5 w-3.5" />
                                <span>Meal Schedule Details</span>
                            </div>
                            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                                {dailyMenu.title || `${dailyMenu.meal_type} Menu`}
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-500">
                                {dailyMenu.date} • {dailyMenu.meal_type} Meal
                            </p>
                        </div>
                    </div>

                    {canManage && (
                        <Link
                            href={route('daily-menus.edit', dailyMenu.id)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/20 hover:bg-emerald-700 active:scale-98 transition self-start sm:self-auto"
                        >
                            <Edit3 className="h-4 w-4" />
                            <span>Edit Menu</span>
                        </Link>
                    )}
                </div>

                {/* Banner Card */}
                <Card className={`p-6 border ${
                    isLunch
                        ? 'bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white border-amber-200/60'
                        : 'bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-white border-indigo-200/60'
                }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className={`p-3 rounded-2xl ${
                                isLunch ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'
                            }`}>
                                {isLunch ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                            </span>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg font-black text-slate-900">{dailyMenu.meal_type} Service</h2>
                                    {dailyMenu.client ? (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                            <Building2 className="h-3 w-3" />
                                            <span>{dailyMenu.client.name}</span>
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            <Globe className="h-3 w-3" />
                                            <span>Global Standard Menu</span>
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    Scheduled for {dailyMenu.date}
                                </p>
                            </div>
                        </div>

                        {dailyMenu.base_price && (
                            <div className="text-right">
                                <span className="text-[10px] uppercase font-bold text-slate-400 block">Package Price</span>
                                <span className="text-2xl font-black text-emerald-600">৳{Number(dailyMenu.base_price).toFixed(2)}</span>
                            </div>
                        )}
                    </div>

                    {dailyMenu.notes && (
                        <div className="mt-4 pt-3 border-t border-slate-200/60 text-xs text-slate-600 bg-white/60 p-3 rounded-xl">
                            <span className="font-bold text-slate-800 block mb-0.5">Kitchen / Chef Notes:</span>
                            {dailyMenu.notes}
                        </div>
                    )}
                </Card>

                {/* Dishes Catalogue in Menu */}
                <Card className="overflow-hidden border-slate-200">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Featured Course Items</h3>
                            <p className="text-xs text-slate-500">
                                Food items served in this day's package
                            </p>
                        </div>
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                            {dailyMenu.items?.length || 0} item(s)
                        </span>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {dailyMenu.items && dailyMenu.items.length > 0 ? (
                            dailyMenu.items.map((item, idx) => (
                                <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
                                    <div className="flex items-center gap-3.5">
                                        <span className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center">
                                            {idx + 1}
                                        </span>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">
                                                {item.menu_item?.name || 'Dish Item'}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                                    {item.menu_item?.category || 'General'}
                                                </span>
                                                {item.menu_item?.description && (
                                                    <span className="text-xs text-slate-400 line-clamp-1 max-w-xs">
                                                        • {item.menu_item.description}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                                            {item.serving_portion || 'Standard portion'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-slate-400 text-xs">
                                No dishes listed for this menu.
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
