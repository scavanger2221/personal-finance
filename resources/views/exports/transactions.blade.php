<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Transaction Report</title>
    <style>
        body { font-family: sans-serif; }
        .header { margin-bottom: 20px; }
        .summary { margin-bottom: 20px; padding: 10px; background: #f4f4f4; }
        .table { width: 100%; border-collapse: collapse; }
        .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .table th { background-color: #f2f2f2; }
        .income { color: green; }
        .expense { color: red; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Laporan Transaksi</h1>
        <p>Periode: {{ $reportData->fromDate ?? 'Semua' }} sampai {{ $reportData->toDate ?? 'Semua' }}</p>
    </div>

    <div class="summary">
        <p>Total Pendapatan: {{ number_format($reportData->totalIncome, 2, ',', '.') }}</p>
        <p>Total Pengeluaran: {{ number_format($reportData->totalExpense, 2, ',', '.') }}</p>
        <p>Saldo Bersih: {{ number_format($reportData->netBalance, 2, ',', '.') }}</p>
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>Tanggal</th>
                <th>Kategori</th>
                <th>Keterangan</th>
                <th>Tipe</th>
                <th>Jumlah</th>
            </tr>
        </thead>
        <tbody>
            @foreach($reportData->transactions as $transaction)
                <tr>
                    <td>{{ $transaction->transaction_date->format('d-m-Y') }}</td>
                    <td>{{ $transaction->category->name }}</td>
                    <td>{{ $transaction->description }}</td>
                    <td>{{ $transaction->category->type->value === 'income' ? 'Pendapatan' : 'Pengeluaran' }}</td>
                    <td class="{{ $transaction->category->type->value === 'income' ? 'income' : 'expense' }}">
                        {{ number_format($transaction->amount, 2, ',', '.') }}
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
