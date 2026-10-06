import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    Building2,
    ArrowLeft,
    Save,
    Phone,
    Mail,
    MapPin,
    Users,
    Clock,
    Trash2,
    Check,
} from 'lucide-react';
import Card from '@/Components/Card';

export default function Edit({ client }) {
    const { data, setData, put, processing, errors } = useForm({
        name: client.name || '',
        contact_person: client.contact_person || '',
        phone: client.phone || '',
        email: client.email || '',
        address: client.address || '',
        city: client.city || 'Dhaka',
        delivery_address: client.delivery_address || '',
        number_of_employees: client.number_of_employees || 0,
        meal_types: client.meal_types || ['lunch'],
        office_start_time: client.office_start_time || '09:00',
        lunch_cutoff_time: client.lunch_cutoff_time || '10:00',
        dinner_cutoff_time: client.dinner_cutoff_time || '16:00',
        special_instructions: client.special_instructions || '',
        status: client.status || 'active',
        notes: client.notes || '',
    });

    const handleMealTypeToggle = (type) => {
        if (data.meal_types.includes(type)) {
            setData(
                'meal_types',
                data.meal_types.filter((t) => t !== type)
            );
        } else {
            setData('meal_types', [...data.meal_types, type]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('clients.update', client.id));
    };

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete ${client.name}? This will move the organization to trash.`)) {
            router.delete(route('clients.destroy', client.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('clients.show', client.id)}
                            className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                                Edit {client.name}
                            </h1>
                            <p className="text-xs text-slate-500 sm:text-sm mt-0.5">
                                Modify corporate contract, meal schedules, and delivery parameters
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleDelete}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
                    >
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Delete Organization</span>
                    </button>
                </div>
            }
        >
            <Head title={`Edit ${client.name} - Office Meal & Catering`} />

            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
                {/* 1. Basic Information */}
                <Card
                    title="Organization & Contact Details"
                    subtitle="Primary commercial identity and communication contact"
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Organization Name <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-xl border-slate-200 pl-10 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    required
                                />
                            </div>
                            {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Contact Person <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.contact_person}
                                    onChange={(e) => setData('contact_person', e.target.value)}
                                    className="w-full rounded-xl border-slate-200 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    required
                                />
                                {errors.contact_person && (
                                    <p className="text-xs text-rose-600 mt-1">{errors.contact_person}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Official Phone <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full rounded-xl border-slate-200 pl-10 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                        required
                                    />
                                </div>
                                {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Official Email <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full rounded-xl border-slate-200 pl-10 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                        required
                                    />
                                </div>
                                {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    City / Area <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                    className="w-full rounded-xl border-slate-200 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    required
                                />
                                {errors.city && <p className="text-xs text-rose-600 mt-1">{errors.city}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Number of Employees <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <Users className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                                    <input
                                        type="number"
                                        min="1"
                                        value={data.number_of_employees}
                                        onChange={(e) => setData('number_of_employees', e.target.value)}
                                        className="w-full rounded-xl border-slate-200 pl-10 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                        required
                                    />
                                </div>
                                {errors.number_of_employees && (
                                    <p className="text-xs text-rose-600 mt-1">{errors.number_of_employees}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Account Status <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full rounded-xl border-slate-200 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                >
                                    <option value="active">Active Client</option>
                                    <option value="inactive">Inactive Client</option>
                                </select>
                                {errors.status && <p className="text-xs text-rose-600 mt-1">{errors.status}</p>}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* 2. Meal Service & Cutoff Timings */}
                <Card
                    title="Meal Schedule & Cutoff Windows"
                    subtitle="Cutoff times strictly enforce when clients may finalize daily meal headcounts"
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                Supported Meal Types
                            </label>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl">
                                    <input
                                        type="checkbox"
                                        checked={data.meal_types.includes('lunch')}
                                        onChange={() => handleMealTypeToggle('lunch')}
                                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <span className="text-xs sm:text-sm font-semibold text-slate-800">
                                        Lunch Service
                                    </span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl">
                                    <input
                                        type="checkbox"
                                        checked={data.meal_types.includes('dinner')}
                                        onChange={() => handleMealTypeToggle('dinner')}
                                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <span className="text-xs sm:text-sm font-semibold text-slate-800">
                                        Dinner Service
                                    </span>
                                </label>
                            </div>
                            {errors.meal_types && (
                                <p className="text-xs text-rose-600 mt-1">{errors.meal_types}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Office Start Time
                                </label>
                                <div className="relative">
                                    <Clock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                                    <input
                                        type="time"
                                        value={data.office_start_time || ''}
                                        onChange={(e) => setData('office_start_time', e.target.value)}
                                        className="w-full rounded-xl border-slate-200 pl-10 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Lunch Cutoff Time
                                </label>
                                <div className="relative">
                                    <Clock className="absolute left-3.5 top-3 h-4 w-4 text-emerald-600" />
                                    <input
                                        type="time"
                                        value={data.lunch_cutoff_time || ''}
                                        onChange={(e) => setData('lunch_cutoff_time', e.target.value)}
                                        className="w-full rounded-xl border-slate-200 pl-10 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500 font-semibold"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Dinner Cutoff Time
                                </label>
                                <div className="relative">
                                    <Clock className="absolute left-3.5 top-3 h-4 w-4 text-emerald-600" />
                                    <input
                                        type="time"
                                        value={data.dinner_cutoff_time || ''}
                                        onChange={(e) => setData('dinner_cutoff_time', e.target.value)}
                                        className="w-full rounded-xl border-slate-200 pl-10 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500 font-semibold"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* 3. Address & Delivery Location */}
                <Card
                    title="Locations & Delivery Instructions"
                    subtitle="Specify kitchen drop-off floor, cafeteria location, or security entry instructions"
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Registered Office Address <span className="text-rose-500">*</span>
                            </label>
                            <textarea
                                rows={2}
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                className="w-full rounded-xl border-slate-200 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                required
                            />
                            {errors.address && <p className="text-xs text-rose-600 mt-1">{errors.address}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Delivery Address / Specific Drop-off Point
                            </label>
                            <textarea
                                rows={2}
                                value={data.delivery_address || ''}
                                onChange={(e) => setData('delivery_address', e.target.value)}
                                className="w-full rounded-xl border-slate-200 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Special Delivery Instructions
                            </label>
                            <input
                                type="text"
                                value={data.special_instructions || ''}
                                onChange={(e) => setData('special_instructions', e.target.value)}
                                className="w-full rounded-xl border-slate-200 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Internal Notes <span className="text-slate-400 font-normal">(Vendor visible only)</span>
                            </label>
                            <input
                                type="text"
                                value={data.notes || ''}
                                onChange={(e) => setData('notes', e.target.value)}
                                className="w-full rounded-xl border-slate-200 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500"
                            />
                        </div>
                    </div>
                </Card>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                    <Link
                        href={route('clients.show', client.id)}
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
                        <span>{processing ? 'Saving...' : 'Update Client Organization'}</span>
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
