<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Avatar;
use App\Models\AvatarImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AvatarController extends Controller
{
    /**
     * Display a listing of avatars for public catalog or admin.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Avatar::with(['categories', 'images']);

        // Status filter: public users only see published
        if (!$request->boolean('all_status')) {
            $query->where('status', 'published');
        } elseif ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        // Search by name or description
        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('badge', 'like', "%{$search}%");
            });
        }

        // Filter by category slug or ID
        if ($request->filled('category') && $request->query('category') !== 'all' && $request->query('category') !== 'Semua') {
            $cat = $request->query('category');
            $query->whereHas('categories', function ($q) use ($cat) {
                $q->where('slug', $cat)
                  ->orWhere('categories.id', $cat)
                  ->orWhere('categories.name', $cat);
            });
        }

        // Filter by featured
        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        // Filter by price range
        if ($request->filled('min_price')) {
            $query->where('starting_price', '>=', (int) $request->query('min_price'));
        }
        if ($request->filled('max_price')) {
            $query->where('starting_price', '<=', (int) $request->query('max_price'));
        }

        // Sorting
        $sort = $request->query('sort', 'newest');
        switch ($sort) {
            case 'price_asc':
                $query->orderBy('starting_price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('starting_price', 'desc');
                break;
            case 'popular':
                $query->orderBy('views_count', 'desc');
                break;
            case 'newest':
            default:
                $query->orderBy('id', 'desc');
                break;
        }

        $perPage = min((int) $request->query('per_page', 12), 50);
        $avatars = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $avatars->items(),
            'meta' => [
                'current_page' => $avatars->currentPage(),
                'last_page' => $avatars->lastPage(),
                'per_page' => $avatars->perPage(),
                'total' => $avatars->total(),
            ],
        ]);
    }

    /**
     * Display the specified avatar by slug or ID.
     */
    public function show($identifier): JsonResponse
    {
        $avatar = Avatar::with(['categories', 'images'])
            ->where(function ($q) use ($identifier) {
                if (is_numeric($identifier)) {
                    $q->where('id', $identifier)->orWhere('slug', $identifier);
                } else {
                    $q->where('slug', $identifier);
                }
            })
            ->firstOrFail();

        // Increment views count
        $avatar->increment('views_count');

        // Fetch related avatars
        $categoryIds = $avatar->categories->pluck('id')->toArray();
        $related = Avatar::with('categories')
            ->where('id', '!=', $avatar->id)
            ->where('status', 'published')
            ->whereHas('categories', function ($q) use ($categoryIds) {
                $q->whereIn('categories.id', $categoryIds);
            })
            ->limit(4)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $avatar,
            'related' => $related,
        ]);
    }

    /**
     * Store a newly created avatar.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'description' => 'required|string',
            'starting_price' => 'required|numeric|min:0',
            'badge' => 'nullable|string|max:50',
            'is_featured' => 'nullable|boolean',
            'status' => 'nullable|in:published,draft',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:categories,id',
            'cover_image' => 'nullable|max:51200',
            'gallery_images.*' => 'nullable|max:51200',
        ]);

        $slug = Str::slug($validated['name']);
        $originalSlug = $slug;
        $counter = 1;
        while (Avatar::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$counter}";
            $counter++;
        }

        $coverPath = null;
        if ($request->hasFile('cover_image')) {
            $coverPath = $request->file('cover_image')->store('avatars/covers', 'public');
            $coverPath = Storage::url($coverPath);
        }

        $avatar = Avatar::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'],
            'starting_price' => (int) $validated['starting_price'],
            'badge' => $validated['badge'] ?? null,
            'is_featured' => $request->boolean('is_featured'),
            'status' => $validated['status'] ?? 'published',
            'cover_image' => $coverPath,
        ]);

        if (!empty($validated['category_ids'])) {
            $avatar->categories()->sync($validated['category_ids']);
        }

        if ($request->hasFile('gallery_images')) {
            $order = 0;
            foreach ($request->file('gallery_images') as $file) {
                $path = $file->store('avatars/gallery', 'public');
                $avatar->images()->create([
                    'image_path' => Storage::url($path),
                    'sort_order' => $order++,
                ]);
            }
        }

        $avatar->load(['categories', 'images']);

        return response()->json([
            'success' => true,
            'message' => 'Avatar berhasil dibuat!',
            'data' => $avatar,
        ], 201);
    }

    /**
     * Update the specified avatar.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $avatar = Avatar::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'description' => 'required|string',
            'starting_price' => 'required|numeric|min:0',
            'badge' => 'nullable|string|max:50',
            'is_featured' => 'nullable|boolean',
            'status' => 'nullable|in:published,draft',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:categories,id',
            'cover_image' => 'nullable|max:51200',
            'gallery_images.*' => 'nullable|max:51200',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'description' => $validated['description'],
            'starting_price' => (int) $validated['starting_price'],
            'badge' => $validated['badge'] ?? null,
            'is_featured' => $request->boolean('is_featured'),
            'status' => $validated['status'] ?? $avatar->status,
        ];

        if ($request->hasFile('cover_image')) {
            $coverPath = $request->file('cover_image')->store('avatars/covers', 'public');
            $updateData['cover_image'] = Storage::url($coverPath);
        }

        $avatar->update($updateData);

        if (isset($validated['category_ids'])) {
            $avatar->categories()->sync($validated['category_ids']);
        }

        if ($request->hasFile('gallery_images')) {
            $lastOrder = $avatar->images()->max('sort_order') ?? 0;
            foreach ($request->file('gallery_images') as $file) {
                $lastOrder++;
                $path = $file->store('avatars/gallery', 'public');
                $avatar->images()->create([
                    'image_path' => Storage::url($path),
                    'sort_order' => $lastOrder,
                ]);
            }
        }

        $avatar->load(['categories', 'images']);

        return response()->json([
            'success' => true,
            'message' => 'Avatar berhasil diperbarui!',
            'data' => $avatar,
        ]);
    }

    /**
     * Remove the specified avatar.
     */
    public function destroy($id): JsonResponse
    {
        $avatar = Avatar::findOrFail($id);
        $avatar->categories()->detach();
        $avatar->images()->delete();
        $avatar->delete();

        return response()->json([
            'success' => true,
            'message' => 'Avatar berhasil dihapus!',
        ]);
    }

    /**
     * Delete a single gallery image.
     */
    public function deleteImage($imageId): JsonResponse
    {
        $image = AvatarImage::findOrFail($imageId);
        $image->delete();

        return response()->json([
            'success' => true,
            'message' => 'Foto galeri berhasil dihapus!',
        ]);
    }
}
