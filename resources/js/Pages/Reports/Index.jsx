import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Archive, Download, Search, Trash2, X } from 'lucide-react';
import { motion } from 'framer-motion';
import Modal from '@/Components/Modal';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import {
    TableWrapper,
    AnimatedTableRow,
    TableCell,
    TableActions,
    TableActionButton,
    EmptyTableState,
    ResultsCount,
    SearchInput,
} from '@/Components/Table';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.03,
            duration: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 4 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.2,
            ease: [0.4, 0, 0.2, 1],
        },
    },
};

function formatSize(size) {
    if (!size) return '-';
    if (size >= 1_000_000) return `${(size / 1_000_000).toFixed(2)} MB`;
    if (size >= 1_000) return `${(size / 1_000).toFixed(2)} KB`;
    return `${size} B`;
}

const formatBadgeClasses = {
    PDF: 'bg-danger/10 text-danger border-danger/20',
    CSV: 'bg-success/10 text-success border-success/20',
};

export default function Index({ archives, filters }) {
    const { flash = {} } = usePage().props;
    const { delete: destroy, processing } = useForm();
    const [deletingArchive, setDeletingArchive] = useState(null);
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [isSearching, setIsSearching] = useState(false);
    const lastSubmittedSearch = useRef((filters?.search || '').trim());

    const resultsKey = archives.map((archive) => archive.id).join('-') || 'empty-archives';

    const visitArchives = useCallback((search = '') => {
        let spinnerTimeoutId;
        const normalizedSearch = search.trim();

        lastSubmittedSearch.current = normalizedSearch;

        const params = {};

        if (normalizedSearch) {
            params.search = normalizedSearch;
        }

        router.get(route('reports.index'), params, {
            preserveState: true,
            preserveScroll: true,
            only: ['archives', 'filters'],
            replace: true,
            onStart: () => {
                spinnerTimeoutId = window.setTimeout(() => setIsSearching(true), 150);
            },
            onFinish: () => {
                window.clearTimeout(spinnerTimeoutId);
                setIsSearching(false);
            },
        });
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const normalizedQuery = searchQuery.trim();
            const currentSearch = lastSubmittedSearch.current;

            if (normalizedQuery !== currentSearch) {
                visitArchives(normalizedQuery);
            }
        }, 450);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, visitArchives]);

    const handleSearch = useCallback((e) => {
        setSearchQuery(e.target.value);
    }, []);

    const clearSearch = useCallback(() => {
        setSearchQuery('');
        visitArchives('');
    }, [visitArchives]);

    const handleDelete = (e) => {
        e.preventDefault();

        destroy(route('reports.destroy', deletingArchive.id), {
            onFinish: () => {
                setDeletingArchive(null);
            },
        });
    };

    const emptyState = archives.length === 0;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-5">
                    <div>
                        <div className="flex items-center gap-3">
                            <Archive className="w-5 h-5 text-text-primary" />
                            <h2 className="text-3xl font-semibold text-text-primary">Arsip Laporan</h2>
                        </div>
                        <p className="text-sm text-text-secondary">
                            Lihat, unduh ulang, dan hapus laporan PDF/CSV yang pernah Anda ekspor.
                        </p>
                    </div>

                    <SearchInput
                        value={searchQuery}
                        onChange={handleSearch}
                        onClear={clearSearch}
                        isLoading={isSearching}
                        placeholder="Cari nama file atau format..."
                        searchIcon={Search}
                        clearIcon={X}
                    />

                    <ResultsCount count={archives.length} label="arsip" />
                </div>
            }
        >
            <Head title="Arsip Laporan" />

            {flash.success && (
                <div className="mb-4 rounded-card border border-success/20 bg-success/5 px-4 py-3 text-sm text-success">
                    {flash.success}
                </div>
            )}

            {flash.error && (
                <div className="mb-4 rounded-card border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
                    {flash.error}
                </div>
            )}

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
                                                <th className="px-4 py-3 text-xs font-medium text-text-secondary tracking-wider border-b border-border">File</th>
                                                <th className="px-4 py-3 text-xs font-medium text-text-secondary tracking-wider border-b border-border">Format</th>
                                                <th className="px-4 py-3 text-xs font-medium text-text-secondary tracking-wider border-b border-border">Periode</th>
                                                <th className="px-4 py-3 text-xs font-medium text-text-secondary tracking-wider border-b border-border">Ukuran</th>
                                                <th className="px-4 py-3 text-xs font-medium text-text-secondary tracking-wider border-b border-border">Tanggal</th>
                                                <th className="px-4 py-3 text-xs font-medium text-text-secondary tracking-wider border-b border-border text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {archives.map((archive, index) => (
                                                <AnimatedTableRow key={archive.id} index={index}>
                                                    <TableCell className="font-medium text-text-primary">{archive.file_name}</TableCell>
                                                    <TableCell>
                                                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-button border ${formatBadgeClasses[archive.format]}`}>
                                                            {archive.format}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>{archive.period}</TableCell>
                                                    <TableCell>{formatSize(archive.file_size)}</TableCell>
                                                    <TableCell>{archive.created_at}</TableCell>
                                                    <TableCell align="right">
                                                        <TableActions>
                                                            <TableActionButton
                                                                icon={Download}
                                                                onClick={() => (window.location.href = route('reports.download', archive.id))}
                                                                title="Unduh arsip"
                                                            />
                                                            <TableActionButton
                                                                icon={Trash2}
                                                                color="danger"
                                                                onClick={() => setDeletingArchive(archive)}
                                                                disabled={processing && deletingArchive?.id === archive.id}
                                                                title="Hapus arsip"
                                                            />
                                                        </TableActions>
                                                    </TableCell>
                                                </AnimatedTableRow>
                                            ))}
                                        </tbody>
                                    </table>

                                    {emptyState && (
                                        <EmptyTableState
                                            icon={Archive}
                                            title="Belum ada arsip"
                                            description="Mulai ekspor laporan transaksi untuk menyimpan arsip di sini."
                                        />
                                    )}
                                </div>
                            </TableWrapper>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            <Modal show={!!deletingArchive} onClose={() => setDeletingArchive(null)}>
                <form onSubmit={handleDelete} className="p-6 bg-surface border border-border">
                    <h2 className="text-2xl font-medium text-danger flex items-center">
                        <Trash2 className="w-6 h-6 mr-2" /> Hapus Arsip?
                    </h2>
                    <p className="mt-4 text-sm text-text-secondary leading-relaxed">
                        Tindakan ini tidak dapat dibatalkan. File laporan yang tersimpan akan dihapus dari arsip Anda.
                    </p>
                    {deletingArchive && (
                        <div className="mt-5 rounded-button border border-border bg-background px-4 py-3">
                            <p className="text-sm font-medium text-text-primary truncate">{deletingArchive.file_name}</p>
                            <p className="mt-1 text-xs text-text-secondary">{deletingArchive.period}</p>
                        </div>
                    )}
                    <div className="mt-8 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setDeletingArchive(null)}>Batal</SecondaryButton>
                        <DangerButton disabled={processing}>Hapus Permanen</DangerButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
