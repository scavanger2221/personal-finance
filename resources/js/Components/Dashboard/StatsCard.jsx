import React from 'react';
import { formatRupiah } from '@/lib/currency';

export default function StatsCard({ title, amount, icon: Icon, trend, className }) {
    const isNegative = amount < 0;
    const formattedAmount = formatRupiah(Math.abs(amount));

    return (
        <div 
            className={`bg-surface border border-border overflow-hidden rounded-card p-5 relative group ${className}`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-text-secondary">{title}</p>
                    <p className={`mt-2 text-3xl font-semibold font-mono tracking-tight ${isNegative && (title === 'Saldo Bersih' || title === 'Net Balance') ? 'text-danger' : 'text-text-primary'}`}>
                        {isNegative ? '-' : ''}{formattedAmount}
                    </p>
                </div>
                <div className="p-3 bg-surface-elevated rounded-card text-text-secondary border border-border">
                    <Icon size={22} strokeWidth={1.5} />
                </div>
            </div>
            
            {trend && (
                <div className="mt-4 flex items-center">
                    <span className={`text-sm font-medium ${trend > 0 ? 'text-success' : 'text-danger'}`}>
                        {trend > 0 ? '+' : ''}{trend}%
                    </span>
                    <span className="text-sm text-text-tertiary ml-2">dari bulan lalu</span>
                </div>
            )}
        </div>
    );
}
