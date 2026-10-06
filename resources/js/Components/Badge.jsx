import React from 'react';

const variantClasses = {
    primary: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
    success: 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20',
    warning: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
    danger: 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20',
    info: 'bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-600/20',
    purple: 'bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20',
    neutral: 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-600/10',
};

export default function Badge({
    children,
    variant = 'neutral',
    size = 'md',
    dot = false,
    className = '',
}) {
    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs font-medium',
        md: 'px-2.5 py-1 text-xs font-semibold',
        lg: 'px-3 py-1.5 text-sm font-semibold',
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full ${sizeClasses[size] || sizeClasses.md} ${
                variantClasses[variant] || variantClasses.neutral
            } ${className}`}
        >
            {dot && (
                <span
                    className={`h-1.5 w-1.5 rounded-full ${
                        variant === 'success' || variant === 'primary'
                            ? 'bg-emerald-500'
                            : variant === 'warning'
                            ? 'bg-amber-500'
                            : variant === 'danger'
                            ? 'bg-rose-500'
                            : variant === 'info'
                            ? 'bg-sky-500'
                            : 'bg-slate-400'
                    }`}
                />
            )}
            {children}
        </span>
    );
}
