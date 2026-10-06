import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import {
    Store,
    Building2,
    User,
    Phone,
    Mail,
    MapPin,
    FileText,
    ShieldCheck,
    Upload,
    Check,
    AlertCircle,
    Calendar,
    Save,
} from 'lucide-react';
import Card from '@/Components/Card';
import Badge from '@/Components/Badge';

export default function VendorProfile({ vendorProfile, canEdit }) {
    const [logoPreview, setLogoPreview] = useState(
        vendorProfile?.logo ? `/storage/${vendorProfile.logo}` : null
    );

    const { data, setData, post, processing, errors } = useForm({
        business_name: vendorProfile?.business_name || '',
        organization_name: vendorProfile?.organization_name || '',
        owner_name: vendorProfile?.owner_name || '',
        phone: vendorProfile?.phone || '',
        email: vendorProfile?.email || '',
        address: vendorProfile?.address || '',
        city: vendorProfile?.city || '',
        business_type: vendorProfile?.business_type || 'Corporate Meal & Catering Services',
        vat_tin: vendorProfile?.vat_tin || '',
        status: vendorProfile?.status || 'active',
        logo: null,
    });

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('logo', file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('vendor.profile.update'), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    const formattedCreatedAt = vendorProfile?.created_at
        ? new Date(vendorProfile.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          })
        : 'Foundational Setup';

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                        Vendor Profile & Business Details
                    </h1>
                    <p className="text-xs text-slate-500 sm:text-sm mt-0.5">
                        Manage central catering business credentials, contact, and invoicing identity
                    </p>
                </div>
            }
        >
            <Head title="Vendor Profile - Office Meal & Catering" />

            <div className="space-y-6">
                {!canEdit && (
                    <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs sm:text-sm text-amber-800">
                        <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                        <span>
                            You are viewing in <strong>Staff Mode</strong>. Only a <strong>Vendor Admin</strong> has permission to alter business details and registration credentials.
                        </span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Top Hero Card: Identity & Logo */}
                    <Card noPadding>
                        <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 to-emerald-950 rounded-t-2xl text-white">
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <div className="relative group">
                                    <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl bg-white/10 border-2 border-white/20 backdrop-blur overflow-hidden flex items-center justify-center shadow-lg">
                                        {logoPreview ? (
                                            <img
                                                src={logoPreview}
                                                alt="Vendor Logo"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <Store className="h-12 w-12 text-emerald-300" />
                                        )}
                                    </div>
                                    {canEdit && (
                                        <label
                                            htmlFor="logo-upload"
                                            className="absolute bottom-0 right-0 p-2 bg-emerald-600 text-white rounded-xl shadow-md cursor-pointer hover:bg-emerald-500 transition-colors"
                                            title="Upload business logo"
                                        >
                                            <Upload className="h-4 w-4" />
                                            <input
                                                id="logo-upload"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleLogoChange}
                                            />
                                        </label>
                                    )}
                                </div>
                                <div className="text-center sm:text-left space-y-1">
                                    <div className="flex items-center justify-center sm:justify-start gap-2">
                                        <Badge variant="success" size="sm" dot>
                                            {data.status === 'active' ? 'Active Business' : 'Inactive'}
                                        </Badge>
                                        <span className="text-xs text-slate-400">
                                            Established: {formattedCreatedAt}
                                        </span>
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                                        {data.business_name || 'Business Name'}
                                    </h2>
                                    <p className="text-xs sm:text-sm text-slate-300">
                                        {data.organization_name || 'Organization Name'}
                                    </p>
                                    <p className="text-xs text-emerald-400 font-medium">
                                        {data.business_type}
                                    </p>
                                </div>
                            </div>
                        </div>
                        {errors.logo && (
                            <div className="px-6 py-2 bg-rose-50 border-t border-rose-100 text-xs text-rose-600">
                                {errors.logo}
                            </div>
                        )}
                    </Card>

                    {/* Form Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Section 1: Business Information */}
                        <Card
                            title="Business Information"
                            subtitle="Official naming and operational categorization"
                        >
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                        Business Name <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Store className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={data.business_name}
                                            onChange={(e) => setData('business_name', e.target.value)}
                                            disabled={!canEdit}
                                            className="w-full rounded-xl border-slate-200 pl-10 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-slate-500"
                                            placeholder="e.g. ABC Catering"
                                            required
                                        />
                                    </div>
                                    {errors.business_name && (
                                        <p className="text-xs text-rose-600 mt-1">{errors.business_name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                        Organization / Legal Name
                                    </label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={data.organization_name}
                                            onChange={(e) => setData('organization_name', e.target.value)}
                                            disabled={!canEdit}
                                            className="w-full rounded-xl border-slate-200 pl-10 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-slate-500"
                                            placeholder="e.g. ABC Hospitality & Logistics Ltd."
                                        />
                                    </div>
                                    {errors.organization_name && (
                                        <p className="text-xs text-rose-600 mt-1">{errors.organization_name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                        Owner / Managing Director Name <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={data.owner_name}
                                            onChange={(e) => setData('owner_name', e.target.value)}
                                            disabled={!canEdit}
                                            className="w-full rounded-xl border-slate-200 pl-10 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-slate-500"
                                            placeholder="e.g. Rafiqul Islam"
                                            required
                                        />
                                    </div>
                                    {errors.owner_name && (
                                        <p className="text-xs text-rose-600 mt-1">{errors.owner_name}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                            Business Type <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.business_type}
                                            onChange={(e) => setData('business_type', e.target.value)}
                                            disabled={!canEdit}
                                            className="w-full rounded-xl border-slate-200 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-slate-500"
                                            placeholder="e.g. Corporate Meal Catering"
                                            required
                                        />
                                        {errors.business_type && (
                                            <p className="text-xs text-rose-600 mt-1">{errors.business_type}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                            Status <span className="text-rose-500">*</span>
                                        </label>
                                        <select
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            disabled={!canEdit}
                                            className="w-full rounded-xl border-slate-200 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-slate-500"
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                        {errors.status && (
                                            <p className="text-xs text-rose-600 mt-1">{errors.status}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Section 2: Contact, Location & Regulatory */}
                        <Card
                            title="Contact, Address & Tax Details"
                            subtitle="Delivery base and billing invoice details"
                        >
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                                disabled={!canEdit}
                                                className="w-full rounded-xl border-slate-200 pl-10 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-slate-500"
                                                placeholder="+880 1712-345678"
                                                required
                                            />
                                        </div>
                                        {errors.phone && (
                                            <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>
                                        )}
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
                                                disabled={!canEdit}
                                                className="w-full rounded-xl border-slate-200 pl-10 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-slate-500"
                                                placeholder="info@catering.com"
                                                required
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="text-xs text-rose-600 mt-1">{errors.email}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                        Kitchen / Commercial Address <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                                        <textarea
                                            rows={3}
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            disabled={!canEdit}
                                            className="w-full rounded-xl border-slate-200 pl-10 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-slate-500"
                                            placeholder="House, Road, Block, Area..."
                                            required
                                        />
                                    </div>
                                    {errors.address && (
                                        <p className="text-xs text-rose-600 mt-1">{errors.address}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                            City / District <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            disabled={!canEdit}
                                            className="w-full rounded-xl border-slate-200 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-slate-500"
                                            placeholder="e.g. Dhaka"
                                            required
                                        />
                                        {errors.city && (
                                            <p className="text-xs text-rose-600 mt-1">{errors.city}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                            VAT / TIN (BIN) <span className="text-slate-400 font-normal">(Optional)</span>
                                        </label>
                                        <div className="relative">
                                            <FileText className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                                            <input
                                                type="text"
                                                value={data.vat_tin}
                                                onChange={(e) => setData('vat_tin', e.target.value)}
                                                disabled={!canEdit}
                                                className="w-full rounded-xl border-slate-200 pl-10 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500 font-mono disabled:bg-slate-50 disabled:text-slate-500"
                                                placeholder="e.g. BIN-9876543210"
                                            />
                                        </div>
                                        {errors.vat_tin && (
                                            <p className="text-xs text-rose-600 mt-1">{errors.vat_tin}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Action Buttons */}
                    {canEdit && (
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 transition-all"
                            >
                                <Save className="h-4 w-4" />
                                <span>{processing ? 'Saving Changes...' : 'Save Vendor Profile'}</span>
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
