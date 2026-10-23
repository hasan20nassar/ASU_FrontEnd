"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

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

export const DEFAULT_PUBLISHED_PAGES: Record<string, boolean> = {
  home: true,
  about: true,
  about_directory: true,
  about_map: true,
  academics: true,
  admissions: true,
  campus_life: true,
  library: true,
  research: true,
  news: true,
  contact: true,
  privacy: true,
  terms: true,
  developer: true,
};

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
  publishedPages: Record<string, boolean>;
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
  publishedPages: { ...DEFAULT_PUBLISHED_PAGES },
};

interface SiteSettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  updateSocialLink: (key: string, url: string, enabled: boolean) => Promise<void>;
  updatePublishedPages: (newPages: Record<string, boolean>) => Promise<boolean>;
  isPagePublished: (keyOrPath: string) => boolean;
  resetSettings: () => void;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

const STORAGE_KEY = "asu_site_settings_v10";
const SETTINGS_EVENT = "asu_site_settings_updated";

function getApiBaseUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_API_URL ||
    (typeof window !== "undefined" && window.location.hostname === "localhost"
      ? "http://127.0.0.1:8000"
      : "");
  return url.replace(/\/+$/, "");
}

export function getMergedContactFields(
  parsedFields?: Record<string, any>
): Record<string, ContactFieldItem> {
  const merged = { ...DEFAULT_SITE_SETTINGS.contactFields };
  if (parsedFields && typeof parsedFields === "object") {
    Object.keys(DEFAULT_SITE_SETTINGS.contactFields).forEach((key) => {
      if (parsedFields[key]) {
        const item = parsedFields[key];
        const defaultItem =
          DEFAULT_SITE_SETTINGS.contactFields[
            key as keyof typeof DEFAULT_SITE_SETTINGS.contactFields
          ];
        merged[key as keyof typeof DEFAULT_SITE_SETTINGS.contactFields] = {
          ...defaultItem,
          ...item,
          value: item.value !== undefined ? item.value : defaultItem.value,
          valueAr:
            item.valueAr ?? item.value ?? defaultItem.valueAr ?? defaultItem.value,
          valueEn:
            item.valueEn ?? defaultItem.valueEn ?? item.value ?? defaultItem.value,
          enabled: item.enabled !== undefined ? item.enabled : defaultItem.enabled,
        };
      }
    });
  }
  return merged;
}

export function getMergedPublishedPages(
  parsedPages?: Record<string, any>
): Record<string, boolean> {
  const merged: Record<string, boolean> = { ...DEFAULT_PUBLISHED_PAGES };
  if (parsedPages && typeof parsedPages === "object") {
    Object.keys(parsedPages).forEach((key) => {
      merged[key] = Boolean(parsedPages[key]);
    });
  }
  merged.home = true; // Home is always published
  return merged;
}

/**
 * Evaluates whether a given page key or URL path is published,
 * strictly enforcing parent-child hierarchy rules:
 * - Home ("/" or "home") is always published.
 * - Subpages under a parent are unpublished if the parent or the subpage itself is unpublished.
 */
export function checkIsPagePublished(
  publishedPages: Record<string, boolean> | undefined,
  keyOrPath: string
): boolean {
  const pages = publishedPages || DEFAULT_PUBLISHED_PAGES;
  const raw = (keyOrPath || "").trim();

  if (!raw || raw === "/" || raw === "home") {
    return true;
  }

  // Normalize path vs key
  const cleanPath = raw.startsWith("/") ? raw.replace(/\/+$/, "") || "/" : "";

  const isKeyEnabled = (k: string): boolean => {
    if (k === "home") return true;
    return pages[k] !== false;
  };

  // Direct key check with parent hierarchy
  if (!cleanPath) {
    if (raw === "about") return isKeyEnabled("about");
    if (raw === "about_directory")
      return isKeyEnabled("about") && isKeyEnabled("about_directory");
    if (raw === "about_map")
      return isKeyEnabled("about") && isKeyEnabled("about_map");

    if (raw === "academics") return isKeyEnabled("academics");
    if (raw.startsWith("faculty:")) {
      return isKeyEnabled("academics") && isKeyEnabled(raw);
    }
    if (raw.startsWith("program:")) {
      // format: program:<facultySlug>:<programSlug> or program:<programSlug>
      const parts = raw.split(":");
      if (parts.length === 3) {
        const facSlug = parts[1];
        return (
          isKeyEnabled("academics") &&
          isKeyEnabled(`faculty:${facSlug}`) &&
          isKeyEnabled(raw)
        );
      }
      return isKeyEnabled("academics") && isKeyEnabled(raw);
    }

    if (raw === "campus_life") return isKeyEnabled("campus_life");
    if (raw === "library")
      return isKeyEnabled("campus_life") && isKeyEnabled("library");
    if (raw === "research")
      return isKeyEnabled("campus_life") && isKeyEnabled("research");

    return isKeyEnabled(raw);
  }

  // Path-based evaluation
  if (cleanPath === "/") return true;

  // Protected / System paths are not public content pages
  if (
    cleanPath.startsWith("/dashboard") ||
    cleanPath.startsWith("/portal") ||
    cleanPath.startsWith("/login")
  ) {
    return true;
  }

  // 1. About & Subpages
  if (cleanPath === "/about") {
    return isKeyEnabled("about");
  }
  if (cleanPath === "/about/directory" || cleanPath.startsWith("/about/directory/")) {
    return isKeyEnabled("about") && isKeyEnabled("about_directory");
  }
  if (cleanPath === "/about/map" || cleanPath.startsWith("/about/map/")) {
    return isKeyEnabled("about") && isKeyEnabled("about_map");
  }

  // 2. Academics, Faculties & Programs
  if (cleanPath === "/academics") {
    return isKeyEnabled("academics");
  }
  if (cleanPath.startsWith("/academics/")) {
    if (!isKeyEnabled("academics")) return false;
    const segments = cleanPath.replace("/academics/", "").split("/").filter(Boolean);
    const facultySlug = segments[0];
    const programSlug = segments[1];
    if (facultySlug && !isKeyEnabled(`faculty:${facultySlug}`)) {
      return false;
    }
    if (facultySlug && programSlug) {
      if (
        !isKeyEnabled(`program:${facultySlug}:${programSlug}`) ||
        !isKeyEnabled(`program:${programSlug}`)
      ) {
        return false;
      }
    }
    return true;
  }
  if (cleanPath.startsWith("/faculties/")) {
    if (!isKeyEnabled("academics")) return false;
    const segments = cleanPath.replace("/faculties/", "").split("/").filter(Boolean);
    const facultySlug = segments[0];
    if (facultySlug && !isKeyEnabled(`faculty:${facultySlug}`)) {
      return false;
    }
    return true;
  }

  // 3. Admissions
  if (cleanPath === "/admissions" || cleanPath.startsWith("/admissions/")) {
    return isKeyEnabled("admissions");
  }

  // 4. Campus Life & Subpages (Library, Research)
  if (cleanPath === "/campus-life" || cleanPath.startsWith("/campus-life/")) {
    return isKeyEnabled("campus_life");
  }
  if (cleanPath === "/library" || cleanPath.startsWith("/library/")) {
    return isKeyEnabled("campus_life") && isKeyEnabled("library");
  }
  if (cleanPath === "/research" || cleanPath.startsWith("/research/")) {
    return isKeyEnabled("campus_life") && isKeyEnabled("research");
  }

  // 5. News
  if (cleanPath === "/news" || cleanPath.startsWith("/news/")) {
    return isKeyEnabled("news");
  }

  // 6. Contact
  if (cleanPath === "/contact" || cleanPath.startsWith("/contact/")) {
    return isKeyEnabled("contact");
  }

  // 7. Footer Legal & Info Pages
  if (cleanPath === "/privacy" || cleanPath.startsWith("/privacy/")) {
    return isKeyEnabled("privacy");
  }
  if (cleanPath === "/terms" || cleanPath.startsWith("/terms/")) {
    return isKeyEnabled("terms");
  }
  if (cleanPath === "/developer" || cleanPath.startsWith("/developer/")) {
    return isKeyEnabled("developer");
  }

  return true;
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
    const mergedPublishedPages = getMergedPublishedPages(parsed.publishedPages);

    return {
      ...DEFAULT_SITE_SETTINGS,
      ...parsed,
      contactFields: mergedContactFields,
      socialLinks: mergedSocialLinks,
      publishedPages: mergedPublishedPages,
    };
  } catch (err) {
    console.error("Failed to parse site settings from localStorage:", err);
    return DEFAULT_SITE_SETTINGS;
  }
}

async function fetchFromBackendApi(): Promise<SiteSettings | null> {
  try {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("asu_access_token")
        : "";
    const headers: Record<string, string> = { Accept: "application/json" };
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
    const mergedPublishedPages = getMergedPublishedPages(data.publishedPages);

    return {
      email: data.email || DEFAULT_SITE_SETTINGS.email,
      phone: data.phone || DEFAULT_SITE_SETTINGS.phone,
      address: data.address || DEFAULT_SITE_SETTINGS.address,
      addressEn: data.addressEn || DEFAULT_SITE_SETTINGS.addressEn,
      officeAddress: data.officeAddress || DEFAULT_SITE_SETTINGS.officeAddress,
      officeAddressEn:
        data.officeAddressEn || DEFAULT_SITE_SETTINGS.officeAddressEn,
      workingHours: data.workingHours || DEFAULT_SITE_SETTINGS.workingHours,
      workingHoursEn:
        data.workingHoursEn || DEFAULT_SITE_SETTINGS.workingHoursEn,
      contactFields: mergedContactFields,
      registrationOpen:
        data.registrationOpen ?? DEFAULT_SITE_SETTINGS.registrationOpen,
      maintenanceMode:
        data.maintenanceMode ?? DEFAULT_SITE_SETTINGS.maintenanceMode,
      showResults: data.showResults ?? DEFAULT_SITE_SETTINGS.showResults,
      socialLinks: mergedSocialLinks,
      publishedPages: mergedPublishedPages,
    };
  } catch (err) {
    console.warn(
      "Notice: Fetching site settings from API failed, using cached settings.",
      err
    );
    return null;
  }
}

async function saveToBackendApi(updatedState: SiteSettings): Promise<boolean> {
  try {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("asu_access_token")
        : "";
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
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
        publishedPages: {
          ...updatedState.publishedPages,
          home: true,
        },
      }),
    });

    if (res.ok) {
      await res.json();
      return true;
    } else {
      console.error(
        "Backend returned error status when saving site settings:",
        res.status
      );
      return false;
    }
  } catch (err) {
    console.error("Error connecting to backend database API:", err);
    return false;
  }
}

export function SiteSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

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

    const updatedPublishedPages = getMergedPublishedPages({
      ...settings.publishedPages,
      ...(newSettings.publishedPages || {}),
    });

    const updatedState: SiteSettings = {
      ...settings,
      ...newSettings,
      contactFields: updatedContactFields,
      socialLinks: updatedSocialLinks,
      publishedPages: updatedPublishedPages,
    };

    setSettings(updatedState);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedState));
        window.dispatchEvent(new Event(SETTINGS_EVENT));
      } catch (err) {
        console.error("Failed to save settings to localStorage:", err);
      }
    }

    await saveToBackendApi(updatedState);
  };

  const updatePublishedPages = async (
    newPages: Record<string, boolean>
  ): Promise<boolean> => {
    const mergedPages = getMergedPublishedPages({
      ...settings.publishedPages,
      ...newPages,
    });

    const updatedState: SiteSettings = {
      ...settings,
      publishedPages: mergedPages,
    };

    setSettings(updatedState);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedState));
        window.dispatchEvent(new Event(SETTINGS_EVENT));
      } catch (err) {
        console.error("Failed to save publishedPages to localStorage:", err);
      }
    }

    return await saveToBackendApi(updatedState);
  };

  const updateSocialLink = async (
    key: string,
    url: string,
    enabled: boolean
  ) => {
    const defaultItem = DEFAULT_SITE_SETTINGS.socialLinks[key] || {
      key,
      nameAr: key,
      nameEn: key,
      url: "",
      enabled: true,
    };
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

  const isPagePublished = useCallback(
    (keyOrPath: string) => {
      return checkIsPagePublished(settings.publishedPages, keyOrPath);
    },
    [settings.publishedPages]
  );

  const resetSettings = () => {
    setSettings(DEFAULT_SITE_SETTINGS);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event(SETTINGS_EVENT));
    }
  };

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        updateSettings,
        updateSocialLink,
        updatePublishedPages,
        isPagePublished,
        resetSettings,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error(
      "useSiteSettings must be used within a SiteSettingsProvider"
    );
  }
  return context;
}
