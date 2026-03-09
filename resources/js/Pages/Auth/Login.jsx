import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Masuk" />

            <div className="text-center mb-8">
                <h2 className="text-3xl font-display font-bold text-white tracking-tight">Selamat Datang</h2>
                <p className="text-gray-400 mt-2 text-sm">Masuk untuk mengelola keuangan Anda.</p>
            </div>

            {status && <div className="mb-4 font-medium text-sm text-emerald-400 p-3 bg-emerald-500/10 rounded-lg">{status}</div>}

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="email" value="Email" className="text-gray-300 font-medium" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1.5 block w-full py-3"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <div className="flex justify-between items-center mt-4">
                        <InputLabel htmlFor="password" value="Kata Sandi" className="text-gray-300 font-medium" />
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm font-medium text-indigo-400 hover:text-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-indigo-500 transition-colors"
                            >
                                Lupa sandi?
                            </Link>
                        )}
                    </div>

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1.5 block w-full py-3"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="block mt-4">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="bg-surfaceHighlight border-border text-indigo-500 rounded focus:ring-indigo-500/50"
                        />
                        <span className="ml-2 text-sm text-gray-400">Ingat saya</span>
                    </label>
                </div>

                <div className="flex items-center justify-end mt-8">
                    <PrimaryButton className="w-full justify-center py-3.5 text-base font-semibold shadow-[0_0_20px_rgba(99,102,241,0.2)]" disabled={processing}>
                        Masuk
                    </PrimaryButton>
                </div>
                
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-500">
                        Belum punya akun?{' '}
                        <Link href={route('register')} className="text-indigo-400 hover:text-indigo-300 font-medium">
                            Daftar di sini
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}