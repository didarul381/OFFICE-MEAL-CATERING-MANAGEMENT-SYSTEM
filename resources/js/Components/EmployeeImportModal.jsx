import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import {
    Upload,
    FileSpreadsheet,
    Download,
    CheckCircle2,
    AlertCircle,
    X,
    FileText,
    AlertTriangle,
} from 'lucide-react';

export default function EmployeeImportModal({ show, onClose, clients, isClientAdmin, userClientId }) {
    const { flash } = usePage().props;
    const report = flash?.importReport;

    const { data, setData, post, processing, errors, reset } = useForm({
        client_id: isClientAdmin ? userClientId : (clients[0]?.id || ''),
        csv_file: null,
    });

    const [fileName, setFileName] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('csv_file', file);
            setFileName(file.name);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('employees.import'), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                reset('csv_file');
                setFileName('');
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="xl">
            <div className="p-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                            <FileSpreadsheet className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900">
                                Bulk Employee Import (CSV)
                            </h3>
                            <p className="text-xs text-slate-500">
                                Enroll multiple employees and meal settings at once
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Import Result Feedback if available */}
                {report && (
                    <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                            Latest Import Summary
                        </h4>
                        <div className="grid grid-cols-3 gap-3 text-center">
                            <div className="p-3 bg-white rounded-xl border border-emerald-100">
                                <span className="text-[10px] text-slate-400 font-bold block uppercase">Created</span>
                                <span className="text-lg font-black text-emerald-600">{report.successful}</span>
                            </div>
                            <div className="p-3 bg-white rounded-xl border border-amber-100">
                                <span className="text-[10px] text-slate-400 font-bold block uppercase">Duplicates</span>
                                <span className="text-lg font-black text-amber-600">{report.duplicates}</span>
                            </div>
                            <div className="p-3 bg-white rounded-xl border border-rose-100">
                                <span className="text-[10px] text-slate-400 font-bold block uppercase">Failed</span>
                                <span className="text-lg font-black text-rose-600">{report.failed}</span>
                            </div>
                        </div>

                        {report.errors?.length > 0 && (
                            <div className="mt-2 text-xs">
                                <span className="font-semibold text-rose-700 block mb-1">Validation Errors:</span>
                                <div className="max-h-32 overflow-y-auto space-y-1 bg-white p-2.5 rounded-xl border border-rose-100 text-[11px] text-rose-600 font-mono">
                                    {report.errors.map((err, i) => (
                                        <div key={i}>• {err}</div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    {!isClientAdmin && clients?.length > 0 && (
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Target Client Organization <span className="text-rose-500">*</span>
                            </label>
                            <select
                                value={data.client_id}
                                onChange={(e) => setData('client_id', e.target.value)}
                                className="w-full rounded-xl border-slate-200 text-xs sm:text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                required
                            >
                                {clients.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            {errors.client_id && (
                                <p className="text-xs text-rose-600 mt-1">{errors.client_id}</p>
                            )}
                        </div>
                    )}

                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Upload CSV File <span className="text-rose-500">*</span>
                            </label>
                            <a
                                href={route('employees.sample-csv')}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                            >
                                <Download className="h-3.5 w-3.5" />
                                <span>Download Template</span>
                            </a>
                        </div>

                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-2xl hover:border-emerald-500 transition-colors bg-slate-50/50">
                            <div className="space-y-1 text-center">
                                <Upload className="mx-auto h-8 w-8 text-slate-400" />
                                <div className="flex text-xs text-slate-600 justify-center">
                                    <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer rounded-md font-bold text-emerald-600 hover:text-emerald-500 focus-within:outline-hidden"
                                    >
                                        <span>Select a file</span>
                                        <input
                                            id="file-upload"
                                            name="file-upload"
                                            type="file"
                                            accept=".csv,text/csv"
                                            className="sr-only"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-[11px] text-slate-400">
                                    CSV up to 5MB (columns: name, employee_id, phone, email, department, meal_preference...)
                                </p>
                                {fileName && (
                                    <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                                        <FileText className="h-3.5 w-3.5" />
                                        <span>{fileName}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        {errors.csv_file && (
                            <p className="text-xs text-rose-600 mt-1">{errors.csv_file}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing || !data.csv_file}
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs disabled:opacity-50 transition-all"
                        >
                            <Upload className="h-4 w-4" />
                            <span>{processing ? 'Processing CSV...' : 'Start Import'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
