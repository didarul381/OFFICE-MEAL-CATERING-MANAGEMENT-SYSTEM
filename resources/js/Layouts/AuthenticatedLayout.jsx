import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Building2,
    Users,
    UtensilsCrossed,
    CalendarCheck,
    Truck,
    Receipt,
    BarChart3,
    Store,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight,
    UserCheck,
    Shield,
    Bell,
    ChefHat,
    Calendar,
    CalendarDays,
    DollarSign,
} from 'lucide-react';
import Badge from '@/Components/Badge';
import FlashMessage from '@/Components/FlashMessage';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, vendor } = usePage().props;
    const user = auth?.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    const businessName = vendor?.business_name || 'ABC Catering & Food';
    const isVendorAdmin = user?.role === 'vendor_admin';
    const isVendorStaff = user?.role === 'vendor_staff';
    const isClientAdmin = user?.role === 'client_admin';
    const isRider = user?.role === 'rider';

    const getRoleBadgeVariant = (role) => {
        switch (role) {
            case 'vendor_admin':
                return { label: 'Vendor Admin', variant: 'primary', icon: Shield };
            case 'vendor_staff':
                return { label: 'Vendor Staff', variant: 'purple', icon: UserCheck };
            case 'client_admin':
                return { label: 'Client Admin', variant: 'info', icon: Building2 };
            case 'rider':
                return { label: 'Delivery Rider', variant: 'warning', icon: Truck };
            default:
                return { label: 'User', variant: 'neutral', icon: UserCheck };
        }
    };

    const roleInfo = getRoleBadgeVariant(user?.role);
    const RoleIcon = roleInfo.icon;

    const navItems = [
        {
            group: 'Core Operations',
            items: [
                {
                    name: 'Dashboard',
                    href: route('dashboard'),
                    active: route().current('dashboard'),
                    icon: LayoutDashboard,
                    available: true,
                },
                {
                    name: isClientAdmin ? 'My Office' : 'Clients',
                    href: isClientAdmin && user?.client_id ? route('clients.show', user.client_id) : route('clients.index'),
                    active: route().current('clients.*'),
                    icon: Building2,
                    available: isVendorAdmin || isVendorStaff || (isClientAdmin && !!user?.client_id),
                },
                {
                    name: 'Employees',
                    href: route('employees.index'),
                    active: route().current('employees.*'),
                    icon: Users,
                    available: isVendorAdmin || isVendorStaff || (isClientAdmin && !!user?.client_id),
                },
                {
                    name: 'Food Menu Items',
                    href: route('menu-items.index'),
                    active: route().current('menu-items.*'),
                    icon: UtensilsCrossed,
                    available: isVendorAdmin || isVendorStaff || isClientAdmin,
                },
                {
                    name: 'Daily Menus',
                    href: route('daily-menus.index'),
                    active: route().current('daily-menus.*'),
                    icon: CalendarDays,
                    available: isVendorAdmin || isVendorStaff || isClientAdmin,
                },
                {
                    name: 'Contract Pricing',
                    href: isClientAdmin && user?.client_id ? route('client-pricing.show', user.client_id) : route('client-pricing.index'),
                    active: route().current('client-pricing.*'),
                    icon: DollarSign,
                    available: isVendorAdmin || isVendorStaff || (isClientAdmin && !!user?.client_id),
                },
                {
                    name: 'Daily Meals',
                    href: isClientAdmin && user?.client_id ? route('daily-meals.roster') : route('daily-meals.index'),
                    active: route().current('daily-meals.*'),
                    icon: CalendarCheck,
                    available: isVendorAdmin || isVendorStaff || (isClientAdmin && !!user?.client_id),
                },
                {
                    name: 'Orders & Riders',
                    href: '#',
                    active: false,
                    icon: Truck,
                    badge: 'M6',
                    available: false,
                },
                {
                    name: 'Billing & Invoices',
                    href: '#',
                    active: false,
                    icon: Receipt,
                    badge: 'M7',
                    available: false,
                },
                {
                    name: 'Reports & Analytics',
                    href: '#',
                    active: false,
                    icon: BarChart3,
                    badge: 'M8',
                    available: false,
                },
            ],
        },
        {
            group: 'Administration',
            items: [
                {
                    name: 'Vendor Profile',
                    href: route('vendor.profile'),
                    active: route().current('vendor.profile'),
                    icon: Store,
                    available: isVendorAdmin || isVendorStaff,
                },
                {
                    name: 'System Settings',
                    href: '#',
                    active: false,
                    icon: Settings,
                    badge: 'M9',
                    available: false,
                },
            ],
        },
    ];

    const todayDate = new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    }).format(new Date());

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased pb-20 md:pb-0">
            <FlashMessage />

            {/* Desktop Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200/80 bg-white md:flex">
                {/* Brand Header */}
                <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20">
                        <ChefHat className="h-6 w-6" />
                    </div>
                    <div className="overflow-hidden">
                        <h1 className="truncate text-sm font-bold text-slate-900 tracking-tight">
                            {businessName}
                        </h1>
                        <p className="truncate text-xs font-medium text-emerald-600">
                            Office Meal System
                        </p>
                    </div>
                </div>

                {/* User Role Card in Sidebar */}
                <div className="mx-3 mt-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white font-bold text-slate-700 shadow-xs ring-1 ring-slate-200">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-slate-900">
                                {user?.name}
                            </p>
                            <Badge variant={roleInfo.variant} size="sm" className="mt-0.5">
                                <RoleIcon className="h-3 w-3" />
                                {roleInfo.label}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
                    {navItems.map((group, gIdx) => (
                        <div key={gIdx} className="space-y-1">
                            <h2 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                {group.group}
                            </h2>
                            <div className="mt-1 space-y-0.5">
                                {group.items.map((item, iIdx) => {
                                    const Icon = item.icon;
                                    const isDisabled = !item.available;

                                    if (isDisabled) {
                                        return (
                                            <div
                                                key={iIdx}
                                                className="group flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-slate-400 opacity-60 cursor-not-allowed"
                                                title={`Scheduled for Milestone ${item.badge}`}
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <Icon className="h-4 w-4" />
                                                    <span>{item.name}</span>
                                                </div>
                                                {item.badge && (
                                                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={iIdx}
                                            href={item.href}
                                            className={`group flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                                                item.active
                                                    ? 'bg-emerald-50 text-emerald-700 shadow-xs font-bold'
                                                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <Icon
                                                    className={`h-4 w-4 transition-colors ${
                                                        item.active
                                                            ? 'text-emerald-600'
                                                            : 'text-slate-400 group-hover:text-slate-600'
                                                    }`}
                                                />
                                                <span>{item.name}</span>
                                            </div>
                                            {item.active && (
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sidebar Footer Logout */}
                <div className="border-t border-slate-100 p-3">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex min-h-screen flex-col md:pl-64">
                {/* Top Header */}
                <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur sm:px-6">
                    {/* Left: Mobile hamburger & Page Title */}
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(true)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 md:hidden"
                            aria-label="Open navigation menu"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <div className="hidden sm:block">
                            {header || (
                                <h1 className="text-base font-bold text-slate-900">
                                    Dashboard
                                </h1>
                            )}
                        </div>
                    </div>

                    {/* Right: Date, Role Pill & User Dropdown */}
                    <div className="flex items-center gap-3">
                        <div className="hidden items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 lg:flex ring-1 ring-slate-200/70">
                            <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                            <span>{todayDate}</span>
                        </div>

                        <div className="hidden sm:block">
                            <Badge variant={roleInfo.variant} size="md">
                                <RoleIcon className="h-3.5 w-3.5" />
                                {roleInfo.label}
                            </Badge>
                        </div>

                        {/* User Menu Dropdown */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                className="flex items-center gap-2 rounded-full p-1 text-slate-700 hover:bg-slate-100 transition-colors focus:outline-hidden"
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 font-bold text-white shadow-xs">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                                <span className="hidden text-xs font-semibold sm:inline-block max-w-[120px] truncate">
                                    {user?.name}
                                </span>
                            </button>

                            {userDropdownOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setUserDropdownOpen(false)}
                                    />
                                    <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-150">
                                        <div className="px-3 py-2 border-b border-slate-100">
                                            <p className="text-xs font-bold text-slate-900 truncate">
                                                {user?.name}
                                            </p>
                                            <p className="text-[11px] text-slate-500 truncate">
                                                {user?.email}
                                            </p>
                                            <div className="mt-1">
                                                <Badge variant={roleInfo.variant} size="sm">
                                                    {roleInfo.label}
                                                </Badge>
                                            </div>
                                        </div>

                                        {(isVendorAdmin || isVendorStaff) && (
                                            <Link
                                                href={route('vendor.profile')}
                                                onClick={() => setUserDropdownOpen(false)}
                                                className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-700"
                                            >
                                                <Store className="h-4 w-4 text-slate-400" />
                                                <span>Vendor Profile</span>
                                            </Link>
                                        )}

                                        <Link
                                            href={route('profile.edit')}
                                            onClick={() => setUserDropdownOpen(false)}
                                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-700"
                                        >
                                            <Settings className="h-4 w-4 text-slate-400" />
                                            <span>Account Settings</span>
                                        </Link>

                                        <div className="my-1 border-t border-slate-100" />

                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            <span>Sign Out</span>
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                    {children}
                </main>
            </div>

            {/* Mobile Slide-over Drawer Menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
                        onClick={() => setMobileMenuOpen(false)}
                    />

                    {/* Drawer Content */}
                    <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-white shadow-2xl animate-in slide-in-from-left duration-200">
                        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
                                    <ChefHat className="h-5 w-5" />
                                </div>
                                <span className="font-bold text-slate-900 text-sm">
                                    {businessName}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-lg p-2 text-slate-400 hover:text-slate-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-3 border-b border-slate-100 bg-slate-50">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-xs">
                                    {user?.name?.charAt(0)}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-bold text-slate-900 truncate">
                                        {user?.name}
                                    </p>
                                    <Badge variant={roleInfo.variant} size="sm">
                                        {roleInfo.label}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                            {navItems.map((group, gIdx) => (
                                <div key={gIdx} className="space-y-1">
                                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
                                        {group.group}
                                    </h3>
                                    <div className="space-y-1 mt-1">
                                        {group.items.map((item, iIdx) => {
                                            const Icon = item.icon;
                                            if (!item.available) {
                                                return (
                                                    <div
                                                        key={iIdx}
                                                        className="flex items-center justify-between px-3 py-2.5 text-xs text-slate-400 rounded-lg opacity-60"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <Icon className="h-4 w-4" />
                                                            <span>{item.name}</span>
                                                        </div>
                                                        <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-semibold">
                                                            {item.badge}
                                                        </span>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <Link
                                                    key={iIdx}
                                                    href={item.href}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className={`flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-lg transition-colors ${
                                                        item.active
                                                            ? 'bg-emerald-50 text-emerald-700'
                                                            : 'text-slate-700 hover:bg-slate-50'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Icon
                                                            className={`h-4 w-4 ${
                                                                item.active
                                                                    ? 'text-emerald-600'
                                                                    : 'text-slate-400'
                                                            }`}
                                                        />
                                                        <span>{item.name}</span>
                                                    </div>
                                                    {item.active && (
                                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                                                    )}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-slate-100 p-4">
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 py-3 text-xs font-bold text-rose-600"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Sign Out</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Bottom Navigation Bar (Thumb friendly) */}
            <div className="fixed bottom-0 inset-x-0 z-30 bg-white/95 border-t border-slate-200 backdrop-blur md:hidden">
                <nav className="grid grid-cols-4 h-16 items-center px-2">
                    <Link
                        href={route('dashboard')}
                        className={`flex flex-col items-center justify-center py-1 transition-colors ${
                            route().current('dashboard')
                                ? 'text-emerald-600 font-bold'
                                : 'text-slate-500 hover:text-slate-900'
                        }`}
                    >
                        <LayoutDashboard className="h-5 w-5" />
                        <span className="text-[10px] mt-1">Dashboard</span>
                    </Link>

                    <Link
                        href={isClientAdmin && user?.client_id ? route('clients.show', user.client_id) : route('clients.index')}
                        className={`flex flex-col items-center justify-center py-1 transition-colors ${
                            route().current('clients.*')
                                ? 'text-emerald-600 font-bold'
                                : 'text-slate-500 hover:text-slate-900'
                        }`}
                    >
                        <Building2 className="h-5 w-5" />
                        <span className="text-[10px] mt-1">{isClientAdmin ? 'Office' : 'Clients'}</span>
                    </Link>

                    <Link
                        href={route('profile.edit')}
                        className={`flex flex-col items-center justify-center py-1 transition-colors ${
                            route().current('profile.edit')
                                ? 'text-emerald-600 font-bold'
                                : 'text-slate-500 hover:text-slate-900'
                        }`}
                    >
                        <Settings className="h-5 w-5" />
                        <span className="text-[10px] mt-1">Account</span>
                    </Link>

                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="flex flex-col items-center justify-center py-1 text-slate-500 hover:text-slate-900"
                    >
                        <Menu className="h-5 w-5" />
                        <span className="text-[10px] mt-1">More</span>
                    </button>
                </nav>
            </div>
        </div>
    );
}
