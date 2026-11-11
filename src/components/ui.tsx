import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  Camera,
  ChevronRight,
  Heart,
  LayoutDashboard,
  LogOut,
  Mail,
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
import { useAuth } from "../contexts/AuthContext";
import { useSettings } from "../contexts/SettingsContext";
import { getImageUrl, rupiah } from "../lib/api";
import type { Avatar } from "../lib/types";

/**
 * Dynamic brand logo — custom uploaded logo or the built-in sparkle mark.
 */
export function Logo({
  compact = false,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  const { settings } = useSettings();
  const logoImage = getImageUrl(settings.site_logo);
  const brandName = settings.site_name || "AVA Studio";

  return (
    <Link to="/" className={`logo ${className}`} aria-label={`${brandName} home`}>
      {logoImage ? (
        <img
          src={logoImage}
          alt={brandName}
          className="h-9 max-w-[170px] rounded-xl object-contain"
        />
      ) : (
        <span className="logo-mark" title="AVA Studio Official">
          <Sparkles size={17} strokeWidth={2.2} />
        </span>
      )}
      {!compact && (
        <span className="font-bold tracking-tight">
          {brandName.includes(" ") ? (
            <>
              {brandName.split(" ")[0]} <b>{brandName.split(" ").slice(1).join(" ")}</b>
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
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="public-header">
      <div className="container nav-row">
        <Logo />
        <nav className={`main-nav ${open ? "is-open" : ""}`} aria-label="Navigasi utama">
          {publicLinks.map(([label, path]) => (
            <NavLink key={path} to={path} end={path === "/"} onClick={() => setOpen(false)}>
              {label}
            </NavLink>
          ))}
          <Link className="btn btn-primary mobile-order" to="/order" onClick={() => setOpen(false)}>
            <MessageCircle size={16} /> Order sekarang
          </Link>
        </nav>
        <div className="nav-actions">
          <Link className="btn btn-primary desktop-order" to="/order">
            <MessageCircle size={16} /> Order sekarang
          </Link>
          <button
            className="icon-button menu-button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
          >
            {open ? <X size={19} /> : <Menu size={19} />}
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
  const email = settings.contact_email || "halo@avastudio.id";

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Logo />
          <p>
            {settings.footer_about ||
              "Jasa styling avatar Roblox yang dibuat personal, detail, dan penuh karakter aesthetic."}
          </p>
          <div className="social-row">
            <a href={igLink} target="_blank" rel="noreferrer" aria-label="Instagram">
              <Camera size={18} />
            </a>
            <a href={waLink} target="_blank" rel="noreferrer" aria-label="WhatsApp">
              <MessageCircle size={18} />
            </a>
            <a href={`mailto:${email}`} aria-label="Email">
              <Mail size={18} />
            </a>
          </div>
        </div>
        <div>
          <h4>Jelajahi</h4>
          <Link to="/catalog">Katalog AVA</Link>
          <Link to="/how-to-order">Cara order</Link>
          <Link to="/order">Form pemesanan</Link>
        </div>
        <div>
          <h4>Bantuan</h4>
          <Link to="/contact">Hubungi kami</Link>
          <Link to="/how-to-order#faq">FAQ</Link>
          <span>{settings.operating_hours || "Senin–Sabtu, 09.00–20.00 WIB"}</span>
        </div>
        <div className="footer-note">
          <Sparkles size={17} />
          <p>AVA Studio tidak pernah meminta password, cookie, atau akses login Roblox kamu.</p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © 2026 {settings.site_name || "AVA Studio"}.{" "}
          {settings.site_tagline || "Your Avatar, Your Style ♡"}
        </span>
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
 * Avatar cover art with a graceful, on-brand fallback.
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
      <div className={`avatar-art relative ${className}`}>
        <img
          src={resolvedUrl}
          alt={name}
          onError={() => setError(true)}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className={`avatar-art flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200 p-6 text-center ${className}`}
    >
      <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-white/75 shadow-sm">
        <Sparkles className="h-9 w-9 text-brand-600" />
      </div>
      <b className="text-sm font-semibold text-brand-900">{name}</b>
      <span className="mt-1 text-2xs uppercase tracking-[0.18em] text-brand-700">
        Roblox styling portfolio
      </span>
    </div>
  );
}

export function AvatarCard({ avatar }: { avatar: Avatar }) {
  const primaryCategory = avatar.categories?.[0]?.name || "Roblox Avatar";
  const [liked, setLiked] = useState(false);

  return (
    <article className="avatar-card group">
      <div className="avatar-card-media">
        <AvatarArt
          imageSrc={avatar.cover_image}
          name={avatar.name}
          className="h-full w-full object-cover"
        />

        <Link
          to={`/avatars/${avatar.slug}`}
          className="absolute inset-0 z-0"
          aria-label={`Lihat detail ${avatar.name}`}
        />

        {avatar.badge && (
          <span className="absolute left-3 top-3 z-10 rounded-full border border-white/70 bg-white/92 px-3 py-1 text-2xs font-extrabold uppercase tracking-[0.12em] text-brand-700 shadow-sm backdrop-blur">
            {avatar.badge}
          </span>
        )}

        <button
          type="button"
          className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/70 bg-white/92 shadow-sm backdrop-blur transition-all ${
            liked ? "text-brand-600" : "text-brand-600 hover:text-brand-700"
          }`}
          aria-label={liked ? `Batal sukai ${avatar.name}` : `Sukai ${avatar.name}`}
          aria-pressed={liked}
          onClick={() => setLiked((value) => !value)}
        >
          <Heart size={15} fill={liked ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="avatar-card-body">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="tag">{primaryCategory}</span>
            {avatar.is_featured && (
              <span className="text-2xs font-bold uppercase tracking-wider text-brand-600">
                Featured
              </span>
            )}
          </div>

          <h3 className="mb-1 text-lg font-bold leading-snug text-ink transition-colors group-hover:text-brand-700">
            <Link to={`/avatars/${avatar.slug}`}>{avatar.name}</Link>
          </h3>

          <p className="line-clamp-2 text-xs leading-relaxed text-muted">{avatar.description}</p>
        </div>

        <div className="mt-4 flex items-end justify-between gap-3 border-t border-line pt-4">
          <div>
            <span className="block text-2xs font-bold uppercase tracking-[0.12em] text-faint">
              Biaya jasa
            </span>
            <strong className="text-lg font-extrabold text-ink">
              {rupiah(avatar.starting_price)}
            </strong>
          </div>
          <Link
            to={`/avatars/${avatar.slug}`}
            className="inline-flex items-center gap-1 text-2xs font-bold text-brand-700 transition-colors hover:text-brand-600"
          >
            Detail <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  copy,
  action,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
  action?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={`section-head ${align === "center" ? "is-center" : ""}`}>
      <div>
        {eyebrow && (
          <span className="eyebrow">
            <Sparkles size={13} /> {eyebrow}
          </span>
        )}
        <h2>{title}</h2>
        {copy && <p>{copy}</p>}
      </div>
      {action && <div className="section-head-actions">{action}</div>}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  copy,
  aside,
  children,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  aside?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="page-hero">
      <div className="container">
        <div className="page-hero-row">
          <div>
            <span className="eyebrow">
              <Sparkles size={13} /> {eyebrow}
            </span>
            <h1>{title}</h1>
            {copy && <p className="lede">{copy}</p>}
            {children}
          </div>
          {aside}
        </div>
      </div>
    </section>
  );
}

const navGroups = [
  {
    label: "Workspace",
    links: [
      { label: "Overview", icon: LayoutDashboard, path: "/admin" },
      { label: "Avatar", icon: PanelsTopLeft, path: "/admin/avatars" },
      { label: "Kategori", icon: Tags, path: "/admin/categories" },
    ],
  },
  {
    label: "Operasional",
    links: [
      { label: "Pesanan", icon: PackageOpen, path: "/admin/orders" },
      { label: "Testimoni", icon: UsersRound, path: "/admin/testimonials" },
    ],
  },
  {
    label: "Sistem",
    links: [{ label: "Pengaturan", icon: Settings, path: "/admin/settings" }],
  },
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
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${open ? "is-open" : ""}`} aria-label="Navigasi admin">
        <div className="admin-logo-row">
          <Logo />
          <button
            className="icon-button sidebar-close"
            onClick={() => setOpen(false)}
            aria-label="Tutup menu"
          >
            <X size={19} />
          </button>
        </div>

        <nav>
          {navGroups.map((group) => (
            <div key={group.label}>
              <span className="nav-label">{group.label}</span>
              {group.links.map(({ label, icon: Icon, path }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === "/admin"}
                  onClick={() => setOpen(false)}
                >
                  <Icon size={18} /> {label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-profile">
            <div className="flex min-w-0 items-center gap-2">
              <div className="profile-avatar">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : "AS"}
              </div>
              <div className="min-w-0">
                <strong className="block truncate text-xs font-semibold text-ink">
                  {user?.name || "Ava Studio"}
                </strong>
                <span className="block truncate text-2xs text-muted">{user?.email || "Admin"}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Keluar"
              aria-label="Keluar dari admin"
              className="row-action"
            >
              <LogOut size={15} />
            </button>
          </div>
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
          <button
            className="icon-button admin-menu"
            onClick={() => setOpen(true)}
            aria-label="Buka menu admin"
          >
            <Menu size={19} />
          </button>
          <div className="min-w-0">
            <h1 className="truncate">{title}</h1>
            <p className="truncate">{subtitle}</p>
          </div>
          <div className="admin-actions">
            <Link to="/" target="_blank" className="view-site">
              Lihat website <ChevronRight size={15} />
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
  const label = status.replace(/[_-]+/g, " ");
  return <span className={`status-pill status-${normalized}`}>{label}</span>;
}

export function PageToolbar({
  search,
  onSearch,
  placeholder = "Cari data...",
  children,
}: {
  search: string;
  onSearch: (value: string) => void;
  placeholder?: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-toolbar">
      <label className="table-search">
        <Search size={17} />
        <input
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
        />
      </label>
      <div className="toolbar-actions">{children}</div>
    </div>
  );
}

export function Rating({ value = 5 }: { value?: number }) {
  return (
    <div className="rating" aria-label={`${value} dari 5 bintang`}>
      {[1, 2, 3, 4, 5].map((index) => (
        <Star
          key={index}
          size={14}
          fill={index <= value ? "currentColor" : "none"}
          className={index <= value ? "text-brand-600" : "text-line-strong"}
        />
      ))}
    </div>
  );
}
