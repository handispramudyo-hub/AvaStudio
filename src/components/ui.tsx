import type { ReactNode } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Camera,
  ChevronRight,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  PackageOpen,
  PanelsTopLeft,
  Search,
  Settings,
  Sparkles,
  Star,
  Tags,
  UsersRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useSettings } from "../contexts/SettingsContext";
import { getImageUrl, rupiah } from "../lib/api";
import type { Avatar } from "../lib/types";

/**
 * Dynamic Brand Logo
 * Loads custom uploaded logo image if available in settings,
 * otherwise falls back to the aesthetic typography logo with pink pastel mark.
 */
export function Logo({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  const { settings } = useSettings();
  const logoImage = getImageUrl(settings.site_logo);
  const brandName = settings.site_name || "AVA Studio";

  return (
    <Link to="/" className={`logo ${className}`} aria-label={`${brandName} home`}>
      {logoImage ? (
        <img
          src={logoImage}
          alt={brandName}
          className="h-9 max-w-[170px] object-contain rounded-md"
        />
      ) : (
        <span className="logo-mark" title="AVA Studio Official">
          <Sparkles size={18} strokeWidth={2.2} />
        </span>
      )}
      {!compact && (
        <span className="font-bold tracking-tight">
          {brandName.includes(" ") ? (
            <>
              {brandName.split(" ")[0]}{" "}
              <b>{brandName.split(" ").slice(1).join(" ")}</b>
            </>
          ) : (
            brandName
          )}
        </span>
      )}
    </Link>
  );
}

const publicLinks = [
  ["Beranda", "/"],
  ["Katalog", "/catalog"],
  ["Cara Order", "/how-to-order"],
  ["Kontak", "/contact"],
];

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const { settings } = useSettings();

  return (
    <header className="public-header">
      <div className="container nav-row">
        <Logo />
        <nav className={`main-nav ${open ? "is-open" : ""}`}>
          {publicLinks.map(([label, path]) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              onClick={() => setOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          <Link className="btn btn-primary mobile-order" to="/order" onClick={() => setOpen(false)}>
            <MessageCircle size={17} /> Order sekarang
          </Link>
        </nav>
        <div className="nav-actions">
          <Link className="btn btn-primary desktop-order" to="/order">
            <MessageCircle size={17} /> Order sekarang
          </Link>
          <button
            className="icon-button menu-button"
            onClick={() => setOpen(!open)}
            aria-label="Buka menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const { settings } = useSettings();
  const cleanPhone = (settings.whatsapp_number || "6281234567890").replace(/[^0-9]/g, "");
  const waLink = `https://wa.me/${cleanPhone.startsWith("08") ? "62" + cleanPhone.slice(1) : cleanPhone}`;
  const igLink = settings.instagram_url || "https://instagram.com";

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Logo />
          <p>{settings.footer_about || "Jasa styling avatar Roblox yang dibuat personal, detail, dan penuh karakter aesthetic."}</p>
          <div className="social-row">
            <a href={igLink} target="_blank" rel="noreferrer" aria-label="Instagram">
              <Camera size={19} />
            </a>
            <a href={waLink} target="_blank" rel="noreferrer" aria-label="WhatsApp">
              <MessageCircle size={19} />
            </a>
          </div>
        </div>
        <div>
          <h4>Jelajahi</h4>
          <Link to="/catalog">Katalog AVA</Link>
          <Link to="/how-to-order">Cara order</Link>
          <Link to="/order">Form Pemesanan</Link>
        </div>
        <div>
          <h4>Bantuan</h4>
          <Link to="/contact">Hubungi kami</Link>
          <Link to="/how-to-order#faq">FAQ</Link>
          <span>{settings.operating_hours || "Senin–Sabtu, 09.00–20.00 WIB"}</span>
        </div>
        <div className="footer-note">
          <Sparkles size={18} />
          <p>AVA Studio tidak pernah meminta password, cookie, atau akses login Roblox kamu.</p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 {settings.site_name || "AVA Studio"}. {settings.site_tagline || "Your Avatar, Your Style ♡"}</span>
        <span>Roblox adalah merek dagang pemiliknya masing-masing.</span>
      </div>
    </footer>
  );
}

export function PublicLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  return (
    <div className="site-shell">
      <PublicHeader />
      <main key={location.pathname}>{children}</main>
      <Footer />
    </div>
  );
}

/**
 * Avatar Art / Cover Image Card
 * Renders real uploaded cover image or high quality aesthetic pastel fallback
 */
export function AvatarArt({
  imageSrc,
  name,
  className = "",
}: {
  imageSrc?: string | null;
  name: string;
  className?: string;
}) {
  const [error, setError] = useState(false);
  const resolvedUrl = imageSrc ? getImageUrl(imageSrc) : null;

  if (resolvedUrl && !error) {
    return (
      <div className={`avatar-art overflow-hidden relative ${className}`}>
        <img
          src={resolvedUrl}
          alt={name}
          onError={() => setError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
    );
  }

  // Graceful Aesthetic Fallback Artwork
  return (
    <div
      className={`avatar-art flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200 ${className}`}
    >
      <div className="w-20 h-20 rounded-full bg-white/70 shadow-sm flex items-center justify-center mb-3">
        <Sparkles className="text-pink-500 w-10 h-10 animate-pulse" />
      </div>
      <b className="text-pink-900 text-sm font-semibold">{name}</b>
      <span className="text-xs text-pink-700/70 mt-1">Roblox Styling Portfolio</span>
    </div>
  );
}

export function AvatarCard({ avatar }: { avatar: Avatar }) {
  const primaryCategory = avatar.categories?.[0]?.name || "Roblox Avatar";
  const [liked, setLiked] = useState(false);

  return (
    <article className="avatar-card group relative bg-white border border-[#F3DCE8] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
      <Link to={`/avatars/${avatar.slug}`} className="block relative aspect-[4/5] overflow-hidden bg-pink-50 m-2.5 rounded-2xl">
        <AvatarArt imageSrc={avatar.cover_image} name={avatar.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        
        {avatar.badge && (
          <span className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-white/90 backdrop-blur-md text-[#DB5793] shadow-sm border border-pink-100">
            ✦ {avatar.badge}
          </span>
        )}

        <button
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center transition-all ${
            liked ? "text-pink-600 scale-110" : "text-pink-400 hover:text-pink-600 hover:scale-105"
          }`}
          aria-label={`Sukai ${avatar.name}`}
          onClick={(event) => {
            event.preventDefault();
            setLiked(!liked);
          }}
        >
          <Heart size={17} fill={liked ? "currentColor" : "none"} />
        </button>
      </Link>

      <div className="p-5 pt-2 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#DB5793] bg-[#FFF4F9] px-2.5 py-0.5 rounded-md border border-[#F3DCE8]">
              {primaryCategory}
            </span>
          </div>

          <h3 className="text-lg font-bold text-[#3D2636] group-hover:text-pink-600 transition-colors line-clamp-1 mb-1">
            <Link to={`/avatars/${avatar.slug}`}>{avatar.name}</Link>
          </h3>

          <p className="text-xs text-[#94667D] line-clamp-2 leading-relaxed mb-4">
            {avatar.description}
          </p>
        </div>

        <div className="pt-3 border-t border-pink-50 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#94667D] uppercase font-bold tracking-wider block">Biaya Jasa</span>
            <strong className="text-base font-extrabold text-[#3D2636]">{rupiah(avatar.starting_price)}</strong>
          </div>
          
          <Link
            to={`/avatars/${avatar.slug}`}
            className="text-xs font-bold text-pink-600 group-hover:text-pink-700 flex items-center gap-1 hover:underline"
          >
            Detail <ChevronRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  copy,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={`section-title ${align === "left" ? "align-left" : ""}`}>
      <span className="kicker">
        <Sparkles size={14} /> {eyebrow}
      </span>
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
    </div>
  );
}

const adminLinks = [
  { label: "Overview", icon: LayoutDashboard, path: "/admin" },
  { label: "Avatar", icon: PanelsTopLeft, path: "/admin/avatars" },
  { label: "Kategori", icon: Tags, path: "/admin/categories" },
  { label: "Pesanan", icon: PackageOpen, path: "/admin/orders" },
  { label: "Testimonial", icon: UsersRound, path: "/admin/testimonials" },
  { label: "Pengaturan", icon: Settings, path: "/admin/settings" },
];

export function AdminLayout({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle: string;
}) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${open ? "is-open" : ""}`}>
        <div className="admin-logo-row">
          <Logo />
          <button className="icon-button sidebar-close" onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>
        <nav>
          <span className="nav-label">Workspace</span>
          {adminLinks.map(({ label, icon: Icon, path }) => (
            <NavLink key={path} to={path} end={path === "/admin"} onClick={() => setOpen(false)}>
              <Icon size={19} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-profile flex items-center justify-between p-3 border-t border-pink-100">
          <div className="flex items-center gap-2">
            <div className="profile-avatar bg-pink-500 text-white font-bold rounded-full w-9 h-9 flex items-center justify-center text-xs">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : "AS"}
            </div>
            <div>
              <strong className="block text-sm font-semibold">{user?.name || "Ava Studio"}</strong>
              <span className="text-xs text-muted-foreground">{user?.email || "Admin"}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Keluar"
            className="p-1.5 rounded-md hover:bg-pink-100 text-pink-700 transition"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>
      {open && (
        <button
          className="sidebar-overlay"
          onClick={() => setOpen(false)}
          aria-label="Tutup menu"
        />
      )}
      <div className="admin-main">
        <header className="admin-topbar">
          <button className="icon-button admin-menu" onClick={() => setOpen(true)}>
            <Menu />
          </button>
          <div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <div className="admin-actions">
            <Link to="/" target="_blank" className="view-site">
              Lihat website <ChevronRight size={16} />
            </Link>
          </div>
        </header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const normalized = status.toLowerCase().replace(/[\s_]+/g, "-");
  return (
    <span className={`status-pill status-${normalized}`}>
      {status}
    </span>
  );
}

export function PageToolbar({
  search,
  onSearch,
  children,
}: {
  search: string;
  onSearch: (value: string) => void;
  children?: ReactNode;
}) {
  return (
    <div className="page-toolbar">
      <label className="table-search">
        <Search size={18} />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Cari data..."
        />
      </label>
      <div className="toolbar-actions">
        {children}
      </div>
    </div>
  );
}

export function Rating({ value = 5 }: { value?: number }) {
  return (
    <div className="rating flex gap-0.5 text-pink-400" aria-label={`${value} dari 5 bintang`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={15}
          fill={i <= value ? "currentColor" : "none"}
          className={i <= value ? "text-pink-400" : "text-gray-300"}
        />
      ))}
    </div>
  );
}
