import React from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Shield,
    UserCheck,
    Building2,
    Truck,
    LogIn,
    Lock,
    Mail,
    ArrowRight,
} from 'lucide-react';
import Badge from '@/Components/Badge';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: 'admin@catering.com',
        password: 'password123',
        remember: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const demoRoles = [
        {
            role: 'Vendor Admin',
            email: 'admin@catering.com',
            icon: Shield,
            variant: 'primary',
            desc: 'Full vendor system access',
        },
        {
            role: 'Vendor Staff',
            email: 'staff@catering.com',
            icon: UserCheck,
            variant: 'purple',
            desc: 'Operational vendor access',
        },
        {
            role: 'Client Admin',
            email: 'client@office.com',
            icon: Building2,
            variant: 'info',
            desc: 'Client office isolation',
        },
        {
            role: 'Rider',
            email: 'rider@catering.com',
            icon: Truck,
            variant: 'warning',
            desc: 'Assigned deliveries',
        },
    ];

    const selectRole = (email) => {
        setData((prev) => ({
            ...prev,
            email: email,
            password: 'password123',
        }));
    };

    return (
        <GuestLayout>
            <Head title="Sign In - Office Meal & Catering" />

            <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                    Sign in to your account
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                    Enter your authorized credentials to access your meal portal
                </p>
            </div>

            {status && (
                <div className="mb-4 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 border border-emerald-200">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Email Address
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="w-full rounded-xl border-slate-200 pl-10 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500"
                            autoComplete="username"
                            required
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.email} className="mt-1" />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Password
                        </label>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                            >
                                Forgot password?
                            </Link>
                        )}
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="w-full rounded-xl border-slate-200 pl-10 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500"
                            autoComplete="current-password"
                            required
                            onChange={(e) => setData('password', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.password} className="mt-1" />
                </div>

                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-xs text-slate-600 font-medium">Remember me</span>
                    </label>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 px-4 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 transition-all"
                    >
                        <LogIn className="h-4 w-4" />
                        <span>{processing ? 'Signing In...' : 'Sign In'}</span>
                    </button>
                </div>
            </form>

            {/* Quick Demo Switcher */}
            <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Quick Demo Test Roles
                    </span>
                    <span className="text-[10px] text-slate-400">Click to fill</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {demoRoles.map((item, idx) => {
                        const Icon = item.icon;
                        const isSelected = data.email === item.email;
                        return (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => selectRole(item.email)}
                                className={`text-left p-2.5 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                                    isSelected
                                        ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500/20'
                                        : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100/80 hover:border-slate-300'
                                }`}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span className="font-bold text-slate-800 text-[11px] truncate">
                                        {item.role}
                                    </span>
                                    <Icon className={`h-3.5 w-3.5 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                                </div>
                                <span className="text-[10px] text-slate-500 truncate mt-1">
                                    {item.email}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </GuestLayout>
    );
}
