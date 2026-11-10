<?php

namespace Database\Seeders;

use App\Models\Avatar;
use App\Models\Category;
use App\Models\Order;
use App\Models\Setting;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Admin User
        User::firstOrCreate(
            ['email' => 'admin@avastudio.id'],
            [
                'name' => 'Admin AVA Studio',
                'password' => Hash::make('AdminAvaStudio2026!'),
                'role' => 'admin',
            ]
        );

        // 2. Categories
        $categoriesData = [
            ['name' => 'AVA Cute', 'description' => 'Gaya manis, pastel, dan menggemaskan untuk avatar kamu.', 'sort_order' => 1],
            ['name' => 'AVA Cewek', 'description' => 'Koleksi styling feminin, aesthetic, dan coquette.', 'sort_order' => 2],
            ['name' => 'AVA Cowok', 'description' => 'Koleksi styling maskulin, cool, dan streetwear.', 'sort_order' => 3],
            ['name' => 'AVA Couple', 'description' => 'Set avatar berpasangan dengan chemistry dan warna matching.', 'sort_order' => 4],
            ['name' => 'AVA Y2K', 'description' => 'Gaya retro early 2000s dengan vibe cyberpunk & popstar.', 'sort_order' => 5],
            ['name' => 'AVA Sultan', 'description' => 'Kombinasi item mewah, limited, dan berkelas tinggi.', 'sort_order' => 6],
            ['name' => 'AVA Anime', 'description' => 'Karakter cosplay dan gaya anime slice-of-life.', 'sort_order' => 7],
            ['name' => 'AVA Anomali', 'description' => 'Styling unik, absurd, namun tetap berkonsep estetik.', 'sort_order' => 8],
            ['name' => 'AVA Troll', 'description' => 'Avatar komedi dan konten mabar yang seru.', 'sort_order' => 9],
            ['name' => 'AVA Custom', 'description' => 'Styling custom request khusus sesuai brief pribadi.', 'sort_order' => 10],
        ];

        $categoriesMap = [];
        foreach ($categoriesData as $cat) {
            $created = Category::firstOrCreate(
                ['slug' => Str::slug($cat['name'])],
                [
                    'name' => $cat['name'],
                    'description' => $cat['description'],
                    'is_active' => true,
                    'sort_order' => $cat['sort_order'],
                ]
            );
            $categoriesMap[$cat['name']] = $created->id;
        }

        // 3. Avatars
        $avatarsData = [
            [
                'name' => 'Strawberry Dream',
                'description' => 'Look manis dengan palet strawberry milk, detail pita, dan layering yang lembut. Cocok untuk kamu yang suka style cute tanpa terlihat berlebihan.',
                'starting_price' => 35000,
                'badge' => 'Paling disukai',
                'is_featured' => true,
                'status' => 'published',
                'views_count' => 1240,
                'categories' => ['AVA Cute', 'AVA Cewek'],
                'cover_image' => null,
            ],
            [
                'name' => 'Y2K Popstar',
                'description' => 'Siluet ikonik ala early 2000s dengan aksesori silver, denim, dan sentuhan bubblegum pink yang berani.',
                'starting_price' => 45000,
                'badge' => 'Trending',
                'is_featured' => true,
                'status' => 'published',
                'views_count' => 980,
                'categories' => ['AVA Y2K', 'AVA Cewek'],
                'cover_image' => null,
            ],
            [
                'name' => 'Midnight Prince',
                'description' => 'Gaya dark luxury yang clean dengan aksen metalik dan proporsi modern untuk karakter yang tegas.',
                'starting_price' => 65000,
                'badge' => 'Premium',
                'is_featured' => true,
                'status' => 'published',
                'views_count' => 840,
                'categories' => ['AVA Sultan', 'AVA Cowok'],
                'cover_image' => null,
            ],
            [
                'name' => 'Mochi Bunny',
                'description' => 'Perpaduan pastel lilac, bunny ears, dan detail lembut yang terinspirasi dari karakter anime slice-of-life.',
                'starting_price' => 38000,
                'badge' => 'Cute Choice',
                'is_featured' => true,
                'status' => 'published',
                'views_count' => 1100,
                'categories' => ['AVA Cute', 'AVA Anime', 'AVA Cewek'],
                'cover_image' => null,
            ],
            [
                'name' => 'Matcha Date Couple',
                'description' => 'Couple outfit yang senada tanpa terlalu kembar, dengan palet matcha dan cream yang hangat.',
                'starting_price' => 72000,
                'badge' => 'Couple set',
                'is_featured' => true,
                'status' => 'published',
                'views_count' => 750,
                'categories' => ['AVA Couple', 'AVA Cute'],
                'cover_image' => null,
            ],
            [
                'name' => 'Cyber Neko',
                'description' => 'Detail cyber, headset neko, dan warna neon lembut untuk look futuristik yang tetap wearable.',
                'starting_price' => 52000,
                'badge' => 'Hot',
                'is_featured' => false,
                'status' => 'published',
                'views_count' => 620,
                'categories' => ['AVA Anime', 'AVA Y2K'],
                'cover_image' => null,
            ],
            [
                'name' => 'Tiny Chaos',
                'description' => 'Avatar absurd yang dirancang dengan komposisi tetap rapi. Cocok untuk konten dan mabar santai.',
                'starting_price' => 30000,
                'badge' => 'Lucu banget',
                'is_featured' => false,
                'status' => 'published',
                'views_count' => 530,
                'categories' => ['AVA Anomali', 'AVA Troll'],
                'cover_image' => null,
            ],
            [
                'name' => 'Blush Ballerina',
                'description' => 'Balletcore yang airy dengan tutu modern, leg warmer, dan detail ribbon yang elegan.',
                'starting_price' => 48000,
                'badge' => 'New',
                'is_featured' => false,
                'status' => 'published',
                'views_count' => 410,
                'categories' => ['AVA Cewek', 'AVA Cute'],
                'cover_image' => null,
            ],
        ];

        foreach ($avatarsData as $ava) {
            $catNames = $ava['categories'];
            unset($ava['categories']);

            $slug = Str::slug($ava['name']);
            $avatar = Avatar::firstOrCreate(
                ['slug' => $slug],
                $ava
            );

            $catIds = [];
            foreach ($catNames as $name) {
                if (isset($categoriesMap[$name])) {
                    $catIds[] = $categoriesMap[$name];
                }
            }
            $avatar->categories()->sync($catIds);
        }

        // 4. Testimonials
        $testimonials = [
            [
                'customer_name' => 'Nayla Putri',
                'roblox_username' => '@naylovespink',
                'content' => 'Kakaknya ngerti banget brief aku! Hasilnya cute banget tapi tetap beda dari avatar orang lain. Recommended banget buat yang mau avatar estetik ♡',
                'rating' => 5,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'customer_name' => 'Caca Novita',
                'roblox_username' => '@cacaplayz',
                'content' => 'Prosesnya enak dan detail itemnya lengkap banget. Dikasih list langsung tinggal cari di catalog Roblox, sat-set selesai!',
                'rating' => 5,
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'customer_name' => 'Raka Aditya',
                'roblox_username' => '@rakzz_vibes',
                'content' => 'Couple AVA-ku jadi matching tanpa kelihatan norak. Temen-temen pas main game langsung pada nanya bikin di mana. Worth it parah!',
                'rating' => 5,
                'is_active' => true,
                'sort_order' => 3,
            ],
        ];

        foreach ($testimonials as $t) {
            Testimonial::firstOrCreate(
                ['customer_name' => $t['customer_name']],
                $t
            );
        }

        // 5. Settings (Dynamic branding, logo, WhatsApp, Socials, Hero)
        $settings = [
            'site_name' => 'AVA Studio',
            'site_tagline' => 'Your Avatar, Your Style ♡',
            'site_logo' => '', // Empty by default; admin can upload custom image logo
            'site_favicon' => '',
            'whatsapp_number' => '6281234567890',
            'instagram_username' => '@avastudio.id',
            'instagram_url' => 'https://instagram.com',
            'hero_headline' => 'Avatar kamu, main character-nya kamu.',
            'hero_subheadline' => 'Kami bantu wujudkan avatar Roblox yang bukan cuma bagus, tapi benar-benar terasa seperti kamu.',
            'hero_badge' => 'Styling avatar, made personal',
            'operating_hours' => 'Senin–Sabtu, 09.00–20.00 WIB',
            'contact_email' => 'halo@avastudio.id',
            'footer_about' => 'Jasa styling avatar Roblox yang dibuat personal, detail, dan penuh karakter aesthetic.',
            'whatsapp_template' => "Halo kak! Aku mau order jasa joki AVA Roblox di AVA Studio ♡\n\n*Nomor Pesanan:* {order_number}\n*Nama Pelanggan:* {customer_name}\n*Username Roblox:* {roblox_username}\n*Style AVA:* {style}\n*Referensi:* {reference}\n*Budget:* {budget}\n*Catatan:* {notes}\n\nBoleh minta info selanjutnya dan cara pembayarannya kak? Terima kasih!",
        ];

        foreach ($settings as $key => $val) {
            Setting::set($key, $val);
        }

        // 6. Initial Sample Orders
        $sampleAvatar = Avatar::first();

        Order::firstOrCreate(
            ['order_number' => 'AVA-20261108-001'],
            [
                'customer_name' => 'Nayla Putri',
                'roblox_username' => 'naylovespink',
                'whatsapp' => '081234567890',
                'avatar_id' => $sampleAvatar?->id,
                'requested_style' => 'Sweet Coquette Look',
                'budget' => 45000,
                'request_notes' => 'Mau warna dominan soft pink dengan aksen pita rambut',
                'status' => 'pending',
                'admin_notes' => 'Pesanan baru masuk dari website',
            ]
        );
    }
}
