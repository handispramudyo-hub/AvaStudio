<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    /**
     * Display a listing of active categories for public website.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Category::query();

        // If not requesting admin scope, only show active ones
        if (!$request->boolean('all')) {
            $query->where('is_active', true);
        }

        $categories = $query->withCount('avatars')
            ->orderBy('sort_order', 'asc')
            ->orderBy('name', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    /**
     * Store a newly created category in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
            'thumbnail' => 'nullable|max:25600',
        ]);

        $slug = Str::slug($validated['name']);
        $originalSlug = $slug;
        $counter = 1;
        while (Category::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$counter}";
            $counter++;
        }

        $thumbnailPath = null;
        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('categories', 'public');
            $thumbnailPath = Storage::url($thumbnailPath);
        }

        $category = Category::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'thumbnail' => $thumbnailPath,
            'is_active' => $request->has('is_active') ? $request->boolean('is_active') : true,
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Kategori berhasil ditambahkan!',
            'data' => $category,
        ], 201);
    }

    /**
     * Display the specified category.
     */
    public function show($id): JsonResponse
    {
        $category = Category::withCount('avatars')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $category,
        ]);
    }

    /**
     * Update the specified category.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
            'thumbnail' => 'nullable|max:25600',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'is_active' => $request->has('is_active') ? $request->boolean('is_active') : $category->is_active,
            'sort_order' => $validated['sort_order'] ?? $category->sort_order,
        ];

        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('categories', 'public');
            $updateData['thumbnail'] = Storage::url($thumbnailPath);
        }

        $category->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Kategori berhasil diperbarui!',
            'data' => $category,
        ]);
    }

    /**
     * Remove the specified category.
     */
    public function destroy($id): JsonResponse
    {
        $category = Category::findOrFail($id);
        $category->avatars()->detach();
        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Kategori berhasil dihapus!',
        ]);
    }
}
