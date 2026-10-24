"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/language-context";
import {
  useSiteSettings,
  DEFAULT_HOME_PAGE_CONFIG,
  HomeNewsConfig,
} from "@/contexts/site-settings-context";
import { useNews } from "@/hooks/use-news";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Calendar } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const categoryLabels: Record<string, { ar: string; en: string }> = {
  announcement: { ar: "إعلان", en: "Announcement" },
  event: { ar: "فعالية", en: "Event" },
  achievement: { ar: "إنجاز", en: "Achievement" },
  research: { ar: "بحث علمي", en: "Research" },
};

const categoryColors: Record<string, string> = {
  announcement:
    "bg-red-50 text-red-700 border-red-200/60 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/30",
  event:
    "bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/30",
  achievement:
    "bg-green-50 text-green-700 border-green-200/60 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/30",
  research:
    "bg-purple-50 text-purple-700 border-purple-200/60 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900/30",
};

export function NewsPreview({
  configOverride,
}: {
  configOverride?: HomeNewsConfig;
} = {}) {
  const { language, t, dir } = useLanguage();
  const isArabic = language === "ar";
  const { settings, isPagePublished } = useSiteSettings();
  const { data: backendNews } = useNews();
  const rawNews = backendNews || [];

  const newsConfig: HomeNewsConfig = {
    ...DEFAULT_HOME_PAGE_CONFIG.news,
    ...(settings.homePageConfig?.news || {}),
    ...(configOverride || {}),
  };

  const categoryFiltered =
    newsConfig.categoryFilter && newsConfig.categoryFilter !== "all"
      ? rawNews.filter((item) => item.category === newsConfig.categoryFilter)
      : rawNews;

  const displayNews =
    newsConfig.itemLimit && newsConfig.itemLimit > 0
      ? categoryFiltered.slice(0, newsConfig.itemLimit)
      : categoryFiltered;

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

  const total = displayNews.length;
  const ReadMoreArrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const LeftIcon = dir === "rtl" ? ArrowRight : ArrowLeft;
  const RightIcon = dir === "rtl" ? ArrowLeft : ArrowRight;

  if (!isPagePublished("/news")) {
    return null;
  }

  const getInitialAnim = (index: number) => {
    switch (newsConfig.animationType) {
      case "stagger-fade-up":
        return { opacity: 0, y: 35 };
      case "scale-spring":
        return { opacity: 0, scale: 0.85, y: 20 };
      case "blur-slide":
        return {
          opacity: 0,
          x: dir === "rtl" ? 50 : -50,
          filter: "blur(10px)",
        };
      case "curtain-split":
      default: {
        const isLeft = dir === "rtl" ? index >= total / 2 : index < total / 2;
        return {
          x: isLeft ? -130 : 130,
          opacity: 0,
          scale: 0.95,
        };
      }
    }
  };

  const getAnimateAnim = () => {
    switch (newsConfig.animationType) {
      case "stagger-fade-up":
        return { opacity: 1, y: 0 };
      case "scale-spring":
        return { opacity: 1, scale: 1, y: 0 };
      case "blur-slide":
        return { opacity: 1, x: 0, filter: "blur(0px)" };
      case "curtain-split":
      default:
        return { x: 0, opacity: 1, scale: 1 };
    }
  };

  const getTransition = (index: number) => {
    if (
      newsConfig.animationType === "curtain-split" ||
      newsConfig.animationType === "scale-spring"
    ) {
      return {
        type: "spring" as const,
        stiffness: 55,
        damping: 14,
        mass: 0.8,
        delay: index * 0.08,
      };
    }
    return {
      duration: 0.55,
      delay: index * 0.08,
      ease: "easeOut" as const,
    };
  };

  const renderArticleCard = (article: any, index: number, isFeatured = false) => (
    <Link
      href={`/news/${article.slug}`}
      className="group block h-full select-none"
      draggable={false}
    >
      <Card
        className={cn(
          "h-full overflow-hidden transition-all duration-500 ease-out origin-center rounded-2xl border bg-card text-card-foreground flex flex-col",
          isFeatured
            ? "shadow-lg border-primary/25 hover:shadow-xl"
            : "border-border shadow-sm hover:shadow-md hover:border-primary/40"
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden w-full bg-muted flex-shrink-0",
            isFeatured ? "aspect-[16/9]" : "aspect-[16/10]"
          )}
        >
          {article.image ? (
            <Image
              src={article.image}
              alt={isArabic ? article.titleAr : article.titleEn}
              fill
              sizes="(max-w-7xl) 33vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 select-none"
              draggable={false}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-muted-foreground/20">
              ASU
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent pointer-events-none" />
          {newsConfig.showCategoryBadge !== false && article.category && (
            <Badge
              className={`absolute start-4 top-4 shadow-sm font-semibold text-xs px-2.5 py-1 rounded-md transition-all duration-300 border ${
                categoryColors[article.category] || ""
              }`}
            >
              {isArabic
                ? categoryLabels[article.category]?.ar || article.category
                : categoryLabels[article.category]?.en || article.category}
            </Badge>
          )}
        </div>

        <div className="p-6 flex flex-col flex-1 text-start">
          {newsConfig.showDate !== false && article.date && (
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 text-primary/80" />
              <time dateTime={article.date}>
                {new Date(article.date).toLocaleDateString(
                  isArabic ? "ar-SY" : "en-US",
                  { year: "numeric", month: "long", day: "numeric" }
                )}
              </time>
            </div>
          )}

          <h3
            className={cn(
              "font-bold text-foreground tracking-tight leading-snug line-clamp-2 transition-colors duration-300 group-hover:text-primary",
              isFeatured ? "text-xl sm:text-2xl" : "text-lg"
            )}
          >
            {isArabic ? article.titleAr : article.titleEn}
          </h3>

          {newsConfig.showExcerpt !== false && (
            <p className="mt-2.5 text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">
              {isArabic ? article.excerptAr : article.excerptEn}
            </p>
          )}

          <div className="mt-5 pt-3 border-t border-border/50 flex items-center gap-1.5 text-sm font-bold text-primary group/link">
            <span className="transition-all duration-300 group-hover/link:underline">
              {isArabic ? "اقرأ المزيد" : "Read More"}
            </span>
            <ReadMoreArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </div>
        </div>
      </Card>
    </Link>
  );

  return (
    <section className="bg-muted/30 py-16 sm:py-24 overflow-hidden">
      <div className="section-container">
        {/* Header */}
        <div className="mb-12 flex items-end justify-between">
          <div className="text-start">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              {isArabic
                ? newsConfig.titleAr || "آخر الأخبار"
                : newsConfig.titleEn || "Latest News"}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {isArabic
                ? newsConfig.subtitleAr || "تابع آخر المستجدات والإعلانات"
                : newsConfig.subtitleEn ||
                  "Stay updated with the latest announcements"}
            </p>
          </div>
          {newsConfig.showCta !== false && (
            <Link href={newsConfig.ctaLink || "/news"} className="hidden sm:block">
              <Button
                variant="outline"
                className="gap-2 bg-transparent border-border hover:bg-accent transition-colors"
              >
                {isArabic
                  ? newsConfig.ctaTextAr || t("common.viewAll")
                  : newsConfig.ctaTextEn || t("common.viewAll")}
                <ReadMoreArrow className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>

        {/* Layout 1: Modern 3-Column Grid */}
        {newsConfig.layoutVariant === "modern-grid" && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayNews.map((article, index) => (
              <motion.div
                key={article.id}
                initial={getInitialAnim(index)}
                whileInView={getAnimateAnim()}
                viewport={{ once: true, margin: "-50px" }}
                transition={getTransition(index)}
                className="h-full"
              >
                {renderArticleCard(article, index)}
              </motion.div>
            ))}
          </div>
        )}

        {/* Layout 2: Editorial Magazine (1 Large Featured + Side List) */}
        {newsConfig.layoutVariant === "editorial-magazine" &&
          displayNews.length > 0 && (
            <div className="grid gap-6 lg:grid-cols-12">
              <motion.div
                initial={getInitialAnim(0)}
                whileInView={getAnimateAnim()}
                viewport={{ once: true }}
                transition={getTransition(0)}
                className="lg:col-span-7 h-full"
              >
                {renderArticleCard(displayNews[0], 0, true)}
              </motion.div>

              <div className="lg:col-span-5 flex flex-col gap-4">
                {displayNews.slice(1, 5).map((article, idx) => (
                  <motion.div
                    key={article.id}
                    initial={getInitialAnim(idx + 1)}
                    whileInView={getAnimateAnim()}
                    viewport={{ once: true }}
                    transition={getTransition(idx + 1)}
                  >
                    <Link
                      href={`/news/${article.slug}`}
                      className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-3.5 transition-all hover:border-primary/40 hover:shadow-md text-start"
                    >
                      <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
                        {article.image ? (
                          <Image
                            src={article.image}
                            alt={isArabic ? article.titleAr : article.titleEn}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-sm font-bold text-muted-foreground/30">
                            ASU
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        {newsConfig.showDate !== false && article.date && (
                          <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-primary" />
                            {new Date(article.date).toLocaleDateString(
                              isArabic ? "ar-SY" : "en-US",
                              { year: "numeric", month: "short", day: "numeric" }
                            )}
                          </span>
                        )}
                        <h4 className="mt-1 font-bold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                          {isArabic ? article.titleAr : article.titleEn}
                        </h4>
                      </div>
                      <ReadMoreArrow className="h-4 w-4 shrink-0 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

        {/* Layout 3: Compact Feed */}
        {newsConfig.layoutVariant === "compact-feed" && (
          <div className="grid gap-3 sm:grid-cols-2">
            {displayNews.map((article, index) => (
              <motion.div
                key={article.id}
                initial={getInitialAnim(index)}
                whileInView={getAnimateAnim()}
                viewport={{ once: true }}
                transition={getTransition(index)}
              >
                <Link
                  href={`/news/${article.slug}`}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm text-start"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {newsConfig.showCategoryBadge !== false && article.category && (
                        <Badge
                          className={`text-[10px] px-2 py-0.5 border ${
                            categoryColors[article.category] || ""
                          }`}
                        >
                          {isArabic
                            ? categoryLabels[article.category]?.ar
                            : categoryLabels[article.category]?.en}
                        </Badge>
                      )}
                      {newsConfig.showDate !== false && article.date && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(article.date).toLocaleDateString(
                            isArabic ? "ar-SY" : "en-US",
                            { year: "numeric", month: "short", day: "numeric" }
                          )}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-foreground truncate group-hover:text-primary transition-colors">
                      {isArabic ? article.titleAr : article.titleEn}
                    </h3>
                  </div>
                  <ReadMoreArrow className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Layout 4 (Default): Center Focus Carousel */}
        {(!newsConfig.layoutVariant ||
          newsConfig.layoutVariant === "center-focus-carousel") && (
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
              <CarouselContent className="-ml-4 md:-ml-6 py-8 px-1">
                {displayNews.map((article, index) => {
                  const isActive = activeIndex === index;

                  return (
                    <CarouselItem
                      key={article.id}
                      className="pl-4 md:pl-6 basis-full sm:basis-[80%] md:basis-[48%] lg:basis-[33.33%] xl:basis-[30%] 2xl:basis-[24%] 3xl:basis-[20%]"
                    >
                      <motion.div
                        initial={getInitialAnim(index)}
                        whileInView={getAnimateAnim()}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={getTransition(index)}
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
                                ? "scale-105 z-10 shadow-[0_20px_50px_rgba(0,0,0,0.12)] border-primary/25 dark:border-primary/45 dark:shadow-[0_20px_50px_rgba(255,255,255,0.02)]"
                                : "scale-95 opacity-70 border-border dark:border-border/60 shadow-sm hover:opacity-90 hover:scale-[0.97] hover:shadow-md"
                            }`}
                          >
                            {/* Image Container */}
                            <div className="relative overflow-hidden w-full aspect-[16/10] bg-muted flex-shrink-0">
                              {article.image ? (
                                <Image
                                  src={article.image}
                                  alt={isArabic ? article.titleAr : article.titleEn}
                                  fill
                                  sizes="(max-w-7xl) 33vw, 100vw"
                                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 select-none"
                                  draggable={false}
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-muted-foreground/20">
                                  ASU
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                              {newsConfig.showCategoryBadge !== false &&
                                article.category && (
                                  <Badge
                                    className={`absolute start-4 top-4 shadow-sm font-semibold text-xs px-2.5 py-1 rounded-md transition-all duration-300 border ${
                                      categoryColors[article.category] || ""
                                    }`}
                                  >
                                    {isArabic
                                      ? categoryLabels[article.category]?.ar
                                      : categoryLabels[article.category]?.en}
                                  </Badge>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-6 flex flex-col flex-1 text-start">
                              {newsConfig.showDate !== false && article.date && (
                                <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                                  <Calendar className="h-3.5 w-3.5 text-primary/80" />
                                  <time dateTime={article.date}>
                                    {new Date(article.date).toLocaleDateString(
                                      isArabic ? "ar-SY" : "en-US",
                                      {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      }
                                    )}
                                  </time>
                                </div>
                              )}

                              <h3
                                className={`font-bold text-foreground tracking-tight leading-snug line-clamp-2 transition-colors duration-300 group-hover:text-primary ${
                                  isActive ? "text-xl" : "text-lg"
                                }`}
                              >
                                {isArabic ? article.titleAr : article.titleEn}
                              </h3>

                              {newsConfig.showExcerpt !== false && (
                                <p className="mt-2.5 text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">
                                  {isArabic
                                    ? article.excerptAr
                                    : article.excerptEn}
                                </p>
                              )}

                              <div className="mt-5 pt-3 border-t border-border/50 flex items-center gap-1.5 text-sm font-bold text-primary group/link">
                                <span className="transition-all duration-300 group-hover/link:underline">
                                  {isArabic ? "اقرأ المزيد" : "Read More"}
                                </span>
                                <ReadMoreArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                              </div>
                            </div>
                          </Card>
                        </Link>
                      </motion.div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>

              <div className="flex items-center justify-center gap-3 mt-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={scrollPrev}
                  disabled={!canScrollPrev}
                  className="h-10 w-10 rounded-full border-border bg-card text-foreground hover:bg-accent disabled:opacity-40 transition-colors shadow-sm"
                  aria-label="Previous slide"
                >
                  <LeftIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={scrollNext}
                  disabled={!canScrollNext}
                  className="h-10 w-10 rounded-full border-border bg-card text-foreground hover:bg-accent disabled:opacity-40 transition-colors shadow-sm"
                  aria-label="Next slide"
                >
                  <RightIcon className="h-4 w-4" />
                </Button>
              </div>
            </Carousel>
          </div>
        )}

        {/* Mobile CTA */}
        {newsConfig.showCta !== false && (
          <div className="mt-8 text-center sm:hidden">
            <Link href={newsConfig.ctaLink || "/news"}>
              <Button
                variant="outline"
                className="gap-2 bg-transparent border-border hover:bg-accent transition-colors w-full max-w-[200px]"
              >
                {isArabic
                  ? newsConfig.ctaTextAr || t("common.viewAll")
                  : newsConfig.ctaTextEn || t("common.viewAll")}
                <ReadMoreArrow className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
