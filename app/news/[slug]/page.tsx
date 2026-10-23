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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RichArticleContent } from "@/components/news/rich-article-content";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
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
  Mail,
  Phone,
  Tag,
  Type,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import { OpenAPI } from "@/lib/api/core/OpenAPI";

interface AttachmentItem {
  url: string;
  titleAr?: string;
  titleEn?: string;
  fileType?: string;
  size?: string;
}

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
  const [previewDoc, setPreviewDoc] = useState<AttachmentItem | null>(null);
  const [currentUrl, setCurrentUrl] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [fontSize, setFontSize] = useState<"normal" | "large">("normal");

  // Keep full accurate current URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, [slug]);

  // Reading progress scroll tracker
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // Related articles (matching same faculty or same category, excluding current)
  const relatedArticles = displayNews
    .filter((a) => a.slug !== article.slug && (a.faculty === article.faculty || a.category === article.category))
    .slice(0, 3);

  // Recent news from same faculty / context for sidebar
  const sidebarContextArticles = displayNews
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  const galleryList = article.galleryImages || [];
  const attachmentsList = (article.attachments || []) as AttachmentItem[];

  const articleTitle = isArabic ? article.titleAr : article.titleEn;
  const shareUrl = currentUrl || (typeof window !== "undefined" ? window.location.href : "");

  // Safe and accurate Copy Link Handler
  const handleCopyLink = () => {
    const urlToCopy = (typeof window !== "undefined" && window.location.href) ? window.location.href : shareUrl;
    if (navigator?.clipboard && urlToCopy) {
      navigator.clipboard.writeText(urlToCopy);
      setCopied(true);
      toast.success(isArabic ? "تم نسخ رابط الخبر للحافظة بنجاح" : "Article link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Topic tags generator
  const topicTags = [
    isArabic ? "جامعة أنطاكية السورية" : "Antioch Syrian University",
    categoryLabels[article.category] ? (isArabic ? categoryLabels[article.category].ar : categoryLabels[article.category].en) : null,
    article.facultyNameAr ? (isArabic ? article.facultyNameAr : article.facultySlug) : null,
    article.programNameAr ? (isArabic ? article.programNameAr : article.programSlug) : null,
  ].filter(Boolean) as string[];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground" dir={dir}>
      <Navbar />

      {/* Reading Progress Indicator */}
      <div
        className="fixed top-0 inset-x-0 h-1 bg-primary z-50 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={scrollProgress}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      <main className="flex-1 pb-16">
        {/* Top Header & Breadcrumbs - Expanded to max-w-7xl */}
        <section className="border-b bg-muted/20 py-8 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Hierarchical Breadcrumb */}
            <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary transition-colors">
                {isArabic ? "الرئيسية" : "Home"}
              </Link>
              <span>/</span>
              <Link href="/news" className="hover:text-primary transition-colors">
                {isArabic ? "الأخبار والتغطيات" : "News & Media"}
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

            {/* Badges Bar (Clean & Professional, No Clumsy Central Badge) */}
            <div className="mb-4 flex flex-wrap items-center gap-2.5">
              <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-3 py-1 text-xs shadow-xs">
                {categoryLabels[article.category]
                  ? (isArabic ? categoryLabels[article.category].ar : categoryLabels[article.category].en)
                  : article.category}
              </Badge>

              {scope === "department" && (
                <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 gap-1 text-xs py-1 font-semibold">
                  <GraduationCap className="h-3.5 w-3.5" />
                  {isArabic ? (article.programNameAr || "قسم أكاديمي") : "Department"}
                </Badge>
              )}

              {scope === "faculty" && (
                <Badge variant="outline" className="border-blue-500/40 bg-blue-500/10 text-blue-700 dark:text-blue-400 gap-1 text-xs py-1 font-semibold">
                  <Building2 className="h-3.5 w-3.5" />
                  {isArabic ? (article.facultyNameAr || "كلية تخصصية") : "Faculty"}
                </Badge>
              )}
            </div>

            {/* Article Main Headline */}
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl leading-tight text-foreground max-w-5xl">
              {articleTitle}
            </h1>

            {/* Publication Metadata & Editorial Dateline Bar (At the start of the article) */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border/70 pt-5">
              {/* Author / Media Office Byline */}
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-black text-sm shadow-xs">
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

              {/* Editorial Metadata Items: Date, Reading Time, Views */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium">
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

                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  {isArabic
                    ? `${article.readingTime || 3} دقائق قراءة`
                    : `${article.readingTime || 3} min read`}
                </span>

                {typeof article.viewsCount === "number" && article.viewsCount > 0 && (
                  <span className="flex items-center gap-1.5 font-medium">
                    <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                    {article.viewsCount} {isArabic ? "مشاهدة" : "views"}
                  </span>
                )}
              </div>

              {/* Quick Reading & Sharing Tools */}
              <div className="flex items-center gap-2">
                {/* Font Size Adjuster */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFontSize((prev) => (prev === "normal" ? "large" : "normal"))}
                  className="gap-1.5 text-xs font-semibold h-8"
                  title={isArabic ? "تغيير حجم خط القراءة" : "Adjust Font Size"}
                >
                  <Type className="h-3.5 w-3.5" />
                  <span className="font-bold">{fontSize === "normal" ? "A+" : "A-"}</span>
                </Button>

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
                  title={isArabic ? "نسخ رابط الخبر" : "Copy Article Link"}
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span className="hidden sm:inline">{copied ? (isArabic ? "تم النسخ ✓" : "Copied ✓") : (isArabic ? "نسخ الرابط" : "Copy Link")}</span>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Area - Expanded to max-w-7xl with balanced layout */}
        <section className="py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Main Editorial Column */}
              <article className="lg:col-span-8 space-y-8 min-w-0">
                {/* Hero Featured Image */}
                <div className="overflow-hidden rounded-3xl border bg-muted shadow-md">
                  <div className="relative aspect-video max-h-[500px] w-full overflow-hidden bg-muted">
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
                    <div className="border-t bg-muted/30 px-5 py-3 text-xs text-muted-foreground flex items-center justify-between">
                      <span className="font-medium">{isArabic ? article.imageCaptionAr : (article.imageCaptionEn || article.imageCaptionAr)}</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">
                        {isArabic ? "مصدر الصورة" : "Photo Source"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Lead Excerpt Paragraph (Introductory Hook) */}
                {(article.excerptAr || article.excerptEn) && (
                  <div className="rounded-2xl border-s-4 border-primary bg-primary/5 p-5 sm:p-7 dark:bg-primary/10">
                    <p className="text-lg sm:text-xl font-bold leading-relaxed text-foreground/95">
                      {isArabic ? article.excerptAr : (article.excerptEn || article.excerptAr)}
                    </p>
                  </div>
                )}

                {/* Editorial Body Content with Font Scaling */}
                <div className={fontSize === "large" ? "[&_p]:text-xl [&_p]:leading-loose [&_li]:text-xl" : ""}>
                  <RichArticleContent
                    content={
                      (isArabic ? article.contentAr : article.contentEn) ||
                      (isArabic ? article.excerptAr : article.excerptEn)
                    }
                    isArabic={isArabic}
                  />
                </div>

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

                {/* Official Documents / Attachments Card with Interactive PDF Preview */}
                {attachmentsList.length > 0 && (
                  <div className="mt-8 rounded-3xl border bg-card p-6 sm:p-8 shadow-xs space-y-4">
                    <div className="flex items-center gap-2.5 border-b pb-4">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="text-xl font-bold text-foreground">
                          {isArabic ? "المستندات والقرارات الرسمية المرفقة" : "Official Attached Documents"}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {isArabic ? "يمكنك معاينة الوثائق مباشرة عبر المتصفح أو تنزيلها كملف رسمي." : "Preview documents directly in browser or download to your device."}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {attachmentsList.map((doc, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-4 bg-muted/20 transition-colors hover:bg-muted/40"
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
                                {doc.size || "PDF"} • {isArabic ? "مستند رسمي معتمد" : "Official document"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                            {/* Preview Button */}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setPreviewDoc(doc)}
                              className="gap-1.5 text-xs font-bold h-9"
                            >
                              <Eye className="h-3.5 w-3.5 text-primary" />
                              <span>{isArabic ? "معاينة المستند" : "Preview"}</span>
                            </Button>

                            {/* Direct Download Button */}
                            <a
                              href={doc.url}
                              download
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all h-9"
                            >
                              <Download className="h-3.5 w-3.5" />
                              <span>{isArabic ? "تحميل الملف" : "Download"}</span>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Topic Tags Section (World-Class University Standard) */}
                {topicTags.length > 0 && (
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground mb-3">
                      <Tag className="h-3.5 w-3.5 text-primary" />
                      <span>{isArabic ? "وسوم وموضوعات الخبر:" : "Article Topics & Tags:"}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {topicTags.map((tag, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground transition-colors border"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Social Share Bar */}
                <div className="rounded-3xl border bg-muted/20 p-6 flex flex-wrap items-center justify-between gap-4 mt-8">
                  <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                    <Share2 className="h-4 w-4 text-primary" />
                    {isArabic ? "مشاركة هذا الخبر عبر منصات التواصل:" : "Share this article on:"}
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(articleTitle + " - " + shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full border bg-background hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300 transition-colors shadow-2xs"
                      title="WhatsApp"
                    >
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                      </svg>
                    </a>

                    <a
                      href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(articleTitle)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full border bg-background hover:bg-blue-50 hover:text-blue-500 hover:border-blue-300 transition-colors shadow-2xs"
                      title="Telegram"
                    >
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                      </svg>
                    </a>

                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(articleTitle)}&url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full border bg-background hover:bg-neutral-100 transition-colors shadow-2xs"
                      title="X"
                    >
                      <Twitter className="h-4 w-4" />
                    </a>

                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full border bg-background hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors shadow-2xs"
                      title="Facebook"
                    >
                      <Facebook className="h-4 w-4" />
                    </a>

                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full border bg-background hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-colors shadow-2xs"
                      title="LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </article>

              {/* Sidebar: Academic Entity & Smart Contextual Updates */}
              <aside className="lg:col-span-4 space-y-6 min-w-0 sticky top-24">
                {/* Academic Entity Card */}
                {(article.facultySlug || article.programSlug) && (
                  <div className="rounded-3xl border bg-card p-6 shadow-xs space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold shrink-0">
                        <Building2 className="h-6 w-6" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs text-muted-foreground font-semibold truncate">
                          {isArabic ? "الجهة الأكاديمية المصدرة" : "Issuing Academic Entity"}
                        </div>
                        <h4 className="font-bold text-base text-foreground truncate">
                          {isArabic ? (article.facultyNameAr || "جامعة أنطاكية السورية") : "Antioch Syrian University"}
                        </h4>
                      </div>
                    </div>

                    {article.programNameAr && (
                      <div className="rounded-xl bg-muted/40 p-3 text-xs">
                        <span className="font-semibold text-primary">{isArabic ? "القسم الأكاديمي:" : "Program:"}</span>{" "}
                        <span className="text-foreground font-bold">{isArabic ? article.programNameAr : article.programSlug}</span>
                      </div>
                    )}

                    {article.facultySlug && (
                      <Link href={`/faculties/${article.facultySlug}`} className="block">
                        <Button variant="outline" className="w-full text-xs font-bold gap-1.5 shadow-2xs">
                          {isArabic ? "زيارة صفحة الكلية الرسمية" : "Visit Faculty Page"}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    )}
                  </div>
                )}

                {/* Media & Press Inquiries Card (World-Class University Standard) */}
                <div className="rounded-3xl border bg-card p-6 shadow-xs space-y-3.5 text-xs">
                  <div className="flex items-center gap-2 border-b pb-3">
                    <Mail className="h-4 w-4 text-primary shrink-0" />
                    <h4 className="font-bold text-sm text-foreground">
                      {isArabic ? "استفسارات وتواصل إعلامي" : "Media & Press Inquiries"}
                    </h4>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {isArabic
                      ? "للحصول على تصريحات صحفية أو تغطية إعلامية رسمية للفعاليات والأنشطة الجامعية، يرجى مراسلة المكتب الإعلامي."
                      : "For media inquiries, press statements or official coverage, contact our Communications Office."}
                  </p>
                  <div className="pt-2 border-t space-y-2 font-medium">
                    <div className="flex items-center gap-2 text-foreground">
                      <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                      <a href="mailto:press@asu.edu.sy" className="hover:text-primary transition-colors font-mono">
                        press@asu.edu.sy
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-foreground">
                      <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="font-mono dir-ltr">+963 21 000 0000</span>
                    </div>
                  </div>
                </div>

                {/* Sidebar Contextual News (Latest in the University) */}
                {sidebarContextArticles.length > 0 && (
                  <div className="rounded-3xl border bg-card p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b pb-3">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary shrink-0" />
                        <h4 className="font-bold text-sm text-foreground">
                          {isArabic ? "أحدث التغطيات الجامعية" : "Latest University News"}
                        </h4>
                      </div>
                      <Link href="/news" className="text-[11px] font-bold text-primary hover:underline">
                        {isArabic ? "المزيد" : "More"}
                      </Link>
                    </div>

                    <div className="space-y-3.5">
                      {sidebarContextArticles.map((item) => (
                        <Link
                          key={item.id}
                          href={`/news/${item.slug}`}
                          className="group block space-y-1 hover:text-primary transition-colors"
                        >
                          <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 font-medium">
                            <Calendar className="h-3 w-3" />
                            {item.date}
                          </div>
                          <h5 className="text-xs font-bold text-foreground line-clamp-2 group-hover:text-primary leading-snug">
                            {isArabic ? item.titleAr : item.titleEn}
                          </h5>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </section>

        {/* Related Articles Section - Expanded to max-w-7xl */}
        {relatedArticles.length > 0 && (
          <section className="border-t bg-muted/20 py-12 sm:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                          <div className="text-[11px] text-muted-foreground mb-2 flex items-center gap-1.5 font-medium">
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

      {/* Interactive PDF Document Preview Modal */}
      <Dialog open={previewDoc !== null} onOpenChange={(open) => !open && setPreviewDoc(null)}>
        <DialogContent className="max-w-5xl w-[95vw] h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl border shadow-2xl bg-card">
          <DialogHeader className="p-4 sm:p-5 border-b bg-muted/40 flex flex-row items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-950/40 font-bold text-xs">
                {previewDoc?.fileType || "PDF"}
              </div>
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-base sm:text-lg font-bold text-foreground truncate">
                  {isArabic ? previewDoc?.titleAr : (previewDoc?.titleEn || previewDoc?.titleAr)}
                </DialogTitle>
                <p className="text-xs text-muted-foreground truncate">
                  {previewDoc?.size || "PDF"} • {isArabic ? "مستند رسمي معتمد - جامعة أنطاكية السورية" : "Official Document - Antioch Syrian University"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 pe-6">
              {previewDoc?.url && (
                <>
                  <a
                    href={previewDoc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-background text-xs font-semibold hover:bg-muted transition-colors text-foreground shadow-2xs"
                    title={isArabic ? "فتح في تبويب مستقل" : "Open in new tab"}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{isArabic ? "تبويب جديد" : "New Tab"}</span>
                  </a>
                  <a
                    href={previewDoc.url}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors shadow-xs"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>{isArabic ? "تحميل" : "Download"}</span>
                  </a>
                </>
              )}
            </div>
          </DialogHeader>

          <div className="flex-1 w-full h-full bg-muted/30 relative min-h-0">
            {previewDoc?.url ? (
              <iframe
                src={`${previewDoc.url}#toolbar=1&navpanes=0`}
                className="w-full h-full border-0"
                title={previewDoc.titleAr || "Document Preview"}
              />
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      {/* Lightbox Modal for Gallery Images */}
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
