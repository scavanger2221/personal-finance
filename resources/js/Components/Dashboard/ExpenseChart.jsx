import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend
} from 'recharts';
import { formatRupiah } from '@/lib/currency';

const COLORS = [
    '#6366f1', '#10b981', '#f59e0b', '#ef4444', 
    '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6',
    '#f97316', '#06b6d4', '#d946ef', '#84cc16'
];

export default function ExpenseChart({ data }) {
    if (!data || data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-gray-500">
                Tidak ada data tersedia
            </div>
        );
    }

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#111111] border border-[#222] p-3 rounded-xl shadow-2xl">
                    <p className="text-gray-200 text-sm font-medium mb-1">{payload[0].name}</p>
                    <p className="text-sm font-semibold font-display text-rose-400">
                        {formatRupiah(payload[0].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
