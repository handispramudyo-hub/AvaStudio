<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Avatar;
use App\Models\Category;
use App\Models\Order;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        $totalAvatars = Avatar::count();
        $totalCategories = Category::count();
        $totalOrders = Order::count();
        $pendingOrders = Order::where('status', 'pending')->count();
        $inProgressOrders = Order::where('status', 'in_progress')->count();
        $completedOrders = Order::where('status', 'completed')->count();
        $totalViews = Avatar::sum('views_count');

        $recentOrders = Order::with('avatar')
            ->orderBy('id', 'desc')
            ->limit(5)
            ->get();

        $topAvatars = Avatar::with('categories')
            ->orderBy('views_count', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'counts' => [
                    'total_avatars' => $totalAvatars,
                    'total_categories' => $totalCategories,
                    'total_orders' => $totalOrders,
                    'pending_orders' => $pendingOrders,
                    'in_progress_orders' => $inProgressOrders,
                    'completed_orders' => $completedOrders,
                    'total_views' => $totalViews,
                ],
                'recent_orders' => $recentOrders,
                'top_avatars' => $topAvatars,
            ],
        ]);
    }
}
