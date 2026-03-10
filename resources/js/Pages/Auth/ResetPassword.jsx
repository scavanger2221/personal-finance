import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';

const breathe = {
    scale: [1, 1.15, 1],
    transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
    }
};

const breatheDelayed = {
    scale: [1, 1.1, 1],
    transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1
    }
};

const breatheSlow = {
    scale: [1, 1.2, 1],
    transition: {
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.5
    }
};

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Atur Ulang Kata Sandi" />

            <div className="min-h-screen flex">
                {/* Left Side - Brand/Visual */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-surface">
                        {/* Grid Pattern */}
                        <div 
                            className="absolute inset-0 opacity-[0.03]"
                            style={{
                                backgroundImage: `
                                    linear-gradient(to right, #FAFAFA 1px, transparent 1px),
                                    linear-gradient(to bottom, #FAFAFA 1px, transparent 1px)
                                `,
                                backgroundSize: '60px 60px'
                            }}
                        />
                        
                        {/* Geometric Accent */}
                        <motion.div 
                            animate={{ opacity: 1, ...breathe }}
                            className="absolute top-1/4 left-1/4 w-96 h-96 border border-border rounded-full"
                        />
                        <motion.div 
                            animate={{ opacity: 1, ...breatheDelayed }}
                            className="absolute top-1/3 left-1/3 w-64 h-64 border border-border rounded-full"
                        />
                        <motion.div 
                            animate={{ opacity: 1, ...breatheSlow }}
                            className="absolute bottom-1/4 right-1/4 w-80 h-80 border border-border rounded-full"
                        />
                        
                        {/* Accent Line */}
                        <motion.div 
                            animate={{ scaleY: 1 }}
                            className="absolute left-12 top-0 bottom-0 w-px bg-border"
                        />
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10 flex flex-col justify-between p-16">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <Link href="/" className="inline-block">
                                <span className="text-xl font-semibold tracking-tight text-text-primary">
                                    Perfinn.
                                </span>
                            </Link>
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            className="max-w-sm"
                        >
                            <blockquote className="text-2xl font-light text-text-primary leading-relaxed tracking-tight">
                                &quot;Keamanan baru, awal baru untuk keuangan yang lebih baik.&quot;
                            </blockquote>
                            <p className="mt-4 text-sm text-text-tertiary">
                                — Buat kata sandi yang kuat untuk melindungi akun Anda
                            </p>
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="flex items-center gap-6 text-xs text-text-tertiary"
                        >
                            <span>2025</span>
                            <span className="w-1 h-1 rounded-full bg-text-tertiary" />
                            <span>Personal Finance</span>
                        </motion.div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-20 xl:px-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full max-w-md mx-auto lg:mx-0"
                    >
                        {/* Mobile Logo */}
                        <div className="lg:hidden mb-12">
                            <Link href="/" className="inline-block">
                                <span className="text-xl font-semibold tracking-tight text-text-primary">
                                    Perfinn.
                                </span>
                            </Link>
                        </div>

                        <div className="mb-10">
                            <motion.h1 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="text-3xl font-semibold text-text-primary tracking-tight"
                            >
                                Atur ulang kata sandi
                            </motion.h1>
                            <motion.p 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.15 }}
                                className="mt-3 text-text-secondary text-[15px] leading-relaxed"
                            >
                                Buat kata sandi baru yang kuat untuk akun Anda.
                            </motion.p>
                        </div>

                        <motion.form 
                            onSubmit={submit} 
                            className="space-y-5"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div>
                                <InputLabel htmlFor="email" value="Alamat email" className="text-sm font-medium text-text-secondary mb-2" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full py-3 px-4 bg-background border-border focus:border-text-tertiary focus:ring-0 transition-colors"
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value="Kata sandi baru" className="text-sm font-medium text-text-secondary mb-2" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full py-3 px-4 bg-background border-border focus:border-text-tertiary focus:ring-0 transition-colors"
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                    isFocused={true}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password_confirmation" value="Konfirmasi kata sandi" className="text-sm font-medium text-text-secondary mb-2" />
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="mt-1 block w-full py-3 px-4 bg-background border-border focus:border-text-tertiary focus:ring-0 transition-colors"
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password_confirmation} className="mt-2" />
                            </div>

                            <div className="pt-2">
                                <PrimaryButton 
                                    className="w-full justify-center py-3.5 text-sm font-medium tracking-wide" 
                                    disabled={processing}
                                >
                                    {processing ? 'Memproses...' : 'Atur Ulang Kata Sandi'}
                                </PrimaryButton>
                            </div>
                        </motion.form>

                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="mt-10 pt-8 border-t border-border"
                        >
                            <p className="text-center text-sm text-text-tertiary">
                                Ingat kata sandi Anda?{' '}
                                <Link 
                                    href={route('login')} 
                                    className="text-text-primary hover:text-accent transition-colors duration-fast font-medium"
                                >
                                    Masuk di sini
                                </Link>
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </GuestLayout>
    );
}
