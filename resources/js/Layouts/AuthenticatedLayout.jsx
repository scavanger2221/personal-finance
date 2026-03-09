import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Receipt, PieChart, Settings, LogOut, Menu, X, Hexagon } from 'lucide-react';
import Dropdown from '@/Components/Dropdown';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Dasbor', href: route('dashboard'), icon: LayoutDashboard, current: route().current('dashboard') },
        { name: 'Transaksi', href: route('transactions.index'), icon: Receipt, current: route().current('transactions.*') },
        { name: 'Kategori', href: route('categories.index'), icon: PieChart, current: route().current('categories.*') },
    ];

    return (
        <div className="min-h-screen bg-background text-gray-200 font-sans flex overflow-hidden">
            
            {/* Mobile sidebar backdrop */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.div
                initial={false}
                animate={{ x: sidebarOpen ? 0 : -300 }}
                className="fixed inset-y-0 left-0 z-50 w-72 bg-surface/50 border-r border-border backdrop-blur-xl lg:static lg:translate-x-0 flex flex-col transition-transform duration-300 ease-in-out"
                style={{
                    transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
                }}
            >
                {/* Mobile logic override via CSS for desktop */}
                <style>{`
                    @media (min-width: 1024px) {
                        .lg\\:static { position: static !important; transform: translateX(0) !important; }
                        .lg\\:hidden { display: none !important; }
                    }
                `}</style>
                
                <div className="h-16 flex items-center px-8 border-b border-border/50">
                    <Link href="/" className="flex items-center gap-3 text-white group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)] group-hover:shadow-[0_0_25px_rgba(99,102,241,0.7)] transition-shadow">
                            <Hexagon className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-display font-bold text-xl tracking-tight">Aura</span>
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-4">Menu Utama</div>
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                    item.current
                                        ? 'bg-white/10 text-white font-medium shadow-sm border border-white/5'
                                        : 'text-gray-400 hover:text-gray-100 hover:bg-white/5'
                                }`}
                            >
                                <Icon size={18} className={item.current ? 'text-indigo-400' : 'text-gray-500'} />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-border/50">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-left group">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center text-sm font-medium text-white border border-gray-500">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-200 truncate group-hover:text-white transition-colors">{user.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                </div>
                            </button>
                        </Dropdown.Trigger>

                        <Dropdown.Content align="top" width="48" contentClasses="py-1 bg-[#111111] border border-[#222222] shadow-2xl rounded-xl">
                            <div className="px-4 py-2 border-b border-[#222222] mb-1">
                                <p className="text-sm text-white font-medium truncate">{user.name}</p>
                            </div>
                            <Dropdown.Link href={route('profile.edit')} className="text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2 px-4 py-2 text-sm rounded-md mx-1">
                                <Settings size={14} /> Pengaturan Profil
                            </Dropdown.Link>
                            <Dropdown.Link href={route('logout')} method="post" as="button" className="text-gray-300 hover:bg-rose-500/10 hover:text-rose-500 flex items-center gap-2 px-4 py-2 text-sm rounded-md mx-1 w-[calc(100%-8px)]">
                                <LogOut size={14} /> Keluar
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </motion.div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
                {/* Topbar (Mobile mainly, but provides header slot on desktop) */}
                <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 lg:h-auto lg:py-6 lg:border-none lg:bg-transparent lg:backdrop-blur-none">
                    <div className="flex items-center lg:hidden">
                        <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-gray-400 hover:text-white">
                            <Menu size={24} />
                        </button>
                        <span className="ml-3 font-display font-bold text-lg text-white">Aura</span>
                    </div>
                    <div className="hidden lg:block w-full">
                        {header}
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="lg:hidden mb-6">
                        {header}
                    </div>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={route().current()}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="h-full"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}