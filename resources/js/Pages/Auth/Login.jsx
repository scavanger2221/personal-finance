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
                <h2 className="text-2xl font-semibold text-text-primary tracking-tight">Selamat Datang</h2>
                <p className="text-text-secondary mt-2 text-sm">Masuk untuk mengelola keuangan Anda.</p>
            </div>

            {status && <div className="mb-4 font-medium text-sm text-success p-3 bg-success/10 rounded-lg">{status}</div>}

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="email" value="Email" />

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
                        <InputLabel htmlFor="password" value="Kata Sandi" />
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm text-text-tertiary hover:text-text-primary transition-colors"
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
                        />
                        <span className="ml-2 text-sm text-text-secondary">Ingat saya</span>
                    </label>
                </div>

                <div className="flex items-center justify-end mt-8">
                    <PrimaryButton className="w-full justify-center py-3" disabled={processing}>
                        Masuk
                    </PrimaryButton>
                </div>
                
                <div className="text-center mt-6">
                    <p className="text-sm text-text-secondary">
                        Belum punya akun?{' '}
                        <Link href={route('register')} className="text-text-primary hover:text-accent transition-colors font-medium">
                            Daftar di sini
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}