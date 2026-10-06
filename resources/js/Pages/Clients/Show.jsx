import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    Building2,
    ArrowLeft,
    Edit3,
    Phone,
    Mail,
    MapPin,
    Users,
    Clock,
    DollarSign,
    Utensils,
    Calendar,
    UserPlus,
    Lock,
    Shield,
    CheckCircle2,
    XCircle,
    X,
    FileText,
    Power,
    Sparkles,
    TrendingUp,
} from 'lucide-react';
import Card from '@/Components/Card';
import Badge from '@/Components/Badge';
import Modal from '@/Components/Modal';

export default function Show({
    client,
    clientUsers,
    stats,
    recentActivity,
    canEdit,
    canDelete,
    canManageUsers,
}) {
    const [userModalOpen, setUserModalOpen] = useState(false);

    // Form for creating a client user
    const {
        data: userData,
        setData: setUserData,
        post: postUser,
        processing: userProcessing,
        errors: userErrors,
        reset: resetUser,
    } = useForm({
        name: '',
        email: '',
        phone: '',
        password: 'password123',
        status: 'active',
    });

    const handleCreateUser = (e) => {
        e.preventDefault();
        postUser(route('clients.users.store', client.id), {
            preserveScroll: true,
            onSuccess: () => {
                setUserModalOpen(false);
                resetUser();
            },
        });
    };

    const handleToggleUserStatus = (u) => {
        if (confirm(`Change status of user ${u.name} to ${u.status === 'active' ? 'Inactive' : 'Active'}?`)) {
            router.post(
                route('clients.users.toggle-status', [client.id, u.id]),
                {},
                { preserveScroll: true }
            );
        }
    };

    const handleToggleClientStatus = () => {
        if (confirm(`Change status of ${client.name} to ${client.status === 'active' ? 'Inactive' : 'Active'}?`)) {
            router.post(route('clients.toggle-status', client.id), {}, { preserveScroll: true });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('clients.index')}
                            className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                                    {client.name}
                                </h1>
                                <Badge
                                    variant={client.status === 'active' ? 'success' : 'danger'}
                                    size="sm"
                                    dot
                                >
                                    {client.status === 'active' ? 'Active' : 'Inactive'}
                                </Badge>
                            </div>
                            <p className="text-xs text-slate-500 sm:text-sm mt-0.5">
                                {client.city} · Contracted Office
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {canEdit && (
                            <>
                                <button
                                    type="button"
                                    onClick={handleToggleClientStatus}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
                                >
                                    <Power className="h-3.5 w-3.5 text-slate-500" />
                                    <span>{client.status === 'active' ? 'Deactivate' : 'Activate'}</span>
                                </button>
                                <Link
                                    href={route('clients.edit', client.id)}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
                                >
                                    <Edit3 className="h-3.5 w-3.5" />
                                    <span>Edit Organization</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            }
        >
            <Head title={`${client.name} - Client Details`} />

            <div className="space-y-6">
                {/* 4 Summary Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Enrolled Staff
                            </span>
                            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                                <Users className="h-5 w-5" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mt-2">
                            {stats.enrolled_employees}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">Contracted headcount</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Today's Meals
                            </span>
                            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                                <Utensils className="h-5 w-5" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-black text-emerald-700 mt-2">
                            {stats.today_meals}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">Confirmed lunch count</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Monthly Meals
                            </span>
                            <div className="p-2 rounded-xl bg-violet-50 text-violet-600">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mt-2">
                            {stats.monthly_meals}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">Current monthly consumption</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Outstanding Balance
                            </span>
                            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                                <DollarSign className="h-5 w-5" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-black text-amber-700 mt-2">
                            ৳ {Number(stats.outstanding_balance).toLocaleString()}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">Unbilled / due balance</p>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Column 1 & 2: Detailed specs & Meal Activity */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Contract & Delivery Specifications */}
                        <Card
                            title="Organization & Delivery Specifications"
                            subtitle="Registered office and kitchen logistics parameters"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                <div className="space-y-3">
                                    <div className="p-3 bg-slate-50 rounded-xl">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                                            Registered Office Address
                                        </span>
                                        <p className="font-semibold text-slate-800 flex items-start gap-1.5">
                                            <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
                                            <span>{client.address}</span>
                                        </p>
                                    </div>

                                    <div className="p-3 bg-slate-50 rounded-xl">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                                            Drop-off Delivery Point
                                        </span>
                                        <p className="font-semibold text-slate-800">
                                            {client.delivery_address || client.address}
                                        </p>
                                    </div>

                                    <div className="p-3 bg-slate-50 rounded-xl">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                                            Special Delivery Instructions
                                        </span>
                                        <p className="text-slate-700 italic">
                                            {client.special_instructions || 'None specified.'}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="p-3 bg-slate-50 rounded-xl space-y-2">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase block">
                                            Daily Cutoff Windows
                                        </span>
                                        <div className="flex justify-between py-1 border-b border-slate-200/60">
                                            <span className="text-slate-500">Office Start Time</span>
                                            <strong className="text-slate-800">
                                                {client.office_start_time || '09:00 AM'}
                                            </strong>
                                        </div>
                                        <div className="flex justify-between py-1 border-b border-slate-200/60">
                                            <span className="text-slate-500">Lunch Cutoff Window</span>
                                            <strong className="text-emerald-700">
                                                {client.lunch_cutoff_time || '10:00 AM'}
                                            </strong>
                                        </div>
                                        <div className="flex justify-between py-1">
                                            <span className="text-slate-500">Dinner Cutoff Window</span>
                                            <strong className="text-emerald-700">
                                                {client.dinner_cutoff_time || '04:00 PM'}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-slate-50 rounded-xl space-y-2">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase block">
                                            Supported Meal Types
                                        </span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {client.meal_types?.map((type, tIdx) => (
                                                <Badge key={tIdx} variant="primary" size="md">
                                                    {type.toUpperCase()}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {client.notes && (
                                        <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl">
                                            <span className="text-[10px] text-amber-700 font-bold uppercase block mb-0.5">
                                                Internal Vendor Notes
                                            </span>
                                            <p className="text-amber-900">{client.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* Recent Meal Activity Table */}
                        <Card
                            title="Recent Meal Activity"
                            subtitle="Historical daily counts and billed totals"
                            noPadding
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs text-slate-600">
                                    <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-3">Date</th>
                                            <th className="px-6 py-3">Meal Slot</th>
                                            <th className="px-6 py-3">Quantity</th>
                                            <th className="px-6 py-3">Estimated Amount</th>
                                            <th className="px-6 py-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 font-medium">
                                        {recentActivity?.map((row, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/70">
                                                <td className="px-6 py-3.5 font-bold text-slate-800">
                                                    {row.date}
                                                </td>
                                                <td className="px-6 py-3.5">{row.meal_type}</td>
                                                <td className="px-6 py-3.5 font-bold text-emerald-700">
                                                    {row.count} Meals
                                                </td>
                                                <td className="px-6 py-3.5 font-semibold text-slate-900">
                                                    ৳ {Number(row.amount).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-3.5">
                                                    <Badge variant="success" size="sm" dot>
                                                        {row.status}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>

                    {/* Column 3: Contact Person & Client Users */}
                    <div className="space-y-6">
                        {/* Primary Contact Person Card */}
                        <Card title="Primary Contact" subtitle="Designated office coordinator">
                            <div className="space-y-3 text-xs">
                                <div>
                                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                                        Contact Person
                                    </span>
                                    <p className="font-bold text-slate-900 text-sm mt-0.5">
                                        {client.contact_person}
                                    </p>
                                </div>
                                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-slate-500 flex items-center gap-1.5">
                                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                                        Phone
                                    </span>
                                    <a
                                        href={`tel:${client.phone}`}
                                        className="font-bold text-emerald-600 hover:text-emerald-700"
                                    >
                                        {client.phone}
                                    </a>
                                </div>
                                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-slate-500 flex items-center gap-1.5">
                                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                                        Email
                                    </span>
                                    <a
                                        href={`mailto:${client.email}`}
                                        className="font-semibold text-slate-800 truncate max-w-[180px]"
                                    >
                                        {client.email}
                                    </a>
                                </div>
                            </div>
                        </Card>

                        {/* Client Login Users Card */}
                        <Card
                            title="Client Login Accounts"
                            subtitle="Authorized logins for this client only"
                            action={
                                canManageUsers && (
                                    <button
                                        type="button"
                                        onClick={() => setUserModalOpen(true)}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                                    >
                                        <UserPlus className="h-3.5 w-3.5" />
                                        <span>Add User</span>
                                    </button>
                                )
                            }
                        >
                            <div className="space-y-2.5 text-xs">
                                {clientUsers?.length > 0 ? (
                                    clientUsers.map((u) => (
                                        <div
                                            key={u.id}
                                            className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-7 w-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                                                        {u.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 leading-none">
                                                            {u.name}
                                                        </p>
                                                        <span className="text-[11px] text-slate-500">
                                                            {u.email}
                                                        </span>
                                                    </div>
                                                </div>
                                                <Badge
                                                    variant={u.status === 'active' ? 'success' : 'danger'}
                                                    size="sm"
                                                    dot
                                                >
                                                    {u.status === 'active' ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </div>

                                            {canManageUsers && (
                                                <div className="flex justify-end pt-1 border-t border-slate-200/60">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleUserStatus(u)}
                                                        className="text-[11px] font-semibold text-slate-500 hover:text-slate-800"
                                                    >
                                                        {u.status === 'active'
                                                            ? 'Deactivate Login'
                                                            : 'Activate Login'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-slate-400">
                                        <Lock className="h-6 w-6 mx-auto text-slate-300 mb-1" />
                                        <p className="font-semibold text-slate-600">No client users yet</p>
                                        <p className="text-[11px] mt-0.5">
                                            Create a login so this client can manage their daily headcount.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Modal: Add Client User */}
            <Modal show={userModalOpen} onClose={() => setUserModalOpen(false)} maxWidth="md">
                <form onSubmit={handleCreateUser} className="p-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">
                                Create Client User Login
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Provide login credentials for {client.name}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setUserModalOpen(false)}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="mt-4 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Full Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={userData.name}
                                onChange={(e) => setUserData('name', e.target.value)}
                                placeholder="e.g. Tanvir Ahmed"
                                className="w-full rounded-xl border-slate-200 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                required
                            />
                            {userErrors.name && (
                                <p className="text-xs text-rose-600 mt-1">{userErrors.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Login Email <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="email"
                                value={userData.email}
                                onChange={(e) => setUserData('email', e.target.value)}
                                placeholder="clientadmin@office.com"
                                className="w-full rounded-xl border-slate-200 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                required
                            />
                            {userErrors.email && (
                                <p className="text-xs text-rose-600 mt-1">{userErrors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                value={userData.phone}
                                onChange={(e) => setUserData('phone', e.target.value)}
                                placeholder="+880 1912-345680"
                                className="w-full rounded-xl border-slate-200 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Initial Password <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="password"
                                value={userData.password}
                                onChange={(e) => setUserData('password', e.target.value)}
                                placeholder="Minimum 8 characters"
                                className="w-full rounded-xl border-slate-200 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                required
                            />
                            {userErrors.password && (
                                <p className="text-xs text-rose-600 mt-1">{userErrors.password}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                User Account Status <span className="text-rose-500">*</span>
                            </label>
                            <select
                                value={userData.status}
                                onChange={(e) => setUserData('status', e.target.value)}
                                className="w-full rounded-xl border-slate-200 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setUserModalOpen(false)}
                            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={userProcessing}
                            className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs disabled:opacity-50"
                        >
                            {userProcessing ? 'Creating...' : 'Create Client Login'}
                        </button>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
