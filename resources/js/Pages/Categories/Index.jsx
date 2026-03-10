import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import Modal from '@/Components/Modal';
import CategoryForm from '@/Components/Categories/CategoryForm';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import FlashMessage from '@/Components/FlashMessage';
import { Edit2, Trash2, Plus, FolderHeart, Search, X } from 'lucide-react';
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

export default function Index({ categories, filters }) {
    const { flash = {} } = usePage().props;
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [deletingCategory, setDeletingCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [isSearching, setIsSearching] = useState(false);
    const lastSubmittedSearch = useRef((filters?.search || '').trim());
    const { delete: destroy, processing } = useForm();

    const currentSort = filters?.sort || 'name';
    const currentDirection = filters?.direction || 'asc';

    const handleSort = (field) => {
        const newDirection = currentSort === field && currentDirection === 'asc' ? 'desc' : 'asc';
        router.get(route('categories.index'), {
            ...filters,
            sort: field,
            direction: newDirection,
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['categories', 'filters'],
        });
    };

    const SortIcon = ({ field }) => {
        if (currentSort !== field) {
            return <span className="inline-block w-3 h-3 text-text-tertiary opacity-50">↕</span>;
        }
        return <span className="inline-block w-3 h-3 text-text-primary">{currentDirection === 'asc' ? '↑' : '↓'}</span>;
    };

    const visitCategories = useCallback((search = '') => {
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
            route('categories.index'),
            params,
            {
                preserveState: true,
                preserveScroll: true,
                only: ['categories', 'filters'],
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
                visitCategories(normalizedQuery);
            }
        }, 450);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, visitCategories]);

    const handleSearch = useCallback((e) => {
        setSearchQuery(e.target.value);
    }, []);

    const clearSearch = useCallback(() => {
        setSearchQuery('');
        visitCategories('');
    }, [visitCategories]);

    const resultsKey = categories.map((category) => category.id).join('-') || 'empty-results';

    const deleteCategory = (e) => {
        e.preventDefault();
        destroy(route('categories.destroy', deletingCategory.id), {
            onSuccess: () => setDeletingCategory(null),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-5">
                    {/* Title Row */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div>
                            <h2 className="text-3xl font-semibold text-text-primary tracking-tight">
                                Kategori
                            </h2>
                            <p className="mt-1 text-sm text-text-secondary">Atur pengelompokan transaksi keuangan Anda.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsCreatingCategory(true)}
                                className="inline-flex items-center px-4 py-2 bg-accent hover:bg-accent-hover text-background border border-transparent rounded-button font-medium text-sm transition-colors duration-200"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Buat Kategori
                            </button>
                        </div>
                    </div>

                    {/* Search Bar - Full Width */}
                    <SearchInput
                        value={searchQuery}
                        onChange={handleSearch}
                        onClear={clearSearch}
                        isLoading={isSearching}
                        placeholder="Cari kategori..."
                        searchIcon={Search}
                        clearIcon={X}
                    />

                    {/* Results Count */}
                    <ResultsCount
                        count={categories.length}
                        label="total kategori"
                        visible={true}
                    />
                </div>
            }
        >
            <Head title="Kategori" />

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
                                                <SortableHeader field="name" onClick={handleSort} SortIcon={SortIcon}>
                                                    Nama
                                                </SortableHeader>
                                                <SortableHeader field="type" onClick={handleSort} SortIcon={SortIcon}>
                                                    Tipe
                                                </SortableHeader>
                                                <SortableHeader field="transactions_count" onClick={handleSort} SortIcon={SortIcon} align="right">
                                                    Total Transaksi
                                                </SortableHeader>
                                                <th className="px-4 py-3 text-xs font-medium text-text-secondary tracking-wider border-b border-border text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {categories.map((category, index) => (
                                                <AnimatedTableRow key={category.id} index={index}>
                                                    <TableCell className="font-medium text-text-primary">
                                                        {category.name}
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-button text-xs font-medium border ${category.type === 'income' ? 'bg-success/10 text-success border-success/20' : 'bg-danger/10 text-danger border-danger/20'}`}>
                                                            {category.type === 'income' ? 'Pendapatan' : 'Pengeluaran'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell align="right" className="font-mono text-text-secondary">
                                                        {category.transactions_count} <span className="text-text-tertiary text-xs ml-1">entri</span>
                                                    </TableCell>
                                                    <TableCell align="right" last className="font-medium">
                                                        <TableActions>
                                                            <TableActionButton
                                                                onClick={() => setEditingCategory(category)}
                                                                icon={Edit2}
                                                                color="accent"
                                                            />
                                                            <TableActionButton
                                                                onClick={() => setDeletingCategory(category)}
                                                                icon={Trash2}
                                                                color={category.transactions_count > 0 ? 'gray' : 'danger'}
                                                                disabled={category.transactions_count > 0}
                                                                title={category.transactions_count > 0 ? "Tidak dapat menghapus kategori yang memiliki transaksi" : "Hapus kategori"}
                                                            />
                                                        </TableActions>
                                                    </TableCell>
                                                </AnimatedTableRow>
                                            ))}
                                        </tbody>
                                    </table>

                                    {categories.length === 0 && (
                                        <EmptyTableState
                                            icon={FolderHeart}
                                            title="Belum ada kategori yang dibuat."
                                            description="Mulai dengan membuat kategori pengeluaran atau pendapatan."
                                        />
                                    )}
                                </div>
                            </TableWrapper>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Create Modal */}
            <Modal show={isCreatingCategory} onClose={() => setIsCreatingCategory(false)}>
                <div className="p-6 bg-surface border border-border">
                    <h2 className="text-2xl font-medium text-text-primary mb-6 flex items-center">
                        <Plus className="w-6 h-6 mr-2 text-text-primary" /> Buat Kategori
                    </h2>
                    <div>
                        <CategoryForm onSuccess={() => setIsCreatingCategory(false)} />
                    </div>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal show={!!editingCategory} onClose={() => setEditingCategory(null)}>
                <div className="p-6 bg-surface border border-border">
                    <h2 className="text-2xl font-medium text-text-primary mb-6 flex items-center">
                        <Edit2 className="w-6 h-6 mr-2 text-text-primary" /> Edit Kategori
                    </h2>
                    <div>
                        <CategoryForm 
                            category={editingCategory} 
                            onSuccess={() => setEditingCategory(null)} 
                        />
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={!!deletingCategory} onClose={() => setDeletingCategory(null)}>
                <form onSubmit={deleteCategory} className="p-6 bg-surface border border-border">
                    <h2 className="text-2xl font-medium text-danger flex items-center">
                        <Trash2 className="w-6 h-6 mr-2" /> Hapus Kategori?
                    </h2>
                    <p className="mt-4 text-sm text-text-secondary leading-relaxed">Tindakan ini tidak dapat dibatalkan. Kategori hanya dapat dihapus jika tidak ada transaksi yang terhubung dengannya.</p>
                    <div className="mt-8 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setDeletingCategory(null)}>Batal</SecondaryButton>
                        <DangerButton disabled={processing}>Hapus Permanen</DangerButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}