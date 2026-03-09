import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-background text-text-primary relative">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
                <Link href="/">
                    <ApplicationLogo className="w-16 h-16 fill-current text-text-primary" />
                </Link>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="w-full sm:max-w-md mt-8 px-8 py-10 bg-surface border border-border overflow-hidden sm:rounded-card"
            >
                {children}
            </motion.div>
        </div>
    );
}
