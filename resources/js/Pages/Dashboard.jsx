import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import StatsCard from '@/Components/Dashboard/StatsCard';
import ExpenseChart from '@/Components/Dashboard/ExpenseChart';
import TrendChart from '@/Components/Dashboard/TrendChart';
import { motion } from 'framer-motion';
import { 
    TrendingUp, 
    TrendingDown, 
    Wallet, 
    ArrowRight, 
    Download,
    Plus
} from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(date);
};

export default function Dashboard({ summary }) {
    const {
        totalIncome,
        totalExpense,
        netBalance,
        categoryBreakdown,
        recentTransactions,
        monthlyTrends
    } = summary;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                    <div>
                        <h2 className="text-2xl font-display font-semibold text-gray-100 tracking-tight">
                            Dasbor
                        </h2>
                        <p className="mt-1 text-sm text-gray-400">Ringkasan keuangan Anda hari ini.</p>
                    </div>
                    <div className="flex space-x-3">
                        <a
                            href={route('exports.transactions', { format: 'pdf' })}
                            className="inline-flex items-center px-4 py-2 bg-surfaceHighlight border border-border rounded-lg font-medium text-sm text-gray-300 hover:text-white hover:bg-[#1a1a1a] focus:outline-none transition-all duration-200"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Unduh Laporan
                        </a>
                        <Link
                            href={route('transactions.index')}
                            className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-white text-black border border-transparent rounded-lg font-medium text-sm focus:outline-none transition-all duration-200 shadow-sm"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Catat Transaksi
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Dasbor" />

            <div className="py-6">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                >
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <motion.div variants={itemVariants}>
                            <StatsCard 
                                title="Total Pendapatan" 
                                amount={totalIncome} 
                                icon={TrendingUp} 
                            />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <StatsCard 
                                title="Total Pengeluaran" 
                                amount={totalExpense} 
                                icon={TrendingDown} 
                            />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <StatsCard 
                                title="Saldo Bersih" 
                                amount={netBalance} 
                                icon={Wallet} 
                            />
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        {/* Trend Chart */}
                        <motion.div variants={itemVariants} className="xl:col-span-2 bg-surface border border-border rounded-xl p-6">
                            <h3 className="text-base font-medium text-gray-200 mb-6 font-display">Tren Arus Kas (6 Bulan)</h3>
                            <TrendChart data={monthlyTrends} />
                        </motion.div>

                        {/* Breakdown Chart */}
                        <motion.div variants={itemVariants} className="xl:col-span-1 bg-surface border border-border rounded-xl p-6">
                            <h3 className="text-base font-medium text-gray-200 mb-6 font-display">Rincian Pengeluaran</h3>
                            <ExpenseChart data={categoryBreakdown} />
                        </motion.div>
                    </div>

                    {/* Recent Transactions */}
                    <motion.div variants={itemVariants} className="bg-surface border border-border rounded-xl overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-base font-medium text-gray-200 font-display">Transaksi Terakhir</h3>
                                <Link 
                                    href={route('transactions.index')}
                                    className="text-sm font-medium text-gray-400 hover:text-gray-200 flex items-center group transition-colors"
                                >
                                    Lihat Semua 
                                    <ArrowRight className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-border">Tanggal</th>
                                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-border">Detail</th>
                                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-border text-right">Jumlah</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/50">
                                        {recentTransactions.map((transaction) => {
                                            const isIncome = transaction.category.type === 'income';
                                            return (
                                                <tr key={transaction.id} className="hover:bg-surfaceHighlight/30 transition-colors">
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">
                                                        {formatDate(transaction.transaction_date)}
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center">
                                                            <div className={`flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center mr-3 border ${isIncome ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                                                                {isIncome ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-200">{transaction.description || transaction.category.name}</div>
                                                                <div className="text-xs text-gray-500">{transaction.category.name}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-right">
                                                        <span className={`text-sm font-medium font-display ${isIncome ? 'text-emerald-400' : 'text-gray-200'}`}>
                                                            {isIncome ? '+' : '-'}
                                                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(transaction.amount)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                
                                {recentTransactions.length === 0 && (
                                    <div className="py-12 flex flex-col items-center justify-center text-gray-500">
                                        <Wallet className="w-10 h-10 opacity-20 mb-3" />
                                        <p className="text-sm">Belum ada transaksi.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}
