import React from 'react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Select from '@/Components/Select';

export default function CategoryForm({ category = null, onSuccess }) {
    const isEditing = !!category;
    
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: category?.name || '',
        type: category?.type || 'expense',
    });

    const submit = (e) => {
        e.preventDefault();
        
        if (isEditing) {
            put(route('categories.update', category.id), {
                onSuccess: () => {
                    reset();
                    onSuccess?.();
                },
            });
        } else {
            post(route('categories.store'), {
                onSuccess: () => {
                    reset();
                    onSuccess?.();
                },
            });
        }
    };

    const typeOptions = [
        { value: 'expense', label: 'Pengeluaran' },
        { value: 'income', label: 'Pendapatan' },
    ];

    return (
        <form onSubmit={submit} className="space-y-6">
            <div>
                <InputLabel htmlFor="name" value="Nama Kategori" className="text-gray-300 font-medium" />
                <TextInput
                    id="name"
                    className="mt-1.5 block w-full py-3"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                    isFocused
                />
                <InputError message={errors.name} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="type" value="Tipe" className="text-gray-300 font-medium" />
                <Select
                    value={data.type}
                    onChange={(value) => setData('type', value)}
                    options={typeOptions}
                    className="mt-1.5"
                />
                <InputError message={errors.type} className="mt-2" />
            </div>

            <div className="flex items-center gap-4 pt-4">
                <PrimaryButton disabled={processing} className="px-6">
                    {isEditing ? 'Perbarui Kategori' : 'Buat Kategori'}
                </PrimaryButton>
                
                {onSuccess && (
                    <SecondaryButton onClick={onSuccess}>
                        Batal
                    </SecondaryButton>
                )}
            </div>
        </form>
    );
}
