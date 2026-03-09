import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, Receipt, PieChart, Settings, LogOut, Menu, X } from 'lucide-react';
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
        <div className="min-h-screen bg-background text-text-secondary font-sans flex overflow-hidden">
            
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-black/80 lg:hidden transition-opacity duration-200"
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-60 bg-background border-r border-border lg:static lg:translate-x-0 flex flex-col transition-transform duration-200 ease-standard ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                <div className="h-16 flex items-center px-6 border-b border-border">
                    <Link href="/" className="flex items-center gap-3 text-text-primary">
                        <span className="font-display font-bold text-2xl tracking-tight text-text-primary">Perfinn.</span>
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-text-secondary hover:text-text-primary transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    <div className="text-xs font-medium text-text-tertiary mb-3 px-3">Menu Utama</div>
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-button transition-colors duration-200 ${
                                    item.current
                                        ? 'bg-surface-elevated text-text-primary font-medium border border-border'
                                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
                                }`}
                            >
                                <Icon size={18} className={item.current ? 'text-text-primary' : 'text-text-tertiary'} />
                                <span className="text-sm">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>

                <div className="p-3 border-t border-border">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-button hover:bg-surface-elevated transition-colors text-left">
                                <div className="w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center text-sm font-medium text-text-primary border border-border">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-text-primary truncate">{user.name}</p>
                                    <p className="text-xs text-text-tertiary truncate">{user.email}</p>
                                </div>
                            </button>
                        </Dropdown.Trigger>

                        <Dropdown.Content align="right" position="top" width="48" contentClasses="py-1 bg-surface border border-border rounded-card">
                            <div className="px-3 py-2 border-b border-border mb-1">
                                <p className="text-sm text-text-primary font-medium truncate">{user.name}</p>
                            </div>
                            <Dropdown.Link href={route('profile.edit')} className="text-text-secondary hover:bg-surface-elevated hover:text-text-primary flex items-center gap-2 px-3 py-2 text-sm rounded-button mx-1">
                                <Settings size={14} /> Pengaturan Profil
                            </Dropdown.Link>
                            <Dropdown.Link href={route('logout')} method="post" as="button" className="text-text-secondary hover:bg-surface-elevated hover:text-danger flex items-center gap-2 px-3 py-2 text-sm rounded-button mx-1 w-[calc(100%-8px)]">
                                <LogOut size={14} /> Keluar
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
                {/* Topbar (Mobile mainly, but provides header slot on desktop) */}
                <header className="sticky top-0 z-30 bg-background border-b border-border lg:border-none flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 lg:h-auto lg:py-6">
                    <div className="flex items-center lg:hidden">
                        <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-text-secondary hover:text-text-primary transition-colors">
                            <Menu size={24} />
                        </button>
                        <span className="ml-3 font-display font-bold text-xl tracking-tight text-text-primary">Perfinn.</span>
                    </div>
                    <div className="hidden lg:block w-full">
                        {header}
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="lg:hidden mb-6">
                        {header}
                    </div>
                    <div className="h-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}