import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  MessageCircle,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { AvatarArt, AvatarCard, Rating } from "../components/ui";
import { useSettings } from "../contexts/SettingsContext";
import { api, getImageUrl, rupiah } from "../lib/api";
import type { Avatar, Category, Testimonial } from "../lib/types";

// ==========================================
// 1. HOME PAGE (CLEAN, SPACIOUS, BOUTIQUE AESTHETIC)
// ==========================================
export function HomePage() {
  const { settings } = useSettings();
  const [featuredAvatars, setFeaturedAvatars] = useState<Avatar[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [avatarsRes, catRes, testiRes] = await Promise.all([
          api.get<{ success: boolean; data: Avatar[] }>("/avatars?featured=1&per_page=6"),
          api.get<{ success: boolean; data: Category[] }>("/categories"),
          api.get<{ success: boolean; data: Testimonial[] }>("/testimonials"),
        ]);

        if (avatarsRes.data.success) setFeaturedAvatars(avatarsRes.data.data);
        if (catRes.data.success) setCategories(catRes.data.data);
        if (testiRes.data.success) setTestimonials(testiRes.data.data);
      } catch (err) {
        console.error("Gagal memuat data homepage:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const headline = settings.hero_headline || "Your Dream Avatar Starts Here.";
  const subheadline =
    settings.hero_subheadline ||
    "Create your own Roblox style with our cute, aesthetic, and personalized avatar styling service.";

  const heroShowcaseAvatar = featuredAvatars[0];

  return (
    <div className="space-y-24 md:space-y-32 pb-24">
      {/* HERO SECTION */}
      <section className="relative pt-12 md:pt-20 pb-16 md:pb-24 overflow-hidden bg-gradient-to-b from-[#FFF5F9] via-[#FFF9FC] to-white border-b border-[#F3DCE8]/60">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* LEFT COPY */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FCE7F3] text-[#DB5793] border border-[#F3DCE8]">
                <Sparkles size={14} className="text-[#EC4899]" />
                {settings.site_tagline || "Your Avatar, Your Style ♡"}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#3D2636] tracking-tight leading-[1.12]">
                {headline.includes("Starts Here") ? (
                  <>
                    Your Dream Avatar <br className="hidden sm:inline" />
                    <span className="text-[#EC4899] italic font-serif font-normal">Starts Here.</span>
                  </>
                ) : (
                  headline
                )}
              </h1>

              <p className="text-base sm:text-lg text-[#94667D] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {subheadline}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/catalog"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#EC4899] hover:bg-[#db3e8b] text-white font-bold text-sm shadow-md hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  Explore Collection <ArrowRight size={17} />
                </Link>
                <Link
                  to="/order"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-pink-50 text-[#3D2636] hover:text-[#EC4899] border border-[#F3DCE8] font-bold text-sm shadow-sm transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <MessageCircle size={17} className="text-[#EC4899]" /> Order Jasa Sekarang
                </Link>
              </div>

              {/* SOCIAL PROOF */}
              <div className="pt-6 border-t border-pink-100/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#94667D]">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {["🌸", "✨", "🎀"].map((emoji, i) => (
                      <span
                        key={i}
                        className="w-7 h-7 rounded-full bg-[#FCE7F3] border-2 border-white flex items-center justify-center text-xs shadow-xs"
                      >
                        {emoji}
                      </span>
                    ))}
                  </div>
                  <b className="text-[#3D2636] font-semibold">250+ Roblox Players</b> puas
                </div>

                <div className="flex items-center gap-1.5">
                  <Rating value={5} />
                  <span className="font-semibold text-[#3D2636]">5.0 / 5.0</span>
                </div>
              </div>
            </div>

            {/* RIGHT SHOWCASE CARD */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm">
                <div className="bg-white p-3.5 rounded-[32px] border border-[#F3DCE8] shadow-xl relative z-10 transition-transform duration-300 hover:scale-[1.01]">
                  <div className="aspect-[4/5] rounded-[24px] overflow-hidden bg-[#FFF4F9] relative">
                    <AvatarArt
                      imageSrc={heroShowcaseAvatar?.cover_image}
                      name={heroShowcaseAvatar?.name || "Strawberry Dream"}
                      className="w-full h-full object-cover"
                    />

                    {/* FLOATING GLASS BADGE */}
                    <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-pink-100 text-xs font-bold text-[#EC4899] shadow-sm">
                      ✦ Signature Look
                    </div>
                  </div>

                  <div className="p-4 pt-4 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#DB5793] block">
                        {heroShowcaseAvatar?.categories?.[0]?.name || "AVA Cute"}
                      </span>
                      <h2 className="text-lg font-bold text-[#3D2636]">
                        {heroShowcaseAvatar?.name || "Strawberry Dream"}
                      </h2>
                    </div>
                    <Link
                      to={heroShowcaseAvatar ? `/avatars/${heroShowcaseAvatar.slug}` : "/catalog"}
                      className="px-4 py-2 rounded-full bg-[#FCE7F3] hover:bg-[#EC4899] text-[#DB5793] hover:text-white font-bold text-xs transition-colors"
                    >
                      Lihat Style ➔
                    </Link>
                  </div>
                </div>

                {/* ACCENT BACKDROP GLOW */}
                <div className="absolute -inset-4 bg-gradient-to-r from-pink-200/40 to-rose-200/40 rounded-[40px] blur-xl -z-10" />
              </div>
            </div>
          </div>
        </div>

        {/* MARQUEE CATEGORIES STRIP */}
        <div className="mt-16 py-3.5 border-y border-[#F3DCE8] bg-[#FFF4F9]/60">
          <div className="flex justify-around items-center gap-8 text-xs font-extrabold uppercase tracking-widest text-[#DB5793]/80 overflow-hidden whitespace-nowrap">
            <span>✦ AVA CUTE</span>
            <span className="hidden sm:inline">✦ AVA COUPLE</span>
            <span>✦ AVA Y2K</span>
            <span className="hidden md:inline">✦ AVA ANIME</span>
            <span>✦ AVA SULTAN</span>
            <span className="hidden sm:inline">✦ AVA ANOMALI</span>
            <span>✦ AVA CUSTOM</span>
          </div>
        </div>
      </section>

      {/* POPULAR CATEGORIES */}
      <section className="container mx-auto px-6 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#EC4899]">
            Koleksi Berdasarkan Style
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#3D2636] tracking-tight">
            Kategori Avatar Populer
          </h2>
          <p className="text-sm text-[#94667D]">
            Temukan style Roblox yang paling sesuai dengan persona dan selera visualmu.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-5">
          {categories.slice(0, 10).map((c) => (
            <Link
              key={c.id}
              to={`/catalog?category=${c.slug}`}
              className="p-5 rounded-2xl bg-white border border-[#F3DCE8] hover:border-[#EC4899] hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FFF4F9] text-[#EC4899] flex items-center justify-center font-bold text-sm mb-3 group-hover:scale-110 transition-transform">
                ✦
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#3D2636] group-hover:text-[#EC4899] transition-colors">
                  {c.name}
                </h3>
                <span className="text-xs text-[#94667D]">
                  {c.avatars_count !== undefined ? `${c.avatars_count} Look` : "Koleksi"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED AVATARS (SPACIOUS 3-COLUMN LOOKBOOK) */}
      <section className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4 text-center md:text-left">
          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#EC4899]">
              Lookbook Unggulan
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#3D2636] tracking-tight">
              Inspirasi Styling Paling Disukai
            </h2>
          </div>
          <Link
            to="/catalog"
            className="px-6 py-2.5 rounded-full border border-[#F3DCE8] hover:bg-pink-50 text-xs font-bold text-[#3D2636] hover:text-[#EC4899] transition-all flex items-center gap-1.5"
          >
            Lihat Semua Katalog ({featuredAvatars.length}+) <ChevronRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredAvatars.map((avatar) => (
            <AvatarCard key={avatar.id} avatar={avatar} />
          ))}
        </div>
      </section>

      {/* HOW TO ORDER (CLEAN SPACIOUS STEPS) */}
      <section className="bg-[#FFF4F9]/60 border-y border-[#F3DCE8] py-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#EC4899]">
              Cara Pemesanan Jasa
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#3D2636] tracking-tight">
              4 Langkah Mudah Punya Avatar Kece
            </h2>
            <p className="text-sm text-[#94667D]">
              Semua proses transparan, aman, dan tanpa pernah meminta password akun Roblox kamu.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Pilih Style Favorit",
                desc: "Jelajahi katalog kami untuk inspirasi look atau siapkan referensi style yang kamu inginkan.",
              },
              {
                step: "02",
                title: "Isi Form & Chat WA",
                desc: "Kirim username Roblox dan preferensi outfit via form pemesanan ke WhatsApp resmi admin.",
              },
              {
                step: "03",
                title: "Konfirmasi & Bayar",
                desc: "Admin akan mengonfirmasi detail pengerjaan. Lakukan pembayaran jasa secara aman.",
              },
              {
                step: "04",
                title: "Hasil & Link Item",
                desc: "Terima hasil moodboard styling lengkap beserta link item resmi Roblox siap pakai.",
              },
            ].map((st) => (
              <div
                key={st.step}
                className="bg-white p-7 rounded-3xl border border-[#F3DCE8] shadow-xs hover:shadow-md transition-shadow relative"
              >
                <span className="text-3xl font-extrabold text-[#EC4899]/30 block mb-3 font-mono">
                  {st.step}
                </span>
                <h3 className="font-bold text-base text-[#3D2636] mb-2">{st.title}</h3>
                <p className="text-xs text-[#94667D] leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/order"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#EC4899] hover:bg-[#db3e8b] text-white font-bold text-sm shadow-md transition-all"
            >
              Mulai Pesan Sekarang <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#EC4899]">
              Ulasan Pelanggan
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#3D2636] tracking-tight">
              Cerita Klien AVA Studio
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white p-7 rounded-3xl border border-[#F3DCE8] shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="mb-3">
                    <Rating value={t.rating} />
                  </div>
                  <p className="text-xs sm:text-sm text-[#3D2636] leading-relaxed italic mb-6">
                    “{t.content}”
                  </p>
                </div>
                <div className="pt-4 border-t border-pink-50 flex items-center justify-between">
                  <div>
                    <b className="text-xs text-[#3D2636] block">{t.customer_name}</b>
                    <span className="text-[11px] text-[#94667D]">
                      {t.roblox_username || "Roblox Player"}
                    </span>
                  </div>
                  <span className="text-xs text-[#EC4899]">Verified Client ♡</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CALL TO ACTION BOTTOM CARD */}
      <section className="container mx-auto px-6 max-w-5xl">
        <div className="bg-gradient-to-r from-[#FCE7F3] via-[#FFF4F9] to-[#FCE7F3] rounded-[36px] border border-[#F3DCE8] p-10 md:p-14 text-center space-y-6 shadow-sm">
          <div className="max-w-xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#3D2636] tracking-tight">
              Mau Tampil Beda di Game Roblox?
            </h2>
            <p className="text-sm text-[#94667D] leading-relaxed">
              Konsultasikan ide style avatarmu dengan stylist kami sekarang. Pengerjaan cepat, ramah, dan memuaskan.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/order"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#EC4899] hover:bg-[#db3e8b] text-white font-bold text-sm shadow-md transition-all"
            >
              <MessageCircle size={18} /> Chat & Pesan via WhatsApp
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// ==========================================
// 2. CATALOG PAGE (SPACIOUS, MODERN LOOKBOOK)
// ==========================================
export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get("category") || "all";
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  const [categories, setCategories] = useState<Category[]>([]);
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, last_page: 1 });

  useEffect(() => {
    api.get<{ success: boolean; data: Category[] }>("/categories").then((res) => {
      if (res.data.success) {
        setCategories(res.data.data);
      }
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string | number> = {
      page,
      sort,
      per_page: 12,
    };
    if (currentCategory && currentCategory !== "all") {
      params.category = currentCategory;
    }
    if (search.trim()) {
      params.search = search.trim();
    }

    api
      .get<{ success: boolean; data: Avatar[]; meta: { total: number; last_page: number } }>(
        "/avatars",
        { params }
      )
      .then((res) => {
        if (res.data.success) {
          setAvatars(res.data.data);
          if (res.data.meta) {
            setMeta({
              total: res.data.meta.total,
              last_page: res.data.meta.last_page,
            });
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [currentCategory, search, sort, page]);

  const handleCategoryClick = (catSlug: string) => {
    setPage(1);
    if (catSlug === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", catSlug);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="py-12 md:py-16 space-y-12">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#EC4899]">
            Katalog AVA Roblox
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#3D2636] tracking-tight">
            Eksplorasi Koleksi Gaya
          </h1>
          <p className="text-sm sm:text-base text-[#94667D] leading-relaxed">
            Klik avatar untuk melihat rincian item atau memesan jasa styling khusus dengan tema serupa.
          </p>
        </div>

        {/* CATEGORY TABS (SPACIOUS PILLS) */}
        <div className="flex gap-2.5 overflow-x-auto pb-4 mb-8 scrollbar-none items-center justify-start md:justify-center">
          <button
            onClick={() => handleCategoryClick("all")}
            className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              currentCategory === "all"
                ? "bg-[#EC4899] text-white shadow-sm"
                : "bg-white text-[#3D2636] border border-[#F3DCE8] hover:bg-pink-50"
            }`}
          >
            Semua ({meta.total || avatars.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => handleCategoryClick(c.slug)}
              className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                currentCategory === c.slug
                  ? "bg-[#EC4899] text-white shadow-sm"
                  : "bg-white text-[#3D2636] border border-[#F3DCE8] hover:bg-pink-50"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* SEARCH & SORT TOOLBAR */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#F3DCE8] shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between mb-10">
          <div className="relative w-full sm:max-w-md">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Cari style avatar (misal: strawberry, y2k, prince)..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-pink-100 bg-[#FFF4F9]/40 text-xs focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <span className="text-xs text-[#94667D] font-medium hidden sm:inline">Urutkan:</span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#F3DCE8] text-xs font-semibold text-[#3D2636] bg-white focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              <option value="newest">✦ Terbaru</option>
              <option value="popular">🔥 Paling Banyak Dilihat</option>
              <option value="price_asc">Harga: Rendah ke Tinggi</option>
              <option value="price_desc">Harga: Tinggi ke Rendah</option>
            </select>
          </div>
        </div>

        {/* AVATAR GRID (3 COLS) */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[4/5] bg-pink-100/50 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : avatars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {avatars.map((avatar) => (
              <AvatarCard key={avatar.id} avatar={avatar} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-3xl border border-[#F3DCE8] p-8 max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FFF4F9] text-[#EC4899] flex items-center justify-center mx-auto text-2xl font-bold">
              ✦
            </div>
            <h3 className="text-lg font-bold text-[#3D2636]">Tidak ada avatar ditemukan</h3>
            <p className="text-xs text-[#94667D]">
              Coba ganti kata kunci pencarian atau pilih kategori lain.
            </p>
            <button
              onClick={() => {
                setSearch("");
                handleCategoryClick("all");
              }}
              className="px-6 py-2.5 rounded-full bg-[#EC4899] text-white font-bold text-xs"
            >
              Reset Filter
            </button>
          </div>
        )}

        {/* PAGINATION */}
        {meta.last_page > 1 && (
          <div className="flex items-center justify-center gap-3 pt-12">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-5 py-2.5 rounded-full border border-[#F3DCE8] text-xs font-bold disabled:opacity-40 hover:bg-pink-50"
            >
              Sebelumnya
            </button>
            <span className="text-xs font-bold text-[#94667D]">
              Halaman {page} dari {meta.last_page}
            </span>
            <button
              disabled={page >= meta.last_page}
              onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
              className="px-5 py-2.5 rounded-full border border-[#F3DCE8] text-xs font-bold disabled:opacity-40 hover:bg-pink-50"
            >
              Selanjutnya
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 3. AVATAR DETAIL PAGE
// ==========================================
export function AvatarDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { settings } = useSettings();

  const [avatar, setAvatar] = useState<Avatar | null>(null);
  const [related, setRelated] = useState<Avatar[]>([]);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api
      .get<{ success: boolean; data: Avatar; related: Avatar[] }>(`/avatars/${slug}`)
      .then((res) => {
        if (res.data.success) {
          setAvatar(res.data.data);
          setRelated(res.data.related || []);
          setActiveImage(res.data.data.cover_image);
        }
      })
      .catch(() => {
        toast.error("Avatar tidak ditemukan");
        navigate("/catalog");
      })
      .finally(() => setLoading(false));
  }, [slug, navigate]);

  if (loading || !avatar) {
    return (
      <div className="container mx-auto px-6 py-28 text-center">
        <Sparkles className="animate-spin text-pink-500 mx-auto mb-3" size={32} />
        <p className="text-sm text-[#94667D]">Memuat detail avatar...</p>
      </div>
    );
  }

  const cleanPhone = (settings.whatsapp_number || "6281234567890").replace(/[^0-9]/g, "");
  const waPhone = cleanPhone.startsWith("08") ? "62" + cleanPhone.slice(1) : cleanPhone;
  const directWaText = `Halo kak! Aku tertarik dengan styling avatar *${avatar.name}* di AVA Studio.\n\nLink referensi: ${window.location.href}\nHarga mulai: ${rupiah(avatar.starting_price)}\n\nBisa dibantu untuk konsultasi dan order jasa ini? Terima kasih!`;
  const directWaUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(directWaText)}`;

  const allImages = [
    ...(avatar.cover_image ? [{ id: 0, image_path: avatar.cover_image }] : []),
    ...(avatar.images || []),
  ];

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-6 max-w-5xl space-y-12">
        <Link
          to="/catalog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#EC4899] hover:text-[#db3e8b]"
        >
          <ArrowLeft size={15} /> Kembali ke Katalog
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          {/* GALLERY IMAGE */}
          <div className="md:col-span-6 space-y-4">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-[#FFF4F9] border border-[#F3DCE8] shadow-md relative">
              <AvatarArt imageSrc={activeImage} name={avatar.name} className="w-full h-full object-cover" />
              {avatar.badge && (
                <span className="absolute top-4 left-4 px-3.5 py-1 rounded-full text-xs font-bold uppercase bg-white/95 backdrop-blur-md text-[#DB5793] shadow-sm border border-pink-100">
                  ✦ {avatar.badge}
                </span>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img.image_path)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      activeImage === img.image_path ? "border-[#EC4899] scale-105" : "border-[#F3DCE8] opacity-70"
                    }`}
                  >
                    <img src={getImageUrl(img.image_path) || ""} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INFO DETAILS */}
          <div className="md:col-span-6 space-y-6">
            <div className="flex flex-wrap gap-2">
              {avatar.categories?.map((c) => (
                <span
                  key={c.id}
                  className="px-3 py-1 rounded-full text-[11px] font-bold uppercase bg-[#FCE7F3] text-[#DB5793] border border-[#F3DCE8]"
                >
                  {c.name}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#3D2636] tracking-tight">
              {avatar.name}
            </h1>

            <div className="p-6 rounded-2xl bg-[#FFF4F9] border border-[#F3DCE8] space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#DB5793] block">
                Biaya Jasa Styling Mulai
              </span>
              <strong className="text-3xl font-extrabold text-[#3D2636] block">
                {rupiah(avatar.starting_price)}
              </strong>
              <small className="text-[11px] text-[#94667D] block pt-1">
                *Hanya biaya jasa styling dan kurasi item. Item Roblox dibeli sendiri melalui link katalog resmi.
              </small>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-sm text-[#3D2636]">Deskripsi Look</h3>
              <p className="text-sm text-[#94667D] leading-relaxed">{avatar.description}</p>
            </div>

            <div className="space-y-2.5 pt-2">
              {[
                "Rekomendasi link item resmi Roblox siap pakai",
                "Panduan layering aksesoris dan proporsi karakter",
                "Konsultasi ramah dan revisi jika belum pas",
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-[#3D2636]">
                  <CheckCircle2 size={16} className="text-[#EC4899] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link
                to={`/order?avatar_id=${avatar.id}`}
                className="flex-1 py-3.5 rounded-full bg-[#EC4899] hover:bg-[#db3e8b] text-white font-bold text-xs text-center shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag size={17} /> Pesan Jasa Style Ini
              </Link>
              <a
                href={directWaUrl}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 rounded-full bg-white hover:bg-pink-50 border border-[#F3DCE8] text-[#3D2636] font-bold text-xs text-center transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle size={17} className="text-[#EC4899]" /> Tanya via WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* RELATED AVATARS */}
        {related.length > 0 && (
          <div className="pt-16 border-t border-pink-100 space-y-8">
            <h2 className="text-2xl font-extrabold text-[#3D2636]">Inspirasi Serupa</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((ava) => (
                <AvatarCard key={ava.id} avatar={ava} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 4. HOW TO ORDER PAGE
// ==========================================
export function HowToOrderPage() {
  return (
    <div className="py-12 md:py-16 space-y-16">
      <div className="container mx-auto px-6 max-w-4xl space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#EC4899]">
            Panduan Order
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#3D2636] tracking-tight">
            Cara Pesan Jasa di AVA Studio
          </h1>
          <p className="text-sm sm:text-base text-[#94667D]">
            Proses pemesanan cepat, nyaman, dan 100% aman tanpa meminta kredensial akun Roblox kamu.
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              step: "01",
              title: "Pilih Inspirasi Style atau Siapkan Ide Kamu",
              desc: "Kamu bisa menjelajahi Katalog AVA untuk memilih referensi look yang kamu sukai, atau berikan foto contoh outfit/moodboard yang ingin kamu tiru.",
            },
            {
              step: "02",
              title: "Lengkapi Form Pemesanan",
              desc: "Isi nama, username Roblox, dan nomor WhatsApp kamu di halaman form order. Sertakan referensi avatar dan estimasi budget kamu.",
            },
            {
              step: "03",
              title: "Konfirmasi & Pembayaran via WhatsApp",
              desc: "Form akan otomatis menghubungkan kamu ke WhatsApp resmi admin dengan invoice nomor order resmi. Lakukan pembayaran jasa sesuai arahan admin.",
            },
            {
              step: "04",
              title: "Proses Styling & Penyerahan Hasil",
              desc: "Stylist kami meracik outfit avatar Roblox impianmu, memberikan pratinjau 3D/tampilan, serta seluruh link item resmi Roblox di marketplace.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-6 md:p-8 rounded-3xl bg-white border border-[#F3DCE8] shadow-xs flex flex-col sm:flex-row gap-5 items-start sm:items-center"
            >
              <span className="text-2xl font-extrabold text-[#EC4899] bg-[#FFF4F9] w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-[#F3DCE8]">
                {item.step}
              </span>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#3D2636]">{item.title}</h3>
                <p className="text-xs sm:text-sm text-[#94667D] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* SECURITY PROMISE */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#FFF4F9] via-white to-[#FFF4F9] border border-[#F3DCE8] text-center space-y-3">
          <ShieldCheck size={36} className="text-[#EC4899] mx-auto" />
          <h3 className="font-bold text-lg text-[#3D2636]">Keamanan Terjamin 100%</h3>
          <p className="text-xs sm:text-sm text-[#94667D] max-w-xl mx-auto leading-relaxed">
            Kami <b>tidak pernah</b> meminta password, email, pin, atau cookie akun Roblox kamu. Kamu hanya perlu membeli item resmi di katalog Roblox menggunakan link yang kami siapkan.
          </p>
        </div>

        <div className="text-center pt-4">
          <Link
            to="/order"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#EC4899] hover:bg-[#db3e8b] text-white font-bold text-sm shadow-md transition-all"
          >
            Mulai Pesan Sekarang <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 6. ORDER FORM (INTERACTIVE & NON-AI-SLOP BUILDER)
// ==========================================
const orderSchema = z.object({
  customer_name: z.string().min(2, "Nama minimal 2 karakter."),
  roblox_username: z.string().min(3, "Username Roblox minimal 3 karakter."),
  whatsapp: z.string().min(9, "Nomor WhatsApp minimal 9 digit."),
  avatar_id: z.string().optional(),
  requested_style: z.string().optional(),
  budget: z.string().optional(),
  request_notes: z.string().optional(),
});
type OrderFormData = z.infer<typeof orderSchema>;

export function OrderPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialAvatarId = searchParams.get("avatar_id") || "";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      avatar_id: initialAvatarId,
      requested_style: "",
      budget: "",
      request_notes: "",
    },
  });

  const selectedAvatarId = watch("avatar_id");
  const currentRobloxUsername = watch("roblox_username");
  const currentRequestedStyle = watch("requested_style");
  const currentBudget = watch("budget");

  useEffect(() => {
    api
      .get<{ success: boolean; data: Avatar[] }>("/avatars?all_status=0&per_page=50")
      .then((avaRes) => {
        if (avaRes.data.success) setAvatars(avaRes.data.data);
      });
  }, []);

  useEffect(() => {
    if (initialAvatarId) setValue("avatar_id", initialAvatarId);
  }, [initialAvatarId, setValue]);

  const activeAvatar = avatars.find((a) => String(a.id) === selectedAvatarId);

  const quickStyleTags = [
    "🌸 Cute Pastel",
    "🎀 Coquette Aesthetic",
    "✨ Y2K Retro",
    "👑 Sultan Luxury",
    "🤍 Matching Couple",
    "🖤 Dark Grunge",
    "🐱 Cyber Neko",
    "🎮 Anomali / Absurd",
  ];

  const handleTagClick = (tag: string) => {
    const current = watch("requested_style") || "";
    if (current.includes(tag)) {
      setValue("requested_style", current.replace(tag, "").trim());
    } else {
      setValue("requested_style", current ? `${current}, ${tag}` : tag);
    }
  };

  const onSubmit = async (data: OrderFormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        customer_name: data.customer_name,
        roblox_username: data.roblox_username,
        whatsapp: data.whatsapp,
        avatar_id: data.avatar_id ? Number(data.avatar_id) : null,
        requested_style: data.requested_style || null,
        budget: data.budget ? Number(data.budget) : null,
        request_notes: data.request_notes || null,
      };

      const res = await api.post<{
        success: boolean;
        message: string;
        data: {
          order: any;
          whatsapp_url: string;
        };
      }>("/orders", payload);

      if (res.data.success) {
        toast.success("Pesanan berhasil disimpan!");
        const { order, whatsapp_url } = res.data.data;
        navigate("/order/success", {
          state: {
            order,
            whatsapp_url,
          },
        });
      }
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Gagal membuat pesanan. Periksa kembali formulir."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-6 max-w-6xl space-y-12">
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#EC4899]">
            Form Pemesanan
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#3D2636] tracking-tight">
            Order Jasa Joki AVA Roblox
          </h1>
          <p className="text-sm text-[#94667D]">
            Pilih referensi avatar dan masukkan preferensi style kamu. Pesananmu akan otomatis tersimpan dan dibuatkan link invoice WhatsApp.
          </p>
        </div>

        {/* 2-COLUMN ORDER BUILDER LAYOUT */}
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: INTERACTIVE FORM INPUTS */}
          <div className="lg:col-span-8 space-y-8">
            {/* STEP 1: CONTACT & ROBLOX ACCOUNT */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3DCE8] shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-pink-100">
                <span className="w-8 h-8 rounded-full bg-[#EC4899] text-white flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <div>
                  <h3 className="font-bold text-base text-[#3D2636]">Data Akun & Kontak</h3>
                  <p className="text-xs text-[#94667D]">Pastikan username dan WhatsApp aktif untuk konfirmasi.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#3D2636] block">Nama Kamu *</label>
                  <input
                    {...register("customer_name")}
                    placeholder="Contoh: Nayla Putri"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#F3DCE8] text-xs focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                  {errors.customer_name && (
                    <small className="text-red-500 text-[11px] block">{errors.customer_name.message}</small>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#3D2636] block">Username Roblox *</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400 font-bold text-xs">@</span>
                    <input
                      {...register("roblox_username")}
                      placeholder="naylovespink"
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-[#F3DCE8] text-xs focus:outline-none focus:ring-2 focus:ring-pink-300"
                    />
                  </div>
                  {errors.roblox_username && (
                    <small className="text-red-500 text-[11px] block">{errors.roblox_username.message}</small>
                  )}
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-[#3D2636] block">Nomor WhatsApp Aktif *</label>
                  <input
                    {...register("whatsapp")}
                    placeholder="Contoh: 081234567890"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#F3DCE8] text-xs focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                  {errors.whatsapp && (
                    <small className="text-red-500 text-[11px] block">{errors.whatsapp.message}</small>
                  )}
                  <small className="text-[11px] text-[#94667D] block">
                    Format: 08xxxxxxxxxx atau 628xxxxxxxxxx
                  </small>
                </div>
              </div>
            </div>

            {/* STEP 2: AVATAR REFERENCE & REQUEST DETAIL */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3DCE8] shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-pink-100">
                <span className="w-8 h-8 rounded-full bg-[#EC4899] text-white flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <div>
                  <h3 className="font-bold text-base text-[#3D2636]">Referensi & Detail Request</h3>
                  <p className="text-xs text-[#94667D]">Beri tahu kami inspirasi dan vibe yang kamu impikan.</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#3D2636] block">Pilih Referensi Avatar dari Katalog (Opsional)</label>
                  <select
                    {...register("avatar_id")}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#F3DCE8] text-xs focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                  >
                    <option value="">-- Tanpa referensi khusus (Request bebas) --</option>
                    {avatars.map((ava) => (
                      <option key={ava.id} value={ava.id}>
                        {ava.name} ({rupiah(ava.starting_price)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#3D2636] block">Tag Vibe Cepat (Klik untuk memilih)</label>
                  <div className="flex flex-wrap gap-2">
                    {quickStyleTags.map((tag) => {
                      const isSelected = (currentRequestedStyle || "").includes(tag);
                      return (
                        <button
                          type="button"
                          key={tag}
                          onClick={() => handleTagClick(tag)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                            isSelected
                              ? "bg-[#EC4899] text-white border-[#EC4899]"
                              : "bg-white text-[#94667D] border-[#F3DCE8] hover:bg-pink-50"
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#3D2636] block">Style / Vibe yang Diinginkan</label>
                    <input
                      {...register("requested_style")}
                      placeholder="Contoh: Sweet Coquette, Pastel Bunny"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#F3DCE8] text-xs focus:outline-none focus:ring-2 focus:ring-pink-300"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#3D2636] block">Estimasi Budget Jasa (Rp)</label>
                    <input
                      type="number"
                      {...register("budget")}
                      placeholder="Contoh: 50000"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#F3DCE8] text-xs focus:outline-none focus:ring-2 focus:ring-pink-300"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#3D2636] block">Catatan Tambahan & Request Khusus</label>
                  <textarea
                    rows={4}
                    {...register("request_notes")}
                    placeholder="Ceritakan detail aksesoris yang wajib ada (misal: topi kelinci, sayap peri, warna dominan baby pink, dll)..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#F3DCE8] text-xs focus:outline-none focus:ring-2 focus:ring-pink-300 leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: STICKY LIVE ORDER SUMMARY */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#F3DCE8] shadow-md space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-pink-100">
                <h3 className="font-extrabold text-base text-[#3D2636] flex items-center gap-2">
                  <Sparkles size={16} className="text-[#EC4899]" /> Ringkasan Pesanan
                </h3>
                <span className="text-[11px] font-bold text-[#EC4899] bg-[#FFF4F9] px-2.5 py-0.5 rounded-full border border-pink-100">
                  Live Preview
                </span>
              </div>

              {/* LIVE SUMMARY CONTENT */}
              <div className="space-y-3.5 text-xs">
                {activeAvatar && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-[#94667D]">Referensi AVA:</span>
                    <b className="text-[#EC4899] text-right">{activeAvatar.name}</b>
                  </div>
                )}

                <div className="flex justify-between items-center py-1">
                  <span className="text-[#94667D]">Username Roblox:</span>
                  <b className="text-[#3D2636] font-mono">
                    {currentRobloxUsername ? `@${currentRobloxUsername}` : "-"}
                  </b>
                </div>

                {currentRequestedStyle && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-[#94667D]">Style Diminta:</span>
                    <b className="text-[#3D2636] text-right">{currentRequestedStyle}</b>
                  </div>
                )}

                <div className="pt-4 border-t border-pink-100 flex justify-between items-baseline">
                  <span className="text-xs font-bold text-[#94667D]">Estimasi Budget Jasa:</span>
                  <strong className="text-2xl font-extrabold text-[#EC4899]">
                    {currentBudget ? rupiah(Number(currentBudget)) : "-"}
                  </strong>
                </div>
              </div>

              {/* TRUST GUARANTEES */}
              <div className="bg-[#FFF4F9] rounded-2xl p-4 border border-[#F3DCE8] space-y-2 text-[11px] text-[#3D2636]">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={15} className="text-[#EC4899] shrink-0" />
                  <span>100% Aman tanpa minta password Roblox</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={15} className="text-[#EC4899] shrink-0" />
                  <span>Garansi revisi jika look belum pas</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle size={15} className="text-[#EC4899] shrink-0" />
                  <span>Langsung terhubung dengan stylist via WA</span>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-full bg-[#EC4899] hover:bg-[#db3e8b] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="animate-spin" size={17} /> Menyimpan Pesanan...
                  </>
                ) : (
                  <>
                    <MessageCircle size={18} /> Lanjut ke WhatsApp Resmi
                  </>
                )}
              </button>

              <small className="text-[10px] text-center text-[#94667D] block leading-relaxed">
                Nomor pesanan resmi akan dibuat otomatis dan dapat dilacak oleh admin.
              </small>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 7. ORDER SUCCESS PAGE
// ==========================================
export function OrderSuccessPage() {
  const location = useLocation();
  const state = location.state as { order?: any; whatsapp_url?: string } | undefined;

  if (!state || !state.order) {
    return (
      <div className="container mx-auto px-6 py-28 text-center space-y-4">
        <h2 className="text-2xl font-bold">Tidak ada data pesanan</h2>
        <Link to="/order" className="px-6 py-2.5 rounded-full bg-[#EC4899] text-white font-bold text-xs inline-block">
          Kembali ke Form Order
        </Link>
      </div>
    );
  }

  const { order, whatsapp_url } = state;

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-6 max-w-lg text-center space-y-6">
        <div className="w-20 h-20 bg-[#FCE7F3] text-[#EC4899] rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 size={42} />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#EC4899]">
            Pesanan Berhasil Disimpan
          </span>
          <h1 className="text-3xl font-extrabold text-[#3D2636]">Terima Kasih, {order.customer_name}!</h1>
          <p className="text-xs sm:text-sm text-[#94667D] leading-relaxed">
            Pesanan joki styling kamu telah tercatat di sistem AVA Studio. Silakan klik tombol di bawah untuk meneruskan rincian pesanan ke WhatsApp admin.
          </p>
        </div>

        <div className="bg-[#FFF4F9] border border-[#F3DCE8] rounded-3xl p-6 text-center space-y-1">
          <span className="text-[11px] text-[#DB5793] uppercase tracking-widest font-extrabold block">
            Nomor Invoice Pesanan
          </span>
          <b className="block text-2xl font-mono text-[#3D2636] font-bold">{order.order_number}</b>
          <small className="text-[11px] text-[#94667D] block">
            Simpan nomor ini untuk melacak progres pengerjaan avatar kamu.
          </small>
        </div>

        <div className="space-y-3 pt-2">
          <a
            href={whatsapp_url}
            target="_blank"
            rel="noreferrer"
            className="w-full py-4 rounded-full bg-[#EC4899] hover:bg-[#db3e8b] text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle size={19} /> Buka WhatsApp Sekarang
          </a>
          <Link
            to="/catalog"
            className="w-full py-3 rounded-full bg-white hover:bg-pink-50 border border-[#F3DCE8] text-xs font-bold text-[#3D2636] block"
          >
            Kembali ke Katalog AVA
          </Link>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 8. CONTACT PAGE
// ==========================================
export function ContactPage() {
  const { settings } = useSettings();
  const cleanPhone = (settings.whatsapp_number || "6281234567890").replace(/[^0-9]/g, "");
  const waPhone = cleanPhone.startsWith("08") ? "62" + cleanPhone.slice(1) : cleanPhone;

  return (
    <div className="py-12 md:py-16 space-y-12">
      <div className="container mx-auto px-6 max-w-4xl space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#EC4899]">
            Kontak Resmi
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#3D2636] tracking-tight">
            Hubungi AVA Studio
          </h1>
          <p className="text-xs sm:text-sm text-[#94667D]">
            Punya pertanyaan mengenai styling, custom avatar, atau ingin konsultasi outfit? Tim kami siap membantu!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-[#F3DCE8] shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF4F9] text-[#EC4899] flex items-center justify-center">
              <MessageCircle size={24} />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#3D2636]">WhatsApp Admin</h3>
              <p className="text-xs text-[#94667D] mb-4">Konsultasi cepat & konfirmasi pemesanan avatar.</p>
              <a
                href={`https://wa.me/${waPhone}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-[#EC4899] hover:underline flex items-center gap-1"
              >
                +{waPhone} ➔
              </a>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#F3DCE8] shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF4F9] text-[#EC4899] flex items-center justify-center">
              <Camera size={24} />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#3D2636]">Instagram Resmi</h3>
              <p className="text-xs text-[#94667D] mb-4">Portofolio lookbook harian & tips outfit Roblox.</p>
              <a
                href={settings.instagram_url || "https://instagram.com"}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-[#EC4899] hover:underline flex items-center gap-1"
              >
                {settings.instagram_username || "@avastudio.id"} ➔
              </a>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-[#FFF4F9] border border-[#F3DCE8] text-center space-y-2">
          <Clock3 size={24} className="text-[#EC4899] mx-auto mb-1" />
          <h4 className="font-bold text-sm text-[#3D2636]">Jam Operasional Layanan</h4>
          <p className="text-xs text-[#94667D]">
            {settings.operating_hours || "Senin–Sabtu, 09.00–20.00 WIB"}
          </p>
        </div>
      </div>
    </div>
  );
}
