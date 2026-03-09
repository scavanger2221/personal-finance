import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import Modal from '@/Components/Modal';
import CategoryForm from '@/Components/Categories/CategoryForm';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Edit2, Trash2, Plus, FolderHeart, Search, X } from 'lucide-react';
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

export default function Index({ categories, filters }) {
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
            return <span className="inline-block w-3 h-3 text-gray-600 opacity-50">↕</span>;
        }
        return <span className="inline-block w-3 h-3 text-indigo-400">{currentDirection === 'asc' ? '↑' : '↓'}</span>;
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
                <div className="flex flex-col gap-6">
                    {/* Title Row */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div>
                            <h2 className="text-3xl font-display font-semibold text-gray-100 tracking-tight">
                                Kategori
                            </h2>
                            <p className="mt-1 text-sm text-gray-400">Atur pengelompokan transaksi keuangan Anda.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsCreatingCategory(true)}
                                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-white text-black border border-transparent rounded-lg font-medium text-sm focus:outline-none transition-all duration-200 shadow-sm"
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
                        label="hasil ditemukan"
                        visible={!!filters?.search}
                    />
                </div>
            }
        >
            <Head title="Kategori" />

            <div className="py-8">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="mx-auto max-w-7xl sm:px-6 lg:px-8"
                >
                    {/* Full Width Category List */}
                    <motion.div variants={itemVariants}>
                        <div className="bg-surface border border-border rounded-2xl overflow-hidden relative shadow-2xl">
                            <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />
                            
                            <div className="p-6 relative z-10">
                                <TableWrapper isLoading={isSearching} resultsKey={resultsKey}>
                                    <div className="overflow-x-auto overflow-y-hidden">
                                        <table className="min-w-full text-left border-separate border-spacing-y-2">
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
                                                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-border text-right">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y-0">
                                                {categories.map((category, index) => (
                                                    <AnimatedTableRow key={category.id} index={index}>
                                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-200 rounded-l-xl">
                                                            {category.name}
                                                        </td>
                                                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${category.type === 'income' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                                                                {category.type === 'income' ? 'Pendapatan' : 'Pengeluaran'}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400 font-display text-right">
                                                            {category.transactions_count} <span className="text-gray-600 text-xs ml-1">entri</span>
                                                        </td>
                                                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium rounded-r-xl">
                                                            <TableActions>
                                                                <TableActionButton
                                                                    onClick={() => setEditingCategory(category)}
                                                                    icon={Edit2}
                                                                    color="indigo"
                                                                />
                                                                <TableActionButton
                                                                    onClick={() => setDeletingCategory(category)}
                                                                    icon={Trash2}
                                                                    color={category.transactions_count > 0 ? 'gray' : 'rose'}
                                                                    disabled={category.transactions_count > 0}
                                                                    title={category.transactions_count > 0 ? "Tidak dapat menghapus kategori yang memiliki transaksi" : "Hapus kategori"}
                                                                />
                                                            </TableActions>
                                                        </td>
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
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Create Modal */}
            <Modal show={isCreatingCategory} onClose={() => setIsCreatingCategory(false)}>
                <div className="p-6 bg-surface border border-border relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] rounded-full pointer-events-none" />
                    <h2 className="text-2xl font-display font-medium text-gray-100 mb-6 relative z-10 flex items-center">
                        <Plus className="w-6 h-6 mr-2 text-indigo-500" /> Buat Kategori
                    </h2>
                    <div className="relative z-10">
                        <CategoryForm onSuccess={() => setIsCreatingCategory(false)} />
                    </div>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal show={!!editingCategory} onClose={() => setEditingCategory(null)}>
                <div className="p-6 bg-surface border border-border relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] rounded-full pointer-events-none" />
                    <h2 className="text-2xl font-display font-medium text-gray-100 mb-6 relative z-10 flex items-center">
                        <Edit2 className="w-6 h-6 mr-2 text-indigo-500" /> Edit Kategori
                    </h2>
                    <div className="relative z-10">
                        <CategoryForm 
                            category={editingCategory} 
                            onSuccess={() => setEditingCategory(null)} 
                        />
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={!!deletingCategory} onClose={() => setDeletingCategory(null)}>
                <form onSubmit={deleteCategory} className="p-6 bg-surface border border-border relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-rose-500/5 blur-[50px] rounded-full pointer-events-none" />
                    <h2 className="text-2xl font-display font-medium text-gray-100 relative z-10 flex items-center text-rose-500">
                        <Trash2 className="w-6 h-6 mr-2" /> Hapus Kategori?
                    </h2>
                    <p className="mt-4 text-sm text-gray-400 leading-relaxed relative z-10">Tindakan ini tidak dapat dibatalkan. Kategori hanya dapat dihapus jika tidak ada transaksi yang terhubung dengannya.</p>
                    <div className="mt-8 flex justify-end gap-3 relative z-10">
                        <SecondaryButton onClick={() => setDeletingCategory(null)}>Batal</SecondaryButton>
                        <DangerButton disabled={processing}>Hapus Permanen</DangerButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
