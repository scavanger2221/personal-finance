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

// Generate consistent muted colors based on index
const generateColor = (index) => {
    // Muted color palette (slate, sage, taupe, dusty)
    const baseColors = [
        { h: 210, s: 25, l: 45 }, // slate blue
        { h: 150, s: 25, l: 40 }, // sage green
        { h: 30, s: 30, l: 45 },  // warm taupe
        { h: 270, s: 20, l: 45 }, // dusty purple
        { h: 180, s: 25, l: 42 }, // teal
        { h: 0, s: 25, l: 40 },   // muted red
        { h: 45, s: 30, l: 48 },  // ochre
        { h: 330, s: 25, l: 45 }, // mauve
    ];
    
    // Cycle through base colors
    const baseColor = baseColors[index % baseColors.length];
    
    // Add slight variation based on total to avoid identical colors
    const lightnessVariation = (index % 3) * 8 - 8; // -8, 0, or +8
    
    return `hsl(${baseColor.h}, ${baseColor.s}%, ${Math.max(30, Math.min(55, baseColor.l + lightnessVariation))}%)`;
};

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
                    <p className="text-sm font-semibold font-display text-[#8B5A5A]">
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
                            <Cell key={`cell-${index}`} fill={generateColor(index, data.length)} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
