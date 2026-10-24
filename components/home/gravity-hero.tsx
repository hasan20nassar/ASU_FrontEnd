"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/language-context";
import {
  useSiteSettings,
  DEFAULT_HOME_PAGE_CONFIG,
  HomeHeroConfig,
} from "@/contexts/site-settings-context";
import { Button } from "@/components/ui/button";
import { ChevronsDown, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function GravityHero({
  configOverride,
}: {
  configOverride?: HomeHeroConfig;
} = {}) {
  const { language, t, dir } = useLanguage();
  const { settings } = useSiteSettings();
  const isArabic = language === "ar";
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  const hero: HomeHeroConfig = {
    ...DEFAULT_HOME_PAGE_CONFIG.hero,
    ...(settings.homePageConfig?.hero || {}),
    ...(configOverride || {}),
  };

  const titleText = isArabic
    ? hero.titleAr || "جامعة أنطاكية السورية"
    : hero.titleEn || "Antioch Syrian University";

  const subtitleText = isArabic
    ? hero.subtitleAr || t("hero.description")
    : hero.subtitleEn || t("hero.description");

  // Typewriter animation state when animationType === "typewriter"
  const [typedTitle, setTypedTitle] = useState(titleText);
  useEffect(() => {
    if (hero.animationType !== "typewriter") {
      setTypedTitle(titleText);
      return;
    }
    setTypedTitle("");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypedTitle(titleText.slice(0, i));
      if (i >= titleText.length) {
        clearInterval(interval);
      }
    }, 45);
    return () => clearInterval(interval);
  }, [titleText, hero.animationType]);

  const heightClass =
    hero.heightVariant === "compact"
      ? "min-h-[55vh]"
      : hero.heightVariant === "medium"
        ? "min-h-[72vh]"
        : "min-h-[90vh]";

  const getTitleInitial = () => {
    switch (hero.animationType) {
      case "blur-reveal":
        return { opacity: 0, filter: "blur(16px)", y: 24 };
      case "slide-up-stagger":
        return { opacity: 0, y: 50 };
      case "typewriter":
        return { opacity: 1 };
      case "scale-fade":
      default:
        return { opacity: 0, scale: 0.92 };
    }
  };

  const getTitleAnimate = () => {
    switch (hero.animationType) {
      case "blur-reveal":
        return { opacity: 1, filter: "blur(0px)", y: 0 };
      case "slide-up-stagger":
        return { opacity: 1, y: 0 };
      case "typewriter":
        return { opacity: 1 };
      case "scale-fade":
      default:
        return { opacity: 1, scale: 1 };
    }
  };

  const overlayAlpha = Math.min(Math.max(hero.overlayOpacity ?? 20, 0), 90) / 100;
  const blurPx = Math.min(Math.max(hero.backdropBlur ?? 2, 0), 16);

  return (
    <section
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-background transition-all duration-500",
        heightClass
      )}
    >
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {hero.backgroundType === "video" && (
          <video
            key={hero.videoUrl}
            src={hero.videoUrl || "/videos/home-video.mp4"}
            autoPlay
            muted
            loop
            playsInline
            poster={hero.posterUrl || "/hero-bg.png"}
            className="h-full w-full object-cover opacity-60 transition-opacity duration-1000"
          />
        )}

        {hero.backgroundType === "image" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={hero.posterUrl || "/hero-bg.png"}
            alt={titleText}
            className="h-full w-full object-cover opacity-70 transition-transform duration-1000 scale-105"
          />
        )}

        {hero.backgroundType === "gradient" && (
          <div
            className="h-full w-full"
            style={{
              background:
                "radial-gradient(circle at 20% 20%, rgba(128, 0, 0, 0.25) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(212, 175, 55, 0.2) 0%, transparent 50%), linear-gradient(135deg, var(--background) 0%, var(--muted) 100%)",
            }}
          />
        )}

        <div
          className="absolute inset-0"
          style={{
            backgroundColor: `rgba(0, 0, 0, ${overlayAlpha})`,
            backdropFilter: `blur(${blurPx}px)`,
          }}
        />
      </div>

      {/* Bottom Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/75 pointer-events-none" />

      {/* Content Container */}
      <div
        className={cn(
          "relative z-10 mx-auto max-w-7xl px-4 w-full flex flex-col",
          hero.alignment === "start"
            ? "items-start text-start"
            : "items-center text-center"
        )}
      >
        {/* Title */}
        <motion.h1
          key={`hero-title-${hero.animationType}-${language}`}
          className="text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          initial={getTitleInitial()}
          animate={getTitleAnimate()}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {hero.animationType === "typewriter" ? (
            <>
              {typedTitle}
              <span className="inline-block w-[3px] h-[0.9em] bg-primary align-middle ms-1 animate-pulse" />
            </>
          ) : (
            titleText
          )}
        </motion.h1>

        {/* Description */}
        <motion.p
          key={`hero-sub-${hero.animationType}-${language}`}
          className="mt-6 max-w-2xl text-pretty text-lg font-medium text-foreground/80 sm:text-xl"
          initial={{
            opacity: 0,
            y: 24,
            filter: hero.animationType === "blur-reveal" ? "blur(10px)" : "blur(0px)",
          }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {subtitleText}
        </motion.p>

        {/* Optional CTA Buttons */}
        {(hero.showPrimaryCta || hero.showSecondaryCta) && (
          <motion.div
            className="mt-8 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            {hero.showPrimaryCta && (
              <Link href={hero.primaryCtaLink || "/academics"}>
                <Button size="lg" className="font-bold gap-2 px-7 shadow-lg">
                  <span>
                    {isArabic
                      ? hero.primaryCtaTextAr || "استكشف الكليات"
                      : hero.primaryCtaTextEn || "Explore Faculties"}
                  </span>
                  <Arrow className="h-4 w-4" />
                </Button>
              </Link>
            )}

            {hero.showSecondaryCta && (
              <Link href={hero.secondaryCtaLink || "/admissions"}>
                <Button
                  size="lg"
                  variant="outline"
                  className="font-bold gap-2 px-7 bg-background/70 backdrop-blur-md"
                >
                  <span>
                    {isArabic
                      ? hero.secondaryCtaTextAr || "القبول والتسجيل"
                      : hero.secondaryCtaTextEn || "Admissions"}
                  </span>
                </Button>
              </Link>
            )}
          </motion.div>
        )}
      </div>

      {/* Scroll Indicator */}
      {hero.showScrollIndicator !== false && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center"
          >
            <ChevronsDown className="h-8 w-8 text-foreground/40" />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
