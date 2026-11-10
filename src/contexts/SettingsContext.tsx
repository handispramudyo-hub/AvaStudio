import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "../lib/api";
import type { WebsiteSettings } from "../lib/types";

interface SettingsContextType {
  settings: WebsiteSettings;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettingsState: (newSettings: Partial<WebsiteSettings>) => void;
}

const defaultSettings: WebsiteSettings = {
  site_name: "AVA Studio",
  site_tagline: "Your Avatar, Your Style ♡",
  site_logo: "",
  site_favicon: "",
  whatsapp_number: "6281234567890",
  instagram_username: "@avastudio.id",
  instagram_url: "https://instagram.com",
  hero_headline: "Avatar kamu, main character-nya kamu.",
  hero_subheadline: "Kami bantu wujudkan avatar Roblox yang bukan cuma bagus, tapi benar-benar terasa seperti kamu.",
  hero_badge: "Styling avatar, made personal",
  operating_hours: "Senin–Sabtu, 09.00–20.00 WIB",
  contact_email: "halo@avastudio.id",
  footer_about: "Jasa styling avatar Roblox yang dibuat personal, detail, dan penuh karakter aesthetic.",
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  isLoading: false,
  refreshSettings: async () => {},
  updateSettingsState: () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<WebsiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSettings = async () => {
    try {
      const response = await api.get<{ success: boolean; data: WebsiteSettings }>("/settings/public");
      if (response.data.success && response.data.data) {
        setSettings((prev) => ({ ...prev, ...response.data.data }));
      }
    } catch (error) {
      console.warn("Gagal memuat pengaturan website dari API:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettingsState = (newSettings: Partial<WebsiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  // Update dynamic favicon if set
  useEffect(() => {
    if (settings.site_favicon) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = settings.site_favicon;
    }
  }, [settings.site_favicon]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoading,
        refreshSettings,
        updateSettingsState,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
