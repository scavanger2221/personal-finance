<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $query = Category::forUser(Auth::id())
            ->withCount('transactions');

        // Search
        if (request()->has('search') && request()->search) {
            $search = request()->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                    ->orWhere('type', 'ilike', "%{$search}%");
            });
        }

        // Sorting
        $sortField = request()->input('sort', 'name');
        $sortDirection = request()->input('direction', 'asc');

        $allowedSorts = ['name', 'type', 'transactions_count'];
        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortDirection === 'desc' ? 'desc' : 'asc');
        } else {
            $query->orderBy('name');
        }

        $categories = $query->get();

        return Inertia::render('Categories/Index', [
            'categories' => $categories,
            'filters' => request()->only(['search', 'sort', 'direction']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        $request->user()->categories()->create($request->validated());

        return redirect()->route('categories.index')
            ->with('success', 'Kategori berhasil dibuat.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, $id): RedirectResponse
    {
        $category = Category::findOrFail($id);
        $this->authorize('update', $category);

        $category->update($request->validated());

        return redirect()->route('categories.index')
            ->with('success', 'Kategori berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id): RedirectResponse
    {
        $category = Category::findOrFail($id);
        $this->authorize('delete', $category);

        $category->delete();

        return redirect()->route('categories.index')
            ->with('success', 'Kategori berhasil dihapus.');
    }
}
