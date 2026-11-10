export type Avatar = {
  id: number;
  name: string;
  slug: string;
  style: string;
  categories: string[];
  price: number;
  badge?: string;
  description: string;
  palette: [string, string, string];
  featured?: boolean;
  status: "Published" | "Draft";
};

export const categories = [
  "Semua",
  "AVA Anomali",
  "AVA Couple",
  "AVA Cute",
  "AVA Y2K",
  "AVA Sultan",
  "AVA Cowok",
  "AVA Cewek",
  "AVA Anime",
  "AVA Troll",
  "AVA Custom",
];

export const avatars: Avatar[] = [
  {
    id: 1,
    name: "Strawberry Dream",
    slug: "strawberry-dream",
    style: "Sweet coquette look",
    categories: ["AVA Cute", "AVA Cewek"],
    price: 35000,
    badge: "Paling disukai",
    description:
      "Look manis dengan palet strawberry milk, detail pita, dan layering yang lembut. Cocok untuk kamu yang suka style cute tanpa terlihat berlebihan.",
    palette: ["#f9a8d4", "#fff1f7", "#8b5e78"],
    featured: true,
    status: "Published",
  },
  {
    id: 2,
    name: "Y2K Popstar",
    slug: "y2k-popstar",
    style: "Retro pop statement",
    categories: ["AVA Y2K", "AVA Cewek"],
    price: 45000,
    badge: "Trending",
    description:
      "Siluet ikonik ala early 2000s dengan aksesori silver, denim, dan sentuhan bubblegum pink yang berani.",
    palette: ["#c4b5fd", "#fbcfe8", "#4c3b78"],
    featured: true,
    status: "Published",
  },
  {
    id: 3,
    name: "Midnight Prince",
    slug: "midnight-prince",
    style: "Dark luxury styling",
    categories: ["AVA Sultan", "AVA Cowok"],
    price: 65000,
    badge: "Premium",
    description:
      "Gaya dark luxury yang clean dengan aksen metalik dan proporsi modern untuk karakter yang tegas.",
    palette: ["#312e81", "#a5b4fc", "#17152c"],
    featured: true,
    status: "Published",
  },
  {
    id: 4,
    name: "Mochi Bunny",
    slug: "mochi-bunny",
    style: "Soft pastel cutie",
    categories: ["AVA Cute", "AVA Anime"],
    price: 38000,
    description:
      "Perpaduan pastel lilac, bunny ears, dan detail lembut yang terinspirasi dari karakter anime slice-of-life.",
    palette: ["#ddd6fe", "#fdf2f8", "#7c6a9b"],
    featured: true,
    status: "Published",
  },
  {
    id: 5,
    name: "Matcha Date",
    slug: "matcha-date",
    style: "Cozy couple set",
    categories: ["AVA Couple", "AVA Cute"],
    price: 72000,
    badge: "Couple set",
    description:
      "Couple outfit yang senada tanpa terlalu kembar, dengan palet matcha dan cream yang hangat.",
    palette: ["#a7c7a0", "#fff7ed", "#50664c"],
    status: "Published",
  },
  {
    id: 6,
    name: "Cyber Neko",
    slug: "cyber-neko",
    style: "Anime cyber street",
    categories: ["AVA Anime", "AVA Y2K"],
    price: 52000,
    description:
      "Detail cyber, headset neko, dan warna neon lembut untuk look futuristik yang tetap wearable.",
    palette: ["#67e8f9", "#f0abfc", "#25365b"],
    status: "Published",
  },
  {
    id: 7,
    name: "Tiny Chaos",
    slug: "tiny-chaos",
    style: "Funny anomaly look",
    categories: ["AVA Anomali", "AVA Troll"],
    price: 30000,
    badge: "Lucu banget",
    description:
      "Avatar absurd yang dirancang dengan komposisi tetap rapi. Cocok untuk konten dan mabar santai.",
    palette: ["#fde047", "#fb7185", "#78350f"],
    status: "Published",
  },
  {
    id: 8,
    name: "Blush Ballerina",
    slug: "blush-ballerina",
    style: "Elegant feminine look",
    categories: ["AVA Cewek", "AVA Cute"],
    price: 48000,
    description:
      "Balletcore yang airy dengan tutu modern, leg warmer, dan detail ribbon yang elegan.",
    palette: ["#fecdd3", "#fff7f7", "#9f5f6e"],
    status: "Draft",
  },
];

export const services = [
  {
    name: "Mini Refresh",
    price: "25K",
    description: "Rapikan look avatar yang sudah kamu punya.",
    features: ["1 konsep styling", "Rekomendasi 5–7 item", "1x revisi ringan"],
  },
  {
    name: "Signature AVA",
    price: "45K",
    description: "Styling lengkap dari nol sesuai vibe kamu.",
    features: ["Moodboard personal", "Full outfit & accessories", "2x revisi"],
    popular: true,
  },
  {
    name: "Couple Chemistry",
    price: "70K",
    description: "Dua avatar senada dengan karakter masing-masing.",
    features: ["2 konsep avatar", "Palet & detail matching", "2x revisi"],
  },
];

export const testimonials = [
  {
    quote:
      "Kakaknya ngerti banget brief aku. Hasilnya cute tapi tetap beda dari avatar orang lain!",
    name: "Nayla",
    username: "@naylovespink",
  },
  {
    quote:
      "Prosesnya enak dan detail itemnya lengkap. Tinggal cari di catalog Roblox, sat-set banget.",
    name: "Caca",
    username: "@cacaplayz",
  },
  {
    quote:
      "Couple AVA-ku jadi matching tanpa norak. Temen-temen langsung pada nanya bikinnya di mana.",
    name: "Raka",
    username: "@rakzz",
  },
];

export const orders = [
  {
    id: "AVA-24031",
    customer: "Nayla Putri",
    service: "Signature AVA",
    total: "Rp45.000",
    status: "Pending",
    date: "Hari ini, 10:42",
  },
  {
    id: "AVA-24030",
    customer: "Raka Aditya",
    service: "Couple Chemistry",
    total: "Rp70.000",
    status: "In Progress",
    date: "Hari ini, 09:18",
  },
  {
    id: "AVA-24029",
    customer: "Caca N.",
    service: "Mini Refresh",
    total: "Rp25.000",
    status: "Completed",
    date: "Kemarin, 20:04",
  },
  {
    id: "AVA-24028",
    customer: "Dina Rahma",
    service: "Signature AVA",
    total: "Rp45.000",
    status: "Revision",
    date: "Kemarin, 14:22",
  },
];

export const rupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
