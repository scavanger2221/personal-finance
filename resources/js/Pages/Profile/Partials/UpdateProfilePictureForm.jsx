import { Transition } from '@headlessui/react';
import { Camera, Trash2, User } from 'lucide-react';
import { useForm, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function UpdateProfilePictureForm({
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(null);

    const { setData, post, delete: destroy, errors, processing, recentlySuccessful, progress } =
        useForm({
            profile_picture: null,
        });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('profile_picture', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('profile.picture.update'), {
            forceFormData: true,
            onSuccess: () => {
                setPreview(null);
                setData('profile_picture', null);
            },
            onError: (errors) => {
                console.error('Upload error:', errors);
            },
        });
    };

    const handleDelete = () => {
        destroy(route('profile.picture.delete'));
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const profilePictureUrl = user.profile_picture_url;

    return (
        <section className={className}>
            <header>
                <h2 className="text-xl font-display font-medium text-text-primary">
                    Foto Profil
                </h2>

                <p className="mt-1 text-sm text-text-secondary">
                    Unggah foto profil untuk mempersonalisasi akun Anda.
                </p>
            </header>

            <div className="mt-6 flex items-start gap-6">
                {/* Profile Picture Display */}
                <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-surface-elevated border border-border overflow-hidden flex items-center justify-center">
                        {(preview || profilePictureUrl) ? (
                            <img
                                src={preview || profilePictureUrl}
                                alt={user.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User className="w-12 h-12 text-text-tertiary" />
                        )}
                    </div>
                    
                    {/* Hover overlay */}
                    <button
                        onClick={triggerFileInput}
                        className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Ubah foto"
                    >
                        <Camera className="w-6 h-6 text-white" />
                    </button>
                </div>

                {/* Upload Controls */}
                <div className="flex-1 space-y-4">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    {preview ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex items-center gap-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center px-4 py-2 bg-accent hover:bg-accent-hover text-background border border-transparent rounded-button font-medium text-sm transition-colors duration-200 disabled:opacity-50"
                                >
                                    {processing ? 'Mengunggah...' : 'Simpan Foto'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPreview(null);
                                        setData('profile_picture', null);
                                    }}
                                    className="inline-flex items-center px-4 py-2 bg-surface hover:bg-surface-elevated text-text-secondary border border-border rounded-button font-medium text-sm transition-colors duration-200"
                                >
                                    Batal
                                </button>
                            </div>
                            
                            {progress && (
                                <div className="w-full bg-surface-elevated rounded-full h-2">
                                    <div
                                        className="bg-accent h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${progress.percentage}%` }}
                                    />
                                </div>
                            )}
                        </form>
                    ) : (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={triggerFileInput}
                                className="inline-flex items-center px-4 py-2 bg-surface hover:bg-surface-elevated text-text-secondary border border-border rounded-button font-medium text-sm transition-colors duration-200"
                            >
                                <Camera className="w-4 h-4 mr-2" />
                                Pilih Foto
                            </button>
                            
                            {profilePictureUrl && (
                                <button
                                    onClick={handleDelete}
                                    disabled={processing}
                                    className="inline-flex items-center px-4 py-2 text-danger hover:bg-danger/10 border border-transparent rounded-button font-medium text-sm transition-colors duration-200"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Hapus
                                </button>
                            )}
                        </div>
                    )}

                    {errors.profile_picture && (
                        <div className="p-3 bg-danger/10 border border-danger/20 rounded-lg">
                            <p className="text-sm text-danger flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                {errors.profile_picture}
                            </p>
                        </div>
                    )}

                    <p className="text-xs text-text-tertiary">
                        Format yang didukung: JPEG, PNG, JPG, GIF. Maksimal 2MB.
                    </p>

                    <Transition
                        show={recentlySuccessful || status}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-success">{status}</p>
                    </Transition>
                </div>
            </div>
        </section>
    );
}
