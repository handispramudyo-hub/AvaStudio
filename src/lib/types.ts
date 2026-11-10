export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  is_active: boolean;
  sort_order: number;
  avatars_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface AvatarImage {
  id: number;
  avatar_id: number;
  image_path: string;
  alt_text: string | null;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Avatar {
  id: number;
  name: string;
  slug: string;
  description: string;
  cover_image: string | null;
  starting_price: number;
  badge: string | null;
  is_featured: boolean;
  status: "published" | "draft";
  views_count: number;
  sort_order: number;
  categories: Category[];
  images?: AvatarImage[];
  created_at?: string;
  updated_at?: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "revision"
  | "completed"
  | "cancelled";

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  roblox_username: string;
  whatsapp: string;
  avatar_id: number | null;
  requested_style: string | null;
  budget: number | null;
  request_notes: string | null;
  status: OrderStatus;
  admin_notes: string | null;
  avatar?: Avatar | null;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: number;
  customer_name: string;
  roblox_username: string | null;
  content: string;
  rating: number;
  image_path: string | null;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface WebsiteSettings {
  site_name?: string;
  site_tagline?: string;
  site_logo?: string;
  site_favicon?: string;
  whatsapp_number?: string;
  instagram_username?: string;
  instagram_url?: string;
  hero_headline?: string;
  hero_subheadline?: string;
  hero_badge?: string;
  operating_hours?: string;
  contact_email?: string;
  footer_about?: string;
  whatsapp_template?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
