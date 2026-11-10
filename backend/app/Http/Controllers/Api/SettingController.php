<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    /**
     * Get public website settings.
     */
    public function publicSettings(): JsonResponse
    {
        $keys = [
            'site_name',
            'site_tagline',
            'site_logo',
            'site_favicon',
            'whatsapp_number',
            'instagram_username',
            'instagram_url',
            'hero_headline',
            'hero_subheadline',
            'hero_badge',
            'operating_hours',
            'contact_email',
            'footer_about',
            'whatsapp_template',
        ];

        $settings = Setting::whereIn('key', $keys)->pluck('value', 'key');

        return response()->json([
            'success' => true,
            'data' => $settings,
        ]);
    }

    /**
     * Get all settings (Admin).
     */
    public function index(): JsonResponse
    {
        $settings = Setting::all()->pluck('value', 'key');

        return response()->json([
            'success' => true,
            'data' => $settings,
        ]);
    }

    /**
     * Update settings & upload logo / favicon (Admin).
     */
    public function update(Request $request): JsonResponse
    {
        // Generous validation: up to 50MB (51200 KB) for logo, flexible string formats
        $validated = $request->validate([
            'site_name' => 'nullable|string|max:150',
            'site_tagline' => 'nullable|string|max:250',
            'whatsapp_number' => 'nullable|string|max:50',
            'instagram_username' => 'nullable|string|max:100',
            'instagram_url' => 'nullable|string|max:500',
            'hero_headline' => 'nullable|string|max:250',
            'hero_subheadline' => 'nullable|string|max:1000',
            'hero_badge' => 'nullable|string|max:150',
            'operating_hours' => 'nullable|string|max:150',
            'contact_email' => 'nullable|string|max:150',
            'footer_about' => 'nullable|string|max:1000',
            'whatsapp_template' => 'nullable|string|max:2000',
            'site_logo' => 'nullable|max:51200',
            'site_favicon' => 'nullable|max:20480',
        ]);

        // Upload custom logo image if provided as file
        if ($request->hasFile('site_logo')) {
            $path = $request->file('site_logo')->store('settings', 'public');
            Setting::set('site_logo', Storage::url($path));
        } elseif ($request->input('site_logo') === '__DELETE__') {
            Setting::set('site_logo', '');
        }

        // Upload custom favicon if provided as file
        if ($request->hasFile('site_favicon')) {
            $path = $request->file('site_favicon')->store('settings', 'public');
            Setting::set('site_favicon', Storage::url($path));
        } elseif ($request->input('site_favicon') === '__DELETE__') {
            Setting::set('site_favicon', '');
        }

        // Update all other string keys
        $stringKeys = [
            'site_name',
            'site_tagline',
            'whatsapp_number',
            'instagram_username',
            'instagram_url',
            'hero_headline',
            'hero_subheadline',
            'hero_badge',
            'operating_hours',
            'contact_email',
            'footer_about',
            'whatsapp_template',
        ];

        foreach ($stringKeys as $key) {
            if ($request->has($key)) {
                Setting::set($key, $request->input($key) ?? '');
            }
        }

        $allSettings = Setting::all()->pluck('value', 'key');

        return response()->json([
            'success' => true,
            'message' => 'Logo dan pengaturan website berhasil diperbarui!',
            'data' => $allSettings,
        ]);
    }
}
