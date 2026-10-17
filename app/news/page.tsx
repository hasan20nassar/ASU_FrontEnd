"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useLanguage } from "@/contexts/language-context";
import { useNews } from "@/hooks/use-news";
import { useEvents } from "@/hooks/use-events";
import { useAcademicCalendar } from "@/hooks/use-academic-calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Newspaper,
  CalendarDays,
  LayoutGrid,
  Megaphone,
  Trophy,
  FlaskConical,
} from "lucide-react";
import Image from "next/image";

export default function NewsPage() {
  const { language, t, dir } = useLanguage();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: backendNews } = useNews();
  const { data: backendEvents } = useEvents();
  const { data: backendAcademicCalendar } = useAcademicCalendar();

  const displayNews = backendNews || [];
  const displayEvents = backendEvents || [];
  const displayAcademicCalendar = backendAcademicCalendar || [];

  const categoryLabels: Record<string, { ar: string; en: string }> = {
    all: { ar: "الكل", en: "All" },
    announcement: { ar: "إعلانات", en: "Announcements" },
    event: { ar: "فعاليات", en: "Events" },
    achievement: { ar: "إنجازات", en: "Achievements" },
    research: { ar: "بحث علمي", en: "Scientific Research" },
  };

  const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    all: LayoutGrid,
    announcement: Megaphone,
    event: CalendarDays,
    achievement: Trophy,
    research: FlaskConical,
  };

  const eventTypeLabels: Record<string, { ar: string; en: string }> = {
    academic: { ar: "أكاديمي", en: "Academic" },
    cultural: { ar: "ثقافي", en: "Cultural" },
    sports: { ar: "رياضي", en: "Sports" },
    career: { ar: "مهني", en: "Career" },
  };

  const filteredNews =
    selectedCategory === "all"
      ? displayNews
      : displayNews.filter((article) => article.category === selectedCategory);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        {/* Hero Section */}
        <section className="relative h-[35vh] min-h-[300px] w-full overflow-hidden bg-gradient-to-br from-primary to-zinc-950">
          <div className="relative h-full flex items-center">
            <div className="section-container w-full text-start">
              <Badge
                variant="secondary"
                className="mb-4 bg-primary text-primary-foreground border-none"
              >
                {t("nav.news")}
              </Badge>
              <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
                {language === "ar" ? "الأخبار والفعاليات" : "News & Events"}
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-white/90">
                {language === "ar"
                  ? "تابع آخر أخبار ومستجدات جامعة أنطاكية السورية"
                  : "Stay updated with the latest news from Antioch Syrian University"}
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 sm:py-16">
          <div className="section-container">
            <Tabs defaultValue="news" className="w-full" dir={dir}>
              <TabsList className="mb-8 grid w-full grid-cols-2">
                <TabsTrigger value="news" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground">
                  <Newspaper className="h-4 w-4" />
                  {language === "ar" ? "الأخبار" : "News"}
                </TabsTrigger>
                <TabsTrigger value="events" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground">
                  <CalendarDays className="h-4 w-4" />
                  {language === "ar" ? "الفعاليات" : "Events"}
                </TabsTrigger>
              </TabsList>

              {/* News Tab */}
              <TabsContent value="news">
                {/* Category Filter */}
                <div className="mb-6 sm:mb-8 grid grid-cols-5 w-full h-auto p-1 bg-muted rounded-xl gap-1">
                  {Object.entries(categoryLabels).map(([key, label]) => {
                    const Icon = categoryIcons[key];
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedCategory(key)}
                        className={`py-2 px-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer ${
                          selectedCategory === key
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted-foreground/5"
                        }`}
                      >
                        {Icon && <Icon className="h-4 w-4 shrink-0" />}
                        <span className="hidden sm:inline">
                          {language === "ar" ? label.ar : label.en}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* News Grid */}
                <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 text-start">
                  {filteredNews.map((article) => (
                    <Link
                      key={article.id}
                      href={`/news/${article.slug}`}
                      className="group"
                    >
                      <Card className="h-full overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg">
                        <CardContent className="p-0">
                          {/* Image */}
                          <div className="relative h-48 overflow-hidden bg-muted">
                            {article.image ? (
                              <Image
                                src={article.image}
                                alt={
                                  language === "ar"
                                    ? article.titleAr
                                    : article.titleEn
                                }
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-4xl font-bold text-muted-foreground/20">
                                  ASU
                                </div>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                            <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none">
                              <Badge
                                variant="secondary"
                                className="bg-background/90 backdrop-blur-xs font-bold text-xs shadow-xs"
                              >
                                {categoryLabels[article.category]
                                  ? (language === "ar" ? categoryLabels[article.category].ar : categoryLabels[article.category].en)
                                  : article.category}
                              </Badge>

                              {article.programNameAr ? (
                                <Badge variant="outline" className="bg-emerald-950/80 text-emerald-300 border-emerald-400/40 text-[10px] font-bold backdrop-blur-xs">
                                  {language === "ar" ? article.programNameAr : (article.programSlug || "Department")}
                                </Badge>
                              ) : article.facultyNameAr ? (
                                <Badge variant="outline" className="bg-blue-950/80 text-blue-300 border-blue-400/40 text-[10px] font-bold backdrop-blur-xs">
                                  {language === "ar" ? article.facultyNameAr : (article.facultySlug || "Faculty")}
                                </Badge>
                              ) : null}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-5 flex flex-col flex-1">
                            <div className="mb-2.5 flex items-center justify-between text-xs text-muted-foreground">
                              <span className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 text-primary" />
                                <time>
                                  {new Date(article.date).toLocaleDateString(
                                    language === "ar" ? "ar-SY" : "en-US",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    },
                                  )}
                                </time>
                              </span>

                              {article.readingTime && (
                                <span className="flex items-center gap-1 text-[11px]">
                                  <Clock className="h-3 w-3" />
                                  {language === "ar" ? `${article.readingTime} دقائق` : `${article.readingTime}m`}
                                </span>
                              )}
                            </div>
                            <h3 className="mb-2 font-bold text-foreground text-base transition-colors group-hover:text-primary line-clamp-2 leading-snug">
                              {language === "ar"
                                ? article.titleAr
                                : article.titleEn}
                            </h3>
                            <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed flex-1">
                              {language === "ar"
                                ? article.excerptAr
                                : article.excerptEn}
                            </p>
                            <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs font-bold text-primary">
                              <span>{t("common.learnMore")}</span>
                              <Arrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </TabsContent>

              {/* Events Tab */}
              <TabsContent value="events">
                <div className="grid gap-4 sm:gap-6 lg:grid-cols-2 text-start">
                  {/* Upcoming Events */}
                  <div>
                    <h2 className="mb-6 text-xl font-semibold text-foreground">
                      {language === "ar"
                        ? "الفعاليات القادمة"
                        : "Upcoming Events"}
                    </h2>
                    <div className="space-y-4">
                      {displayEvents.length > 0 ? (
                        displayEvents.map((event) => (
                          <Card key={event.id}>
                            <CardContent className="p-6">
                              <div className="flex gap-4">
                                <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10">
                                  <span className="text-2xl font-bold text-primary">
                                    {new Date(event.date).getDate()}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(event.date).toLocaleDateString(
                                      language === "ar" ? "ar-SY" : "en-US",
                                      { month: "short" },
                                    )}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <Badge variant="outline" className="mb-2">
                                    {language === "ar"
                                      ? eventTypeLabels[event.type].ar
                                      : eventTypeLabels[event.type].en}
                                  </Badge>
                                  <h3 className="font-semibold text-foreground">
                                    {language === "ar"
                                      ? event.titleAr
                                      : event.titleEn}
                                  </h3>
                                  <p className="mt-1 text-sm text-muted-foreground">
                                    {language === "ar"
                                      ? event.descriptionAr
                                      : event.descriptionEn}
                                  </p>
                                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-4 w-4" />
                                      {event.time}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-4 w-4" />
                                      {language === "ar"
                                        ? event.location.ar
                                        : event.location.en}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <Card>
                          <CardContent className="p-6 text-center text-muted-foreground">
                            {language === "ar"
                              ? "لا توجد فعاليات قادمة حالياً"
                              : "No upcoming events at the moment"}
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>

                  {/* Calendar View Placeholder */}
                  <div>
                    <h2 className="mb-6 text-xl font-semibold text-foreground">
                      {language === "ar"
                        ? "التقويم الأكاديمي"
                        : "Academic Calendar"}
                    </h2>
                    <Card>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {displayAcademicCalendar.length > 0 ? (
                            displayAcademicCalendar.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0"
                              >
                                <div className="h-3 w-3 shrink-0 rounded-full bg-primary" />
                                <div>
                                  <p className="font-medium text-foreground">
                                    {language === "ar"
                                      ? item.eventAr
                                      : item.eventEn}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {language === "ar"
                                      ? item.dateAr
                                      : item.dateEn}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-center text-sm text-muted-foreground">
                              {language === "ar"
                                ? "لا تتوفر عناصر حالياً"
                                : "No academic calendar items available"}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
