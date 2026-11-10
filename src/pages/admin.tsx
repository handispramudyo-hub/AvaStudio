import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  Layers3,
  PackageOpen,
  Pencil,
  Plus,
  Save,
  Sparkles,
  Trash2,
  TrendingUp,
  UploadCloud,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { AdminLayout, AvatarArt, Logo, PageToolbar, StatusPill } from "../components/ui";
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
        err.response?.data?.message ||
          "Gagal masuk. Periksa kembali email dan password kamu."
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
          <p className="eyebrow">Admin workspace</p>
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
                aria-label="Tampilkan password"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <small className="field-error">{errors.password.message}</small>
            )}
          </label>

          <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-lg w-full">
            {isSubmitting ? "Memverifikasi..." : "Masuk ke Dashboard"}
          </button>
        </form>
      </section>
    </div>
  );
}

// ==========================================
// 2. DASHBOARD OVERVIEW PAGE
// ==========================================
export function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <AdminLayout
      title="Dashboard Overview"
      subtitle="Ringkasan performa katalog dan pesanan aktif AVA Studio."
    >
      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-label">Total Avatar</span>
            <Layers3 className="text-pink-500" size={20} />
          </div>
          <b className="stat-value">{loading ? "..." : stats?.counts?.total_avatars || 0}</b>
          <span className="text-xs text-muted-foreground">Aktif di katalog</span>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-label">Total Kategori</span>
            <Sparkles className="text-pink-500" size={20} />
          </div>
          <b className="stat-value">{loading ? "..." : stats?.counts?.total_categories || 0}</b>
          <span className="text-xs text-muted-foreground">Dinamis & terkelola</span>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-label">Pesanan Baru</span>
            <PackageOpen className="text-pink-500" size={20} />
          </div>
          <b className="stat-value text-pink-600">
            {loading ? "..." : stats?.counts?.pending_orders || 0}
          </b>
          <span className="text-xs text-muted-foreground">Menunggu konfirmasi</span>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-label">Total Views Katalog</span>
            <TrendingUp className="text-pink-500" size={20} />
          </div>
          <b className="stat-value">{loading ? "..." : stats?.counts?.total_views || 0}</b>
          <span className="text-xs text-muted-foreground">Tayangan avatar</span>
        </div>
      </div>

      {/* RECENT ORDERS & TOP AVATARS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-pink-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Pesanan Terbaru</h3>
            <Link to="/admin/orders" className="text-xs text-pink-600 font-semibold hover:underline">
              Lihat semua pesanan ➔
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-pink-100 text-xs text-muted-foreground">
                  <th className="pb-3">No. Order</th>
                  <th className="pb-3">Pelanggan</th>
                  <th className="pb-3">Paket/Avatar</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-50">
                {stats?.recent_orders?.map((ord: Order) => (
                  <tr key={ord.id} className="hover:bg-pink-50/50">
                    <td className="py-3 font-mono font-medium text-pink-800">{ord.order_number}</td>
                    <td className="py-3">
                      <b>{ord.customer_name}</b>
                      <small className="block text-xs text-muted-foreground">
                        @{ord.roblox_username}
                      </small>
                    </td>
                    <td className="py-3">
                      {ord.avatar?.name || ord.requested_style || "-"}
                    </td>
                    <td className="py-3">
                      <StatusPill status={ord.status} />
                    </td>
                    <td className="py-3 text-xs text-muted-foreground">
                      {new Date(ord.created_at).toLocaleDateString("id-ID")}
                    </td>
                  </tr>
                ))}
                {(!stats?.recent_orders || stats?.recent_orders.length === 0) && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-muted-foreground">
                      Belum ada pesanan terbaru.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-pink-100 p-5 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Top Avatar Terpopuler</h3>
          <div className="space-y-4">
            {stats?.top_avatars?.map((ava: Avatar) => (
              <div key={ava.id} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-pink-100">
                  <AvatarArt imageSrc={ava.cover_image} name={ava.name} />
                </div>
                <div className="flex-1 min-w-0">
                  <b className="block text-sm truncate">{ava.name}</b>
                  <span className="text-xs text-pink-600 font-semibold">{rupiah(ava.starting_price)}</span>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <span className="font-bold text-pink-900">{ava.views_count}</span> views
                </div>
              </div>
            ))}
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
      const res = await api.get<{ success: boolean; data: Avatar[] }>("/admin/avatars?all_status=1&per_page=100");
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
    return avatars.filter((a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [avatars, search]);

  return (
    <AdminLayout
      title="Manajemen Avatar"
      subtitle="Kelola katalog avatar Roblox, foto cover, galeri, dan harga mulai."
    >
      <PageToolbar search={search} onSearch={setSearch}>
        <Link to="/admin/avatars/new" className="btn btn-primary">
          <Plus size={17} /> Tambah Avatar
        </Link>
      </PageToolbar>

      <div className="bg-white rounded-2xl border border-pink-100 overflow-hidden shadow-sm mt-5">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-pink-50/50 border-b border-pink-100 text-xs text-muted-foreground">
              <th className="p-4">Avatar</th>
              <th className="p-4">Kategori</th>
              <th className="p-4">Harga Mulai</th>
              <th className="p-4">Badge</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pink-50">
            {filtered.map((ava) => (
              <tr key={ava.id} className="hover:bg-pink-50/30">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-pink-100">
                      <AvatarArt imageSrc={ava.cover_image} name={ava.name} />
                    </div>
                    <div>
                      <b className="block text-sm">{ava.name}</b>
                      <small className="text-xs text-muted-foreground line-clamp-1 max-w-xs">
                        {ava.description}
                      </small>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {ava.categories?.map((c) => (
                      <span key={c.id} className="text-[11px] bg-pink-100 text-pink-800 px-2 py-0.5 rounded-full font-medium">
                        {c.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4 font-semibold text-pink-700">{rupiah(ava.starting_price)}</td>
                <td className="p-4">{ava.badge ? <span className="badge">{ava.badge}</span> : "-"}</td>
                <td className="p-4">
                  <StatusPill status={ava.status} />
                </td>
                <td className="p-4 text-right space-x-2">
                  <Link
                    to={`/admin/avatars/${ava.id}/edit`}
                    className="p-1.5 rounded-lg border border-pink-200 text-pink-700 hover:bg-pink-50 inline-flex items-center"
                    title="Edit Avatar"
                  >
                    <Pencil size={15} />
                  </Link>
                  <button
                    onClick={() => handleDelete(ava.id, ava.name)}
                    className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 inline-flex items-center"
                    title="Hapus Avatar"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  Tidak ada avatar ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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

  const { register, handleSubmit, reset, setValue } = useForm({
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
      prev.includes(catId) ? prev.filter((i) => i !== catId) : [...prev, catId]
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
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl bg-white rounded-2xl border border-pink-100 p-6 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="font-semibold text-sm block mb-1">Nama Avatar *</label>
              <input
                {...register("name", { required: true })}
                placeholder="Contoh: Strawberry Dream"
                className="w-full px-3 py-2 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            <div>
              <label className="font-semibold text-sm block mb-1">Biaya Jasa Mulai (Rp) *</label>
              <input
                type="number"
                {...register("starting_price", { required: true })}
                placeholder="35000"
                className="w-full px-3 py-2 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            <div>
              <label className="font-semibold text-sm block mb-1">Badge Tampilan</label>
              <input
                {...register("badge")}
                placeholder="Contoh: Paling disukai, Trending, New"
                className="w-full px-3 py-2 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-sm block mb-1">Status Publikasi</label>
                <select
                  {...register("status")}
                  className="w-full px-3 py-2 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold">
                  <input type="checkbox" {...register("is_featured")} className="accent-pink-500 w-4 h-4" />
                  Koleksi Unggulan (Hero)
                </label>
              </div>
            </div>

            <div>
              <label className="font-semibold text-sm block mb-1">Deskripsi Lengkap *</label>
              <textarea
                rows={4}
                {...register("description", { required: true })}
                placeholder="Jelaskan detail look, palet warna, dan vibe avatar..."
                className="w-full px-3 py-2 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
          </div>

          {/* RIGHT COLUMN: COVER & GALLERY */}
          <div className="space-y-4">
            <div>
              <label className="font-semibold text-sm block mb-1">Foto Cover Avatar</label>
              <div className="border-2 border-dashed border-pink-200 rounded-2xl p-4 text-center hover:bg-pink-50/50 transition relative">
                {coverPreview ? (
                  <div className="relative w-full h-48 rounded-xl overflow-hidden mb-2">
                    <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="py-6">
                    <UploadCloud size={32} className="text-pink-400 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Upload file gambar (PNG, JPG, WebP max 5MB)</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* GALLERY UPLOAD */}
            <div>
              <label className="font-semibold text-sm block mb-1">Galeri Foto Tambahan</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleGalleryChange}
                className="w-full text-xs text-muted-foreground file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-pink-100 file:text-pink-700 hover:file:bg-pink-200 cursor-pointer"
              />

              {/* EXISTING GALLERY IMAGES */}
              {existingImages.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {existingImages.map((img) => (
                    <div key={img.id} className="relative w-16 h-16 rounded-lg overflow-hidden border border-pink-200 group">
                      <img src={getImageUrl(img.image_path) || ""} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleDeleteExistingImage(img.id)}
                        className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MULTIPLE CATEGORIES SELECTION */}
        <div className="border-t border-pink-100 pt-5">
          <label className="font-semibold text-sm block mb-2">Pilih Kategori (Satu avatar dapat memilih beberapa kategori)</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isSelected = selectedCategories.includes(cat.id);
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => handleCategoryToggle(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                    isSelected
                      ? "bg-pink-500 text-white border-pink-500 shadow-sm"
                      : "bg-white text-pink-900 border-pink-200 hover:bg-pink-50"
                  }`}
                >
                  {isSelected ? `✓ ${cat.name}` : `+ ${cat.name}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4 border-t border-pink-100">
          <Link to="/admin/avatars" className="btn btn-outline">
            Batal
          </Link>
          <button type="submit" disabled={isSubmitting} className="btn btn-primary">
            {isSubmitting ? "Menyimpan..." : isEdit ? "Perbarui Avatar" : "Simpan Avatar"}
          </button>
        </div>
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
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-pink-900/70">
          Kategori yang dibuat di sini akan langsung tampil pada filter katalog public website.
        </p>
        <button onClick={openAddModal} className="btn btn-primary">
          <Plus size={17} /> Tambah Kategori
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-pink-100 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-pink-50/50 border-b border-pink-100 text-xs text-muted-foreground">
              <th className="p-4">Kategori</th>
              <th className="p-4">Slug URL</th>
              <th className="p-4">Deskripsi</th>
              <th className="p-4">Total Avatar</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pink-50">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-pink-50/30">
                <td className="p-4 font-semibold text-pink-900">{cat.name}</td>
                <td className="p-4 font-mono text-xs text-muted-foreground">{cat.slug}</td>
                <td className="p-4 text-xs text-muted-foreground max-w-sm line-clamp-1">{cat.description || "-"}</td>
                <td className="p-4 font-bold text-pink-600">{cat.avatars_count || 0}</td>
                <td className="p-4">
                  <span className={`status-pill ${cat.is_active ? "status-completed" : "status-draft"}`}>
                    {cat.is_active ? "Aktif" : "Non-aktif"}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 rounded-lg border border-pink-200 text-pink-700 hover:bg-pink-50 inline-flex items-center"
                    title="Edit Kategori"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 inline-flex items-center"
                    title="Hapus Kategori"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in fade-in">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-black"
            >
              <X size={18} />
            </button>
            <h3 className="font-bold text-lg mb-4">
              {editingCategory ? "Edit Kategori" : "Tambah Kategori Baru"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-semibold text-xs block mb-1">Nama Kategori *</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: AVA Y2K, AVA Sultan"
                  className="w-full px-3 py-2 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-xs block mb-1">Deskripsi Kategori</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Keterangan singkat gaya kategori..."
                  className="w-full px-3 py-2 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="cat-active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="accent-pink-500 w-4 h-4"
                />
                <label htmlFor="cat-active" className="text-sm font-semibold cursor-pointer">
                  Kategori Aktif & Ditampilkan
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-pink-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline text-xs">
                  Batal
                </button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary text-xs">
                  {isSubmitting ? "Menyimpan..." : "Simpan Kategori"}
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
        }
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
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
        {["all", "pending", "confirmed", "in_progress", "revision", "completed", "cancelled"].map((st) => (
          <button
            key={st}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition ${
              statusFilter === st
                ? "bg-pink-500 text-white shadow-sm"
                : "bg-white text-pink-900 border border-pink-200 hover:bg-pink-50"
            }`}
            onClick={() => setStatusFilter(st)}
          >
            {st}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-pink-100 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-pink-50/50 border-b border-pink-100 text-xs text-muted-foreground">
              <th className="p-4">No. Order</th>
              <th className="p-4">Pelanggan</th>
              <th className="p-4">WhatsApp</th>
              <th className="p-4">Style / Referensi</th>
              <th className="p-4">Budget</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pink-50">
            {orders.map((ord) => (
              <tr key={ord.id} className="hover:bg-pink-50/30">
                <td className="p-4 font-mono font-bold text-pink-800">{ord.order_number}</td>
                <td className="p-4">
                  <b>{ord.customer_name}</b>
                  <small className="block text-xs text-muted-foreground">@{ord.roblox_username}</small>
                </td>
                <td className="p-4">
                  <a
                    href={`https://wa.me/${ord.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-pink-600 font-semibold hover:underline"
                  >
                    {ord.whatsapp}
                  </a>
                </td>
                <td className="p-4 text-xs">
                  {ord.avatar?.name || ord.requested_style || "-"}
                </td>
                <td className="p-4 font-semibold text-pink-700">{rupiah(ord.budget)}</td>
                <td className="p-4">
                  <StatusPill status={ord.status} />
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => openDetail(ord)} className="btn btn-outline text-xs">
                    Kelola
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && !loading && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground">
                  Tidak ada pesanan dengan status ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* DETAIL MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative animate-in fade-in max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-black"
            >
              <X size={18} />
            </button>
            <h3 className="font-bold text-lg mb-1">Rincian Pesanan</h3>
            <span className="font-mono text-xs text-pink-700 font-bold block mb-4">
              {selectedOrder.order_number}
            </span>

            <div className="space-y-3 text-sm bg-pink-50/50 p-4 rounded-xl mb-4">
              <div>
                <span className="text-xs text-muted-foreground block">Pelanggan & Username Roblox</span>
                <b>{selectedOrder.customer_name}</b> (@{selectedOrder.roblox_username})
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Nomor WhatsApp</span>
                <b>{selectedOrder.whatsapp}</b>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Style / Referensi</span>
                <b>{selectedOrder.avatar?.name || selectedOrder.requested_style || "-"}</b>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Catatan Pesanan Pelanggan</span>
                <p className="text-xs bg-white p-2.5 rounded-lg border border-pink-100 mt-1">
                  {selectedOrder.request_notes || "Tidak ada catatan tambahan."}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold block mb-1">Ubah Status Pesanan</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="revision">Revision</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Catatan Internal Admin</label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Catatan pengerjaan atau riwayat revisi..."
                  className="w-full px-3 py-2 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 mt-4 border-t border-pink-100">
              <a
                href={`https://wa.me/${selectedOrder.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline text-xs text-pink-700"
              >
                Chat WhatsApp
              </a>
              <div className="flex gap-2">
                <button onClick={() => setSelectedOrder(null)} className="btn btn-outline text-xs">
                  Tutup
                </button>
                <button
                  onClick={handleUpdateStatus}
                  disabled={isUpdating}
                  className="btn btn-primary text-xs"
                >
                  {isUpdating ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
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
      const res = await api.get<{ success: boolean; data: Testimonial[] }>("/admin/testimonials?all=1");
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-white rounded-2xl border border-pink-100 p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <b className="text-sm">{t.customer_name}</b>
                <span className="text-xs text-pink-600 font-medium">{t.roblox_username}</span>
              </div>
              <p className="text-xs text-muted-foreground italic mb-4">“{t.content}”</p>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-pink-50">
              <span className="text-xs text-pink-500 font-bold">Rating: {t.rating}★</span>
              <button onClick={() => handleDelete(t.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
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
      footer_about: settings.footer_about || "Jasa styling avatar Roblox yang dibuat personal, detail, dan penuh karakter aesthetic.",
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
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl bg-white rounded-2xl border border-pink-100 p-6 shadow-sm space-y-6">
        {/* BRAND LOGO & FAVICON SECTION */}
        <div className="bg-pink-50/50 p-6 rounded-3xl border border-pink-100 space-y-4">
          <div>
            <h3 className="font-bold text-base text-[#3D2636]">Logo Brand & Identitas Visual</h3>
            <p className="text-xs text-muted-foreground">
              Ganti logo default Figma dengan file logo resmi kamu (PNG, WebP, SVG, JPG hingga 50MB). Logo akan langsung tampil di navbar dan footer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-3">
              <label className="text-xs font-bold text-[#3D2636] block">Pilih Logo Gambar</label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="h-20 w-36 border-2 border-dashed border-pink-200 rounded-2xl bg-white flex items-center justify-center overflow-hidden p-2 shadow-xs">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo Preview" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="text-xs text-pink-400 font-semibold text-center">Default Icon</span>
                  )}
                </div>
                
                <div className="space-y-2 w-full sm:w-auto">
                  <label className="btn btn-outline text-xs cursor-pointer w-full text-center inline-block">
                    {logoFile ? "Ganti File Terpilih" : "Pilih File Logo"}
                    <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                  </label>

                  {logoFile && (
                    <button
                      type="button"
                      onClick={handleDirectUploadLogo}
                      disabled={isSaving}
                      className="btn btn-primary text-xs w-full"
                    >
                      {isSaving ? "Mengunggah..." : "✓ Simpan Logo Ini"}
                    </button>
                  )}

                  {settings.site_logo && (
                    <button
                      type="button"
                      onClick={handleDeleteLogo}
                      className="text-[11px] text-red-500 hover:underline block text-center w-full"
                    >
                      Hapus Logo (Reset ke Bawaan)
                    </button>
                  )}
                </div>
              </div>
              <small className="text-[10px] text-muted-foreground block">
                {logoFile ? `File: ${logoFile.name} (${Math.round(logoFile.size / 1024)} KB)` : "Mendukung resolusi tinggi hingga 50MB."}
              </small>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-[#3D2636] block">Upload Favicon Tab Browser (.png / .ico)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFaviconChange}
                className="w-full text-xs text-muted-foreground file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-pink-100 file:text-pink-700 cursor-pointer"
              />
              <small className="text-[10px] text-muted-foreground block">
                Ikon kecil yang muncul di sebelah judul tab browser kamu.
              </small>
            </div>
          </div>
        </div>

        {/* GENERAL SETTINGS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold block mb-1">Nama Brand Website</label>
            <input
              {...register("site_name")}
              placeholder="AVA Studio"
              className="w-full px-3 py-2 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1">Tagline Brand</label>
            <input
              {...register("site_tagline")}
              placeholder="Your Avatar, Your Style ♡"
              className="w-full px-3 py-2 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1">Nomor WhatsApp Admin (Aktif)</label>
            <input
              {...register("whatsapp_number")}
              placeholder="6281234567890"
              className="w-full px-3 py-2 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            <small className="text-[11px] text-muted-foreground">Gunakan format internasional tanpa spasi (cth: 6281234567890)</small>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1">Username Instagram</label>
            <input
              {...register("instagram_username")}
              placeholder="@avastudio.id"
              className="w-full px-3 py-2 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-semibold block mb-1">Link URL Instagram</label>
            <input
              {...register("instagram_url")}
              placeholder="https://instagram.com/avastudio.id"
              className="w-full px-3 py-2 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-semibold block mb-1">Hero Headline Promosi</label>
            <input
              {...register("hero_headline")}
              placeholder="Avatar kamu, main character-nya kamu."
              className="w-full px-3 py-2 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-semibold block mb-1">Hero Subheadline</label>
            <textarea
              rows={2}
              {...register("hero_subheadline")}
              placeholder="Kami bantu wujudkan avatar Roblox yang bukan cuma bagus..."
              className="w-full px-3 py-2 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1">Jam Operasional Layanan</label>
            <input
              {...register("operating_hours")}
              placeholder="Senin–Sabtu, 09.00–20.00 WIB"
              className="w-full px-3 py-2 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1">Email Kontak</label>
            <input
              {...register("contact_email")}
              placeholder="halo@avastudio.id"
              className="w-full px-3 py-2 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-pink-100">
          <button type="submit" disabled={isSaving} className="btn btn-primary flex items-center gap-2">
            <Save size={16} /> {isSaving ? "Menyimpan Pengaturan..." : "Simpan Semua Pengaturan"}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
