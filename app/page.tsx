"use client";

import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { GravityHero } from "@/components/home/gravity-hero";
import { StatsSection } from "@/components/home/stats-section";
import { FacultiesGrid } from "@/components/home/faculties-grid";
import { PartnersSection } from "@/components/home/partners-section";
import { NewsPreview } from "@/components/home/news-preview";
import {
  useSiteSettings,
  DEFAULT_HOME_PAGE_CONFIG,
  HomeSectionId,
} from "@/contexts/site-settings-context";

export default function HomePage() {
  const { settings } = useSiteSettings();
  const homeConfig = settings.homePageConfig || DEFAULT_HOME_PAGE_CONFIG;

  const sectionsOrder: HomeSectionId[] =
    homeConfig.sectionsOrder && homeConfig.sectionsOrder.length > 0
      ? homeConfig.sectionsOrder
      : DEFAULT_HOME_PAGE_CONFIG.sectionsOrder;

  const isSectionVisible = (secId: HomeSectionId) => {
    const enabled = homeConfig.enabledSections?.[secId] !== false;
    if (!enabled) return false;

    const schedule = homeConfig.sectionSchedules?.[secId];
    if (schedule?.enabled) {
      const now = new Date();
      if (schedule.startDate && new Date(schedule.startDate) > now) return false;
      if (schedule.endDate && new Date(schedule.endDate) < now) return false;
    }
    return true;
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {sectionsOrder.map((secId) => {
          if (!isSectionVisible(secId)) return null;

          switch (secId) {
            case "hero":
              return <GravityHero key="hero" />;
            case "stats":
              return <StatsSection key="stats" />;
            case "faculties":
              return <FacultiesGrid key="faculties" />;
            case "partners":
              return <PartnersSection key="partners" />;
            case "news":
              return <NewsPreview key="news" />;
            default:
              return null;
          }
        })}
      </main>
      <Footer />
    </div>
  );
}
