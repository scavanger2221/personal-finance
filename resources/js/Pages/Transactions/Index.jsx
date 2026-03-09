import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import Modal from '@/Components/Modal';
import TransactionForm from '@/Components/Transactions/TransactionForm';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import {
    TableWrapper,
    SortableHeader,
    AnimatedTableRow,
    EmptyTableState,
    TableActions,
    TableActionButton,
    SearchInput,
    ResultsCount,
} from '@/Components/Table';
import { Edit2, Trash2, Download, FileText, Table as TableIcon, Plus, Wallet, TrendingUp, TrendingDown, Calendar, Search, X } from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Index({ transactions, categories, filters }) {
    const [isCreatingTransaction, setIsCreatingTransaction] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [deletingTransaction, setDeletingTransaction] = useState(null);
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [isSearching, setIsSearching] = useState(false);
    const lastSubmittedSearch = useRef((filters?.search || '').trim());
    const { delete: destroy, processing: deleting } = useForm();

    const currentSort = filters?.sort || 'transaction_date';
    const currentDirection = filters?.direction || 'desc';

    const handleSort = (field) => {
        const newDirection = currentSort === field && currentDirection === 'asc' ? 'desc' : 'asc';
        router.get(route('transactions.index'), {
            ...filters,
            sort: field,
            direction: newDirection,
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['transactions', 'filters'],
        });
    };

    const SortIcon = ({ field }) => {
        if (currentSort !== field) {
            return <span className="inline-block w-3 h-3 text-gray-600 opacity-50">↕</span>;
        }
        return <span className="inline-block w-3 h-3 text-indigo-400">{currentDirection === 'asc' ? '↑' : '↓'}</span>;
    };

    const visitTransactions = useCallback((search = '') => {
        let spinnerTimeoutId;
        const normalizedSearch = search.trim();

        lastSubmittedSearch.current = normalizedSearch;

        const params = {
            sort: currentSort,
            direction: currentDirection,
        };

        if (normalizedSearch) {
            params.search = normalizedSearch;
        }

        router.get(
            route('transactions.index'),
            params,
            {
                preserveState: true,
                preserveScroll: true,
                only: ['transactions', 'filters'],
                replace: true,
                onStart: () => {
                    spinnerTimeoutId = window.setTimeout(() => setIsSearching(true), 150);
                },
                onFinish: () => {
                    window.clearTimeout(spinnerTimeoutId);
                    setIsSearching(false);
                },
            }
        );
    }, [currentSort, currentDirection]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const normalizedQuery = searchQuery.trim();
            const currentSearch = lastSubmittedSearch.current;

            if (normalizedQuery !== currentSearch) {
                visitTransactions(normalizedQuery);
            }
        }, 450);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, visitTransactions]);

    const handleSearch = useCallback((e) => {
        setSearchQuery(e.target.value);
    }, []);

    const clearSearch = useCallback(() => {
        setSearchQuery('');
        visitTransactions('');
    }, [visitTransactions]);

    const resultsKey = transactions.data.map((transaction) => transaction.id).join('-') || 'empty-results';

    const exportForm = useForm({
        from_date: '',
        to_date: '',
        format: 'pdf'
    });

    const deleteTransaction = (e) => {
        e.preventDefault();
        destroy(route('transactions.destroy', deletingTransaction.id), {
            onSuccess: () => setDeletingTransaction(null),
        });
    };

    const handleExport = (format) => {
        const params = new URLSearchParams({
            from_date: exportForm.data.from_date,
            to_date: exportForm.data.to_date,
            format: format
        });
        window.location.href = route('exports.transactions') + '?' + params.toString();
        setIsExporting(false);
    };

    const Pagination = ({ links }) => {
        const handlePageClick = (url) => {
            if (!url) return;
            window.scrollTo({ top: 0, behavior: 'smooth' });
            router.get(url, {}, {
                preserveState: true,
                preserveScroll: false,
                only: ['transactions'],
            });
        };

        return (
            <div className="flex flex-wrap justify-center gap-2 mt-8">
                {links.map((link, key) => {
                    const isActive = link.active;
                    const isMuted = link.url === null;
                    
                    return isMuted ? (
                        <div key={key} className="px-4 py-2 text-sm text-gray-600 bg-surface/50 border border-border/50 rounded-lg" dangerouslySetInnerHTML={{ __html: link.label }} />
                    ) : (
                        <button
                            key={key}
                            onClick={() => handlePageClick(link.url)}
                            className={`px-4 py-2 text-sm transition-all duration-200 rounded-lg border ${isActive ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-400 font-medium' : 'bg-surface border-border text-gray-400 hover:bg-surfaceHighlight hover:text-white'}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                })}
            </div>
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(date);
    };

    const TransactionRow = ({ transaction }) => {
        const isIncome = transaction.category.type === 'income';

        return (
            <>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400 rounded-l-xl">
                    {formatDate(transaction.transaction_date)}
                </td>
                <td className="px-4 py-4">
                    <div className="flex items-center">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center mr-4 border ${isIncome ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                            {isIncome ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-gray-200 truncate">{transaction.description || transaction.category.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{transaction.category.name}</div>
                        </div>
                    </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right">
                    <span className={`inline-flex items-center text-base font-semibold font-display ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isIncome ? '+' : '-'}
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(transaction.amount)}
                    </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium rounded-r-xl">
                    <TableActions>
                        <TableActionButton
                            onClick={() => setEditingTransaction(transaction)}
                            icon={Edit2}
                            color="indigo"
                        />
                        <TableActionButton
                            onClick={() => setDeletingTransaction(transaction)}
                            icon={Trash2}
                            color="rose"
                        />
                    </TableActions>
                </td>
            </>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-6">
                    {/* Title Row */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div>
                            <h2 className="text-3xl font-display font-semibold text-gray-100 tracking-tight">
                                Transaksi
                            </h2>
                            <p className="mt-1 text-sm text-gray-400">Kelola arus kas dan riwayat pengeluaran Anda.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsExporting(true)}
                                className="inline-flex items-center px-4 py-2 bg-surfaceHighlight border border-border rounded-lg font-medium text-sm text-gray-300 hover:text-white hover:bg-surfaceHighlight/80 focus:outline-none transition-all duration-200"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Ekspor
                            </button>
                            <button
                                onClick={() => setIsCreatingTransaction(true)}
                                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-white text-black border border-transparent rounded-lg font-medium text-sm focus:outline-none transition-all duration-200 shadow-sm"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Catat Transaksi
                            </button>
                        </div>
                    </div>

                    {/* Search Bar - Full Width */}
                    <SearchInput
                        value={searchQuery}
                        onChange={handleSearch}
                        onClear={clearSearch}
                        isLoading={isSearching}
                        placeholder="Cari transaksi atau kategori..."
                        searchIcon={Search}
                        clearIcon={X}
                    />

                    {/* Results Count */}
                    <ResultsCount
                        count={transactions.total}
                        label="hasil ditemukan"
                        visible={!!filters?.search}
                    />
                </div>
            }
        >
            <Head title="Transaksi" />

            <div className="py-8">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="mx-auto max-w-7xl sm:px-6 lg:px-8"
                >
                    {/* Full Width Transactions Table */}
                    <motion.div variants={itemVariants} className="bg-surface border border-border rounded-2xl overflow-hidden relative shadow-2xl">
                        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />
                        
                        <div className="p-6 relative z-10">
                            <TableWrapper isLoading={isSearching} resultsKey={resultsKey}>
                                <div className="overflow-x-auto overflow-y-hidden">
                                    <table className="min-w-full text-left border-separate border-spacing-y-2">
                                        <thead>
                                            <tr>
                                                <SortableHeader field="transaction_date" onClick={handleSort} SortIcon={SortIcon}>
                                                    Tanggal
                                                </SortableHeader>
                                                <SortableHeader field="description" onClick={handleSort} SortIcon={SortIcon}>
                                                    Detail
                                                </SortableHeader>
                                                <SortableHeader field="amount" onClick={handleSort} SortIcon={SortIcon} align="right">
                                                    Jumlah
                                                </SortableHeader>
                                                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-border text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y-0">
                                            {transactions.data.map((transaction, index) => (
                                                <AnimatedTableRow key={transaction.id} index={index}>
                                                    <TransactionRow transaction={transaction} />
                                                </AnimatedTableRow>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                
                                {transactions.data.length === 0 && (
                                    <EmptyTableState
                                        icon={Wallet}
                                        title="Belum ada transaksi tercatat."
                                        description="Mulai dengan mencatat pemasukan atau pengeluaran pertama Anda."
                                    />
                                )}
                            </TableWrapper>

                            {transactions.data.length > 0 && <Pagination links={transactions.links} />}
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Create Modal */}
            <Modal show={isCreatingTransaction} onClose={() => setIsCreatingTransaction(false)}>
                <div className="p-6 bg-surface border border-border relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] rounded-full pointer-events-none" />
                    <h2 className="text-2xl font-display font-medium text-gray-100 mb-6 relative z-10 flex items-center">
                        <Plus className="w-6 h-6 mr-2 text-indigo-500" /> Catat Transaksi
                    </h2>
                    <div className="relative z-10">
                        {categories.length > 0 ? (
                            <TransactionForm 
                                categories={categories} 
                                onSuccess={() => setIsCreatingTransaction(false)}
                            />
                        ) : (
                            <div className="p-4 bg-surfaceHighlight rounded-xl border border-border text-sm text-gray-400 text-center">
                                Harap <Link href={route('categories.index')} className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">buat kategori</Link> terlebih dahulu sebelum mencatat transaksi.
                            </div>
                        )}
                    </div>
                </div>
            </Modal>

            {/* Export Modal */}
            <Modal show={isExporting} onClose={() => setIsExporting(false)} maxWidth="sm">
                <div className="p-6 bg-surface border border-border relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/5 blur-[50px] rounded-full pointer-events-none" />
                    <h2 className="text-2xl font-display font-medium text-gray-100 mb-6 relative z-10 flex items-center">
                        <Download className="w-6 h-6 mr-2 text-emerald-500" /> Ekspor Data
                    </h2>
                    <div className="space-y-5 relative z-10">
                        <p className="text-sm text-gray-400">Pilih rentang tanggal transaksi yang ingin Anda ekspor.</p>
                        <div>
                            <InputLabel value="Dari Tanggal" className="text-gray-400" />
                            <div className="relative mt-1.5">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                <TextInput 
                                    type="date" 
                                    className="block w-full pl-10 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" 
                                    value={exportForm.data.from_date}
                                    onChange={e => exportForm.setData('from_date', e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <InputLabel value="Sampai Tanggal" className="text-gray-400" />
                            <div className="relative mt-1.5">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                <TextInput 
                                    type="date" 
                                    className="block w-full pl-10 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" 
                                    value={exportForm.data.to_date}
                                    onChange={e => exportForm.setData('to_date', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-4">
                            <SecondaryButton onClick={() => handleExport('pdf')} className="justify-center bg-surfaceHighlight hover:bg-white/10 border-transparent">
                                <FileText className="w-4 h-4 mr-2 text-rose-400" /> PDF
                            </SecondaryButton>
                            <SecondaryButton onClick={() => handleExport('csv')} className="justify-center bg-surfaceHighlight hover:bg-white/10 border-transparent">
                                <TableIcon className="w-4 h-4 mr-2 text-emerald-400" /> CSV
                            </SecondaryButton>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal show={!!editingTransaction} onClose={() => setEditingTransaction(null)}>
                <div className="p-6 bg-surface border border-border">
                    <h2 className="text-2xl font-display font-medium text-gray-100 mb-6 flex items-center">
                        <Edit2 className="w-6 h-6 mr-2 text-indigo-500" /> Edit Transaksi
                    </h2>
                    <TransactionForm 
                        transaction={editingTransaction} 
                        categories={categories}
                        onSuccess={() => setEditingTransaction(null)} 
                    />
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={!!deletingTransaction} onClose={() => setDeletingTransaction(null)}>
                <form onSubmit={deleteTransaction} className="p-6 bg-surface border border-border">
                    <h2 className="text-2xl font-display font-medium text-gray-100 flex items-center text-rose-500">
                        <Trash2 className="w-6 h-6 mr-2" /> Hapus Transaksi?
                    </h2>
                    <p className="mt-4 text-sm text-gray-400 leading-relaxed">Tindakan ini akan menghapus catatan transaksi secara permanen dan memengaruhi kalkulasi saldo Anda. Lanjutkan?</p>
                    <div className="mt-8 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setDeletingTransaction(null)}>Batal</SecondaryButton>
                        <DangerButton disabled={deleting}>Hapus Permanen</DangerButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
