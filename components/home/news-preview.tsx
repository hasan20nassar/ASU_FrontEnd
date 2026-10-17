"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/language-context";
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

const categoryLabels: Record<string, { ar: string; en: string }> = {
  announcement: { ar: "إعلان", en: "Announcement" },
  event: { ar: "فعالية", en: "Event" },
  achievement: { ar: "إنجاز", en: "Achievement" },
  research: { ar: "بحث علمي", en: "Research" },
};

const categoryColors: Record<string, string> = {
  announcement: "bg-red-50 text-red-700 border-red-200/60 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/30",
  event: "bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/30",
  achievement: "bg-green-50 text-green-700 border-green-200/60 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/30",
  research: "bg-purple-50 text-purple-700 border-purple-200/60 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900/30",
};

// Framer Motion variants for Curtain Reveal
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

export function NewsPreview() {
  const { language, t, dir } = useLanguage();
  const { data: backendNews } = useNews();
  const displayNews = backendNews || [];

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

  return (
    <section className="bg-muted/30 py-16 sm:py-24 overflow-hidden">
      <div className="section-container">
        {/* Header */}
        <div className="mb-12 flex items-end justify-between">
          <div className="text-start">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              {language === "ar" ? "آخر الأخبار" : "Latest News"}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {language === "ar"
                ? "تابع آخر المستجدات والإعلانات"
                : "Stay updated with the latest announcements"}
            </p>
          </div>
          <Link href="/news" className="hidden sm:block">
            <Button variant="outline" className="gap-2 bg-transparent border-border hover:bg-accent transition-colors">
              {t("common.viewAll")}
              <ReadMoreArrow className="h-4 w-4" />
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
            <CarouselContent className="-ml-4 md:-ml-6 py-8 px-1">
              {displayNews.map((article, index) => {
                // Determine slide entry direction: left vs right of middle
                const isLeft = dir === "rtl" ? index >= total / 2 : index < total / 2;
                const slideX = isLeft ? -150 : 150;
                const isActive = activeIndex === index;

                return (
                  <CarouselItem
                    key={article.id}
                    className="pl-4 md:pl-6 basis-full sm:basis-[80%] md:basis-[48%] lg:basis-[33.33%] xl:basis-[30%] 2xl:basis-[24%] 3xl:basis-[20%]"
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
                              ? "scale-105 z-10 shadow-[0_20px_50px_rgba(0,0,0,0.12)] border-primary/25 dark:border-primary/45 dark:shadow-[0_20px_50px_rgba(255,255,255,0.02)]"
                              : "scale-95 opacity-70 border-border dark:border-border/60 shadow-sm hover:opacity-90 hover:scale-[0.97] hover:shadow-md"
                          }`}
                        >
                          {/* Image Container */}
                          <div className="relative overflow-hidden w-full aspect-[16/10] bg-muted flex-shrink-0">
                            {article.image ? (
                              <Image
                                src={article.image}
                                alt={language === "ar" ? article.titleAr : article.titleEn}
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
                            <Badge
                              className={`absolute start-4 top-4 shadow-sm font-semibold text-xs px-2.5 py-1 rounded-md transition-all duration-300 border ${
                                categoryColors[article.category]
                              }`}
                            >
                              {language === "ar"
                                ? categoryLabels[article.category].ar
                                : categoryLabels[article.category].en}
                            </Badge>
                          </div>

                          {/* Content */}
                          <div className="p-6 flex flex-col flex-1">
                            {/* Date */}
                            <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5 text-primary/80" />
                              <time dateTime={article.date}>
                                {new Date(article.date).toLocaleDateString(
                                  language === "ar" ? "ar-SY" : "en-US",
                                  { year: "numeric", month: "long", day: "numeric" }
                                )}
                              </time>
                            </div>

                            {/* Title */}
                            <h3
                              className={`font-bold text-foreground tracking-tight leading-snug line-clamp-2 transition-colors duration-300 group-hover:text-primary ${
                                isActive ? "text-xl" : "text-lg"
                              }`}
                            >
                              {language === "ar" ? article.titleAr : article.titleEn}
                            </h3>

                            {/* Excerpt */}
                            <p className="mt-2.5 text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">
                              {language === "ar" ? article.excerptAr : article.excerptEn}
                            </p>

                            {/* Action Link */}
                            <div className="mt-5 pt-3 border-t border-border/50 flex items-center gap-1.5 text-sm font-bold text-primary group/link">
                              <span className="transition-all duration-300 group-hover/link:underline">
                                {language === "ar" ? "اقرأ المزيد" : "Read More"}
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

            {/* Custom Navigation Controls (Mirrored layout matching image) */}
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

        {/* Mobile CTA */}
        <div className="mt-8 text-center sm:hidden">
          <Link href="/news">
            <Button variant="outline" className="gap-2 bg-transparent border-border hover:bg-accent transition-colors w-full max-w-[200px]">
              {t("common.viewAll")}
              <ReadMoreArrow className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
