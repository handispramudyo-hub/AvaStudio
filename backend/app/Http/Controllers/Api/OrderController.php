<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Avatar;
use App\Models\Order;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Submit a new customer order.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:100',
            'roblox_username' => 'required|string|max:100',
            'whatsapp' => 'required|string|max:30',
            'avatar_id' => 'nullable|exists:avatars,id',
            'requested_style' => 'nullable|string|max:150',
            'budget' => 'nullable|numeric|min:0',
            'request_notes' => 'nullable|string|max:1000',
        ]);

        // Generate unique order number
        $dateStr = date('Ymd');
        $randomSeq = str_pad(mt_rand(1, 9999), 4, '0', STR_PAD_LEFT);
        $orderNumber = "AVA-{$dateStr}-{$randomSeq}";
        while (Order::where('order_number', $orderNumber)->exists()) {
            $randomSeq = str_pad(mt_rand(1, 9999), 4, '0', STR_PAD_LEFT);
            $orderNumber = "AVA-{$dateStr}-{$randomSeq}";
        }

        $order = Order::create([
            'order_number' => $orderNumber,
            'customer_name' => $validated['customer_name'],
            'roblox_username' => $validated['roblox_username'],
            'whatsapp' => $validated['whatsapp'],
            'avatar_id' => $validated['avatar_id'] ?? null,
            'requested_style' => $validated['requested_style'] ?? null,
            'budget' => isset($validated['budget']) ? (int) $validated['budget'] : null,
            'request_notes' => $validated['request_notes'] ?? null,
            'status' => 'pending',
            'admin_notes' => 'Pesanan baru masuk dari website',
        ]);

        // Build WhatsApp redirect URL
        $avatarName = '-';
        if ($order->avatar_id) {
            $ava = Avatar::find($order->avatar_id);
            if ($ava) {
                $avatarName = "{$ava->name}";
            }
        }

        $adminWhatsapp = Setting::get('whatsapp_number', '6281234567890');
        // Clean phone number (remove non-digits, replace leading 08 with 628)
        $cleanPhone = preg_replace('/[^0-9]/', '', $adminWhatsapp);
        if (str_starts_with($cleanPhone, '08')) {
            $cleanPhone = '62' . substr($cleanPhone, 1);
        }

        $budgetFormatted = $order->budget ? 'Rp' . number_format($order->budget, 0, ',', '.') : '-';

        $template = Setting::get(
            'whatsapp_template',
            "Halo kak! Aku mau order jasa joki AVA Roblox di AVA Studio ♡\n\n*Nomor Pesanan:* {order_number}\n*Nama Pelanggan:* {customer_name}\n*Username Roblox:* {roblox_username}\n*Style AVA:* {style}\n*Referensi:* {reference}\n*Budget:* {budget}\n*Catatan:* {notes}\n\nBoleh minta info selanjutnya dan nomor rekeningnya kak? Terima kasih!"
        );

        $waText = str_replace(
            ['{order_number}', '{customer_name}', '{roblox_username}', '{style}', '{reference}', '{budget}', '{notes}'],
            [
                $order->order_number,
                $order->customer_name,
                $order->roblox_username,
                $order->requested_style ?: '-',
                $avatarName,
                $budgetFormatted,
                $order->request_notes ?: '-',
            ],
            $template
        );

        $whatsappUrl = "https://wa.me/{$cleanPhone}?text=" . rawurlencode($waText);

        $order->load('avatar');

        return response()->json([
            'success' => true,
            'message' => 'Pesanan berhasil dibuat!',
            'data' => [
                'order' => $order,
                'whatsapp_url' => $whatsappUrl,
            ],
        ], 201);
    }

    /**
     * Display a listing of orders (Admin).
     */
    public function index(Request $request): JsonResponse
    {
        $query = Order::with('avatar')->orderBy('id', 'desc');

        if ($request->filled('status') && $request->query('status') !== 'all') {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhere('customer_name', 'like', "%{$search}%")
                  ->orWhere('roblox_username', 'like', "%{$search}%")
                  ->orWhere('whatsapp', 'like', "%{$search}%");
            });
        }

        $perPage = min((int) $request->query('per_page', 15), 50);
        $orders = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $orders->items(),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
            ],
        ]);
    }

    /**
     * Display the specified order (Admin).
     */
    public function show($id): JsonResponse
    {
        $order = Order::with('avatar')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $order,
        ]);
    }

    /**
     * Update order status or admin notes (Admin).
     */
    public function update(Request $request, $id): JsonResponse
    {
        $order = Order::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,in_progress,revision,completed,cancelled',
            'admin_notes' => 'nullable|string',
        ]);

        $order->update([
            'status' => $validated['status'],
            'admin_notes' => $validated['admin_notes'] ?? $order->admin_notes,
        ]);

        $order->load('avatar');

        return response()->json([
            'success' => true,
            'message' => 'Status pesanan berhasil diperbarui!',
            'data' => $order,
        ]);
    }
}
