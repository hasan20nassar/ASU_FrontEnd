"use client";

import { useEffect } from "react";
import { useLanguage } from "@/contexts/language-context";

export function HtmlDirUpdater() {
  const { language } = useLanguage();

  useEffect(() => {
    // Update HTML attributes when language changes
    const html = document.documentElement;
    html.setAttribute("dir", language === "ar" ? "rtl" : "ltr");
    html.setAttribute("lang", language);
    
    // Update font family based on language
    if (language === "ar") {
      html.style.fontFamily = "'Tajawal', 'Cairo', 'Arial', sans-serif";
    } else {
      html.style.fontFamily = "'Inter', system-ui, sans-serif";
    }
  }, [language]);

  return null;
}
