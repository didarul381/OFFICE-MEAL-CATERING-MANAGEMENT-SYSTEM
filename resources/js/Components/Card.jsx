import React from 'react';

export default function Card({
    title,
    subtitle,
    action,
    children,
    footer,
    className = '',
    headerClassName = '',
    bodyClassName = '',
    noPadding = false,
}) {
    return (
        <div
            className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm transition-all duration-200 ${className}`}
        >
            {(title || subtitle || action) && (
                <div
                    className={`px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-100 flex items-center justify-between gap-4 ${headerClassName}`}
                >
                    <div>
                        {title && (
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                                {title}
                            </h3>
                        )}
                        {subtitle && (
                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    {action && <div className="flex-shrink-0">{action}</div>}
                </div>
            )}
            <div
                className={`${noPadding ? '' : 'p-5 sm:p-6'} ${bodyClassName}`}
            >
                {children}
            </div>
            {footer && (
                <div className="px-5 py-3 sm:px-6 sm:py-4 bg-slate-50/70 border-t border-slate-100 rounded-b-2xl">
                    {footer}
                </div>
            )}
        </div>
    );
}
