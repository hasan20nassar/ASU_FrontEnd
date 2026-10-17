"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";
import Image from "next/image";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useLanguage } from "@/contexts/language-context";
import { useNews } from "@/hooks/use-news";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RichArticleContent } from "@/components/news/rich-article-content";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Clock,
  Eye,
  Download,
  FileText,
  Sparkles,
  Printer,
  Copy,
  Check,
  Building2,
  GraduationCap,
  X,
  Maximize2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { OpenAPI } from "@/lib/api/core/OpenAPI";

export default function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { language, dir } = useLanguage();
  const isArabic = language === "ar";
  const BackArrow = dir === "rtl" ? ChevronRight : ChevronLeft;

  const { data: backendNews } = useNews();
  const displayNews = backendNews || [];

  const article = displayNews.find((a) => a.slug === slug);

  // States
  const [copied, setCopied] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Increment views count on load
  useEffect(() => {
    if (article?.id) {
      const baseUrl = OpenAPI.BASE || (typeof window !== "undefined" ? window.location.origin : "");
      fetch(`${baseUrl}/api/news-articles/${article.id}/increment_view/`, {
        method: "POST",
      }).catch(() => {});
    }
  }, [article?.id]);

  if (!article) {
    if (!backendNews) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-sm font-semibold text-muted-foreground">
            {isArabic ? "جاري تحميل تفاصيل الخبر..." : "Loading article details..."}
          </p>
        </div>
      );
    }
    notFound();
  }

  const categoryLabels: Record<string, { ar: string; en: string }> = {
    announcement: { ar: "إعلان رسمي", en: "Official Announcement" },
    academic: { ar: "شأن أكاديمي", en: "Academic" },
    event: { ar: "فعالية ومؤتمر", en: "Event & Conference" },
    achievement: { ar: "إنجاز واعتماد", en: "Achievement" },
    research: { ar: "بحث علمي وابتكار", en: "Research & Innovation" },
  };

  const scope = article.scope || (article.program ? "department" : article.faculty ? "faculty" : "university");

  // Related articles (matching same faculty, or same category, excluding current)
  const relatedArticles = displayNews
    .filter((a) => a.slug !== article.slug && (a.faculty === article.faculty || a.category === article.category))
    .slice(0, 3);

  const galleryList = article.galleryImages || [];
  const attachmentsList = article.attachments || [];

  // Share Actions
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const articleTitle = isArabic ? article.titleAr : article.titleEn;

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      toast.success(isArabic ? "تم نسخ رابط الخبر للحافظة" : "Article link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground" dir={dir}>
      <Navbar />

      <main className="flex-1 pb-16">
        {/* Top Header & Breadcrumbs */}
        <section className="border-b bg-muted/20 py-8 sm:py-12">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            {/* Hierarchical Breadcrumb */}
            <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary transition-colors">
                {isArabic ? "الرئيسية" : "Home"}
              </Link>
              <span>/</span>
              <Link href="/news" className="hover:text-primary transition-colors">
                {isArabic ? "الأخبار" : "News"}
              </Link>

              {article.facultySlug && (
                <>
                  <span>/</span>
                  <Link
                    href={`/faculties/${article.facultySlug}`}
                    className="hover:text-primary transition-colors font-medium text-foreground"
                  >
                    {isArabic ? (article.facultyNameAr || "الكلية") : (article.facultySlug || "Faculty")}
                  </Link>
                </>
              )}

              {article.programNameAr && (
                <>
                  <span>/</span>
                  <span className="font-semibold text-primary">
                    {isArabic ? article.programNameAr : (article.programSlug || "Department")}
                  </span>
                </>
              )}
            </nav>

            {/* Badges Bar */}
            <div className="mb-4 flex flex-wrap items-center gap-2.5">
              <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-3 py-1 text-xs">
                {categoryLabels[article.category]
                  ? (isArabic ? categoryLabels[article.category].ar : categoryLabels[article.category].en)
                  : article.category}
              </Badge>

              {/* Scope Badge */}
              {scope === "department" && (
                <Badge variant="outline" className="border-emerald-500/50 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 gap-1 text-xs py-1">
                  <GraduationCap className="h-3.5 w-3.5" />
                  {isArabic ? (article.programNameAr || "على مستوى القسم الأكاديمي") : "Department Level"}
                </Badge>
              )}
              {scope === "faculty" && (
                <Badge variant="outline" className="border-blue-500/50 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 gap-1 text-xs py-1">
                  <Building2 className="h-3.5 w-3.5" />
                  {isArabic ? (article.facultyNameAr || "على مستوى الكلية") : "Faculty Level"}
                </Badge>
              )}
              {scope === "university" && (
                <Badge variant="outline" className="border-purple-500/50 bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 gap-1 text-xs py-1">
                  🏛️ {isArabic ? "خبر مركزي (إدارة الجامعة)" : "University-Wide"}
                </Badge>
              )}

              {/* Publish Date */}
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground ms-auto">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                {new Date(article.date).toLocaleDateString(
                  isArabic ? "ar-SY" : "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </span>

              {/* Reading Time */}
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                {isArabic
                  ? `${article.readingTime || 3} دقائق قراءة`
                  : `${article.readingTime || 3} min read`}
              </span>

              {/* Views Count */}
              {typeof article.viewsCount === "number" && article.viewsCount > 0 && (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Eye className="h-3.5 w-3.5" />
                  {article.viewsCount} {isArabic ? "مشاهدة" : "views"}
                </span>
              )}
            </div>

            {/* Article Headline */}
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight text-foreground">
              {articleTitle}
            </h1>

            {/* Author / Source Attribution */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t pt-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                  ASU
                </div>
                <div>
                  <div className="font-bold text-sm text-foreground">
                    {article.authorNameAr || (isArabic ? "المكتب الإعلامي للجامعة" : "University Media Office")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {article.authorTitleAr || (isArabic ? "جامعة أنطاكية السورية الخاصة" : "Antioch Syrian University")}
                  </div>
                </div>
              </div>

              {/* Quick Action Tools */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  className="gap-1.5 text-xs font-semibold h-8"
                  title={isArabic ? "طباعة الخبر" : "Print Article"}
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{isArabic ? "طباعة" : "Print"}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLink}
                  className="gap-1.5 text-xs font-semibold h-8"
                  title={isArabic ? "نسخ الرابط" : "Copy Link"}
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span className="hidden sm:inline">{copied ? (isArabic ? "تم النسخ" : "Copied") : (isArabic ? "نسخ الرابط" : "Share")}</span>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <section className="py-10 sm:py-14">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Main Column */}
              <article className="lg:col-span-8 space-y-8">
                {/* Hero Featured Image */}
                <div className="overflow-hidden rounded-3xl border bg-muted shadow-lg">
                  <div className="relative aspect-video max-h-[460px] w-full overflow-hidden">
                    {article.image ? (
                      <img
                        src={article.image}
                        alt={articleTitle}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted/60 text-6xl font-black text-muted-foreground/20 italic">
                        ASU
                      </div>
                    )}
                  </div>
                  {/* Photo Caption & Credits */}
                  {(article.imageCaptionAr || article.imageCaptionEn) && (
                    <div className="border-t bg-muted/30 px-5 py-2.5 text-xs text-muted-foreground flex items-center justify-between">
                      <span>{isArabic ? article.imageCaptionAr : (article.imageCaptionEn || article.imageCaptionAr)}</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">Photo Source</span>
                    </div>
                  )}
                </div>

                {/* Lead Excerpt Paragraph */}
                {(article.excerptAr || article.excerptEn) && (
                  <div className="rounded-2xl border-s-4 border-primary bg-primary/5 p-5 sm:p-6 dark:bg-primary/10">
                    <p className="text-lg sm:text-xl font-semibold leading-relaxed text-foreground/90">
                      {isArabic ? article.excerptAr : (article.excerptEn || article.excerptAr)}
                    </p>
                  </div>
                )}

                {/* Editorial Body Content */}
                <RichArticleContent
                  content={
                    (isArabic ? article.contentAr : article.contentEn) ||
                    (isArabic ? article.excerptAr : article.excerptEn)
                  }
                  isArabic={isArabic}
                />

                {/* Photo Gallery Section (if available) */}
                {galleryList.length > 0 && (
                  <div className="mt-12 rounded-3xl border bg-card p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="flex items-center gap-2.5 border-b pb-4">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <h3 className="text-xl font-bold text-foreground">
                        {isArabic ? "معرض صور الفعالية (الألبوم الكامل)" : "Event Photo Gallery"}
                      </h3>
                      <Badge variant="secondary" className="ms-auto font-bold text-xs">
                        {galleryList.length} {isArabic ? "صور" : "photos"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {galleryList.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => setLightboxIndex(idx)}
                          className="group relative aspect-4/3 cursor-pointer overflow-hidden rounded-2xl border bg-muted shadow-xs transition-all hover:shadow-md"
                        >
                          <img
                            src={item.url}
                            alt={item.captionAr || `Gallery photo ${idx + 1}`}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Maximize2 className="h-6 w-6" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Official Documents / Attachments Card */}
                {attachmentsList.length > 0 && (
                  <div className="mt-8 rounded-3xl border bg-card p-6 sm:p-8 shadow-xs space-y-4">
                    <div className="flex items-center gap-2.5 border-b pb-4">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="text-xl font-bold text-foreground">
                        {isArabic ? "المستندات والقرارات الرسمية المرفقة" : "Official Attached Documents"}
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {attachmentsList.map((doc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-4 rounded-2xl border p-4 bg-muted/20 transition-colors hover:bg-muted/40"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-950/40 font-bold text-xs">
                              {doc.fileType || "PDF"}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-sm text-foreground truncate">
                                {isArabic ? doc.titleAr : (doc.titleEn || doc.titleAr)}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {doc.size || "1.5 MB"} • {isArabic ? "مستند رسمي معتمد" : "Official document"}
                              </p>
                            </div>
                          </div>

                          <a
                            href={doc.url}
                            download
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all"
                          >
                            <Download className="h-3.5 w-3.5" />
                            {isArabic ? "تحميل الملف" : "Download"}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom Social Share Bar */}
                <div className="rounded-3xl border bg-muted/20 p-6 flex flex-wrap items-center justify-between gap-4 mt-8">
                  <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                    <Share2 className="h-4 w-4 text-primary" />
                    {isArabic ? "مشاركة هذا الخبر عبر منصات التواصل:" : "Share this article on:"}
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(articleTitle + " - " + currentUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full border bg-background hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300 transition-colors"
                      title="WhatsApp"
                    >
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                      </svg>
                    </a>

                    <a
                      href={`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(articleTitle)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full border bg-background hover:bg-blue-50 hover:text-blue-500 hover:border-blue-300 transition-colors"
                      title="Telegram"
                    >
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                      </svg>
                    </a>

                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(articleTitle)}&url=${encodeURIComponent(currentUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full border bg-background hover:bg-neutral-100 transition-colors"
                      title="X"
                    >
                      <Twitter className="h-4 w-4" />
                    </a>

                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full border bg-background hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors"
                      title="Facebook"
                    >
                      <Facebook className="h-4 w-4" />
                    </a>

                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full border bg-background hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-colors"
                      title="LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </article>

              {/* Sidebar: Details & Department Scope */}
              <aside className="lg:col-span-4 space-y-6">
                {/* Academic Entity Card */}
                {(article.facultySlug || article.programSlug) && (
                  <div className="rounded-3xl border bg-card p-6 shadow-xs space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold">
                        <Building2 className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground font-semibold">
                          {isArabic ? "الجهة الأكاديمية المصدرة" : "Issuing Academic Entity"}
                        </div>
                        <h4 className="font-bold text-base text-foreground">
                          {isArabic ? (article.facultyNameAr || "جامعة أنطاكية السورية") : "Antioch Syrian University"}
                        </h4>
                      </div>
                    </div>

                    {article.programNameAr && (
                      <div className="rounded-xl bg-muted/30 p-3 text-xs">
                        <span className="font-semibold text-primary">{isArabic ? "القسم / البرنامج:" : "Program:"}</span>{" "}
                        <span className="text-foreground font-bold">{isArabic ? article.programNameAr : article.programSlug}</span>
                      </div>
                    )}

                    {article.facultySlug && (
                      <Link href={`/faculties/${article.facultySlug}`} className="block">
                        <Button variant="outline" className="w-full text-xs font-bold gap-1.5">
                          {isArabic ? "زيارة صفحة الكلية الرسمية" : "Visit Faculty Page"}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    )}
                  </div>
                )}

                {/* Quick Info Box */}
                <div className="rounded-3xl border bg-muted/20 p-6 space-y-3.5 text-xs">
                  <h4 className="font-bold text-sm text-foreground border-b pb-2">
                    {isArabic ? "بيانات النشر والتوثيق" : "Publication Metadata"}
                  </h4>
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>{isArabic ? "التصنيف التحريري:" : "Category:"}</span>
                    <span className="font-bold text-foreground">
                      {categoryLabels[article.category] ? (isArabic ? categoryLabels[article.category].ar : categoryLabels[article.category].en) : article.category}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>{isArabic ? "النطاق المؤسساتي:" : "Scope:"}</span>
                    <span className="font-bold text-foreground">
                      {scope === "department" ? (isArabic ? "قسم أكاديمي" : "Department") : scope === "faculty" ? (isArabic ? "كلية تخصصية" : "Faculty") : (isArabic ? "الجامعة عام" : "University")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>{isArabic ? "تاريخ الاعتماد:" : "Published:"}</span>
                    <span className="font-bold text-foreground">{article.date}</span>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>{isArabic ? "مدة القراءة التقريبية:" : "Est. Reading:"}</span>
                    <span className="font-bold text-foreground">{article.readingTime || 3} {isArabic ? "دقائق" : "mins"}</span>
                  </div>
                </div>

                {/* Back to all news */}
                <Link href="/news" className="block">
                  <Button variant="ghost" className="w-full gap-2 text-xs font-bold text-muted-foreground hover:text-foreground">
                    <BackArrow className="h-4 w-4" />
                    {isArabic ? "العودة إلى كافة أخبار الجامعة" : "Back to all university news"}
                  </Button>
                </Link>
              </aside>
            </div>
          </div>
        </section>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <section className="border-t bg-muted/20 py-12 sm:py-16">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {isArabic ? "أخبار وتغطيات ذات صلة" : "Related University News"}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isArabic ? "مستجدات وإعلانات مرتبطة بنفس النطاق والتصنيف الأكاديمي." : "Recent announcements in the same category or faculty."}
                  </p>
                </div>
                <Link href="/news" className="text-xs font-bold text-primary hover:underline">
                  {isArabic ? "عرض الكل" : "View all"}
                </Link>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.id}
                    href={`/news/${related.slug}`}
                    className="group flex flex-col"
                  >
                    <Card className="h-full overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-xl rounded-2xl">
                      <CardContent className="p-0 flex flex-col h-full">
                        <div className="relative h-44 overflow-hidden bg-muted">
                          {related.image ? (
                            <img
                              src={related.image}
                              alt={isArabic ? related.titleAr : related.titleEn}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center font-bold text-muted-foreground/30">
                              ASU
                            </div>
                          )}
                          <div className="absolute top-2.5 start-2.5">
                            <Badge variant="secondary" className="bg-background/90 backdrop-blur-xs text-[11px] font-bold">
                              {categoryLabels[related.category]
                                ? (isArabic ? categoryLabels[related.category].ar : categoryLabels[related.category].en)
                                : related.category}
                            </Badge>
                          </div>
                        </div>

                        <div className="p-5 flex flex-col flex-1">
                          <div className="text-[11px] text-muted-foreground mb-2 flex items-center gap-1.5">
                            <Calendar className="h-3 w-3" />
                            {related.date}
                          </div>
                          <h3 className="font-bold text-foreground text-base transition-colors group-hover:text-primary line-clamp-2 leading-snug">
                            {isArabic ? related.titleAr : related.titleEn}
                          </h3>
                          <p className="mt-2 line-clamp-2 text-xs text-muted-foreground leading-relaxed flex-1">
                            {isArabic ? related.excerptAr : related.excerptEn}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && galleryList[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 rtl:left-4 rtl:right-auto rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          <div
            className="max-h-[90vh] max-w-4xl space-y-3 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={galleryList[lightboxIndex].url}
                alt="Enlarged photo"
                className="max-h-[75vh] w-auto mx-auto object-contain"
              />
            </div>
            {galleryList[lightboxIndex].captionAr && (
              <p className="text-white text-sm font-medium">
                {galleryList[lightboxIndex].captionAr}
              </p>
            )}

            {/* Gallery Navigation Controls */}
            {galleryList.length > 1 && (
              <div className="flex items-center justify-center gap-4 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : galleryList.length - 1))}
                  className="bg-black/50 text-white border-white/20 text-xs"
                >
                  {isArabic ? "السابق" : "Previous"}
                </Button>
                <span className="text-xs text-white/70">
                  {lightboxIndex + 1} / {galleryList.length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLightboxIndex((prev) => (prev! < galleryList.length - 1 ? prev! + 1 : 0))}
                  className="bg-black/50 text-white border-white/20 text-xs"
                >
                  {isArabic ? "التالي" : "Next"}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
