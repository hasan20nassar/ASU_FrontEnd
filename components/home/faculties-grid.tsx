"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/language-context";
import {
  useSiteSettings,
  DEFAULT_HOME_PAGE_CONFIG,
  HomeFacultiesConfig,
} from "@/contexts/site-settings-context";
import { useFaculties } from "@/hooks/use-faculties";
import { Faculty } from "@/lib/api/models/Faculty";
import { Button } from "@/components/ui/button";
import { TiltCard } from "@/components/ui/tilt-card";
import { Magnetic } from "@/components/ui/magnetic";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Building2,
  Stethoscope,
  Pill,
  Briefcase,
  Scale,
  BookOpen,
  Atom,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  Stethoscope,
  Pill,
  Briefcase,
  Scale,
  BookOpen,
  Atom,
};

function hexToRgba(hex: string, alpha: number) {
  if (!hex || !hex.startsWith("#")) return `rgba(30, 58, 138, ${alpha})`;
  let c = hex.substring(1);
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const num = parseInt(c, 16);
  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
}

function FacultyHomeCard({
  faculty,
  enable3DTilt = true,
  showCoverImage = true,
  showProgramsCount = true,
  compact = false,
}: {
  faculty: Faculty;
  enable3DTilt?: boolean;
  showCoverImage?: boolean;
  showProgramsCount?: boolean;
  compact?: boolean;
}) {
  const { language, dir } = useLanguage();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const [isHovered, setIsHovered] = useState(false);
  const Icon = (faculty.icon && iconMap[faculty.icon]) || BookOpen;
  const primaryColor = faculty.primaryColor || "#003366";
  const accentColor = faculty.accentColor || "#e0a800";

  if (compact) {
    return (
      <Link
        href={`/academics/${faculty.slug}`}
        className="group block h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="relative h-full overflow-hidden rounded-2xl border bg-card p-4 sm:p-5 transition-all duration-300 flex items-center gap-4"
          style={{
            borderColor: isHovered
              ? hexToRgba(primaryColor, 0.5)
              : "var(--border)",
            boxShadow: isHovered
              ? `0 10px 26px ${hexToRgba(primaryColor, 0.12)}`
              : "0 2px 6px rgba(0,0,0,0.03)",
          }}
        >
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border bg-background p-2 transition-transform duration-300 group-hover:scale-105 overflow-hidden"
            style={{
              borderColor: hexToRgba(primaryColor, 0.25),
            }}
          >
            {faculty.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={faculty.logoUrl}
                alt={language === "ar" ? faculty.nameAr : faculty.nameEn}
                className="h-full w-full object-contain"
              />
            ) : (
              <div
                className="w-full h-full rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: primaryColor }}
              >
                <Icon className="h-6 w-6" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 text-start">
            <h3
              className="text-base font-bold text-foreground truncate transition-colors"
              style={{ color: isHovered ? primaryColor : undefined }}
            >
              {language === "ar" ? faculty.nameAr : faculty.nameEn}
            </h3>
            <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
              {language === "ar" ? faculty.descriptionAr : faculty.descriptionEn}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {showProgramsCount && (
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-lg border hidden sm:inline-block"
                style={{
                  backgroundColor: hexToRgba(primaryColor, 0.06),
                  borderColor: hexToRgba(primaryColor, 0.2),
                  color: primaryColor,
                }}
              >
                {faculty.programs?.length || 0}{" "}
                {language === "ar" ? "برامج" : "programs"}
              </span>
            )}
            <Arrow
              className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
              style={{ color: primaryColor }}
            />
          </div>
        </div>
      </Link>
    );
  }

  const cardInner = (
    <div
      className="group relative h-full overflow-hidden rounded-2xl border bg-card transition-all duration-300 flex flex-col justify-between"
      style={{
        borderColor: isHovered
          ? hexToRgba(primaryColor, 0.45)
          : "var(--border)",
        boxShadow: isHovered
          ? `0 12px 30px ${hexToRgba(primaryColor, 0.12)}`
          : "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      {/* Top Identity Line */}
      <div
        className="w-full shrink-0 h-1 transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, ${primaryColor} 0%, ${accentColor} 100%)`,
          opacity: isHovered ? 1 : 0.75,
        }}
      />

      {showCoverImage && faculty.image && (
        <div className="relative h-32 w-full overflow-hidden">
          <Image
            src={faculty.image}
            alt={language === "ar" ? faculty.nameAr : faculty.nameEn}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
        </div>
      )}

      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
        <div>
          {/* Faculty Logo / Icon Container */}
          <div
            className={cn(
              "mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl border bg-background p-2 transition-transform duration-300 group-hover:scale-105 overflow-hidden",
              showCoverImage &&
                faculty.image &&
                "relative -mt-12 border-2 border-card shadow-md"
            )}
            style={{
              borderColor: isHovered
                ? hexToRgba(primaryColor, 0.5)
                : hexToRgba(primaryColor, 0.25),
              boxShadow: `0 4px 14px ${hexToRgba(primaryColor, 0.08)}`,
            }}
          >
            {faculty.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={faculty.logoUrl}
                alt={language === "ar" ? faculty.nameAr : faculty.nameEn}
                className="h-full w-full object-contain"
              />
            ) : (
              <div
                className="w-full h-full rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: primaryColor }}
              >
                <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
            )}
          </div>

          {/* Title */}
          <h3
            className="text-base sm:text-lg font-bold text-foreground transition-colors line-clamp-1"
            style={{ color: isHovered ? primaryColor : undefined }}
          >
            {language === "ar" ? faculty.nameAr : faculty.nameEn}
          </h3>

          {/* Description */}
          <p className="mt-2 line-clamp-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {language === "ar"
              ? faculty.descriptionAr
              : faculty.descriptionEn}
          </p>
        </div>

        {/* Footer with Programs Badge & Arrow */}
        <div className="mt-5 pt-3 border-t border-border/50 flex items-center justify-between">
          {showProgramsCount ? (
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-md border"
              style={{
                backgroundColor: hexToRgba(primaryColor, 0.06),
                borderColor: hexToRgba(primaryColor, 0.2),
                color: primaryColor,
              }}
            >
              {faculty.programs?.length || 0}{" "}
              {language === "ar" ? "برامج" : "programs"}
            </span>
          ) : (
            <span />
          )}

          <div
            className="flex items-center gap-1 text-xs font-bold transition-all"
            style={{ color: primaryColor }}
          >
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">
              {language === "ar" ? "استكشف" : "Explore"}
            </span>
            <Arrow className="h-4 w-4 transform transition-transform group-hover:translate-x-[-2px] rtl:group-hover:translate-x-[2px]" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Link
      href={`/academics/${faculty.slug}`}
      className="group block h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {enable3DTilt ? (
        <TiltCard tiltAmount={6} scale={1.02} className="h-full">
          {cardInner}
        </TiltCard>
      ) : (
        cardInner
      )}
    </Link>
  );
}

export function FacultiesGrid({
  configOverride,
}: {
  configOverride?: HomeFacultiesConfig;
} = {}) {
  const { language, t, dir } = useLanguage();
  const isArabic = language === "ar";
  const { settings, isPagePublished } = useSiteSettings();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const LeftIcon = dir === "rtl" ? ArrowRight : ArrowLeft;
  const RightIcon = dir === "rtl" ? ArrowLeft : ArrowRight;

  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  const facConfig: HomeFacultiesConfig = {
    ...DEFAULT_HOME_PAGE_CONFIG.faculties,
    ...(settings.homePageConfig?.faculties || {}),
    ...(configOverride || {}),
  };

  const { data: backendFaculties } = useFaculties();
  const rawFaculties = backendFaculties || [];
  const publishedFaculties = rawFaculties
    .filter((f) => isPagePublished(`/academics/${f.slug}`))
    .map((f) => ({
      ...f,
      programs: (f.programs || []).filter((p) =>
        isPagePublished(`/academics/${f.slug}/${p.slug}`)
      ),
    }));

  const displayFaculties =
    facConfig.itemLimit && facConfig.itemLimit > 0
      ? publishedFaculties.slice(0, facConfig.itemLimit)
      : publishedFaculties;

  if (!isPagePublished("/academics") || displayFaculties.length === 0) {
    return null;
  }

  const total = displayFaculties.length;

  const getMotionInitial = (index: number) => {
    switch (facConfig.animationType) {
      case "curtain-reveal": {
        const isLeft = dir === "rtl" ? index >= total / 2 : index < total / 2;
        return { opacity: 0, x: isLeft ? -90 : 90, scale: 0.96 };
      }
      case "scale-blur":
        return { opacity: 0, scale: 0.88, filter: "blur(10px)" };
      case "3d-perspective":
        return { opacity: 0, rotateY: dir === "rtl" ? -25 : 25, y: 35 };
      case "stagger-up":
      default:
        return { opacity: 0, y: 30 };
    }
  };

  const getMotionAnimate = () => {
    switch (facConfig.animationType) {
      case "curtain-reveal":
        return { opacity: 1, x: 0, scale: 1 };
      case "scale-blur":
        return { opacity: 1, scale: 1, filter: "blur(0px)" };
      case "3d-perspective":
        return { opacity: 1, rotateY: 0, y: 0 };
      case "stagger-up":
      default:
        return { opacity: 1, y: 0 };
    }
  };

  const gridColsClass =
    facConfig.columns === 3
      ? "sm:grid-cols-2 lg:grid-cols-3"
      : facConfig.columns === 5
        ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
        : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  return (
    <section className="bg-muted/30 py-16 sm:py-24 overflow-hidden">
      <div className="section-container">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            {isArabic
              ? facConfig.titleAr || "البرامج والكليات"
              : facConfig.titleEn || "Programs and Faculties"}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {isArabic
              ? facConfig.subtitleAr || "برامج أكاديمية متنوعة تلبي تطلعاتك المهنية"
              : facConfig.subtitleEn ||
                "Diverse academic programs to meet your career aspirations"}
          </p>
        </div>

        {/* Layout 1: Carousel Slider */}
        {facConfig.layoutVariant === "carousel-slider" && (
          <div className="relative">
            <Carousel
              setApi={setCarouselApi}
              opts={{
                align: "start",
                loop: false,
                direction: dir as "ltr" | "rtl",
              }}
              dir={dir}
              className="w-full"
            >
              <CarouselContent className="-ml-4 py-4">
                {displayFaculties.map((faculty, index) => (
                  <CarouselItem
                    key={faculty.id}
                    className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <motion.div
                      initial={getMotionInitial(index)}
                      whileInView={getMotionAnimate()}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.55, delay: index * 0.08 }}
                      className="h-full"
                    >
                      <FacultyHomeCard
                        faculty={faculty}
                        enable3DTilt={facConfig.enable3DTilt}
                        showCoverImage={facConfig.showCoverImage}
                        showProgramsCount={facConfig.showProgramsCount}
                      />
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => carouselApi?.scrollPrev()}
              >
                <LeftIcon className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => carouselApi?.scrollNext()}
              >
                <RightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Layout 2: Bento Showcase */}
        {facConfig.layoutVariant === "bento-showcase" && (
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {displayFaculties.map((faculty, index) => {
              const isWide = index === 0 || index === 1;
              return (
                <motion.div
                  key={faculty.id}
                  initial={getMotionInitial(index)}
                  whileInView={getMotionAnimate()}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  className={cn(isWide ? "lg:col-span-2" : "lg:col-span-1")}
                >
                  <FacultyHomeCard
                    faculty={faculty}
                    enable3DTilt={facConfig.enable3DTilt}
                    showCoverImage={facConfig.showCoverImage}
                    showProgramsCount={facConfig.showProgramsCount}
                  />
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Layout 3: Compact Directory */}
        {facConfig.layoutVariant === "compact-directory" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayFaculties.map((faculty, index) => (
              <motion.div
                key={faculty.id}
                initial={getMotionInitial(index)}
                whileInView={getMotionAnimate()}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.07 }}
              >
                <FacultyHomeCard
                  faculty={faculty}
                  compact
                  showProgramsCount={facConfig.showProgramsCount}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Layout 4 (Default): 3D Tilt Cards Grid */}
        {(!facConfig.layoutVariant ||
          facConfig.layoutVariant === "tilt-cards-grid") && (
          <div className={cn("grid gap-4 sm:gap-6", gridColsClass)}>
            {displayFaculties.map((faculty, index) => (
              <motion.div
                key={faculty.id}
                initial={getMotionInitial(index)}
                whileInView={getMotionAnimate()}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.09 }}
              >
                <FacultyHomeCard
                  faculty={faculty}
                  enable3DTilt={facConfig.enable3DTilt}
                  showCoverImage={facConfig.showCoverImage}
                  showProgramsCount={facConfig.showProgramsCount}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA */}
        {facConfig.showCta !== false && (
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Magnetic strength={0.3} radius={100}>
              <Link href={facConfig.ctaLink || "/academics"}>
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 bg-transparent"
                >
                  {isArabic
                    ? facConfig.ctaTextAr || t("common.viewAll")
                    : facConfig.ctaTextEn || t("common.viewAll")}
                  <Arrow className="h-4 w-4" />
                </Button>
              </Link>
            </Magnetic>
          </motion.div>
        )}
      </div>
    </section>
  );
}
