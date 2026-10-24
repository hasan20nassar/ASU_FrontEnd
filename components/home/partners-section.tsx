"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/language-context";
import {
  useSiteSettings,
  DEFAULT_HOME_PAGE_CONFIG,
  HomePartnersConfig,
  HomePartnerItem,
} from "@/contexts/site-settings-context";
import { cn } from "@/lib/utils";
import {
  School,
  Building2,
  Landmark,
  GraduationCap,
  Award,
  BookOpen,
  Briefcase,
  Library,
  Globe,
  HeartHandshake,
  Sparkles,
  ExternalLink,
} from "lucide-react";

const PARTNER_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  School,
  Building2,
  Landmark,
  GraduationCap,
  Award,
  BookOpen,
  Briefcase,
  Library,
  Globe,
  HeartHandshake,
  Sparkles,
};

function PartnerVisualNode({
  partner,
  hoverRibbonStyle,
  logoColorMode,
  isArabic,
}: {
  partner: HomePartnerItem;
  hoverRibbonStyle: HomePartnersConfig["hoverRibbonStyle"];
  logoColorMode: HomePartnersConfig["logoColorMode"];
  isArabic: boolean;
}) {
  const Icon = PARTNER_ICON_MAP[partner.fallbackIcon] || Building2;
  const displayName = isArabic ? partner.nameAr : partner.nameEn;
  const displaySub = isArabic ? partner.subtitleAr : partner.subtitleEn;

  const isGrayscale = logoColorMode === "grayscale-to-color";

  const logoElement = partner.logoUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={partner.logoUrl}
      alt={displayName}
      className={cn(
        "h-16 w-16 sm:h-20 sm:w-20 object-contain transition-all duration-300",
        isGrayscale &&
          "grayscale opacity-75 group-hover/partner:grayscale-0 group-hover/partner:opacity-100"
      )}
    />
  ) : (
    <Icon
      className={cn(
        "w-14 h-14 sm:w-16 sm:h-16 transition-colors duration-300",
        isGrayscale
          ? "text-[#4A5568] dark:text-[#E2E8F0] group-hover/partner:text-primary"
          : "text-primary"
      )}
    />
  );

  // Style 1: Glow Card
  if (hoverRibbonStyle === "glow-card") {
    const content = (
      <div className="group/partner relative flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-card/60 px-6 py-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:bg-card hover:shadow-[0_12px_30px_rgba(128,0,0,0.12)] min-w-[160px]">
        <div className="transition-transform duration-300 group-hover/partner:scale-110">
          {logoElement}
        </div>
        <div className="mt-3 text-center">
          <p className="text-xs font-bold text-foreground group-hover/partner:text-primary transition-colors line-clamp-1">
            {displayName}
          </p>
          {displaySub && (
            <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
              {displaySub}
            </p>
          )}
        </div>
      </div>
    );

    if (partner.websiteUrl) {
      return (
        <a
          href={partner.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block"
        >
          {content}
        </a>
      );
    }
    return content;
  }

  // Style 2: Bottom Slide Bar
  if (hoverRibbonStyle === "bottom-slide-bar") {
    const content = (
      <div className="group/partner relative flex flex-col items-center justify-center px-4 py-6">
        <div className="w-20 h-20 flex items-center justify-center transition-transform duration-300 ease-out group-hover/partner:scale-125 group-hover/partner:-translate-y-2 cursor-pointer">
          {logoElement}
        </div>
        {/* Bottom Slide Ribbon */}
        <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 opacity-0 group-hover/partner:translate-y-0 group-hover/partner:opacity-100 transition-all duration-300 z-30">
          <div className="whitespace-nowrap rounded-lg bg-primary px-3 py-1 text-[11px] font-bold text-primary-foreground shadow-lg flex items-center gap-1.5">
            <span>{displayName}</span>
            {partner.websiteUrl && <ExternalLink className="h-3 w-3 opacity-80" />}
          </div>
        </div>
      </div>
    );

    if (partner.websiteUrl) {
      return (
        <a
          href={partner.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block"
        >
          {content}
        </a>
      );
    }
    return content;
  }

  // Style 3 (Default): Floating Pill Ribbon Above Partner Logo on Hover
  const content = (
    <div className="group/partner relative flex items-center justify-center px-3 py-8">
      {/* Floating Hover Ribbon Tooltip */}
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 translate-y-2 scale-95 opacity-0 group-hover/partner:translate-y-0 group-hover/partner:scale-100 group-hover/partner:opacity-100 transition-all duration-300 ease-out z-30"
      >
        <div className="relative whitespace-nowrap rounded-xl border border-primary/30 bg-card/95 backdrop-blur-md px-3.5 py-1.5 shadow-xl text-center">
          <p className="text-xs font-extrabold text-primary flex items-center justify-center gap-1.5">
            <span>{displayName}</span>
            {partner.websiteUrl && <ExternalLink className="h-3 w-3" />}
          </p>
          {displaySub && (
            <p className="text-[10px] font-medium text-muted-foreground mt-0.5">
              {displaySub}
            </p>
          )}
          {/* Little pointer triangle */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-3 w-3 rotate-45 border-b border-r border-primary/30 bg-card" />
        </div>
      </div>

      {/* Partner Logo / Icon */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center flex-shrink-0 transition-all duration-300 ease-out origin-center group-hover/partner:scale-[1.28] z-10 cursor-pointer">
        {logoElement}
      </div>
    </div>
  );

  if (partner.websiteUrl) {
    return (
      <a
        href={partner.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block"
      >
        {content}
      </a>
    );
  }
  return content;
}

export function PartnersSection({
  configOverride,
}: {
  configOverride?: HomePartnersConfig;
} = {}) {
  const { language, dir } = useLanguage();
  const isArabic = language === "ar";
  const { settings } = useSiteSettings();

  const partnersConfig: HomePartnersConfig = {
    ...DEFAULT_HOME_PAGE_CONFIG.partners,
    ...(settings.homePageConfig?.partners || {}),
    ...(configOverride || {}),
  };

  const partnersList: HomePartnerItem[] =
    partnersConfig.partners && partnersConfig.partners.length > 0
      ? partnersConfig.partners
      : DEFAULT_HOME_PAGE_CONFIG.partners.partners;

  // Duplicate partners to allow seamless infinite loop scrolling
  const triplePartners = [...partnersList, ...partnersList, ...partnersList];

  const speedSec = Math.max(Number(partnersConfig.marqueeSpeedSeconds || 25), 5);
  const animDirection =
    partnersConfig.marqueeDirection === "left"
      ? "marquee-ltr"
      : partnersConfig.marqueeDirection === "right"
        ? "marquee-rtl"
        : dir === "rtl"
          ? "marquee-rtl"
          : "marquee-ltr";

  return (
    <section className="py-16 sm:py-24 bg-background">
      {/* Self-contained CSS Marquee styles with hover control */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes marquee-rtl {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.3333%); }
        }
        @keyframes marquee-ltr {
          0% { transform: translateX(-33.3333%); }
          100% { transform: translateX(0%); }
        }
        .marquee-track-custom {
          display: flex;
          gap: 4.5rem;
          align-items: center;
          width: max-content;
          animation-name: ${animDirection};
          animation-duration: ${speedSec}s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        ${
          partnersConfig.pauseOnHover !== false
            ? `.marquee-container:hover .marquee-track-custom { animation-play-state: paused; }`
            : ""
        }
      `,
        }}
      />

      <div className="section-container">
        {/* Header */}
        <div className="mb-12 text-start">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            {isArabic
              ? partnersConfig.titleAr || "شركاء النجاح"
              : partnersConfig.titleEn || "Success Partners"}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {isArabic
              ? partnersConfig.subtitleAr ||
                "مؤسسات وشركات شريكة في تحقيق التميز الأكاديمي والعملي"
              : partnersConfig.subtitleEn ||
                "Partner organizations contributing to academic and practical excellence"}
          </p>
        </div>

        {partnersConfig.displayMode === "static-grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 items-center justify-items-center pt-4">
            {partnersList.map((partner, idx) => (
              <motion.div
                key={partner.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.06 }}
              >
                <PartnerVisualNode
                  partner={partner}
                  hoverRibbonStyle={partnersConfig.hoverRibbonStyle || "floating-pill"}
                  logoColorMode={partnersConfig.logoColorMode || "grayscale-to-color"}
                  isArabic={isArabic}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          /* Infinite Marquee Scroll Container */
          <div
            dir="ltr"
            className="marquee-container relative w-full overflow-x-clip overflow-y-visible py-6"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
              maskImage:
                "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
            }}
          >
            <div className="marquee-track-custom">
              {triplePartners.map((partner, idx) => (
                <PartnerVisualNode
                  key={`${partner.id}-${idx}`}
                  partner={partner}
                  hoverRibbonStyle={partnersConfig.hoverRibbonStyle || "floating-pill"}
                  logoColorMode={partnersConfig.logoColorMode || "grayscale-to-color"}
                  isArabic={isArabic}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
