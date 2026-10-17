"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface SocialLinkItem {
  key: "facebook" | "linkedin" | "youtube" | "instagram" | "telegram" | "twitter";
  nameAr: string;
  nameEn: string;
  url: string;
  enabled: boolean;
}

export interface ContactFieldItem {
  key: "email" | "phone" | "address" | "officeAddress" | "workingHours";
  value?: string;
  valueAr?: string;
  valueEn?: string;
  enabled: boolean;
}

export interface SiteSettings {
  email: string;
  phone: string;
  address: string;
  addressEn?: string;
  officeAddress: string;
  officeAddressEn?: string;
  workingHours: string;
  workingHoursEn?: string;
  contactFields: Record<string, ContactFieldItem>;
  registrationOpen: boolean;
  maintenanceMode: boolean;
  showResults: boolean;
  socialLinks: Record<string, SocialLinkItem>;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  email: "info@asu.edu.sy",
  phone: "(+963) 11 5954910",
  address: "معرة صيدنايا، ريف دمشق، سوريا",
  addressEn: "Maarat Saidnaya, Damascus Countryside, Syria",
  officeAddress: "دمشق، البرامكة، مقابل كلية الحقوق - مكتب المتابعة والتسجيل",
  officeAddressEn: "Damascus, Baramkeh, Opposite Faculty of Law - Follow-up & Registration Office",
  workingHours: "الأحد - الخميس: 8:00 ص - 4:00 م",
  workingHoursEn: "Sunday - Thursday: 8:00 AM - 4:00 PM",
  contactFields: {
    email: {
      key: "email",
      value: "info@asu.edu.sy",
      enabled: true,
    },
    phone: {
      key: "phone",
      value: "(+963) 11 5954910",
      enabled: true,
    },
    address: {
      key: "address",
      value: "معرة صيدنايا، ريف دمشق، سوريا",
      valueAr: "معرة صيدنايا، ريف دمشق، سوريا",
      valueEn: "Maarat Saidnaya, Damascus Countryside, Syria",
      enabled: true,
    },
    officeAddress: {
      key: "officeAddress",
      value: "دمشق، البرامكة، مقابل كلية الحقوق - مكتب المتابعة والتسجيل",
      valueAr: "دمشق، البرامكة، مقابل كلية الحقوق - مكتب المتابعة والتسجيل",
      valueEn: "Damascus, Baramkeh, Opposite Faculty of Law - Follow-up & Registration Office",
      enabled: true,
    },
    workingHours: {
      key: "workingHours",
      value: "الأحد - الخميس: 8:00 ص - 4:00 م",
      valueAr: "الأحد - الخميس: 8:00 ص - 4:00 م",
      valueEn: "Sunday - Thursday: 8:00 AM - 4:00 PM",
      enabled: true,
    },
  },
  registrationOpen: true,
  maintenanceMode: false,
  showResults: true,
  socialLinks: {
    facebook: {
      key: "facebook",
      nameAr: "فيسبوك",
      nameEn: "Facebook",
      url: "https://www.facebook.com/asu.edu.sy.private",
      enabled: true,
    },
    linkedin: {
      key: "linkedin",
      nameAr: "لينكد إن",
      nameEn: "LinkedIn",
      url: "https://linkedin.com/school/antioch-syrian-university",
      enabled: true,
    },
    youtube: {
      key: "youtube",
      nameAr: "يوتيوب",
      nameEn: "YouTube",
      url: "https://youtube.com/@antiochsyrianuniversity",
      enabled: true,
    },
    instagram: {
      key: "instagram",
      nameAr: "إنستغرام",
      nameEn: "Instagram",
      url: "https://instagram.com/asu_syria",
      enabled: true,
    },
    telegram: {
      key: "telegram",
      nameAr: "تلجرام",
      nameEn: "Telegram",
      url: "https://t.me/asu_syria",
      enabled: true,
    },
    twitter: {
      key: "twitter",
      nameAr: "منصة X",
      nameEn: "X",
      url: "https://x.com/asu_syria",
      enabled: true,
    },
  },
};

interface SiteSettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  updateSocialLink: (key: string, url: string, enabled: boolean) => Promise<void>;
  resetSettings: () => void;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

const STORAGE_KEY = "asu_site_settings_v9";
const SETTINGS_EVENT = "asu_site_settings_updated";

function getApiBaseUrl(): string {
  if (typeof window === "undefined") return "http://127.0.0.1:8000";
  const hostname = window.location.hostname || "127.0.0.1";
  return `http://${hostname}:8000`;
}

export function getMergedContactFields(parsedFields?: Record<string, any>): Record<string, ContactFieldItem> {
  const merged = { ...DEFAULT_SITE_SETTINGS.contactFields };
  if (parsedFields && typeof parsedFields === "object") {
    Object.keys(DEFAULT_SITE_SETTINGS.contactFields).forEach((key) => {
      if (parsedFields[key]) {
        const item = parsedFields[key];
        const defaultItem = DEFAULT_SITE_SETTINGS.contactFields[key as keyof typeof DEFAULT_SITE_SETTINGS.contactFields];
        merged[key as keyof typeof DEFAULT_SITE_SETTINGS.contactFields] = {
          ...defaultItem,
          ...item,
          value: item.value !== undefined ? item.value : defaultItem.value,
          valueAr: item.valueAr ?? item.value ?? defaultItem.valueAr ?? defaultItem.value,
          valueEn: item.valueEn ?? defaultItem.valueEn ?? item.value ?? defaultItem.value,
          enabled: item.enabled !== undefined ? item.enabled : defaultItem.enabled,
        };
      }
    });
  }
  return merged;
}

function getStoredSettings(): SiteSettings {
  if (typeof window === "undefined") return DEFAULT_SITE_SETTINGS;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_SITE_SETTINGS;

    const parsed = JSON.parse(saved);
    const mergedSocialLinks = { ...DEFAULT_SITE_SETTINGS.socialLinks };

    if (parsed.socialLinks && typeof parsed.socialLinks === "object") {
      Object.keys(DEFAULT_SITE_SETTINGS.socialLinks).forEach((key) => {
        if (parsed.socialLinks[key]) {
          mergedSocialLinks[key] = {
            ...mergedSocialLinks[key],
            ...parsed.socialLinks[key],
          };
        }
      });
    }

    const mergedContactFields = getMergedContactFields(parsed.contactFields);

    return {
      ...DEFAULT_SITE_SETTINGS,
      ...parsed,
      contactFields: mergedContactFields,
      socialLinks: mergedSocialLinks,
    };
  } catch (err) {
    console.error("Failed to parse site settings from localStorage:", err);
    return DEFAULT_SITE_SETTINGS;
  }
}

async function fetchFromBackendApi(): Promise<SiteSettings | null> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("asu_access_token") : "";
    const headers: Record<string, string> = { "Accept": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/site-settings/`, {
      method: "GET",
      headers,
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (!data) return null;

    const mergedSocialLinks = { ...DEFAULT_SITE_SETTINGS.socialLinks };
    if (data.socialLinks && typeof data.socialLinks === "object") {
      Object.keys(DEFAULT_SITE_SETTINGS.socialLinks).forEach((key) => {
        if (data.socialLinks[key]) {
          mergedSocialLinks[key] = {
            ...mergedSocialLinks[key],
            ...data.socialLinks[key],
          };
        }
      });
    }

    const mergedContactFields = getMergedContactFields(data.contactFields);

    return {
      email: data.email || DEFAULT_SITE_SETTINGS.email,
      phone: data.phone || DEFAULT_SITE_SETTINGS.phone,
      address: data.address || DEFAULT_SITE_SETTINGS.address,
      addressEn: data.addressEn || DEFAULT_SITE_SETTINGS.addressEn,
      officeAddress: data.officeAddress || DEFAULT_SITE_SETTINGS.officeAddress,
      officeAddressEn: data.officeAddressEn || DEFAULT_SITE_SETTINGS.officeAddressEn,
      workingHours: data.workingHours || DEFAULT_SITE_SETTINGS.workingHours,
      workingHoursEn: data.workingHoursEn || DEFAULT_SITE_SETTINGS.workingHoursEn,
      contactFields: mergedContactFields,
      registrationOpen: data.registrationOpen ?? DEFAULT_SITE_SETTINGS.registrationOpen,
      maintenanceMode: data.maintenanceMode ?? DEFAULT_SITE_SETTINGS.maintenanceMode,
      showResults: data.showResults ?? DEFAULT_SITE_SETTINGS.showResults,
      socialLinks: mergedSocialLinks,
    };
  } catch (err) {
    console.warn("Notice: Fetching site settings from API failed, using cached settings.", err);
    return null;
  }
}

async function saveToBackendApi(updatedState: SiteSettings): Promise<boolean> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("asu_access_token") : "";
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Accept": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/site-settings/`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        email: updatedState.email,
        phone: updatedState.phone,
        address: updatedState.address,
        addressEn: updatedState.addressEn,
        officeAddress: updatedState.officeAddress,
        officeAddressEn: updatedState.officeAddressEn,
        workingHours: updatedState.workingHours,
        workingHoursEn: updatedState.workingHoursEn,
        contactFields: updatedState.contactFields,
        registrationOpen: updatedState.registrationOpen,
        maintenanceMode: updatedState.maintenanceMode,
        showResults: updatedState.showResults,
        socialLinks: updatedState.socialLinks,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log("Site settings successfully saved to backend database:", data);
      return true;
    } else {
      console.error("Backend returned error status when saving site settings:", res.status);
      return false;
    }
  } catch (err) {
    console.error("Error connecting to backend database API:", err);
    return false;
  }
}

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  // Load settings on mount (cached first, then fresh from Database API)
  useEffect(() => {
    const initialCache = getStoredSettings();
    setSettings(initialCache);

    fetchFromBackendApi().then((fresh) => {
      if (fresh) {
        setSettings(fresh);
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
          window.dispatchEvent(new Event(SETTINGS_EVENT));
        }
      }
    });

    const handleSync = () => {
      const updated = getStoredSettings();
      setSettings(updated);
    };

    window.addEventListener(SETTINGS_EVENT, handleSync);
    window.addEventListener("storage", handleSync);

    return () => {
      window.removeEventListener(SETTINGS_EVENT, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const updatedSocialLinks = {
      ...settings.socialLinks,
      ...(newSettings.socialLinks || {}),
    };

    const updatedContactFields = {
      ...settings.contactFields,
      ...(newSettings.contactFields || {}),
    };

    const updatedState: SiteSettings = {
      ...settings,
      ...newSettings,
      contactFields: updatedContactFields,
      socialLinks: updatedSocialLinks,
    };

    // 1. Update local Context state synchronously
    setSettings(updatedState);

    // 2. Cache locally in localStorage and trigger live event
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedState));
        window.dispatchEvent(new Event(SETTINGS_EVENT));
      } catch (err) {
        console.error("Failed to save settings to localStorage:", err);
      }
    }

    // 3. Save permanently to Backend Database
    await saveToBackendApi(updatedState);
  };

  const updateSocialLink = async (key: string, url: string, enabled: boolean) => {
    const defaultItem = DEFAULT_SITE_SETTINGS.socialLinks[key] || { key, nameAr: key, nameEn: key, url: "", enabled: true };
    const currentItem = settings.socialLinks[key] || defaultItem;

    const updatedSocialLinks = {
      ...settings.socialLinks,
      [key]: {
        ...currentItem,
        url,
        enabled,
      },
    };

    const updatedState: SiteSettings = {
      ...settings,
      socialLinks: updatedSocialLinks,
    };

    setSettings(updatedState);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedState));
        window.dispatchEvent(new Event(SETTINGS_EVENT));
      } catch (err) {
        console.error("Failed to save social link setting:", err);
      }
    }

    await saveToBackendApi(updatedState);
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SITE_SETTINGS);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event(SETTINGS_EVENT));
    }
  };

  return (
    <SiteSettingsContext.Provider
      value={{ settings, updateSettings, updateSocialLink, resetSettings }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error("useSiteSettings must be used within a SiteSettingsProvider");
  }
  return context;
}
