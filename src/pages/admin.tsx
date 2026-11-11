import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowUpRight,
  Check,
  Eye,
  EyeOff,
  ImagePlus,
  Inbox,
  Layers3,
  MessageCircle,
  PackageOpen,
  PanelsTopLeft,
  Pencil,
  Plus,
  Quote,
  Save,
  Settings2,
  Sparkles,
  Tags,
  Trash2,
  TrendingUp,
  UploadCloud,
  UsersRound,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { AdminLayout, AvatarArt, Logo, PageToolbar, Rating, StatusPill } from "../components/ui";
import { useAuth } from "../contexts/AuthContext";
import { useSettings } from "../contexts/SettingsContext";
import { api, getImageUrl, rupiah } from "../lib/api";
import type { Avatar, Category, Order, Testimonial } from "../lib/types";

// ==========================================
// 1. ADMIN LOGIN PAGE
// ==========================================
const loginSchema = z.object({
  email: z.string().email("Masukkan email yang valid."),
  password: z.string().min(6, "Password minimal 6 karakter."),
});
type LoginForm = z.infer<typeof loginSchema>;

export function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "admin@avastudio.id", password: "AdminAvaStudio2026!" },
  });

  const onSubmit = async (values: LoginForm) => {
    try {
      const res = await api.post("/admin/login", values);
      if (res.data.success) {
        login(res.data.data.token, res.data.data.user);
        toast.success("Selamat datang kembali di Admin Workspace!");
        navigate("/admin");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Gagal masuk. Periksa kembali email dan password kamu.",
      );
    }
  };

  return (
    <div className="login-page">
      <section className="login-brand">
        <Logo />
        <div className="login-visual">
          <div className="login-art-card back">
            <AvatarArt name="Strawberry Dream" />
          </div>
          <div className="login-art-card">
            <AvatarArt name="AVA Studio" />
          </div>
          <span className="login-floating">
            <Sparkles /> <b>Make every AVA feel special.</b>
          </span>
        </div>
        <div className="login-quote">
          <p>“Kelola katalog, kategori, dan pesanan joki styling AVA Roblox secara real-time.”</p>
          <span>AVA Studio Team</span>
        </div>
      </section>

      <section className="login-form-wrap">
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <span className="mobile-login-logo">
            <Logo />
          </span>
          <p className="eyebrow">
            <Sparkles size={13} /> Admin workspace
          </p>
          <h1>Welcome back!</h1>
          <p>Masuk untuk mengelola katalog, kategori, dan pesanan AVA Studio.</p>

          <label className="field">
            <span>Email Admin</span>
            <input {...register("email")} placeholder="admin@avastudio.id" />
            {errors.email && <small className="field-error">{errors.email.message}</small>}
          </label>

          <label className="field">
            <span>Password</span>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="icon-button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <small className="field-error">{errors.password.message}</small>}
          </label>

          <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-lg w-full">
            {isSubmitting ? "Memverifikasi..." : "Masuk ke Dashboard"}
          </button>

          <p className="mt-1 text-center text-2xs text-faint">
            Akses khusus tim AVA Studio. Jangan bagikan kredensial admin kamu.
          </p>
        </form>
      </section>
    </div>
  );
}

// ==========================================
// 2. DASHBOARD OVERVIEW PAGE
// ==========================================
const dashboardQuickActions = [
  { label: "Avatar baru", icon: Plus, path: "/admin/avatars/new" },
  { label: "Kategori", icon: Tags, path: "/admin/categories" },
  { label: "Pesanan", icon: PackageOpen, path: "/admin/orders" },
  { label: "Pengaturan", icon: Settings2, path: "/admin/settings" },
];

export function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    api
      .get("/admin/dashboard")
      .then((res) => {
        if (res.data.success) {
          setStats(res.data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const statItems = [
    {
      label: "Total Avatar",
      value: stats?.counts?.total_avatars ?? 0,
      note: "Aktif di katalog",
      icon: Layers3,
      path: "/admin/avatars",
    },
    {
      label: "Total Kategori",
      value: stats?.counts?.total_categories ?? 0,
      note: "Dinamis & terkelola",
      icon: Tags,
      path: "/admin/categories",
    },
    {
      label: "Pesanan Baru",
      value: stats?.counts?.pending_orders ?? 0,
      note: "Menunggu konfirmasi",
      icon: PackageOpen,
      path: "/admin/orders",
      accent: true,
    },
    {
      label: "Views Katalog",
      value: stats?.counts?.total_views ?? 0,
      note: "Tayangan avatar",
      icon: TrendingUp,
      path: "/admin/avatars",
    },
  ];

  const firstName = user?.name?.split(" ")[0] || "Admin";
  const pendingOrders = stats?.counts?.pending_orders ?? 0;

  return (
    <AdminLayout
      title="Dashboard Overview"
      subtitle="Ringkasan performa katalog dan pesanan aktif AVA Studio."
    >
      <section className="admin-intro">
        <div className="admin-intro-copy">
          <h2>Halo, {firstName}</h2>
          <p>
            {loading
              ? "Memuat ringkasan katalog..."
              : pendingOrders > 0
                ? `Ada ${pendingOrders} pesanan baru yang menunggu konfirmasi.`
                : "Semua pesanan sudah tertangani. Katalog siap dikelola."}
          </p>
        </div>
        <div className="admin-intro-actions">
          <Link to="/admin/avatars/new" className="btn btn-primary">
            <Plus size={16} /> Tambah avatar
          </Link>
          <Link to="/admin/orders" className="btn btn-outline">
            <Inbox size={16} /> Lihat pesanan
          </Link>
        </div>
      </section>

      {/* METRIC CARDS */}
      <div className="stat-grid">
        {statItems.map(({ label, value, note, icon: Icon, path, accent }) => (
          <Link key={label} to={path} className={`stat-card ${accent ? "is-accent" : ""}`}>
            <span className="stat-icon">
              <Icon size={18} />
            </span>
            <div className="stat-body">
              <span className="stat-label">{label}</span>
              <b className="stat-value">{loading ? "..." : value}</b>
              <span className="stat-note">{note}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* RECENT ORDERS & SIDE PANELS */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="admin-panel lg:col-span-2">
          <div className="panel-head">
            <div>
              <h3>Pesanan Terbaru</h3>
              <p>Pantau pesanan yang baru masuk dari website.</p>
            </div>
            <Link to="/admin/orders" className="panel-link inline-flex items-center gap-1">
              Lihat semua <ArrowUpRight size={13} />
            </Link>
          </div>

          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>No. Order</th>
                  <th>Pelanggan</th>
                  <th>Paket / Avatar</th>
                  <th>Status</th>
                  <th>Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {loading &&
                  [0, 1, 2].map((row) => (
                    <tr key={row}>
                      <td colSpan={5}>
                        <div className="skeleton h-9 w-full" />
                      </td>
                    </tr>
                  ))}
                {!loading &&
                  stats?.recent_orders?.map((ord: Order) => (
                    <tr key={ord.id}>
                      <td className="font-mono text-xs font-bold text-brand-700">
                        {ord.order_number}
                      </td>
                      <td>
                        <b className="block text-xs font-bold text-ink">{ord.customer_name}</b>
                        <small className="text-2xs text-muted">@{ord.roblox_username}</small>
                      </td>
                      <td className="text-xs text-ink-soft">
                        {ord.avatar?.name || ord.requested_style || "-"}
                      </td>
                      <td>
                        <StatusPill status={ord.status} />
                      </td>
                      <td className="text-2xs text-muted">
                        {new Date(ord.created_at).toLocaleDateString("id-ID")}
                      </td>
                    </tr>
                  ))}
                {!loading && (!stats?.recent_orders || stats.recent_orders.length === 0) && (
                  <tr>
                    <td colSpan={5}>
                      <div className="py-8 text-center text-xs text-muted">
                        Belum ada pesanan terbaru.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-5">
          <div className="admin-panel">
            <div className="panel-head">
              <div>
                <h3>Top Avatar</h3>
                <p>Paling sering dilihat pengunjung.</p>
              </div>
              <Link to="/admin/avatars" className="row-action" aria-label="Kelola avatar">
                <PanelsTopLeft size={15} />
              </Link>
            </div>
            <div className="top-list">
              {stats?.top_avatars?.map((ava: Avatar, index: number) => (
                <div key={ava.id} className="top-row">
                  <span className={`rank-badge ${index < 3 ? "is-top" : ""}`}>{index + 1}</span>
                  <div className="table-thumb">
                    <AvatarArt imageSrc={ava.cover_image} name={ava.name} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <b className="block truncate text-xs font-bold text-ink">{ava.name}</b>
                    <span className="text-2xs font-semibold text-brand-700">
                      {rupiah(ava.starting_price)}
                    </span>
                  </div>
                  <div className="top-metric">
                    <b>{ava.views_count}</b>
                    <span>views</span>
                  </div>
                </div>
              ))}
              {(!stats?.top_avatars || stats.top_avatars.length === 0) && (
                <p className="py-4 text-center text-xs text-muted">Belum ada data avatar.</p>
              )}
            </div>
          </div>

          <div className="admin-panel">
            <div className="panel-head">
              <div>
                <h3>Aksi Cepat</h3>
                <p>Shortcut pekerjaan harian.</p>
              </div>
            </div>
            <div className="quick-grid">
              {dashboardQuickActions.map(({ label, icon: Icon, path }) => (
                <Link key={label} to={path} className="quick-tile">
                  <span className="quick-icon">
                    <Icon size={15} />
                  </span>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

// ==========================================
// 3. AVATARS ADMIN PAGE
// ==========================================
export function AvatarsAdminPage() {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAvatars = async () => {
    setLoading(true);
    try {
      const res = await api.get<{ success: boolean; data: Avatar[] }>(
        "/admin/avatars?all_status=1&per_page=100",
      );
      if (res.data.success) {
        setAvatars(res.data.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvatars();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Yakin ingin menghapus avatar "${name}"?`)) return;
    try {
      await api.delete(`/admin/avatars/${id}`);
      toast.success("Avatar berhasil dihapus!");
      setAvatars((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      toast.error("Gagal menghapus avatar.");
    }
  };

  const filtered = useMemo(() => {
    return avatars.filter(
      (a) =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.description.toLowerCase().includes(search.toLowerCase()),
    );
  }, [avatars, search]);

  return (
    <AdminLayout
      title="Manajemen Avatar"
      subtitle="Kelola katalog avatar Roblox, foto cover, galeri, dan harga mulai."
    >
      <PageToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Cari nama atau deskripsi avatar..."
      >
        <Link to="/admin/avatars/new" className="btn btn-primary">
          <Plus size={17} /> Tambah Avatar
        </Link>
      </PageToolbar>

      <div className="table-shell">
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Kategori</th>
                <th>Harga Mulai</th>
                <th>Badge</th>
                <th>Status</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading &&
                [0, 1, 2, 3].map((row) => (
                  <tr key={row}>
                    <td colSpan={6}>
                      <div className="skeleton h-12 w-full" />
                    </td>
                  </tr>
                ))}

              {!loading &&
                filtered.map((ava) => (
                  <tr key={ava.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="table-thumb">
                          <AvatarArt imageSrc={ava.cover_image} name={ava.name} />
                        </div>
                        <div className="min-w-0">
                          <b className="block truncate text-xs font-bold text-ink">{ava.name}</b>
                          <small className="line-clamp-1 max-w-xs text-2xs text-muted">
                            {ava.description}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {ava.categories?.map((c) => (
                          <span key={c.id} className="tag">
                            {c.name}
                          </span>
                        ))}
                        {(!ava.categories || ava.categories.length === 0) && (
                          <span className="text-2xs text-faint">Tanpa kategori</span>
                        )}
                      </div>
                    </td>
                    <td className="text-xs font-bold text-brand-700">
                      {rupiah(ava.starting_price)}
                    </td>
                    <td>
                      {ava.badge ? (
                        <span className="badge">{ava.badge}</span>
                      ) : (
                        <span className="text-2xs text-faint">-</span>
                      )}
                    </td>
                    <td>
                      <StatusPill status={ava.status} />
                    </td>
                    <td>
                      <div className="row-actions">
                        <Link
                          to={`/admin/avatars/${ava.id}/edit`}
                          className="row-action"
                          title="Edit Avatar"
                          aria-label={`Edit ${ava.name}`}
                        >
                          <Pencil size={15} />
                        </Link>
                        <button
                          onClick={() => handleDelete(ava.id, ava.name)}
                          className="row-action is-danger"
                          title="Hapus Avatar"
                          aria-label={`Hapus ${ava.name}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state is-plain">
                      <span className="empty-icon">
                        <PanelsTopLeft size={20} />
                      </span>
                      <h3>Avatar tidak ditemukan</h3>
                      <p>
                        Coba kata kunci lain, atau tambahkan avatar baru untuk mulai mengisi
                        katalog.
                      </p>
                      <Link to="/admin/avatars/new" className="btn btn-primary btn-sm">
                        <Plus size={15} /> Tambah Avatar
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {!loading && filtered.length > 0 && (
          <div className="pagination">
            <span>
              Menampilkan <b>{filtered.length}</b> dari <b>{avatars.length}</b> avatar
            </span>
            <span className="hidden sm:inline">Data diperbarui otomatis saat kamu mengedit.</span>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

// ==========================================
// 4. AVATAR FORM PAGE (ADD & EDIT)
// ==========================================
export function AvatarFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      description: "",
      starting_price: 35000,
      badge: "",
      status: "published",
      is_featured: false,
    },
  });

  useEffect(() => {
    api.get<{ success: boolean; data: Category[] }>("/categories").then((res) => {
      if (res.data.success) setCategories(res.data.data);
    });

    if (isEdit && id) {
      api.get<{ success: boolean; data: Avatar }>(`/admin/avatars/${id}`).then((res) => {
        if (res.data.success) {
          const a = res.data.data;
          reset({
            name: a.name,
            description: a.description,
            starting_price: a.starting_price,
            badge: a.badge || "",
            status: a.status,
            is_featured: a.is_featured,
          });
          setSelectedCategories(a.categories?.map((c) => c.id) || []);
          if (a.cover_image) setCoverPreview(getImageUrl(a.cover_image));
          setExistingImages(a.images || []);
        }
      });
    }
  }, [id, isEdit, reset]);

  const handleCategoryToggle = (catId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((i) => i !== catId) : [...prev, catId],
    );
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setGalleryFiles(Array.from(e.target.files));
    }
  };

  const handleDeleteExistingImage = async (imageId: number) => {
    if (!window.confirm("Hapus foto galeri ini?")) return;
    try {
      await api.delete(`/admin/avatar-images/${imageId}`);
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
      toast.success("Foto galeri dihapus!");
    } catch {
      toast.error("Gagal menghapus foto.");
    }
  };

  const onSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("starting_price", String(values.starting_price));
      formData.append("badge", values.badge || "");
      formData.append("status", values.status);
      formData.append("is_featured", values.is_featured ? "1" : "0");

      selectedCategories.forEach((catId) => {
        formData.append("category_ids[]", String(catId));
      });

      if (coverFile) {
        formData.append("cover_image", coverFile);
      }

      galleryFiles.forEach((file) => {
        formData.append("gallery_images[]", file);
      });

      if (isEdit && id) {
        // Use POST with _method=PUT or direct POST update endpoint
        await api.post(`/admin/avatars/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Avatar berhasil diperbarui!");
      } else {
        await api.post("/admin/avatars", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Avatar baru berhasil ditambahkan!");
      }

      navigate("/admin/avatars");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Gagal menyimpan avatar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title={isEdit ? "Edit Avatar" : "Tambah Avatar Baru"}
      subtitle="Atur foto cover, galeri, nama, harga, dan multi-kategori avatar."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="form-layout">
        <div className="space-y-6">
          {/* DETAIL UTAMA */}
          <div className="form-card">
            <div className="form-section-head">
              <span className="form-step">1</span>
              <div>
                <h3>Detail avatar</h3>
                <p>Informasi dasar yang tampil di kartu katalog dan halaman detail.</p>
              </div>
            </div>

            <div className="form-grid">
              <div>
                <label className="field-label">
                  Nama Avatar <span className="text-brand-600">*</span>
                </label>
                <input
                  {...register("name", { required: true })}
                  placeholder="Contoh: Strawberry Dream"
                  className="input"
                />
              </div>

              <div>
                <label className="field-label">
                  Biaya Jasa Mulai (Rp) <span className="text-brand-600">*</span>
                </label>
                <input
                  type="number"
                  {...register("starting_price", { required: true })}
                  placeholder="35000"
                  className="input"
                />
              </div>

              <div>
                <label className="field-label">Badge Tampilan</label>
                <input
                  {...register("badge")}
                  placeholder="Contoh: Paling disukai, Trending, New"
                  className="input"
                />
                <small className="field-hint">Kosongkan jika tidak perlu penanda khusus.</small>
              </div>

              <div>
                <label className="field-label">Status Publikasi</label>
                <select {...register("status")} className="select">
                  <option value="published">Published — tampil di katalog</option>
                  <option value="draft">Draft — simpan dulu</option>
                </select>
              </div>

              <div className="span-2">
                <label className="field-label">
                  Deskripsi Lengkap <span className="text-brand-600">*</span>
                </label>
                <textarea
                  rows={4}
                  {...register("description", { required: true })}
                  placeholder="Jelaskan detail look, palet warna, dan vibe avatar..."
                  className="textarea"
                />
                <small className="field-hint">
                  Tulis 2–3 kalimat yang menggambarkan karakter visual avatar ini.
                </small>
              </div>

              <div className="span-2">
                <label className="option-row">
                  <input type="checkbox" {...register("is_featured")} />
                  <span>
                    <b className="block text-xs font-bold text-ink">
                      Tampilkan di koleksi unggulan
                    </b>
                    <span className="text-2xs text-muted">
                      Avatar unggulan muncul di section featured pada landing page.
                    </span>
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* KATEGORI */}
          <div className="form-card">
            <div className="form-section-head">
              <span className="form-step">2</span>
              <div>
                <h3>Kategori avatar</h3>
                <p>Satu avatar dapat masuk ke beberapa kategori sekaligus.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isSelected = selectedCategories.includes(cat.id);
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => handleCategoryToggle(cat.id)}
                    aria-pressed={isSelected}
                    className={`chip ${isSelected ? "is-active" : ""}`}
                  >
                    {isSelected ? <Check size={13} /> : <Plus size={13} />}
                    {cat.name}
                  </button>
                );
              })}
              {categories.length === 0 && (
                <p className="text-xs text-muted">
                  Belum ada kategori. Tambahkan kategori terlebih dahulu.
                </p>
              )}
            </div>
            <p className="mt-3 text-2xs text-faint">{selectedCategories.length} kategori dipilih</p>
          </div>

          <div className="form-actions">
            <Link to="/admin/avatars" className="btn btn-outline">
              Batal
            </Link>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              <Save size={16} />
              {isSubmitting ? "Menyimpan..." : isEdit ? "Perbarui Avatar" : "Simpan Avatar"}
            </button>
          </div>
        </div>

        {/* MEDIA SIDEBAR */}
        <aside className="sticky-col">
          <div className="form-card">
            <div className="form-section-head">
              <span className="form-step">3</span>
              <div>
                <h3>Foto cover</h3>
                <p>Gunakan rasio 4:5 agar kartu katalog terlihat rapi.</p>
              </div>
            </div>

            <label className="media-drop">
              {coverPreview ? (
                <div className="media-preview">
                  <img src={coverPreview} alt="Cover Preview" />
                </div>
              ) : (
                <>
                  <span className="empty-icon">
                    <UploadCloud size={20} />
                  </span>
                  <b className="text-xs font-bold text-ink">Unggah foto cover</b>
                  <span className="text-2xs text-muted">PNG, JPG, WebP · maks 5MB</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleCoverChange} />
            </label>
            {coverPreview && (
              <p className="mt-2 text-center text-2xs text-faint">
                Klik gambar untuk mengganti cover.
              </p>
            )}
          </div>

          <div className="form-card">
            <div className="flex items-center justify-between gap-3 border-b border-line pb-3">
              <h3 className="flex items-center gap-2 text-sm font-extrabold text-ink">
                <ImagePlus size={15} className="text-brand-600" /> Galeri foto
              </h3>
              {existingImages.length > 0 && (
                <span className="badge">{existingImages.length} tersimpan</span>
              )}
            </div>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleGalleryChange}
              className="file-input mt-4"
            />
            <p className="mt-2 text-2xs text-faint">
              Bisa pilih beberapa foto sekaligus untuk melengkapi portofolio.
            </p>

            {galleryFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                {galleryFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between gap-2 rounded-xl border border-line bg-brand-25 px-3 py-2"
                  >
                    <span className="truncate text-2xs text-muted">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setGalleryFiles((prev) => prev.filter((_, i) => i !== index))}
                      className="text-faint transition-colors hover:text-red-500"
                      aria-label={`Hapus ${file.name} dari unggahan`}
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {existingImages.length > 0 && (
              <>
                <span className="mt-4 block text-2xs font-extrabold uppercase tracking-[0.12em] text-faint">
                  Foto tersimpan
                </span>
                <div className="gallery-grid mt-2">
                  {existingImages.map((img) => (
                    <div key={img.id} className="gallery-thumb">
                      <img src={getImageUrl(img.image_path) || ""} alt="" />
                      <button
                        type="button"
                        onClick={() => handleDeleteExistingImage(img.id)}
                        aria-label="Hapus foto galeri"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </aside>
      </form>
    </AdminLayout>
  );
}

// ==========================================
// 5. CATEGORIES ADMIN PAGE
// ==========================================
export function CategoriesAdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get<{ success: boolean; data: Category[] }>("/admin/categories?all=1");
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setName("");
    setDescription("");
    setIsActive(true);
    setThumbnailFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || "");
    setIsActive(cat.is_active);
    setThumbnailFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number, catName: string) => {
    if (!window.confirm(`Yakin ingin menghapus kategori "${catName}"?`)) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      toast.success("Kategori berhasil dihapus!");
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch {
      toast.error("Gagal menghapus kategori.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Nama kategori wajib diisi.");
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("is_active", isActive ? "1" : "0");
      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      if (editingCategory) {
        await api.post(`/admin/categories/${editingCategory.id}`, formData);
        toast.success("Kategori berhasil diperbarui!");
      } else {
        await api.post("/admin/categories", formData);
        toast.success("Kategori baru berhasil ditambahkan!");
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menyimpan kategori.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title="Manajemen Kategori"
      subtitle="Admin bebas menambah, mengubah, atau menghapus kategori avatar secara dinamis."
    >
      <div className="page-toolbar">
        <p className="max-w-lg text-xs leading-relaxed text-muted">
          Kategori yang dibuat di sini akan langsung tampil pada filter katalog public website.
        </p>
        <div className="toolbar-actions">
          <button onClick={openAddModal} className="btn btn-primary">
            <Plus size={17} /> Tambah Kategori
          </button>
        </div>
      </div>

      <div className="table-shell">
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Kategori</th>
                <th>Slug URL</th>
                <th>Deskripsi</th>
                <th>Total Avatar</th>
                <th>Status</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading &&
                [0, 1, 2].map((row) => (
                  <tr key={row}>
                    <td colSpan={6}>
                      <div className="skeleton h-11 w-full" />
                    </td>
                  </tr>
                ))}

              {!loading &&
                categories.map((cat) => (
                  <tr key={cat.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="table-thumb">
                          {cat.thumbnail ? (
                            <img
                              src={getImageUrl(cat.thumbnail) || ""}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="grid h-full w-full place-items-center text-brand-600">
                              <Tags size={16} />
                            </span>
                          )}
                        </div>
                        <b className="text-xs font-bold text-ink">{cat.name}</b>
                      </div>
                    </td>
                    <td className="font-mono text-2xs text-muted">{cat.slug}</td>
                    <td className="max-w-sm text-2xs text-muted">
                      <span className="line-clamp-1">{cat.description || "-"}</span>
                    </td>
                    <td>
                      <span className="inline-flex min-w-8 items-center justify-center rounded-full border border-brand-100 bg-brand-50 px-2 py-1 text-2xs font-bold text-brand-700">
                        {cat.avatars_count || 0}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-pill ${cat.is_active ? "status-active" : "status-draft"}`}
                      >
                        {cat.is_active ? "Aktif" : "Non-aktif"}
                      </span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="row-action"
                          title="Edit Kategori"
                          aria-label={`Edit ${cat.name}`}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id, cat.name)}
                          className="row-action is-danger"
                          title="Hapus Kategori"
                          aria-label={`Hapus ${cat.name}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {!loading && categories.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state is-plain">
                      <span className="empty-icon">
                        <Tags size={20} />
                      </span>
                      <h3>Belum ada kategori</h3>
                      <p>Tambahkan kategori pertama agar katalog lebih mudah dijelajahi.</p>
                      <button onClick={openAddModal} className="btn btn-primary btn-sm">
                        <Plus size={15} /> Tambah Kategori
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal" role="dialog" aria-modal="true" aria-label="Form kategori">
            <div className="modal-head">
              <div>
                <h3>{editingCategory ? "Edit Kategori" : "Tambah Kategori Baru"}</h3>
                <p className="mt-1 text-xs text-muted">
                  Nama akan otomatis menjadi slug URL katalog.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="icon-button"
                aria-label="Tutup modal"
              >
                <X size={17} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body space-y-4">
                <div>
                  <label className="field-label">
                    Nama Kategori <span className="text-brand-600">*</span>
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: AVA Y2K, AVA Sultan"
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="field-label">Deskripsi Kategori</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Keterangan singkat gaya kategori..."
                    className="textarea"
                  />
                </div>

                <div>
                  <label className="field-label">Thumbnail Kategori</label>
                  <div className="flex items-center gap-3">
                    <div className="table-thumb">
                      {editingCategory?.thumbnail ? (
                        <img
                          src={getImageUrl(editingCategory.thumbnail) || ""}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="grid h-full w-full place-items-center text-brand-600">
                          <ImagePlus size={16} />
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                        className="file-input"
                      />
                      <small className="mt-1 block text-2xs text-faint">
                        {thumbnailFile
                          ? `File dipilih: ${thumbnailFile.name}`
                          : "Biarkan kosong jika tidak ingin mengganti."}
                      </small>
                    </div>
                  </div>
                </div>

                <label className="option-row">
                  <input
                    type="checkbox"
                    id="cat-active"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                  <span>
                    <b className="block text-xs font-bold text-ink">Kategori aktif & ditampilkan</b>
                    <span className="text-2xs text-muted">
                      Kategori non-aktif tetap tersimpan namun disembunyikan dari katalog.
                    </span>
                  </span>
                </label>
              </div>

              <div className="modal-foot">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-outline"
                >
                  Batal
                </button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                  <Save size={15} /> {isSubmitting ? "Menyimpan..." : "Simpan Kategori"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

// ==========================================
// 6. ORDERS ADMIN PAGE
// ==========================================
const orderStatusOptions = [
  { value: "all", label: "Semua" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "in_progress", label: "In progress" },
  { value: "revision", label: "Revision" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function OrdersAdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [adminNotes, setAdminNotes] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get<{ success: boolean; data: Order[] }>("/admin/orders", {
        params: { status: statusFilter, per_page: 50 },
      });
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const openDetail = (ord: Order) => {
    setSelectedOrder(ord);
    setNewStatus(ord.status);
    setAdminNotes(ord.admin_notes || "");
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    setIsUpdating(true);
    try {
      const res = await api.put<{ success: boolean; data: Order }>(
        `/admin/orders/${selectedOrder.id}`,
        {
          status: newStatus,
          admin_notes: adminNotes,
        },
      );
      if (res.data.success) {
        toast.success("Status pesanan diperbarui!");
        setSelectedOrder(null);
        fetchOrders();
      }
    } catch {
      toast.error("Gagal memperbarui status.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AdminLayout
      title="Manajemen Pesanan"
      subtitle="Pantau dan kelola seluruh pesanan pelanggan yang masuk dari website."
    >
      <div className="page-toolbar">
        <div className="filter-row">
          {orderStatusOptions.map(({ value, label }) => (
            <button
              key={value}
              className={`chip chip-sm ${statusFilter === value ? "is-active" : ""}`}
              onClick={() => setStatusFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="text-2xs text-muted">
          {loading ? "Memuat pesanan..." : `${orders.length} pesanan ditampilkan`}
        </span>
      </div>

      <div className="table-shell">
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>No. Order</th>
                <th>Pelanggan</th>
                <th>WhatsApp</th>
                <th>Style / Referensi</th>
                <th>Budget</th>
                <th>Status</th>
                <th className="text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading &&
                [0, 1, 2, 3].map((row) => (
                  <tr key={row}>
                    <td colSpan={7}>
                      <div className="skeleton h-11 w-full" />
                    </td>
                  </tr>
                ))}

              {!loading &&
                orders.map((ord) => (
                  <tr key={ord.id}>
                    <td className="font-mono text-2xs font-bold text-brand-700">
                      {ord.order_number}
                    </td>
                    <td>
                      <b className="block text-xs font-bold text-ink">{ord.customer_name}</b>
                      <small className="text-2xs text-muted">@{ord.roblox_username}</small>
                    </td>
                    <td>
                      <a
                        href={`https://wa.me/${ord.whatsapp.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-2xs font-bold text-brand-700 hover:underline"
                      >
                        <MessageCircle size={13} /> {ord.whatsapp}
                      </a>
                    </td>
                    <td className="text-2xs text-ink-soft">
                      {ord.avatar?.name || ord.requested_style || "-"}
                    </td>
                    <td className="text-xs font-bold text-ink-soft">{rupiah(ord.budget)}</td>
                    <td>
                      <StatusPill status={ord.status} />
                    </td>
                    <td>
                      <div className="row-actions">
                        <button onClick={() => openDetail(ord)} className="btn btn-outline btn-sm">
                          Kelola
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {!loading && orders.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state is-plain">
                      <span className="empty-icon">
                        <Inbox size={20} />
                      </span>
                      <h3>Belum ada pesanan</h3>
                      <p>Tidak ada pesanan dengan status ini. Coba pilih filter lain.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="modal-backdrop">
          <div
            className="modal modal-lg"
            role="dialog"
            aria-modal="true"
            aria-label="Detail pesanan"
          >
            <div className="modal-head">
              <div>
                <h3>Rincian Pesanan</h3>
                <p className="mt-1 font-mono text-2xs font-bold text-brand-700">
                  {selectedOrder.order_number}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="icon-button"
                aria-label="Tutup detail pesanan"
              >
                <X size={17} />
              </button>
            </div>

            <div className="modal-body space-y-4">
              <div className="grid grid-cols-1 gap-3 rounded-xl border border-line bg-brand-25 p-4 text-xs sm:grid-cols-2">
                <div>
                  <span className="block text-2xs font-bold uppercase tracking-[0.08em] text-faint">
                    Pelanggan
                  </span>
                  <b className="text-ink">{selectedOrder.customer_name}</b>
                  <span className="block text-2xs text-muted">
                    @{selectedOrder.roblox_username}
                  </span>
                </div>
                <div>
                  <span className="block text-2xs font-bold uppercase tracking-[0.08em] text-faint">
                    WhatsApp
                  </span>
                  <b className="text-ink">{selectedOrder.whatsapp}</b>
                </div>
                <div>
                  <span className="block text-2xs font-bold uppercase tracking-[0.08em] text-faint">
                    Style / Referensi
                  </span>
                  <b className="text-ink">
                    {selectedOrder.avatar?.name || selectedOrder.requested_style || "-"}
                  </b>
                </div>
                <div>
                  <span className="block text-2xs font-bold uppercase tracking-[0.08em] text-faint">
                    Budget
                  </span>
                  <b className="text-ink">{rupiah(selectedOrder.budget)}</b>
                </div>
                <div className="sm:col-span-2">
                  <span className="block text-2xs font-bold uppercase tracking-[0.08em] text-faint">
                    Catatan Pesanan Pelanggan
                  </span>
                  <p className="mt-1 rounded-xl border border-line bg-white p-3 text-2xs leading-relaxed text-ink-soft">
                    {selectedOrder.request_notes || "Tidak ada catatan tambahan."}
                  </p>
                </div>
              </div>

              <div className="form-grid">
                <div>
                  <label className="field-label">Ubah Status Pesanan</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="select"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="revision">Revision</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="span-2">
                  <label className="field-label">Catatan Internal Admin</label>
                  <textarea
                    rows={3}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Catatan pengerjaan atau riwayat revisi..."
                    className="textarea"
                  />
                </div>
              </div>
            </div>

            <div className="modal-foot">
              <a
                href={`https://wa.me/${selectedOrder.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-sm mr-auto"
              >
                <MessageCircle size={14} /> Chat WhatsApp
              </a>
              <button onClick={() => setSelectedOrder(null)} className="btn btn-outline">
                Tutup
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={isUpdating}
                className="btn btn-primary"
              >
                <Save size={15} /> {isUpdating ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

// ==========================================
// 7. TESTIMONIALS ADMIN PAGE
// ==========================================
export function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await api.get<{ success: boolean; data: Testimonial[] }>(
        "/admin/testimonials?all=1",
      );
      if (res.data.success) setTestimonials(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Hapus testimoni ini?")) return;
    try {
      await api.delete(`/admin/testimonials/${id}`);
      toast.success("Testimoni dihapus!");
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } catch {
      toast.error("Gagal menghapus testimoni.");
    }
  };

  return (
    <AdminLayout
      title="Manajemen Testimoni"
      subtitle="Kelola ulasan dan rating pelanggan yang tampil di website."
    >
      <div className="page-toolbar">
        <p className="max-w-lg text-xs leading-relaxed text-muted">
          Testimoni yang tampil di landing page berasal dari pelanggan yang sudah menyelesaikan
          pesanan.
        </p>
        <span className="badge">
          <UsersRound size={12} /> {testimonials.length} testimoni
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="skeleton h-48" />
          ))}
        </div>
      ) : testimonials.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">
            <Quote size={20} />
          </span>
          <h3>Belum ada testimoni</h3>
          <p>Testimoni dari pelanggan akan muncul di sini setelah mereka mengirim ulasan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <article
              key={t.id}
              className="flex flex-col justify-between rounded-2xl border border-line bg-white p-5 shadow-soft"
            >
              <div>
                <div className="mb-3 flex items-start justify-between gap-3">
                  <Rating value={t.rating} />
                  <Quote size={18} className="text-brand-200" />
                </div>
                <p className="text-xs leading-relaxed text-ink-soft">“{t.content}”</p>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
                <div className="flex min-w-0 items-center gap-2">
                  <div className="profile-avatar">{t.customer_name.slice(0, 2).toUpperCase()}</div>
                  <div className="min-w-0">
                    <b className="block truncate text-xs font-bold text-ink">{t.customer_name}</b>
                    <span className="block truncate text-2xs text-muted">
                      {t.roblox_username ? `@${t.roblox_username}` : "Pelanggan AVA Studio"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="row-action is-danger"
                  aria-label={`Hapus testimoni ${t.customer_name}`}
                  title="Hapus testimoni"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

// ==========================================
// 8. WEBSITE SETTINGS ADMIN PAGE
// (DYNAMIC LOGO & BRAND MANAGEMENT)
// ==========================================
export function SettingsAdminPage() {
  const { settings, refreshSettings } = useSettings();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      site_name: settings.site_name || "AVA Studio",
      site_tagline: settings.site_tagline || "Your Avatar, Your Style ♡",
      whatsapp_number: settings.whatsapp_number || "6281234567890",
      instagram_username: settings.instagram_username || "@avastudio.id",
      instagram_url: settings.instagram_url || "https://instagram.com",
      hero_headline: settings.hero_headline || "Avatar kamu, main character-nya kamu.",
      hero_subheadline:
        settings.hero_subheadline ||
        "Kami bantu wujudkan avatar Roblox yang bukan cuma bagus, tapi benar-benar terasa seperti kamu.",
      hero_badge: settings.hero_badge || "Styling avatar, made personal",
      operating_hours: settings.operating_hours || "Senin–Sabtu, 09.00–20.00 WIB",
      contact_email: settings.contact_email || "halo@avastudio.id",
      footer_about:
        settings.footer_about ||
        "Jasa styling avatar Roblox yang dibuat personal, detail, dan penuh karakter aesthetic.",
    },
  });

  useEffect(() => {
    reset({
      site_name: settings.site_name || "AVA Studio",
      site_tagline: settings.site_tagline || "Your Avatar, Your Style ♡",
      whatsapp_number: settings.whatsapp_number || "6281234567890",
      instagram_username: settings.instagram_username || "@avastudio.id",
      instagram_url: settings.instagram_url || "https://instagram.com",
      hero_headline: settings.hero_headline || "Avatar kamu, main character-nya kamu.",
      hero_subheadline: settings.hero_subheadline || "",
      hero_badge: settings.hero_badge || "",
      operating_hours: settings.operating_hours || "",
      contact_email: settings.contact_email || "",
      footer_about: settings.footer_about || "",
    });

    if (settings.site_logo) {
      setLogoPreview(getImageUrl(settings.site_logo));
    }
  }, [settings, reset]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFaviconFile(file);
    }
  };

  const handleDirectUploadLogo = async () => {
    if (!logoFile) {
      toast.error("Silakan pilih file logo terlebih dahulu!");
      return;
    }
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("site_logo", logoFile);
      const res = await api.post("/admin/settings", formData);
      if (res.data.success) {
        toast.success("Logo brand berhasil diperbarui!");
        await refreshSettings();
        setLogoFile(null);
      }
    } catch (err: any) {
      const errors = err.response?.data?.errors;
      const msg = errors ? Object.values(errors).flat()[0] : err.response?.data?.message;
      toast.error(String(msg || "Gagal mengunggah logo."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLogo = async () => {
    if (!window.confirm("Hapus logo kustom dan kembali ke ikon estetis bawaan?")) return;
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("site_logo", "__DELETE__");
      const res = await api.post("/admin/settings", formData);
      if (res.data.success) {
        toast.success("Logo kustom dihapus! Menggunakan ikon estetis.");
        setLogoPreview(null);
        setLogoFile(null);
        await refreshSettings();
      }
    } catch {
      toast.error("Gagal menghapus logo.");
    } finally {
      setIsSaving(false);
    }
  };

  const onSubmit = async (values: any) => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key !== "site_logo" && key !== "site_favicon") {
          formData.append(key, values[key] ?? "");
        }
      });

      if (logoFile) {
        formData.append("site_logo", logoFile);
      }
      if (faviconFile) {
        formData.append("site_favicon", faviconFile);
      }

      const res = await api.post("/admin/settings", formData);
      if (res.data.success) {
        toast.success("Pengaturan website dan logo berhasil disimpan!");
        await refreshSettings();
        setLogoFile(null);
        setFaviconFile(null);
      }
    } catch (err: any) {
      console.error(err);
      const errors = err.response?.data?.errors;
      if (errors) {
        const firstError = Object.values(errors).flat()[0];
        toast.error(String(firstError));
      } else {
        toast.error(err.response?.data?.message || "Gagal menyimpan pengaturan.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Pengaturan Website"
      subtitle="Ubah logo brand, favicon, nomor WhatsApp, akun sosial media, dan teks promosi."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="form-layout">
        <div className="space-y-6">
          {/* BRAND TEXT */}
          <div className="form-card">
            <div className="form-section-head">
              <span className="form-step">1</span>
              <div>
                <h3>Identitas brand</h3>
                <p>Nama dan tagline yang tampil di navbar, footer, dan judul tab.</p>
              </div>
            </div>

            <div className="form-grid">
              <div>
                <label className="field-label">Nama Brand Website</label>
                <input {...register("site_name")} placeholder="AVA Studio" className="input" />
              </div>

              <div>
                <label className="field-label">Tagline Brand</label>
                <input
                  {...register("site_tagline")}
                  placeholder="Your Avatar, Your Style ♡"
                  className="input"
                />
              </div>
            </div>
          </div>

          {/* HERO */}
          <div className="form-card">
            <div className="form-section-head">
              <span className="form-step">2</span>
              <div>
                <h3>Hero landing page</h3>
                <p>Kalimat utama yang pertama dilihat pengunjung di halaman beranda.</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="span-2">
                <label className="field-label">Hero Badge</label>
                <input
                  {...register("hero_badge")}
                  placeholder="Styling avatar, made personal"
                  className="input"
                />
              </div>

              <div className="span-2">
                <label className="field-label">Hero Headline Promosi</label>
                <input
                  {...register("hero_headline")}
                  placeholder="Avatar kamu, main character-nya kamu."
                  className="input"
                />
              </div>

              <div className="span-2">
                <label className="field-label">Hero Subheadline</label>
                <textarea
                  rows={3}
                  {...register("hero_subheadline")}
                  placeholder="Kami bantu wujudkan avatar Roblox yang bukan cuma bagus..."
                  className="textarea"
                />
              </div>
            </div>
          </div>

          {/* CONTACT */}
          <div className="form-card">
            <div className="form-section-head">
              <span className="form-step">3</span>
              <div>
                <h3>Kontak & sosial media</h3>
                <p>Dipakai untuk tombol WhatsApp, Instagram, dan email di seluruh website.</p>
              </div>
            </div>

            <div className="form-grid">
              <div>
                <label className="field-label">Nomor WhatsApp Admin (Aktif)</label>
                <input
                  {...register("whatsapp_number")}
                  placeholder="6281234567890"
                  className="input"
                />
                <small className="field-hint">
                  Format internasional tanpa spasi, contoh: 6281234567890
                </small>
              </div>

              <div>
                <label className="field-label">Username Instagram</label>
                <input
                  {...register("instagram_username")}
                  placeholder="@avastudio.id"
                  className="input"
                />
              </div>

              <div className="span-2">
                <label className="field-label">Link URL Instagram</label>
                <input
                  {...register("instagram_url")}
                  placeholder="https://instagram.com/avastudio.id"
                  className="input"
                />
              </div>

              <div>
                <label className="field-label">Email Kontak</label>
                <input
                  {...register("contact_email")}
                  placeholder="halo@avastudio.id"
                  className="input"
                />
              </div>

              <div>
                <label className="field-label">Jam Operasional Layanan</label>
                <input
                  {...register("operating_hours")}
                  placeholder="Senin–Sabtu, 09.00–20.00 WIB"
                  className="input"
                />
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="form-card">
            <div className="form-section-head">
              <span className="form-step">4</span>
              <div>
                <h3>Footer website</h3>
                <p>Deskripsi singkat brand yang tampil di bagian bawah halaman.</p>
              </div>
            </div>

            <div>
              <label className="field-label">Tentang Brand (Footer)</label>
              <textarea
                rows={3}
                {...register("footer_about")}
                placeholder="Jasa styling avatar Roblox yang dibuat personal, detail, dan penuh karakter aesthetic."
                className="textarea"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={isSaving} className="btn btn-primary">
              <Save size={16} /> {isSaving ? "Menyimpan Pengaturan..." : "Simpan Semua Pengaturan"}
            </button>
          </div>
        </div>

        {/* BRAND VISUAL SIDEBAR */}
        <aside className="sticky-col">
          <div className="form-card">
            <div className="form-section-head">
              <span className="form-step">
                <Sparkles size={15} />
              </span>
              <div>
                <h3>Logo brand</h3>
                <p>Tampil di navbar, footer, dan halaman admin.</p>
              </div>
            </div>

            <div className="grid place-items-center rounded-xl border border-dashed border-line-strong bg-brand-25 p-4">
              <div className="flex h-20 w-full max-w-[13rem] items-center justify-center overflow-hidden rounded-xl border border-line bg-white p-2">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="text-2xs font-bold text-brand-600">Default Icon</span>
                )}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <label className="btn btn-outline btn-sm w-full cursor-pointer justify-center">
                <UploadCloud size={14} /> {logoFile ? "Ganti File Terpilih" : "Pilih File Logo"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </label>

              {logoFile && (
                <button
                  type="button"
                  onClick={handleDirectUploadLogo}
                  disabled={isSaving}
                  className="btn btn-primary btn-sm w-full"
                >
                  <Check size={14} /> {isSaving ? "Mengunggah..." : "Simpan Logo Ini"}
                </button>
              )}

              {settings.site_logo && (
                <button
                  type="button"
                  onClick={handleDeleteLogo}
                  className="w-full text-center text-2xs font-semibold text-red-500 hover:underline"
                >
                  Hapus logo (reset ke bawaan)
                </button>
              )}

              <small className="block text-center text-2xs text-faint">
                {logoFile
                  ? `File: ${logoFile.name} (${Math.round(logoFile.size / 1024)} KB)`
                  : "PNG, WebP, SVG, JPG hingga 50MB."}
              </small>
            </div>
          </div>

          <div className="form-card">
            <div className="flex items-center gap-2 border-b border-line pb-3">
              <ImagePlus size={15} className="text-brand-600" />
              <h3 className="text-sm font-extrabold text-ink">Favicon</h3>
            </div>
            <p className="mt-3 text-2xs leading-relaxed text-muted">
              Ikon kecil yang muncul di sebelah judul tab browser.
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFaviconChange}
              className="file-input mt-3"
            />
            {faviconFile && (
              <p className="mt-2 text-2xs text-faint">File dipilih: {faviconFile.name}</p>
            )}
          </div>

          <div className="rounded-2xl border border-brand-100 bg-brand-25 p-4">
            <h4 className="flex items-center gap-2 text-xs font-extrabold text-brand-800">
              <Sparkles size={14} /> Catatan
            </h4>
            <p className="mt-2 text-2xs leading-relaxed text-muted">
              Perubahan baru aktif setelah kamu menekan “Simpan Semua Pengaturan”. Logo juga bisa
              disimpan langsung lewat tombol simpan logo.
            </p>
          </div>
        </aside>
      </form>
    </AdminLayout>
  );
}
