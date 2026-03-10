import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import StatsCard from '@/Components/Dashboard/StatsCard';
import ExpenseChart from '@/Components/Dashboard/ExpenseChart';
import TrendChart from '@/Components/Dashboard/TrendChart';
import { motion } from 'framer-motion';
import { 
    ArrowUpRight, 
    ArrowDownRight, 
    Wallet, 
    ArrowRight, 
    Download,
    Plus
} from 'lucide-react';
import { formatRupiah } from '@/lib/currency';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { 
            staggerChildren: 0.05,
            duration: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 4 },
    visible: { 
        opacity: 1, 
        y: 0, 
        transition: { 
            duration: 0.2,
            ease: [0.4, 0, 0.2, 1]
        } 
    }
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
                        <h2 className="text-2xl font-semibold text-text-primary tracking-tight">
                            Dasbor
                        </h2>
                        <p className="mt-1 text-sm text-text-secondary">Ringkasan keuangan Anda hari ini.</p>
                    </div>
                    <div className="flex space-x-3">
                        <a
                            href={route('exports.transactions', { format: 'pdf' })}
                            className="inline-flex items-center px-4 py-2 bg-surface border border-border rounded-button font-medium text-sm text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors duration-200"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Unduh Laporan
                        </a>
                        <Link
                            href={route('transactions.index')}
                            className="inline-flex items-center px-4 py-2 bg-accent hover:bg-accent-hover text-background border border-transparent rounded-button font-medium text-sm transition-colors duration-200"
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <motion.div variants={itemVariants}>
                            <StatsCard 
                                title="Total Pendapatan" 
                                amount={totalIncome} 
                                icon={ArrowUpRight} 
                            />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <StatsCard 
                                title="Total Pengeluaran" 
                                amount={totalExpense} 
                                icon={ArrowDownRight} 
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

                    <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                        {/* Trend Chart */}
                        <div className="xl:col-span-2 bg-surface border border-border rounded-card p-5">
                            <h3 className="text-base font-medium text-text-primary mb-5">Tren Arus Kas (6 Bulan)</h3>
                            <TrendChart data={monthlyTrends} />
                        </div>

                        {/* Breakdown Chart */}
                        <div className="xl:col-span-1 bg-surface border border-border rounded-card p-5">
                            <h3 className="text-base font-medium text-text-primary mb-5">Rincian Pengeluaran</h3>
                            <ExpenseChart data={categoryBreakdown} />
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-surface border border-border rounded-card overflow-hidden">
                        <div className="p-5">
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="text-base font-medium text-text-primary">Transaksi Terakhir</h3>
                                <Link 
                                    href={route('transactions.index')}
                                    className="text-sm font-medium text-text-secondary hover:text-text-primary flex items-center transition-colors duration-200"
                                >
                                    Lihat Semua 
                                    <ArrowRight className="ml-1 w-4 h-4" />
                                </Link>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-3 text-xs font-medium text-text-tertiary tracking-wider border-b border-border">Tanggal</th>
                                            <th className="px-4 py-3 text-xs font-medium text-text-tertiary tracking-wider border-b border-border">Detail</th>
                                            <th className="px-4 py-3 text-xs font-medium text-text-tertiary tracking-wider border-b border-border text-right">Jumlah</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {recentTransactions.map((transaction) => {
                                            const isIncome = transaction.category.type === 'income';
                                            return (
                                                <tr key={transaction.id} className="hover:bg-surface-elevated/50 transition-colors duration-200">
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-text-secondary">
                                                        {formatDate(transaction.transaction_date)}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center">
                                                            <div className={`flex-shrink-0 w-8 h-8 rounded-button flex items-center justify-center mr-3 border ${isIncome ? 'bg-success/10 text-success border-success/20' : 'bg-danger/10 text-danger border-danger/20'}`}>
                                                                {isIncome ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium text-text-primary">{transaction.description || transaction.category.name}</div>
                                                                <div className="text-xs text-text-tertiary">{transaction.category.name}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-right">
                                                        <span className={`text-sm font-medium font-mono ${isIncome ? 'text-success' : 'text-danger'}`}>
                                                            {isIncome ? '+' : '-'}
                                                            {formatRupiah(transaction.amount)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                
                                {recentTransactions.length === 0 && (
                                    <div className="py-12 flex flex-col items-center justify-center text-text-tertiary">
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