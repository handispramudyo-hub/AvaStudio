<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TestimonialController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Testimonial::query();

        if (!$request->boolean('all')) {
            $query->where('is_active', true);
        }

        $testimonials = $query->orderBy('sort_order', 'asc')
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $testimonials,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:100',
            'roblox_username' => 'nullable|string|max:100',
            'content' => 'required|string|max:1000',
            'rating' => 'nullable|integer|min:1|max:5',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('testimonials', 'public');
            $imagePath = Storage::url($path);
        }

        $testimonial = Testimonial::create([
            'customer_name' => $validated['customer_name'],
            'roblox_username' => $validated['roblox_username'] ?? null,
            'content' => $validated['content'],
            'rating' => $validated['rating'] ?? 5,
            'image_path' => $imagePath,
            'is_active' => $request->has('is_active') ? $request->boolean('is_active') : true,
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Testimoni berhasil ditambahkan!',
            'data' => $testimonial,
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $testimonial = Testimonial::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $testimonial,
        ]);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $testimonial = Testimonial::findOrFail($id);

        $validated = $request->validate([
            'customer_name' => 'required|string|max:100',
            'roblox_username' => 'nullable|string|max:100',
            'content' => 'required|string|max:1000',
            'rating' => 'nullable|integer|min:1|max:5',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $updateData = [
            'customer_name' => $validated['customer_name'],
            'roblox_username' => $validated['roblox_username'] ?? null,
            'content' => $validated['content'],
            'rating' => $validated['rating'] ?? $testimonial->rating,
            'is_active' => $request->has('is_active') ? $request->boolean('is_active') : $testimonial->is_active,
            'sort_order' => $validated['sort_order'] ?? $testimonial->sort_order,
        ];

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('testimonials', 'public');
            $updateData['image_path'] = Storage::url($path);
        }

        $testimonial->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Testimoni berhasil diperbarui!',
            'data' => $testimonial,
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $testimonial = Testimonial::findOrFail($id);
        $testimonial->delete();

        return response()->json([
            'success' => true,
            'message' => 'Testimoni berhasil dihapus!',
        ]);
    }
}
