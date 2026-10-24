"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/language-context";
import {
  useSiteSettings,
  DEFAULT_HOME_PAGE_CONFIG,
  HomeStatsConfig,
  HomeStatCardItem,
} from "@/contexts/site-settings-context";
import { useFaculties } from "@/hooks/use-faculties";
import { Counter } from "@/components/ui/counter";
import { cn } from "@/lib/utils";
import {
  Building2,
  GraduationCap,
  Users,
  Award,
  BookOpen,
  Globe,
  FlaskConical,
  Briefcase,
  Sparkles,
  School,
  Landmark,
  HeartHandshake,
} from "lucide-react";

const STAT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  GraduationCap,
  Users,
  Award,
  BookOpen,
  Globe,
  FlaskConical,
  Briefcase,
  Sparkles,
  School,
  Landmark,
  HeartHandshake,
};

export function StatsSection({
  configOverride,
}: {
  configOverride?: HomeStatsConfig;
} = {}) {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const { settings, isPagePublished } = useSiteSettings();
  const { data: backendFaculties } = useFaculties();

  const rawFaculties = backendFaculties || [];
  const publishedFaculties = rawFaculties.filter((f) =>
    isPagePublished(`/academics/${f.slug}`)
  );
  const facultyCount = publishedFaculties.length;
  const programCount = publishedFaculties.reduce(
    (acc, f) =>
      acc +
      (f.programs || []).filter((p) =>
        isPagePublished(`/academics/${f.slug}/${p.slug}`)
      ).length,
    0
  );

  const statsConfig: HomeStatsConfig = {
    ...DEFAULT_HOME_PAGE_CONFIG.stats,
    ...(settings.homePageConfig?.stats || {}),
    ...(configOverride || {}),
  };

  const cards: HomeStatCardItem[] =
    statsConfig.cards && statsConfig.cards.length > 0
      ? statsConfig.cards
      : DEFAULT_HOME_PAGE_CONFIG.stats.cards;

  const resolveCardValue = (card: HomeStatCardItem): number => {
    if (card.valueSource === "auto_faculties") return facultyCount;
    if (card.valueSource === "auto_programs") return programCount;
    return Number(card.customValue || 0);
  };

  const getInitialVariant = (index: number) => {
    switch (statsConfig.animationType) {
      case "zoom-bounce":
        return { opacity: 0, scale: 0.78 };
      case "flip-x":
        return { opacity: 0, rotateX: -65, y: 20 };
      case "slide-alternate":
        return { opacity: 0, x: index % 2 === 0 ? -45 : 45 };
      case "fade-up":
      default:
        return { opacity: 0, y: 28 };
    }
  };

  const getAnimateVariant = () => {
    switch (statsConfig.animationType) {
      case "zoom-bounce":
        return { opacity: 1, scale: 1 };
      case "flip-x":
        return { opacity: 1, rotateX: 0, y: 0 };
      case "slide-alternate":
        return { opacity: 1, x: 0 };
      case "fade-up":
      default:
        return { opacity: 1, y: 0 };
    }
  };

  const getTransition = (index: number) => {
    if (statsConfig.animationType === "zoom-bounce") {
      return {
        type: "spring" as const,
        stiffness: 160,
        damping: 14,
        delay: index * 0.1,
      };
    }
    return {
      duration: 0.6,
      delay: index * 0.1,
      ease: "easeOut" as const,
    };
  };

  const gridColsClass =
    statsConfig.columns === 2
      ? "sm:grid-cols-2"
      : statsConfig.columns === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "sm:grid-cols-2 lg:grid-cols-3";

  const durationSec = Number(statsConfig.counterDuration || 2);

  return (
    <section className="bg-background py-16">
      <div className="section-container">
        {statsConfig.showHeader && (
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              {isArabic ? statsConfig.titleAr : statsConfig.titleEn}
            </h2>
            {(statsConfig.subtitleAr || statsConfig.subtitleEn) && (
              <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
                {isArabic ? statsConfig.subtitleAr : statsConfig.subtitleEn}
              </p>
            )}
          </div>
        )}

        {statsConfig.layoutStyle === "minimal-ribbon" ? (
          <div className="rounded-3xl border border-border bg-card/80 backdrop-blur-md p-6 sm:p-8 shadow-sm">
            <div
              className={cn(
                "grid gap-6 divide-y sm:divide-y-0 sm:divide-x rtl:sm:divide-x-reverse divide-border",
                gridColsClass
              )}
            >
              {cards.map((card, idx) => {
                const Icon = STAT_ICONS[card.icon] || Building2;
                const val = resolveCardValue(card);
                return (
                  <motion.div
                    key={card.id || idx}
                    initial={getInitialVariant(idx)}
                    whileInView={getAnimateVariant()}
                    viewport={{ once: true }}
                    transition={getTransition(idx)}
                    className="flex items-center gap-4 pt-4 sm:pt-0 sm:px-6 first:pt-0 first:sm:ps-0 last:sm:pe-0"
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-7 w-7" />
                    </div>
                    <div>
                      <div className="text-3xl font-extrabold text-foreground">
                        {card.prefix}
                        <Counter value={val} duration={durationSec} />
                        {card.suffix}
                      </div>
                      <div className="text-sm font-medium text-muted-foreground mt-0.5">
                        {isArabic ? card.labelAr : card.labelEn}
                      </div>
                      {(card.subLabelAr || card.subLabelEn) && (
                        <div className="text-xs text-muted-foreground/80">
                          {isArabic ? card.subLabelAr : card.subLabelEn}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className={cn("grid gap-6", gridColsClass)}>
            {cards.map((card, idx) => {
              const Icon = STAT_ICONS[card.icon] || Building2;
              const val = resolveCardValue(card);
              const isGlass = statsConfig.layoutStyle === "glass-floating";

              if (card.cardVariant === "featured-split") {
                return (
                  <motion.div
                    key={card.id || idx}
                    className={cn(
                      "group relative overflow-hidden rounded-2xl border p-6 transition-all",
                      isGlass
                        ? "border-primary/25 bg-gradient-to-br from-primary/[0.06] via-card to-card shadow-md hover:shadow-xl hover:border-primary/50"
                        : "border-border bg-card hover:border-primary/50 hover:shadow-lg"
                    )}
                    initial={getInitialVariant(idx)}
                    whileInView={getAnimateVariant()}
                    viewport={{ once: true }}
                    transition={getTransition(idx)}
                  >
                    {isGlass && (
                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-amber-500 to-primary opacity-80" />
                    )}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="text-xl font-semibold text-foreground">
                          {isArabic
                            ? card.featuredSystemTitleAr || "نظام الساعات المعتمدة"
                            : card.featuredSystemTitleEn || "Credit Hour System"}
                        </div>
                        {(card.subLabelAr || card.subLabelEn) && (
                          <div className="mt-1 text-muted-foreground">
                            {isArabic ? card.subLabelAr : card.subLabelEn}
                          </div>
                        )}
                      </div>
                      <div className="text-end">
                        <div className="text-3xl font-bold text-primary">
                          {card.prefix}
                          <Counter value={val} duration={durationSec} />
                          {card.suffix}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {isArabic ? card.labelAr : card.labelEn}
                        </div>
                      </div>
                    </div>
                    <div className="absolute -bottom-4 -end-4 h-24 w-24 rounded-full bg-primary/5 transition-transform group-hover:scale-150 pointer-events-none" />
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={card.id || idx}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border p-6 transition-all",
                    isGlass
                      ? "border-primary/25 bg-gradient-to-br from-primary/[0.06] via-card to-card shadow-md hover:shadow-xl hover:border-primary/50"
                      : "border-border bg-card hover:border-primary/50 hover:shadow-lg"
                  )}
                  initial={getInitialVariant(idx)}
                  whileInView={getAnimateVariant()}
                  viewport={{ once: true }}
                  transition={getTransition(idx)}
                >
                  {isGlass && (
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-amber-500 to-primary opacity-80" />
                  )}
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-4xl font-bold text-foreground">
                    {card.prefix}
                    <Counter value={val} duration={durationSec} />
                    {card.suffix}
                  </div>
                  <div className="mt-1 text-muted-foreground">
                    {isArabic ? card.labelAr : card.labelEn}
                  </div>
                  {(card.subLabelAr || card.subLabelEn) && (
                    <div className="mt-0.5 text-xs text-muted-foreground/80">
                      {isArabic ? card.subLabelAr : card.subLabelEn}
                    </div>
                  )}
                  <div className="absolute -bottom-4 -end-4 h-24 w-24 rounded-full bg-primary/5 transition-transform group-hover:scale-150 pointer-events-none" />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
