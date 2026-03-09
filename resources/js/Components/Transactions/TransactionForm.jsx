import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Select from '@/Components/Select';
import { formatRupiahInput, parseRupiahInput } from '@/lib/currency';

export default function TransactionForm({ transaction = null, categories, onSuccess }) {
    const isEditing = !!transaction;

    const formatDateForInput = (dateString) => {
        if (!dateString) return new Date().toISOString().split('T')[0];
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const { data, setData, post, put, processing, errors, reset } = useForm({
        category_id: transaction?.category_id || (categories.length > 0 ? categories[0].id : ''),
        amount: transaction?.amount || '',
        description: transaction?.description || '',
        transaction_date: formatDateForInput(transaction?.transaction_date),
    });

    const [amountDisplay, setAmountDisplay] = useState(() => formatRupiahInput(transaction?.amount || ''));

    const handleAmountChange = (e) => {
        const rawValue = parseRupiahInput(e.target.value);
        setData('amount', rawValue);
        setAmountDisplay(formatRupiahInput(rawValue));
    };

    const handleAmountBlur = () => {
        // Ensure proper format when leaving the field
        setAmountDisplay(formatRupiahInput(data.amount));
    };

    const handleAmountFocus = () => {
        // Clear display if amount is 0 or empty
        if (!data.amount || data.amount === '0') {
            setAmountDisplay('');
        }
    };

    const submit = (e) => {
        e.preventDefault();
        
        if (isEditing) {
            put(route('transactions.update', transaction.id), {
                onSuccess: () => {
                    reset();
                    setAmountDisplay('');
                    onSuccess?.();
                },
            });
        } else {
            post(route('transactions.store'), {
                onSuccess: () => {
                    reset();
                    setAmountDisplay('');
                    onSuccess?.();
                },
            });
        }
    };

    const categoryOptions = categories.map((category) => ({
        value: category.id,
        label: `${category.name} (${category.type === 'income' ? 'Pendapatan' : 'Pengeluaran'})`
    }));

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <InputLabel htmlFor="category_id" value="Kategori" className="text-gray-300 font-medium" />
                    <Select
                        value={data.category_id}
                        onChange={(value) => setData('category_id', value)}
                        options={categoryOptions}
                        placeholder="Pilih Kategori"
                        className="mt-1.5"
                    />
                    <InputError message={errors.category_id} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="amount" value="Jumlah" className="text-gray-300 font-medium" />
                    <TextInput
                        id="amount"
                        type="text"
                        inputMode="numeric"
                        className="mt-1.5 block w-full py-3"
                        value={amountDisplay}
                        onChange={handleAmountChange}
                        onBlur={handleAmountBlur}
                        onFocus={handleAmountFocus}
                        placeholder="Rp0"
                        required
                    />
                    <InputError message={errors.amount} className="mt-2" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <InputLabel htmlFor="transaction_date" value="Tanggal" className="text-gray-300 font-medium" />
                    <TextInput
                        id="transaction_date"
                        type="date"
                        className="mt-1.5 block w-full py-3 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                        value={data.transaction_date}
                        onChange={(e) => setData('transaction_date', e.target.value)}
                        required
                    />
                    <InputError message={errors.transaction_date} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="description" value="Keterangan" className="text-gray-300 font-medium" />
                    <TextInput
                        id="description"
                        className="mt-1.5 block w-full py-3"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                    />
                    <InputError message={errors.description} className="mt-2" />
                </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
                <PrimaryButton disabled={processing} className="px-6">
                    {isEditing ? 'Perbarui Transaksi' : 'Catat Transaksi'}
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
