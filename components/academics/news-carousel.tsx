"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/language-context";
import { NewsArticle } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Calendar, Newspaper, Sparkles } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

interface NewsCarouselProps {
  articles: NewsArticle[];
  title?: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllText?: string;
  primaryColor?: string;
  accentColor?: string;
  scopeBadgeText?: string;
  className?: string;
  bgProps?: {
    className?: string;
    style?: React.CSSProperties;
    isSolid?: boolean;
  };
}

const categoryLabels: Record<string, { ar: string; en: string }> = {
  announcement: { ar: "إعلان", en: "Announcement" },
  event: { ar: "فعالية", en: "Event" },
  achievement: { ar: "إنجاز", en: "Achievement" },
  research: { ar: "بحث علمي", en: "Research" },
};

const categoryColors: Record<string, string> = {
  announcement: "bg-red-50 text-red-700 border-red-200/60 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/30",
  event: "bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/30",
  achievement: "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30",
  research: "bg-purple-50 text-purple-700 border-purple-200/60 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900/30",
};

function hexToRgba(hex: string, alpha: number) {
  if (!hex || !hex.startsWith("#")) return `rgba(30, 58, 138, ${alpha})`;
  let c = hex.substring(1);
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const num = parseInt(c, 16);
  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
}

const cardRevealVariants = {
  hidden: ({ slideX }: { slideX: number; index: number }) => ({
    x: slideX,
    opacity: 0,
    scale: 0.95,
  }),
  visible: ({ index }: { slideX: number; index: number }) => ({
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 45,
      damping: 14,
      mass: 0.8,
      delay: index * 0.08,
    },
  }),
};

export function AcademicsNewsCarousel({
  articles,
  title,
  subtitle,
  viewAllHref = "/news",
  viewAllText,
  primaryColor = "#059669",
  accentColor = "#10B981",
  scopeBadgeText,
  className = "",
  bgProps,
}: NewsCarouselProps) {
  const { language, dir } = useLanguage();
  const isArabic = language === "ar";

  const [api, setApi] = React.useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const scrollPrev = React.useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = React.useCallback(() => api?.scrollNext(), [api]);

  React.useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      setActiveIndex(api.selectedScrollSnap());
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    api.on("select", handleSelect);
    api.on("reInit", handleSelect);
    handleSelect();

    return () => {
      api.off("select", handleSelect);
      api.off("reInit", handleSelect);
    };
  }, [api]);

  if (!articles || articles.length === 0) {
    return null;
  }

  const total = articles.length;
  const ReadMoreArrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const LeftIcon = dir === "rtl" ? ArrowRight : ArrowLeft;
  const RightIcon = dir === "rtl" ? ArrowLeft : ArrowRight;

  const defaultTitle = isArabic ? "آخر الأخبار والمستجدات" : "Latest News & Updates";
  const defaultSubtitle = isArabic ? "تابع آخر الإعلانات والأنشطة والفعاليات" : "Stay updated with announcements and events";
  const defaultViewAll = isArabic ? "عرض الكل" : "View All";

  const isSolid = bgProps?.isSolid ?? false;

  return (
    <section
      className={`py-14 sm:py-20 text-start overflow-hidden relative ${bgProps?.className || className}`}
      style={bgProps?.style}
    >
      <div className="section-container">
        {/* Header */}
        <div className="mb-10 sm:mb-12 flex items-end justify-between gap-4">
          <div className="text-start space-y-1.5">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-6 rounded-full shrink-0" style={{ backgroundColor: primaryColor }} />
              <span className="w-1.5 h-4 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: hexToRgba(accentColor, 0.12),
                  color: accentColor,
                }}
              >
                <Newspaper className="h-3.5 w-3.5" />
                <span>{scopeBadgeText || (isArabic ? "المركز الإعلامي" : "Newsroom")}</span>
              </div>
            </div>

            <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isSolid ? "text-white" : "text-foreground"}`}>
              {title || defaultTitle}
            </h2>
            <p className={`text-xs sm:text-sm ${isSolid ? "text-white/80" : "text-muted-foreground"}`}>
              {subtitle || defaultSubtitle}
            </p>
          </div>

          <Link href={viewAllHref} className="hidden sm:block">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 font-bold border hover:shadow-xs transition-all"
              style={{
                borderColor: hexToRgba(primaryColor, 0.3),
              }}
            >
              <span>{viewAllText || defaultViewAll}</span>
              <ReadMoreArrow className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {/* News Carousel */}
        <div className="relative">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: false,
              direction: dir as "ltr" | "rtl",
            }}
            className="w-full"
            dir={dir}
          >
            <CarouselContent className="-ml-4 md:-ml-6 py-6 px-1">
              {articles.map((article, index) => {
                const isLeft = dir === "rtl" ? index >= total / 2 : index < total / 2;
                const slideX = isLeft ? -150 : 150;
                const isActive = activeIndex === index;

                return (
                  <CarouselItem
                    key={article.id}
                    className="pl-4 md:pl-6 basis-full sm:basis-[80%] md:basis-[48%] lg:basis-[33.33%] xl:basis-[30%] 2xl:basis-[24%]"
                  >
                    <motion.div
                      custom={{ slideX, index }}
                      variants={cardRevealVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-60px" }}
                      className="h-full py-2"
                    >
                      <Link
                        href={`/news/${article.slug}`}
                        className="group block h-full select-none"
                        draggable={false}
                      >
                        <Card
                          className={`h-full overflow-hidden transition-all duration-500 ease-out origin-center rounded-2xl border bg-card text-card-foreground flex flex-col ${
                            isActive
                              ? "scale-105 z-10 shadow-[0_20px_50px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_50px_rgba(255,255,255,0.02)]"
                              : "scale-95 opacity-70 border-border dark:border-border/60 shadow-sm hover:opacity-100 hover:scale-[0.98] hover:shadow-md"
                          }`}
                          style={{
                            borderColor: isActive
                              ? hexToRgba(primaryColor, 0.45)
                              : undefined,
                            boxShadow: isActive
                              ? `0 20px 45px -10px ${hexToRgba(primaryColor, 0.22)}, 0 0 0 1px ${hexToRgba(accentColor, 0.35)}`
                              : undefined,
                          }}
                        >
                          {/* Image Container */}
                          <div className="relative overflow-hidden w-full aspect-[16/10] bg-muted shrink-0">
                            {article.image ? (
                              <Image
                                src={article.image}
                                alt={isArabic ? article.titleAr : article.titleEn}
                                fill
                                sizes="(max-width: 1200px) 50vw, 33vw"
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 select-none"
                                draggable={false}
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-muted-foreground/20">
                                ASU
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

                            {/* Category Badge */}
                            <Badge
                              className={`absolute start-4 top-4 shadow-sm font-semibold text-xs px-2.5 py-1 rounded-md transition-all duration-300 border ${
                                categoryColors[article.category] || "bg-muted text-foreground"
                              }`}
                            >
                              {isArabic
                                ? categoryLabels[article.category]?.ar || article.category
                                : categoryLabels[article.category]?.en || article.category}
                            </Badge>
                          </div>

                          {/* Content */}
                          <div className="p-6 flex flex-col flex-1">
                            {/* Date */}
                            <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5" style={{ color: primaryColor }} />
                              <time dateTime={article.date}>
                                {new Date(article.date).toLocaleDateString(
                                  isArabic ? "ar-SY" : "en-US",
                                  { year: "numeric", month: "long", day: "numeric" }
                                )}
                              </time>
                            </div>

                            {/* Title */}
                            <h3
                              className={`font-bold text-foreground tracking-tight leading-snug line-clamp-2 transition-colors duration-300 group-hover:text-primary ${
                                isActive ? "text-lg sm:text-xl" : "text-base sm:text-lg"
                              }`}
                            >
                              {isArabic ? article.titleAr : article.titleEn}
                            </h3>

                            {/* Excerpt */}
                            <p className="mt-2.5 text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">
                              {isArabic ? article.excerptAr : article.excerptEn}
                            </p>

                            {/* Action Link */}
                            <div
                              className="mt-5 pt-3 border-t border-border/50 flex items-center gap-1.5 text-xs sm:text-sm font-bold group/link"
                              style={{ color: primaryColor }}
                            >
                              <span className="transition-all duration-300 group-hover/link:underline">
                                {isArabic ? "اقرأ المزيد" : "Read More"}
                              </span>
                              <ReadMoreArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" style={{ color: accentColor }} />
                            </div>
                          </div>
                        </Card>
                      </Link>
                    </motion.div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            {/* Custom Navigation Controls (Mirrored layout matching image) */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                className="h-10 w-10 rounded-full border-border bg-card text-foreground hover:bg-accent disabled:opacity-40 transition-all shadow-xs hover:scale-105 active:scale-95"
                style={{
                  borderColor: canScrollPrev ? hexToRgba(primaryColor, 0.4) : undefined,
                }}
                aria-label="Previous slide"
              >
                <LeftIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={scrollNext}
                disabled={!canScrollNext}
                className="h-10 w-10 rounded-full border-border bg-card text-foreground hover:bg-accent disabled:opacity-40 transition-all shadow-xs hover:scale-105 active:scale-95"
                style={{
                  borderColor: canScrollNext ? hexToRgba(primaryColor, 0.4) : undefined,
                }}
                aria-label="Next slide"
              >
                <RightIcon className="h-4 w-4" />
              </Button>
            </div>
          </Carousel>
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center sm:hidden">
          <Link href={viewAllHref}>
            <Button
              variant="outline"
              className="gap-2 bg-transparent border-border hover:bg-accent transition-colors w-full max-w-[200px] text-xs font-bold"
              style={{
                borderColor: hexToRgba(primaryColor, 0.3),
              }}
            >
              <span>{viewAllText || defaultViewAll}</span>
              <ReadMoreArrow className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
