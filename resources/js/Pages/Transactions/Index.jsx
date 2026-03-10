import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import Modal from '@/Components/Modal';
import TransactionForm from '@/Components/Transactions/TransactionForm';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import FlashMessage from '@/Components/FlashMessage';
import {
    TableWrapper,
    SortableHeader,
    AnimatedTableRow,
    TableCell,
    EmptyTableState,
    TableActions,
    TableActionButton,
    SearchInput,
    ResultsCount,
} from '@/Components/Table';
import { Edit2, Trash2, Download, FileText, Table as TableIcon, Plus, Wallet, ArrowUpRight, ArrowDownRight, Calendar, Search, X } from 'lucide-react';
import { formatRupiah } from '@/lib/currency';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { 
            staggerChildren: 0.03,
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

export default function Index({ transactions, categories, filters }) {
    const { flash = {} } = usePage().props;
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
            return <span className="inline-block w-3 h-3 text-text-tertiary opacity-50">↕</span>;
        }
        return <span className="inline-block w-3 h-3 text-text-primary">{currentDirection === 'asc' ? '↑' : '↓'}</span>;
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
                        <div key={key} className="px-4 py-2 text-sm text-text-disabled bg-surface border border-border rounded-button" dangerouslySetInnerHTML={{ __html: link.label }} />
                    ) : (
                        <button
                            key={key}
                            onClick={() => handlePageClick(link.url)}
                            className={`px-4 py-2 text-sm transition-colors duration-200 rounded-button border ${isActive ? 'bg-surface-elevated border-border-strong text-text-primary font-medium' : 'bg-surface border-border text-text-secondary hover:bg-surface-elevated hover:text-text-primary'}`}
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
                <TableCell className="text-text-secondary">
                    {formatDate(transaction.transaction_date)}
                </TableCell>
                <TableCell>
                    <div className="flex items-center">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-button flex items-center justify-center mr-4 border ${isIncome ? 'bg-success/10 text-success border-success/20' : 'bg-danger/10 text-danger border-danger/20'}`}>
                            {isIncome ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-text-primary truncate">{transaction.description || transaction.category.name}</div>
                            <div className="text-xs text-text-secondary mt-0.5">{transaction.category.name}</div>
                        </div>
                    </div>
                </TableCell>
                <TableCell align="right">
                    <span className={`inline-flex items-center text-base font-semibold font-mono ${isIncome ? 'text-success' : 'text-danger'}`}>
                        {isIncome ? '+' : '-'}
                        {formatRupiah(transaction.amount)}
                    </span>
                </TableCell>
                <TableCell align="right" className="font-medium">
                    <TableActions>
                        <TableActionButton
                            onClick={() => setEditingTransaction(transaction)}
                            icon={Edit2}
                            color="accent"
                        />
                        <TableActionButton
                            onClick={() => setDeletingTransaction(transaction)}
                            icon={Trash2}
                            color="danger"
                        />
                    </TableActions>
                </TableCell>
            </>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-5">
                    {/* Title Row */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div>
                            <h2 className="text-3xl font-semibold text-text-primary tracking-tight">
                                Transaksi
                            </h2>
                            <p className="mt-1 text-sm text-text-secondary">Kelola arus kas dan riwayat pengeluaran Anda.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <SecondaryButton
                                onClick={() => setIsExporting(true)}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Ekspor
                            </SecondaryButton>
                            <button
                                onClick={() => setIsCreatingTransaction(true)}
                                className="inline-flex items-center px-4 py-2 bg-accent hover:bg-accent-hover text-background border border-transparent rounded-button font-medium text-sm transition-colors duration-200"
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
                        label="total transaksi"
                        visible={true}
                    />
                </div>
            }
        >
            <Head title="Transaksi" />

            <FlashMessage message={flash.success} type="success" />
            <FlashMessage message={flash.error} type="error" />

            <div>
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="mx-auto max-w-7xl"
                >
                    <motion.div variants={itemVariants} className="bg-surface border border-border rounded-card overflow-hidden">
                        <div className="p-5">
                            <TableWrapper isLoading={isSearching} resultsKey={resultsKey}>
                                <div className="overflow-x-auto overflow-y-hidden">
                                    <table className="min-w-full text-left border-collapse">
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
                                                <th className="px-4 py-3 text-xs font-medium text-text-secondary tracking-wider border-b border-border text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <motion.tbody variants={containerVariants} initial="hidden" animate="visible" className="divide-y divide-border">
                                            {transactions.data.map((transaction, index) => (
                                                <AnimatedTableRow key={transaction.id} index={index}>
                                                    <TransactionRow transaction={transaction} />
                                                </AnimatedTableRow>
                                            ))}
                                        </motion.tbody>
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
                <div className="p-6 bg-surface border border-border">
                    <h2 className="text-2xl font-medium text-text-primary mb-6 flex items-center">
                        <Plus className="w-6 h-6 mr-2 text-text-primary" /> Catat Transaksi
                    </h2>
                    <div>
                        {categories.length > 0 ? (
                            <TransactionForm 
                                categories={categories} 
                                onSuccess={() => setIsCreatingTransaction(false)}
                            />
                        ) : (
                            <div className="p-4 bg-surface-elevated rounded-card border border-border text-sm text-text-secondary text-center">
                                Harap <Link href={route('categories.index')} className="text-text-primary hover:text-accent transition-colors font-medium">buat kategori</Link> terlebih dahulu sebelum mencatat transaksi.
                            </div>
                        )}
                    </div>
                </div>
            </Modal>

            {/* Export Modal */}
            <Modal show={isExporting} onClose={() => setIsExporting(false)} maxWidth="sm">
                <div className="p-6 bg-surface border border-border">
                    <h2 className="text-2xl font-medium text-text-primary mb-6 flex items-center">
                        <Download className="w-6 h-6 mr-2 text-text-primary" /> Ekspor Data
                    </h2>
                    <div className="space-y-5">
                        <p className="text-sm text-text-secondary">Pilih rentang tanggal transaksi yang ingin Anda ekspor.</p>
                        <div>
                            <InputLabel value="Dari Tanggal" />
                            <div className="relative mt-1.5">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
                                <TextInput 
                                    type="date" 
                                    className="block w-full pl-10 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" 
                                    value={exportForm.data.from_date}
                                    onChange={e => exportForm.setData('from_date', e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <InputLabel value="Sampai Tanggal" />
                            <div className="relative mt-1.5">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
                                <TextInput 
                                    type="date" 
                                    className="block w-full pl-10 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" 
                                    value={exportForm.data.to_date}
                                    onChange={e => exportForm.setData('to_date', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-4">
                            <SecondaryButton onClick={() => handleExport('pdf')} className="justify-center">
                                <FileText className="w-4 h-4 mr-2" /> PDF
                            </SecondaryButton>
                            <SecondaryButton onClick={() => handleExport('csv')} className="justify-center">
                                <TableIcon className="w-4 h-4 mr-2" /> CSV
                            </SecondaryButton>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal show={!!editingTransaction} onClose={() => setEditingTransaction(null)}>
                <div className="p-6 bg-surface border border-border">
                    <h2 className="text-2xl font-medium text-text-primary mb-6 flex items-center">
                        <Edit2 className="w-6 h-6 mr-2 text-text-primary" /> Edit Transaksi
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
                    <h2 className="text-2xl font-medium text-danger flex items-center">
                        <Trash2 className="w-6 h-6 mr-2" /> Hapus Transaksi?
                    </h2>
                    <p className="mt-4 text-sm text-text-secondary leading-relaxed">Tindakan ini akan menghapus catatan transaksi secara permanen dan memengaruhi kalkulasi saldo Anda. Lanjutkan?</p>
                    <div className="mt-8 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setDeletingTransaction(null)}>Batal</SecondaryButton>
                        <DangerButton disabled={deleting}>Hapus Permanen</DangerButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}