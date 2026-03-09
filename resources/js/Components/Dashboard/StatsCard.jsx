import React from 'react';
import { motion } from 'framer-motion';

export default function StatsCard({ title, amount, icon: Icon, trend, className }) {
    const isNegative = amount < 0;
    const formattedAmount = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
    }).format(Math.abs(amount));

    return (
        <motion.div 
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`bg-surface/80 backdrop-blur-md border border-border overflow-hidden rounded-2xl p-6 relative group ${className}`}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="flex items-center justify-between relative z-10">
                <div>
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">{title}</p>
                    <p className={`mt-2 font-display text-4xl font-semibold tracking-tight ${isNegative && (title === 'Saldo Bersih' || title === 'Net Balance') ? 'text-rose-500' : 'text-gray-100'}`}>
                        {isNegative ? '-' : ''}{formattedAmount}
                    </p>
                </div>
                <div className="p-4 bg-surfaceHighlight rounded-xl text-indigo-500 border border-border shadow-inner">
                    <Icon size={26} strokeWidth={1.5} />
                </div>
            </div>
            
            {trend && (
                <div className="mt-5 relative z-10 flex items-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${trend > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {trend > 0 ? '+' : ''}{trend}%
                    </span>
                    <span className="text-sm text-gray-500 ml-3">dari bulan lalu</span>
                </div>
            )}
        </motion.div>
    );
}
