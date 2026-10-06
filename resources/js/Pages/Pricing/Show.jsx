import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/Card';
import { DollarSign, ArrowLeft, Building2, Sun, Moon, Sliders, CheckCircle2 } from 'lucide-react';

export default function Show({ client, menuItems = [], customPrices = {}, canEdit = false }) {
    return (
        <AuthenticatedLayout>
            <Head title={`Contract Rates: ${client.name} - Office Meal & Catering`} />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('client-pricing.index')}
                            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 transition shadow-xs"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                                <Building2 className="h-3.5 w-3.5" />
                                <span>{client.name}</span>
                            </div>
                            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                                Agreed Contract Pricing
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-500">
                                Current billing rates applied to daily meal rosters and statements
                            </p>
                        </div>
                    </div>

                    {canEdit && (
                        <Link
                            href={route('client-pricing.edit', client.id)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/20 hover:bg-emerald-700 active:scale-98 transition self-start sm:self-auto"
                        >
                            <Sliders className="h-4 w-4" />
                            <span>Edit Rates</span>
                        </Link>
                    )}
                </div>

                {/* Package Rate Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card className="p-5 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white border-amber-200/60">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Regular Executive Lunch</span>
                            <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
                                <Sun className="h-5 w-5" />
                            </span>
                        </div>
                        <div className="mt-4 flex items-baseline gap-1">
                            <span className="text-3xl sm:text-4xl font-black text-amber-950">৳{Number(client.lunch_rate || 120).toFixed(2)}</span>
                            <span className="text-xs text-amber-800 font-semibold">/ meal</span>
                        </div>
                        <p className="text-xs text-amber-900/70 mt-2">
                            Applied to daily lunch count for all enrolled employees
                        </p>
                    </Card>

                    <Card className="p-5 bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-white border-indigo-200/60">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-indigo-800">Overtime / Dinner Meal</span>
                            <span className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                                <Moon className="h-5 w-5" />
                            </span>
                        </div>
                        <div className="mt-4 flex items-baseline gap-1">
                            <span className="text-3xl sm:text-4xl font-black text-indigo-950">৳{Number(client.dinner_rate || 140).toFixed(2)}</span>
                            <span className="text-xs text-indigo-800 font-semibold">/ meal</span>
                        </div>
                        <p className="text-xs text-indigo-900/70 mt-2">
                            Applied to evening meal rosters and night duty catering
                        </p>
                    </Card>
                </div>

                {/* Custom Item Overrides Table */}
                <Card className="overflow-hidden border-slate-200">
                    <div className="p-5 border-b border-slate-100">
                        <h3 className="text-base font-bold text-slate-900">Custom Dish Overrides</h3>
                        <p className="text-xs text-slate-500">
                            Dishes with customized pricing agreed specifically for {client.name}
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <tr>
                                    <th className="py-3 px-4">Dish</th>
                                    <th className="py-3 px-4">Category</th>
                                    <th className="py-3 px-4 text-right">Standard Rate</th>
                                    <th className="py-3 px-4 text-right">Agreed Rate</th>
                                    <th className="py-3 px-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {menuItems.filter((i) => customPrices[i.id]).length > 0 ? (
                                    menuItems.filter((i) => customPrices[i.id]).map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="py-3.5 px-4 font-bold text-slate-900">{item.name}</td>
                                            <td className="py-3.5 px-4 text-slate-600">{item.category}</td>
                                            <td className="py-3.5 px-4 text-right text-slate-400 line-through">
                                                ৳{Number(item.default_price).toFixed(2)}
                                            </td>
                                            <td className="py-3.5 px-4 text-right font-black text-emerald-600">
                                                ৳{Number(customPrices[item.id]).toFixed(2)}
                                            </td>
                                            <td className="py-3.5 px-4 text-center">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    Custom Rate
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-8 text-center text-slate-400 text-xs">
                                            No special dish overrides configured. Standard catalogue prices apply.
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
