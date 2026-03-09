import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Modal from '@/Components/Modal';
import CategoryForm from '@/Components/Categories/CategoryForm';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Edit2, Trash2, Plus, FolderHeart } from 'lucide-react';

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

export default function Index({ categories }) {
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [deletingCategory, setDeletingCategory] = useState(null);
    const { delete: destroy, processing } = useForm();

    const deleteCategory = (e) => {
        e.preventDefault();
        destroy(route('categories.destroy', deletingCategory.id), {
            onSuccess: () => setDeletingCategory(null),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                    <div>
                        <h2 className="text-3xl font-display font-semibold text-gray-100 tracking-tight">
                            Kategori
                        </h2>
                        <p className="mt-1 text-sm text-gray-400">Atur pengelompokan transaksi keuangan Anda.</p>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            onClick={() => setIsCreatingCategory(true)}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 border border-transparent rounded-xl font-medium text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Buat Kategori
                        </button>
                    </div>
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
                                <h3 className="text-xl font-display font-medium text-gray-100 mb-6">Daftar Kategori</h3>
                                
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-left border-separate border-spacing-y-2">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-border">Nama</th>
                                                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-border">Tipe</th>
                                                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-border text-right">Total Transaksi</th>
                                                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-border text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y-0">
                                            {categories.map((category, index) => (
                                                <motion.tr 
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    key={category.id} 
                                                    className="group bg-surfaceHighlight/30 hover:bg-surfaceHighlight/80 transition-colors"
                                                >
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
                                                        <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => setEditingCategory(category)}
                                                                className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                                                            >
                                                                <Edit2 size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => setDeletingCategory(category)}
                                                                className={`p-2 rounded-lg transition-colors ${category.transactions_count > 0 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-rose-400 hover:bg-rose-500/10'}`}
                                                                disabled={category.transactions_count > 0}
                                                                title={category.transactions_count > 0 ? "Tidak dapat menghapus kategori yang memiliki transaksi" : "Hapus kategori"}
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {categories.length === 0 && (
                                        <div className="py-24 flex flex-col items-center justify-center text-gray-500">
                                            <FolderHeart className="w-20 h-20 opacity-10 mb-6" />
                                            <p className="text-xl font-display text-gray-400">Belum ada kategori yang dibuat.</p>
                                            <p className="text-sm mt-2">Mulai dengan membuat kategori pengeluaran atau pendapatan.</p>
                                        </div>
                                    )}
                                </div>
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
