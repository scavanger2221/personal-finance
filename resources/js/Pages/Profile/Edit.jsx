import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

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

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                    <div>
                        <h2 className="text-3xl font-display font-semibold text-gray-100 tracking-tight">
                            Profil
                        </h2>
                        <p className="mt-1 text-sm text-gray-400">Kelola pengaturan akun dan preferensi Anda.</p>
                    </div>
                </div>
            }
        >
            <Head title="Profil" />

            <div className="py-8">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="mx-auto max-w-4xl space-y-8 sm:px-6 lg:px-8"
                >
                    <motion.div variants={itemVariants} className="bg-surface border border-border p-4 shadow-sm sm:rounded-2xl sm:p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none" />
                        <div className="relative z-10">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-xl"
                            />
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-surface border border-border p-4 shadow-sm sm:rounded-2xl sm:p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />
                        <div className="relative z-10">
                            <UpdatePasswordForm className="max-w-xl" />
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-surface border border-border p-4 shadow-sm sm:rounded-2xl sm:p-8 relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/5 blur-[80px] rounded-full pointer-events-none" />
                        <div className="relative z-10">
                            <DeleteUserForm className="max-w-xl" />
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}
