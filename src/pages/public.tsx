import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock3,
  CreditCard,
  Mail,
  MessageCircle,
  PackageCheck,
  Palette,
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
import { AvatarArt, AvatarCard, PageHero, Rating, SectionHeading } from "../components/ui";
import { useSettings } from "../contexts/SettingsContext";
import { api, getImageUrl, rupiah } from "../lib/api";
import type { Avatar, Category, Testimonial } from "../lib/types";

const fallbackMarquee = [
  "AVA Cute",
  "AVA Couple",
  "AVA Y2K",
  "AVA Anime",
  "AVA Sultan",
  "AVA Anomali",
  "AVA Custom",
];

// ==========================================
// HOME PAGE
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

  const headline = settings.hero_headline || "Avatar kamu, main character-nya kamu.";
  const subheadline =
    settings.hero_subheadline ||
    "Kami bantu wujudkan avatar Roblox yang bukan cuma bagus, tapi benar-benar terasa seperti kamu.";
  const commaIndex = headline.indexOf(",");
  const firstLine = commaIndex > 0 ? headline.slice(0, commaIndex + 1) : null;
  const secondLine = commaIndex > 0 ? headline.slice(commaIndex + 1).trim() : headline;

  const heroShowcaseAvatar = featuredAvatars[0];
  const marqueeLabels = categories.length
    ? categories.map((category) => category.name)
    : fallbackMarquee;

  return (
    <div>
      {/* HERO */}
      <section className="home-hero relative overflow-hidden border-b border-line">
        <div className="container relative z-10">
          <div className="grid items-center gap-12 py-14 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-20">
            <div className="text-center lg:text-left">
              <span className="kicker">
                <Sparkles size={13} /> {settings.site_tagline || "Your Avatar, Your Style ♡"}
              </span>

              <h1 className="mx-auto mt-5 max-w-[15ch] text-[clamp(2.5rem,5.4vw,4rem)] font-extrabold leading-[1.04] tracking-[-0.045em] text-ink lg:mx-0">
                {firstLine && (
                  <>
                    {firstLine}
                    <br className="hidden sm:block" />{" "}
                  </>
                )}
                <span className="text-brand-700">{secondLine}</span>
              </h1>

              <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted lg:mx-0">
                {subheadline}
              </p>

              <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row lg:justify-start">
                <Link to="/catalog" className="btn btn-primary btn-lg">
                  Jelajahi koleksi <ArrowRight size={16} />
                </Link>
                <Link to="/order" className="btn btn-outline btn-lg">
                  <MessageCircle size={16} className="text-brand-600" /> Order jasa sekarang
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 border-t border-line pt-6 text-xs text-muted lg:justify-start">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {["N", "C", "R"].map((initial, index) => (
                      <span
                        key={initial}
                        className="grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-brand-100 text-2xs font-extrabold text-brand-700"
                        style={{ zIndex: 3 - index }}
                      >
                        {initial}
                      </span>
                    ))}
                  </div>
                  <span>
                    <b className="font-bold text-ink">250+ player</b> puas
                  </span>
                </div>
                <span className="hidden h-4 w-px bg-line-strong sm:block" />
                <div className="flex items-center gap-2">
                  <Rating value={5} />
                  <b className="font-semibold text-ink">5.0</b>
                </div>
                <span className="hidden h-4 w-px bg-line-strong sm:block" />
                <span className="flex items-center gap-2">
                  <Clock3 size={13} /> Pengerjaan 1–2 hari
                </span>
              </div>
            </div>

            {/* HERO LOOK CARD */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[22rem]">
                <div className="hero-halo" aria-hidden="true" />

                <span className="hero-side-label" aria-hidden="true">
                  Lookbook · 2026
                </span>

                <div className="relative z-10 rounded-2xl border border-line bg-white p-3 shadow-[var(--shadow-lift)]">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-brand-50">
                    <AvatarArt
                      imageSrc={heroShowcaseAvatar?.cover_image}
                      name={heroShowcaseAvatar?.name || "Strawberry Dream"}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/92 px-3 py-1 text-2xs font-extrabold uppercase tracking-[0.14em] text-brand-700 shadow-sm backdrop-blur">
                      ✦ Signature look
                    </span>
                  </div>

                  <div className="flex items-end justify-between gap-3 px-2 pb-1 pt-4">
                    <div>
                      <span className="block text-2xs font-extrabold uppercase tracking-[0.14em] text-brand-600">
                        {heroShowcaseAvatar?.categories?.[0]?.name || "AVA Cute"}
                      </span>
                      <h2 className="mt-1 text-lg font-bold text-ink">
                        {heroShowcaseAvatar?.name || "Strawberry Dream"}
                      </h2>
                    </div>
                    <Link
                      to={heroShowcaseAvatar ? `/avatars/${heroShowcaseAvatar.slug}` : "/catalog"}
                      className="inline-flex shrink-0 items-center gap-1 rounded-full border border-line-strong px-4 py-2 text-2xs font-bold text-ink transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                    >
                      Lihat style <ArrowUpRight size={13} />
                    </Link>
                  </div>
                </div>

                <div className="hero-float-card left-[-0.75rem] top-[18%]">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-50 text-brand-700">
                    <ShieldCheck size={15} />
                  </span>
                  <div>
                    <b>Aman 100%</b>
                    <span>Tanpa password akun</span>
                  </div>
                </div>

                <div className="hero-float-card bottom-[16%] right-[-0.75rem]">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-50 text-emerald-700">
                    <CheckCircle2 size={15} />
                  </span>
                  <div>
                    <b>Garansi revisi</b>
                    <span>Sampai look-nya pas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="marquee relative z-10">
          <div className="marquee-track">
            {[0, 1].map((copy) => (
              <div className="marquee-group" key={copy} aria-hidden={copy === 1}>
                {marqueeLabels.map((label) => (
                  <span key={`${copy}-${label}`}>
                    <Sparkles size={12} /> {label}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Koleksi berdasarkan style"
            title="Kategori avatar populer"
            copy="Temukan style Roblox yang paling sesuai dengan persona dan selera visualmu."
            action={
              <Link to="/catalog" className="btn btn-outline btn-sm">
                Semua kategori <ChevronRight size={14} />
              </Link>
            }
          />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-5">
            {categories.slice(0, 10).map((category, index) => (
              <Link
                key={category.id}
                to={`/catalog?category=${category.slug}`}
                className="group flex flex-col justify-between rounded-2xl border border-line bg-white p-4 transition duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-soft sm:p-5"
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 font-display text-xs font-extrabold text-brand-700">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <ArrowUpRight
                    size={15}
                    className="text-faint transition-colors group-hover:text-brand-600"
                  />
                </div>
                <div className="mt-5">
                  <h3 className="text-sm font-bold text-ink transition-colors group-hover:text-brand-700">
                    {category.name}
                  </h3>
                  <span className="mt-1 block text-2xs text-muted">
                    {category.avatars_count !== undefined
                      ? `${category.avatars_count} look tersedia`
                      : "Lihat koleksi"}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {!loading && categories.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">
                <Palette size={22} />
              </div>
              <h3>Kategori sedang disiapkan</h3>
              <p>
                Koleksi baru segera hadir. Sementara itu, kamu bisa request style bebas lewat form
                order.
              </p>
              <Link to="/order" className="btn btn-primary btn-sm">
                Request style custom
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* FEATURED */}
      <section className="section-tight">
        <div className="container">
          <SectionHeading
            eyebrow="Lookbook unggulan"
            title="Inspirasi styling paling disukai"
            copy="Look pilihan yang paling sering di-request dan paling banyak disimpan pelanggan."
            action={
              <Link to="/catalog" className="btn btn-outline btn-sm">
                Lihat semua katalog <ChevronRight size={14} />
              </Link>
            }
          />

          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="skeleton aspect-[4/5]" />
              ))}
            </div>
          ) : featuredAvatars.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredAvatars.map((avatar) => (
                <AvatarCard key={avatar.id} avatar={avatar} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <ShoppingBag size={22} />
              </div>
              <h3>Belum ada look unggulan</h3>
              <p>
                Katalog sedang diisi. Kamu tetap bisa request style custom langsung ke stylist kami.
              </p>
              <Link to="/order" className="btn btn-primary btn-sm">
                Mulai request
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* HOW TO ORDER */}
      <section className="section-alt">
        <div className="container">
          <SectionHeading
            eyebrow="Cara pemesanan"
            title="Empat langkah, satu avatar baru"
            copy="Proses transparan, aman, dan tanpa pernah meminta password akun Roblox kamu."
            align="center"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "01",
                title: "Pilih style favorit",
                desc: "Jelajahi katalog untuk inspirasi, atau siapkan referensi look yang kamu inginkan.",
                icon: Palette,
              },
              {
                step: "02",
                title: "Isi form & chat WA",
                desc: "Kirim username Roblox dan preferensi outfit lewat form pemesanan.",
                icon: ClipboardList,
              },
              {
                step: "03",
                title: "Konfirmasi & bayar",
                desc: "Admin mengonfirmasi detail pengerjaan, lalu pembayaran dilakukan dengan aman.",
                icon: CreditCard,
              },
              {
                step: "04",
                title: "Hasil & link item",
                desc: "Terima moodboard styling lengkap beserta link item resmi Roblox siap pakai.",
                icon: PackageCheck,
              },
            ].map(({ step, title, desc, icon: Icon }) => (
              <div
                key={step}
                className="group rounded-2xl border border-line bg-white p-5 transition hover:-translate-y-1 hover:shadow-soft sm:p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xs font-extrabold tracking-[0.22em] text-brand-600">
                    STEP {step}
                  </span>
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-700">
                    <Icon size={17} />
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-ink">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-9 text-center">
            <Link to="/order" className="btn btn-primary">
              Mulai pesan sekarang <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="section-tight">
          <div className="container">
            <SectionHeading
              eyebrow="Ulasan pelanggan"
              title="Cerita klien AVA Studio"
              copy="Rata-rata rating 5.0 dari pelanggan yang sudah mencoba layanan styling kami."
              action={
                <div className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2">
                  <Rating value={5} />
                  <span className="text-2xs font-bold text-ink">5.0 / 5.0</span>
                </div>
              }
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
              {testimonials.slice(0, 6).map((testimonial) => (
                <figure
                  key={testimonial.id}
                  className="flex flex-col justify-between rounded-2xl border border-line bg-white p-6"
                >
                  <div>
                    <Rating value={testimonial.rating} />
                    <blockquote className="mt-3 text-sm leading-relaxed text-ink-soft">
                      “{testimonial.content}”
                    </blockquote>
                  </div>
                  <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                    <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-brand-100 text-2xs font-extrabold uppercase text-brand-700">
                      {testimonial.customer_name.slice(0, 2)}
                    </span>
                    <div className="min-w-0">
                      <b className="block truncate text-xs font-bold text-ink">
                        {testimonial.customer_name}
                      </b>
                      <span className="block truncate text-2xs text-muted">
                        {testimonial.roblox_username || "Roblox Player"}
                      </span>
                    </div>
                    <span className="ml-auto flex items-center gap-1 text-2xs font-bold uppercase tracking-wider text-brand-600">
                      <CheckCircle2 size={13} /> Verified
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="pb-20 pt-2 sm:pb-24">
        <div className="container">
          <div className="relative overflow-hidden rounded-2xl border border-line bg-brand-25 px-6 py-12 text-center sm:px-10 sm:py-16">
            <div className="relative mx-auto max-w-xl">
              <span className="kicker">
                <Sparkles size={13} /> Siap tampil beda?
              </span>
              <h2 className="mt-5 text-[clamp(1.75rem,3.4vw,2.5rem)] font-extrabold leading-tight text-ink">
                Mau avatar yang bikin orang nanya, “bikin di mana?”
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
                Konsultasikan ide style-mu dengan stylist kami. Pengerjaan cepat, ramah, dan
                hasilnya personal.
              </p>
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Link to="/order" className="btn btn-primary btn-lg">
                  <MessageCircle size={17} /> Chat & pesan via WhatsApp
                </Link>
                <Link to="/catalog" className="btn btn-outline btn-lg">
                  Lihat lookbook dulu
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ==========================================
// CATALOG PAGE
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
      if (res.data.success) setCategories(res.data.data);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string | number> = {
      page,
      sort,
      per_page: 12,
    };
    if (currentCategory && currentCategory !== "all") params.category = currentCategory;
    if (search.trim()) params.search = search.trim();

    api
      .get<{ success: boolean; data: Avatar[]; meta: { total: number; last_page: number } }>(
        "/avatars",
        { params },
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

  const hasFilter = currentCategory !== "all" || search.trim() !== "";
  const activeCategoryName =
    categories.find((category) => category.slug === currentCategory)?.name || "Semua look";

  return (
    <div>
      <PageHero
        eyebrow="Katalog AVA Roblox"
        title="Eksplorasi koleksi gaya"
        copy="Telusuri look pilihan kami. Klik avatar untuk melihat rincian item, atau pesan jasa styling dengan tema serupa."
        aside={
          <div className="grid w-full max-w-[15rem] grid-cols-2 gap-3 sm:w-auto">
            <div className="rounded-2xl border border-line bg-white/80 p-4 backdrop-blur">
              <b className="block font-display text-xl font-extrabold text-ink">{meta.total}</b>
              <span className="text-2xs font-bold uppercase tracking-[0.1em] text-muted">
                Total look
              </span>
            </div>
            <div className="rounded-2xl border border-line bg-white/80 p-4 backdrop-blur">
              <b className="block font-display text-xl font-extrabold text-ink">
                {categories.length}
              </b>
              <span className="text-2xs font-bold uppercase tracking-[0.1em] text-muted">
                Kategori
              </span>
            </div>
          </div>
        }
      />

      <section className="section-tight">
        <div className="container">
          {/* FILTER BAR */}
          <div className="rounded-2xl border border-line bg-white p-3 shadow-soft sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="input-icon flex-1">
                <Search size={16} />
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Cari style avatar — strawberry, y2k, prince..."
                  className="input"
                  aria-label="Cari style avatar"
                />
              </div>

              <div className="flex items-center gap-2 sm:w-auto">
                <span className="hidden text-2xs font-semibold text-muted sm:inline">Urutkan</span>
                <select
                  value={sort}
                  onChange={(event) => {
                    setSort(event.target.value);
                    setPage(1);
                  }}
                  className="select text-xs"
                  aria-label="Urutkan katalog"
                >
                  <option value="newest">Terbaru</option>
                  <option value="popular">Paling banyak dilihat</option>
                  <option value="price_asc">Harga: rendah ke tinggi</option>
                  <option value="price_desc">Harga: tinggi ke rendah</option>
                </select>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 overflow-x-auto border-t border-line pt-3 scrollbar-none">
              <button
                onClick={() => handleCategoryClick("all")}
                className={`chip chip-sm ${currentCategory === "all" ? "is-active" : ""}`}
              >
                Semua
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.slug)}
                  className={`chip chip-sm ${currentCategory === category.slug ? "is-active" : ""}`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* RESULT META */}
          <div className="mb-6 mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted">
              Menampilkan <b className="font-bold text-ink">{avatars.length}</b> dari{" "}
              <b className="font-bold text-ink">{meta.total}</b> look ·{" "}
              <span className="font-semibold text-brand-700">{activeCategoryName}</span>
              {search.trim() && (
                <>
                  {" "}
                  · pencarian “<span className="font-semibold text-brand-700">{search}</span>”
                </>
              )}
            </p>
            {hasFilter && (
              <button
                onClick={() => {
                  setSearch("");
                  handleCategoryClick("all");
                }}
                className="text-2xs font-bold text-brand-700 underline-offset-4 hover:underline"
              >
                Reset filter
              </button>
            )}
          </div>

          {/* GRID */}
          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="skeleton aspect-[4/5]" />
              ))}
            </div>
          ) : avatars.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {avatars.map((avatar) => (
                <AvatarCard key={avatar.id} avatar={avatar} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <Search size={22} />
              </div>
              <h3>Tidak ada avatar ditemukan</h3>
              <p>Coba kata kunci lain, atau reset filter untuk melihat seluruh koleksi.</p>
              <button
                onClick={() => {
                  setSearch("");
                  handleCategoryClick("all");
                }}
                className="btn btn-primary btn-sm"
              >
                Reset filter
              </button>
            </div>
          )}

          {/* PAGINATION */}
          {meta.last_page > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <button
                disabled={page <= 1}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                className="btn btn-outline btn-sm"
              >
                <ArrowLeft size={14} /> Sebelumnya
              </button>
              <span className="min-w-[7.5rem] text-center text-2xs font-bold text-muted">
                Halaman {page} dari {meta.last_page}
              </span>
              <button
                disabled={page >= meta.last_page}
                onClick={() => setPage((value) => Math.min(meta.last_page, value + 1))}
                className="btn btn-outline btn-sm"
              >
                Selanjutnya <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// ==========================================
// AVATAR DETAIL PAGE
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
      <div className="container py-28 text-center">
        <Sparkles className="mx-auto mb-3 animate-pulse text-brand-600" size={32} />
        <p className="text-sm text-muted">Memuat detail avatar...</p>
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
    <div>
      <div className="border-b border-line bg-brand-25">
        <div className="container flex items-center gap-2 py-3 text-2xs font-semibold text-muted">
          <Link to="/" className="hover:text-brand-700">
            Beranda
          </Link>
          <ChevronRight size={12} />
          <Link to="/catalog" className="hover:text-brand-700">
            Katalog
          </Link>
          <ChevronRight size={12} />
          <span className="truncate text-ink">{avatar.name}</span>
        </div>
      </div>

      <section className="section-tight">
        <div className="container">
          <Link
            to="/catalog"
            className="mb-7 inline-flex items-center gap-2 text-2xs font-bold text-brand-700 hover:underline"
          >
            <ArrowLeft size={14} /> Kembali ke katalog
          </Link>

          <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            {/* GALLERY */}
            <div className="space-y-3">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-brand-50 shadow-soft">
                <AvatarArt
                  imageSrc={activeImage}
                  name={avatar.name}
                  className="h-full w-full object-cover"
                />
                {avatar.badge && (
                  <span className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/92 px-3 py-1 text-2xs font-extrabold uppercase tracking-[0.12em] text-brand-700 shadow-sm backdrop-blur">
                    {avatar.badge}
                  </span>
                )}
              </div>

              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {allImages.map((image, index) => (
                    <button
                      key={`${image.id}-${index}`}
                      onClick={() => setActiveImage(image.image_path)}
                      aria-label={`Lihat foto ${index + 1}`}
                      className={`h-16 w-16 flex-none overflow-hidden rounded-xl border-2 transition ${
                        activeImage === image.image_path
                          ? "border-brand-600"
                          : "border-line opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={getImageUrl(image.image_path) || ""}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* INFO */}
            <div className="lg:sticky lg:top-24">
              <div className="flex flex-wrap items-center gap-2">
                {avatar.categories?.map((category) => (
                  <span key={category.id} className="tag">
                    {category.name}
                  </span>
                ))}
              </div>

              <h1 className="mt-4 text-[clamp(2rem,3.6vw,2.75rem)] font-extrabold leading-tight text-ink">
                {avatar.name}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-2xs font-semibold text-muted">
                <span className="flex items-center gap-2">
                  <Rating value={5} /> 5.0
                </span>
                <span className="flex items-center gap-2">
                  <ShoppingBag size={13} /> {avatar.views_count || 0} dilihat
                </span>
                <span className="flex items-center gap-2 text-brand-700">
                  <CheckCircle2 size={13} /> Siap dikerjakan
                </span>
              </div>

              <p className="mt-4 text-base leading-relaxed text-muted">{avatar.description}</p>

              <div className="mt-6 rounded-2xl border border-line bg-gradient-to-br from-brand-50 to-white p-5">
                <span className="block text-2xs font-extrabold uppercase tracking-[0.14em] text-brand-700">
                  Biaya jasa styling mulai
                </span>
                <strong className="mt-2 block font-display text-3xl font-extrabold leading-none text-ink">
                  {rupiah(avatar.starting_price)}
                </strong>
                <small className="mt-2 block text-2xs leading-relaxed text-muted">
                  Hanya biaya jasa styling dan kurasi item. Item Roblox dibeli sendiri melalui link
                  katalog resmi.
                </small>
              </div>

              <ul className="mt-5 space-y-3">
                {[
                  "Rekomendasi link item resmi Roblox siap pakai",
                  "Panduan layering aksesoris dan proporsi karakter",
                  "Konsultasi ramah dan revisi jika belum pas",
                  "Tanpa meminta password atau akses akun",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-xs text-ink-soft">
                    <CheckCircle2 size={15} className="mt-1 flex-none text-brand-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <Link to={`/order?avatar_id=${avatar.id}`} className="btn btn-primary flex-1">
                  <ShoppingBag size={16} /> Pesan jasa style ini
                </Link>
                <a
                  href={directWaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline flex-1"
                >
                  <MessageCircle size={16} className="text-brand-600" /> Tanya via WhatsApp
                </a>
              </div>

              <p className="mt-3 flex items-center justify-center gap-2 text-center text-2xs text-muted">
                <ShieldCheck size={12} /> Admin akan mengonfirmasi ketersediaan sebelum pembayaran.
              </p>
            </div>
          </div>

          {/* RELATED */}
          {related.length > 0 && (
            <div className="mt-16 border-t border-line pt-12">
              <SectionHeading
                eyebrow="Look serupa"
                title="Inspirasi lainnya"
                copy="Style lain yang mungkin cocok dengan selera dan karakter kamu."
                action={
                  <Link to="/catalog" className="btn btn-outline btn-sm">
                    Semua look <ChevronRight size={14} />
                  </Link>
                }
              />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <AvatarCard key={item.id} avatar={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// ==========================================
// HOW TO ORDER PAGE
// ==========================================
export function HowToOrderPage() {
  const steps = [
    {
      step: "01",
      title: "Pilih inspirasi atau siapkan idemu",
      desc: "Jelajahi katalog AVA untuk memilih referensi look, atau berikan foto contoh outfit/moodboard yang ingin kamu tiru.",
      icon: Palette,
    },
    {
      step: "02",
      title: "Lengkapi form pemesanan",
      desc: "Isi nama, username Roblox, nomor WhatsApp, referensi avatar, dan estimasi budget kamu di halaman form order.",
      icon: ClipboardList,
    },
    {
      step: "03",
      title: "Konfirmasi & pembayaran via WhatsApp",
      desc: "Form akan menghubungkan kamu ke WhatsApp resmi admin dengan nomor order. Pembayaran dilakukan sesuai arahan admin.",
      icon: CreditCard,
    },
    {
      step: "04",
      title: "Pengerjaan & penyerahan hasil",
      desc: "Stylist meracik outfit impianmu, memberikan pratinjau look, serta seluruh link item resmi Roblox di marketplace.",
      icon: PackageCheck,
    },
  ];

  return (
    <div>
      <PageHero
        eyebrow="Panduan order"
        title="Cara pesan jasa di AVA Studio"
        copy="Proses pemesanan cepat, nyaman, dan 100% aman tanpa meminta kredensial akun Roblox kamu."
        aside={
          <div className="flex w-full max-w-[16rem] items-center gap-3 rounded-2xl border border-line bg-white/85 p-4 backdrop-blur">
            <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <ShieldCheck size={19} />
            </span>
            <div>
              <b className="block text-xs font-bold text-ink">Keamanan terjamin</b>
              <span className="text-2xs text-muted">Tanpa password · Garansi revisi</span>
            </div>
          </div>
        }
      />

      <section className="section-tight">
        <div className="container">
          <div className="grid items-start gap-8 lg:grid-cols-[1.5fr_0.9fr] lg:gap-12">
            <div className="relative">
              <span
                className="absolute bottom-8 left-[1.5rem] top-8 hidden w-px border-l border-dashed border-line-strong sm:block"
                aria-hidden="true"
              />
              <div className="space-y-4">
                {steps.map(({ step, title, desc, icon: Icon }) => (
                  <div
                    key={step}
                    className="relative flex gap-4 rounded-2xl border border-line bg-white p-5 sm:gap-5 sm:p-6"
                  >
                    <span className="relative z-10 grid h-11 w-11 flex-none place-items-center rounded-xl border border-brand-200 bg-brand-50 font-display text-xs font-extrabold text-brand-700 sm:h-12 sm:w-12">
                      {step}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <Icon size={15} className="text-brand-600" />
                        <h2 className="text-lg font-bold text-ink">{title}</h2>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-muted sm:text-xs">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="space-y-4 lg:sticky lg:top-24">
              <div className="rounded-2xl border border-line bg-gradient-to-br from-brand-50 to-white p-5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-brand-700 shadow-sm">
                  <ShieldCheck size={19} />
                </span>
                <h3 className="mt-4 text-sm font-bold text-ink">Aman 100%, tanpa akun</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  Kami <b className="text-ink">tidak pernah</b> meminta password, email, PIN, atau
                  cookie akun Roblox kamu. Kamu hanya membeli item resmi lewat link yang kami
                  siapkan.
                </p>
                <ul className="mt-4 space-y-2">
                  {["Konsultasi gratis", "Admin manusia, bukan bot", "Garansi revisi look"].map(
                    (item) => (
                      <li key={item} className="flex items-center gap-2 text-2xs text-ink-soft">
                        <Check size={13} className="text-brand-600" /> {item}
                      </li>
                    ),
                  )}
                </ul>
              </div>

              <div className="rounded-2xl border border-line bg-white p-5">
                <h3 className="text-sm font-bold text-ink">Butuh bantuan dulu?</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  Tanya-tanya soal style, budget, atau estimasi pengerjaan sebelum order.
                </p>
                <Link to="/contact" className="btn btn-outline btn-sm mt-4 w-full">
                  <MessageCircle size={15} /> Hubungi admin
                </Link>
              </div>
            </aside>
          </div>

          {/* FAQ */}
          <div id="faq" className="mt-14 rounded-2xl border border-line bg-white p-6 sm:p-8">
            <h2 className="text-lg font-extrabold text-ink">Pertanyaan yang sering ditanya</h2>
            <div className="mt-5 divide-y divide-line">
              {[
                {
                  q: "Apakah saya perlu memberikan password Roblox?",
                  a: "Tidak, sama sekali. Kami hanya membutuhkan username Roblox untuk referensi karakter. Item outfit dibeli sendiri oleh kamu melalui katalog Roblox resmi.",
                },
                {
                  q: "Berapa lama proses pengerjaannya?",
                  a: "Rata-rata 1–2 hari kerja setelah pembayaran dikonfirmasi. Untuk request custom yang kompleks, admin akan memberi estimasi tambahan.",
                },
                {
                  q: "Apakah bisa revisi kalau hasilnya belum cocok?",
                  a: "Bisa. Setiap paket memiliki jatah revisi. Sampaikan catatanmu ke admin dan stylist akan menyesuaikan look sesuai brief.",
                },
              ].map((item) => (
                <details key={item.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-ink">
                    {item.q}
                    <ChevronRight
                      size={16}
                      className="flex-none text-brand-600 transition-transform group-open:rotate-90"
                    />
                  </summary>
                  <p className="mt-2 pr-6 text-xs leading-relaxed text-muted">{item.a}</p>
                </details>
              ))}
            </div>
          </div>

          <div className="mt-9 text-center">
            <Link to="/order" className="btn btn-primary btn-lg">
              Mulai pesan sekarang <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// ==========================================
// ORDER FORM
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
      .then((res) => {
        if (res.data.success) setAvatars(res.data.data);
      });
  }, []);

  useEffect(() => {
    if (initialAvatarId) setValue("avatar_id", initialAvatarId);
  }, [initialAvatarId, setValue]);

  const activeAvatar = avatars.find((avatar) => String(avatar.id) === selectedAvatarId);

  const quickStyleTags = [
    "Cute Pastel",
    "Coquette Aesthetic",
    "Y2K Retro",
    "Sultan Luxury",
    "Matching Couple",
    "Dark Grunge",
    "Cyber Neko",
    "Anomali Absurd",
  ];

  const handleTagClick = (tag: string) => {
    const current = watch("requested_style") || "";
    if (current.includes(tag)) {
      setValue(
        "requested_style",
        current
          .replace(tag, "")
          .replace(/^,\s*|,\s*$/g, "")
          .trim(),
      );
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
        data: { order: any; whatsapp_url: string };
      }>("/orders", payload);

      if (res.data.success) {
        toast.success("Pesanan berhasil disimpan!");
        const { order, whatsapp_url } = res.data.data;
        navigate("/order/success", { state: { order, whatsapp_url } });
      }
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Gagal membuat pesanan. Periksa kembali formulir.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHero
        eyebrow="Form pemesanan"
        title="Order jasa styling AVA Roblox"
        copy="Pilih referensi avatar dan masukkan preferensi style kamu. Pesanan otomatis tersimpan dan dibuatkan link invoice WhatsApp."
        aside={
          <div className="hidden items-center gap-2 text-2xs font-bold text-muted sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Admin online · respon cepat
          </div>
        }
      />

      <section className="section-tight">
        <div className="container">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid items-start gap-6 lg:grid-cols-[1.5fr_1fr] lg:gap-7"
          >
            <div className="space-y-6">
              {/* STEP 1 */}
              <div className="form-card">
                <div className="form-section-head">
                  <span className="form-step">1</span>
                  <div>
                    <h3>Data akun & kontak</h3>
                    <p>Pastikan username dan WhatsApp aktif untuk konfirmasi pesanan.</p>
                  </div>
                </div>

                <div className="form-grid">
                  <div>
                    <label className="field-label">
                      Nama kamu <span className="text-brand-600">*</span>
                    </label>
                    <input
                      {...register("customer_name")}
                      placeholder="Contoh: Nayla Putri"
                      className={`input ${errors.customer_name ? "has-error" : ""}`}
                    />
                    {errors.customer_name && (
                      <small className="field-error">{errors.customer_name.message}</small>
                    )}
                  </div>

                  <div>
                    <label className="field-label">
                      Username Roblox <span className="text-brand-600">*</span>
                    </label>
                    <div className="input-icon">
                      <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-xs font-bold text-brand-600">
                        @
                      </span>
                      <input
                        {...register("roblox_username")}
                        placeholder="naylovespink"
                        className={`input pl-8 ${errors.roblox_username ? "has-error" : ""}`}
                      />
                    </div>
                    {errors.roblox_username && (
                      <small className="field-error">{errors.roblox_username.message}</small>
                    )}
                  </div>

                  <div className="span-2">
                    <label className="field-label">
                      Nomor WhatsApp aktif <span className="text-brand-600">*</span>
                    </label>
                    <input
                      {...register("whatsapp")}
                      placeholder="Contoh: 081234567890"
                      className={`input ${errors.whatsapp ? "has-error" : ""}`}
                    />
                    {errors.whatsapp && (
                      <small className="field-error">{errors.whatsapp.message}</small>
                    )}
                    <small className="field-hint">
                      Format 08xxxxxxxxxx atau 628xxxxxxxxxx. Nomor ini dipakai admin untuk
                      konfirmasi.
                    </small>
                  </div>
                </div>
              </div>

              {/* STEP 2 */}
              <div className="form-card">
                <div className="form-section-head">
                  <span className="form-step">2</span>
                  <div>
                    <h3>Referensi & detail request</h3>
                    <p>Beri tahu kami inspirasi dan vibe yang kamu impikan.</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="field-label">
                      Pilih referensi avatar dari katalog (opsional)
                    </label>
                    <select {...register("avatar_id")} className="select">
                      <option value="">Tanpa referensi khusus — request bebas</option>
                      {avatars.map((avatar) => (
                        <option key={avatar.id} value={avatar.id}>
                          {avatar.name} — mulai {rupiah(avatar.starting_price)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="field-label">Tag vibe cepat</label>
                    <div className="flex flex-wrap gap-2">
                      {quickStyleTags.map((tag) => {
                        const isSelected = (currentRequestedStyle || "").includes(tag);
                        return (
                          <button
                            type="button"
                            key={tag}
                            onClick={() => handleTagClick(tag)}
                            aria-pressed={isSelected}
                            className={`chip chip-sm ${isSelected ? "is-active" : ""}`}
                          >
                            {isSelected ? <Check size={12} /> : <Sparkles size={12} />} {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="form-grid">
                    <div>
                      <label className="field-label">Style / vibe yang diinginkan</label>
                      <input
                        {...register("requested_style")}
                        placeholder="Contoh: Sweet Coquette, Pastel Bunny"
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="field-label">Estimasi budget jasa (Rp)</label>
                      <input
                        type="number"
                        {...register("budget")}
                        placeholder="Contoh: 50000"
                        className="input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="field-label">Catatan tambahan & request khusus</label>
                    <textarea
                      rows={4}
                      {...register("request_notes")}
                      placeholder="Ceritakan detail aksesoris yang wajib ada (misal: topi kelinci, sayap peri, warna dominan baby pink)..."
                      className="textarea"
                    />
                    <small className="field-hint">
                      Semakin detail brief-mu, semakin cepat stylist menangkap arah visualnya.
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {/* SUMMARY */}
            <aside className="lg:sticky lg:top-24">
              <div className="form-card">
                <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
                  <h3 className="flex items-center gap-2 text-sm font-extrabold text-ink">
                    <Sparkles size={15} className="text-brand-600" /> Ringkasan pesanan
                  </h3>
                  <span className="rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-2xs font-bold text-brand-700">
                    Live preview
                  </span>
                </div>

                {activeAvatar && (
                  <div className="mt-4 flex items-center gap-3 rounded-xl border border-line bg-brand-25 p-3">
                    <div className="h-14 w-12 flex-none overflow-hidden rounded-xl border border-line">
                      <AvatarArt imageSrc={activeAvatar.cover_image} name={activeAvatar.name} />
                    </div>
                    <div className="min-w-0">
                      <b className="block truncate text-xs text-ink">{activeAvatar.name}</b>
                      <span className="text-2xs text-muted">
                        Mulai {rupiah(activeAvatar.starting_price)}
                      </span>
                    </div>
                  </div>
                )}

                <dl className="mt-4 space-y-3 text-xs">
                  <div className="flex items-start justify-between gap-3">
                    <dt className="text-muted">Username Roblox</dt>
                    <dd className="text-right font-semibold text-ink">
                      {currentRobloxUsername ? `@${currentRobloxUsername}` : "-"}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <dt className="text-muted">Style diminta</dt>
                    <dd className="max-w-[60%] text-right font-semibold text-ink">
                      {currentRequestedStyle || "-"}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <dt className="text-muted">Referensi</dt>
                    <dd className="max-w-[60%] text-right font-semibold text-ink">
                      {activeAvatar?.name || "Request bebas"}
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
                  <span className="text-xs font-bold text-muted">Estimasi budget</span>
                  <strong className="font-display text-2xl font-extrabold text-brand-700">
                    {currentBudget
                      ? rupiah(Number(currentBudget))
                      : activeAvatar
                        ? rupiah(activeAvatar.starting_price)
                        : "-"}
                  </strong>
                </div>

                <div className="mt-4 space-y-2 rounded-xl border border-line bg-brand-25 p-4">
                  {[
                    "100% aman tanpa minta password Roblox",
                    "Garansi revisi jika look belum pas",
                    "Langsung terhubung dengan stylist via WA",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2 text-2xs text-ink-soft">
                      <Check size={13} className="mt-1 flex-none text-brand-600" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary mt-5 w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Sparkles className="animate-spin" size={16} /> Menyimpan pesanan...
                    </>
                  ) : (
                    <>
                      <MessageCircle size={17} /> Lanjut ke WhatsApp resmi
                    </>
                  )}
                </button>

                <p className="mt-3 text-center text-2xs leading-relaxed text-muted">
                  Nomor pesanan resmi dibuat otomatis dan dapat dilacak oleh admin.
                </p>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-2xl border border-line bg-white p-4">
                <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-brand-50 text-brand-700">
                  <ShieldCheck size={16} />
                </span>
                <p className="text-2xs leading-relaxed text-muted">
                  Butuh konsultasi dulu?{" "}
                  <Link to="/contact" className="font-bold text-brand-700 hover:underline">
                    Chat admin
                  </Link>{" "}
                  tanpa harus mengisi form.
                </p>
              </div>
            </aside>
          </form>
        </div>
      </section>
    </div>
  );
}

// ==========================================
// ORDER SUCCESS PAGE
// ==========================================
export function OrderSuccessPage() {
  const location = useLocation();
  const state = location.state as { order?: any; whatsapp_url?: string } | undefined;

  if (!state || !state.order) {
    return (
      <div className="container py-28 text-center">
        <div className="empty-state mx-auto max-w-md">
          <div className="empty-icon">
            <ShoppingBag size={22} />
          </div>
          <h3>Tidak ada data pesanan</h3>
          <p>Halaman ini hanya bisa dibuka setelah kamu menyelesaikan form pemesanan.</p>
          <Link to="/order" className="btn btn-primary btn-sm">
            Kembali ke form order
          </Link>
        </div>
      </div>
    );
  }

  const { order, whatsapp_url } = state;

  return (
    <section className="section-tight">
      <div className="container max-w-2xl">
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
          <div className="border-b border-line bg-gradient-to-b from-brand-50 to-white px-6 py-10 text-center sm:px-10">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={32} />
            </div>
            <span className="eyebrow mt-5 justify-center">Pesanan berhasil disimpan</span>
            <h1 className="mt-2 text-[clamp(1.75rem,3.4vw,2.25rem)] font-extrabold text-ink">
              Terima kasih, {order.customer_name}!
            </h1>
            <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-muted sm:text-sm">
              Pesanan styling kamu sudah tercatat. Lanjutkan ke WhatsApp admin untuk konfirmasi dan
              pembayaran.
            </p>
          </div>

          <div className="px-6 py-6 sm:px-10">
            <div className="rounded-xl border border-dashed border-brand-200 bg-brand-25 px-5 py-4 text-center">
              <span className="text-2xs font-extrabold uppercase tracking-[0.16em] text-brand-700">
                Nomor invoice pesanan
              </span>
              <b className="mt-1 block font-mono text-xl font-bold text-ink">
                {order.order_number}
              </b>
              <small className="mt-1 block text-2xs text-muted">
                Simpan nomor ini untuk melacak progres pengerjaan.
              </small>
            </div>

            <ol className="mt-6 space-y-3">
              {[
                "Klik tombol WhatsApp di bawah untuk membuka chat admin.",
                "Kirim pesan yang sudah terisi otomatis — tidak perlu menulis ulang.",
                "Admin akan mengonfirmasi detail dan mengirim instruksi pembayaran.",
              ].map((item, index) => (
                <li key={item} className="flex items-start gap-2 text-xs text-ink-soft">
                  <span className="grid h-5 w-5 flex-none place-items-center rounded-full bg-brand-50 text-2xs font-bold text-brand-700">
                    {index + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>

            <div className="mt-6 space-y-3">
              <a
                href={whatsapp_url}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary w-full"
              >
                <MessageCircle size={17} /> Buka WhatsApp sekarang
              </a>
              <Link to="/catalog" className="btn btn-outline w-full">
                Kembali ke katalog AVA
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// CONTACT PAGE
// ==========================================
export function ContactPage() {
  const { settings } = useSettings();
  const cleanPhone = (settings.whatsapp_number || "6281234567890").replace(/[^0-9]/g, "");
  const waPhone = cleanPhone.startsWith("08") ? "62" + cleanPhone.slice(1) : cleanPhone;
  const email = settings.contact_email || "halo@avastudio.id";

  const channels = [
    {
      icon: MessageCircle,
      title: "WhatsApp admin",
      desc: "Konsultasi cepat dan konfirmasi pemesanan avatar.",
      label: `+${waPhone}`,
      href: `https://wa.me/${waPhone}`,
    },
    {
      icon: Camera,
      title: "Instagram resmi",
      desc: "Portofolio lookbook harian dan tips outfit Roblox.",
      label: settings.instagram_username || "@avastudio.id",
      href: settings.instagram_url || "https://instagram.com",
    },
    {
      icon: Mail,
      title: "Email",
      desc: "Untuk kerja sama, endorsement, atau pertanyaan detail.",
      label: email,
      href: `mailto:${email}`,
    },
  ];

  return (
    <div>
      <PageHero
        eyebrow="Kontak resmi"
        title="Hubungi AVA Studio"
        copy="Punya pertanyaan soal styling, custom avatar, atau ingin konsultasi outfit? Tim kami siap membantu."
        aside={
          <div className="flex items-center gap-2 rounded-full border border-line bg-white/85 px-4 py-2 text-2xs font-bold text-muted backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Biasanya membalas &lt; 1 jam
          </div>
        }
      />

      <section className="section-tight">
        <div className="container">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {channels.map(({ icon: Icon, title, desc, label, href }) => (
              <a
                key={title}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col rounded-2xl border border-line bg-white p-6 transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-soft"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-700">
                  <Icon size={20} />
                </span>
                <h2 className="mt-4 text-lg font-bold text-ink">{title}</h2>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-muted">{desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-2xs font-bold text-brand-700">
                  {label} <ArrowUpRight size={13} />
                </span>
              </a>
            ))}
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-2xl border border-line bg-white p-6 sm:p-7">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700">
                <Clock3 size={19} />
              </span>
              <h3 className="mt-4 text-sm font-bold text-ink">Jam operasional layanan</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                {settings.operating_hours || "Senin–Sabtu, 09.00–20.00 WIB"}
              </p>
              <p className="mt-3 text-2xs leading-relaxed text-muted">
                Pesanan yang masuk di luar jam kerja akan dibalas pada hari kerja berikutnya. Kamu
                tetap bisa mengisi form order kapan saja.
              </p>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-line bg-brand-25 p-6 sm:p-7">
              <div>
                <h3 className="text-sm font-bold text-ink">Sudah tahu style-nya?</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  Langsung isi form order — lebih cepat, dan admin langsung dapat detail brief-mu.
                </p>
              </div>
              <Link to="/order" className="btn btn-primary btn-sm mt-5 w-full">
                Isi form order <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
