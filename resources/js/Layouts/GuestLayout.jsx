import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ChefHat, UtensilsCrossed } from 'lucide-react';

export default function GuestLayout({ children }) {
    const { vendor } = usePage().props;
    const businessName = vendor?.business_name || 'ABC Catering & Food Services';

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 px-4 py-8 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-xl shadow-emerald-500/20 mb-3">
                    <ChefHat className="h-9 w-9" />
                </div>
                <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                    {businessName}
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-emerald-400 font-medium">
                    Office Meal & Corporate Catering Management
                </p>
            </div>

            <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-white/20">
                {children}
            </div>

            <div className="mt-6 text-center text-xs text-slate-400">
                &copy; {new Date().getFullYear()} {businessName}. All rights reserved.
            </div>
        </div>
    );
}
