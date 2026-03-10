<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Models\Category;
use App\Models\Transaction;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $query = Transaction::forUser(Auth::id())
            ->with('category');

        if (request()->has('search') && request()->search) {
            $search = request()->search;
            $query->where(function ($q) use ($search) {
                $q->where('description', 'ilike', "%{$search}%")
                    ->orWhereHas('category', function ($cat) use ($search) {
                        $cat->where('name', 'ilike', "%{$search}%");
                    });
            });
        }

        // Sorting
        $sortField = request()->input('sort', 'transaction_date');
        $sortDirection = request()->input('direction', 'desc');

        $allowedSorts = ['transaction_date', 'amount', 'description'];
        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortDirection === 'asc' ? 'asc' : 'desc');
        } else {
            $query->latestFirst();
        }

        $transactions = $query->paginate(10)->withQueryString();

        $categories = Category::forUser(Auth::id())->get();

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
            'categories' => $categories,
            'filters' => request()->only(['search', 'sort', 'direction']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTransactionRequest $request): RedirectResponse
    {
        $request->user()->transactions()->create($request->validated());

        return redirect()->route('transactions.index')
            ->with('success', 'Transaksi berhasil dicatat.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTransactionRequest $request, $id): RedirectResponse
    {
        $transaction = Transaction::findOrFail($id);
        $this->authorize('update', $transaction);

        $transaction->update($request->validated());

        return redirect()->route('transactions.index')
            ->with('success', 'Transaksi berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id): RedirectResponse
    {
        $transaction = Transaction::findOrFail($id);
        $this->authorize('delete', $transaction);

        $transaction->delete();

        return redirect()->route('transactions.index')
            ->with('success', 'Transaksi berhasil dihapus.');
    }
}
