import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function FlashMessage() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(false);
    const [content, setContent] = useState({ type: '', text: '' });

    useEffect(() => {
        if (flash?.success) {
            setContent({ type: 'success', text: flash.success });
            setVisible(true);
        } else if (flash?.error) {
            setContent({ type: 'error', text: flash.error });
            setVisible(true);
        } else if (flash?.message) {
            setContent({ type: 'info', text: flash.message });
            setVisible(true);
        }
    }, [flash]);

    if (!visible || !content.text) return null;

    const isSuccess = content.type === 'success';

    return (
        <div className="fixed top-5 right-5 z-50 max-w-md w-full px-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <div
                className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg ${
                    isSuccess
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
            >
                {isSuccess ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                    <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 text-sm font-medium">
                    {content.text}
                </div>
                <button
                    type="button"
                    onClick={() => setVisible(false)}
                    className="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
