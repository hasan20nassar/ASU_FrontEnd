"use client";

import React, { useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { useNews, useCreateNews, useUpdateNews, useDeleteNews } from "@/hooks/use-news";
import { useEvents, useCreateEvent, useUpdateEvent, useDeleteEvent } from "@/hooks/use-events";
import {
  useAcademicCalendar,
  useCreateAcademicCalendarEvent,
  useUpdateAcademicCalendarEvent,
  useDeleteAcademicCalendarEvent,
} from "@/hooks/use-academic-calendar";
import { NewsArticle, Event, AcademicCalendarEvent } from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Newspaper,
  Calendar,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Star,
  Loader2,
  CalendarDays,
  UploadCloud,
  Image as ImageIcon,
  Paperclip,
  FileText,
  X,
  Layers,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  List,
  Link2,
  ExternalLink,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogBody,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { useFaculties } from "@/hooks/use-faculties";
import { usePrograms } from "@/hooks/use-programs";
import { MediaUploadService } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";

export default function ContentManagement() {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("news");

  const { data: backendFaculties } = useFaculties();
  const faculties = backendFaculties || [];

  const { data: backendPrograms } = usePrograms();
  const programs = backendPrograms || [];

  // Queries
  const { data: newsList, isLoading: isNewsLoading } = useNews();
  const { data: eventsList, isLoading: isEventsLoading } = useEvents();
  const { data: calendarList, isLoading: isCalendarLoading } = useAcademicCalendar();

  // Mutations
  const createNewsMutation = useCreateNews();
  const updateNewsMutation = useUpdateNews();
  const deleteNewsMutation = useDeleteNews();

  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const deleteEventMutation = useDeleteEvent();

  const createAcademicCalendarMutation = useCreateAcademicCalendarEvent();
  const updateAcademicCalendarMutation = useUpdateAcademicCalendarEvent();
  const deleteAcademicCalendarMutation = useDeleteAcademicCalendarEvent();

  const articles = newsList || [];
  const events = eventsList || [];
  const calendarEvents = calendarList || [];

  // Search states
  const [newsSearchQuery, setNewsSearchQuery] = useState("");
  const [eventsSearchQuery, setEventsSearchQuery] = useState("");
  const [calendarSearchQuery, setCalendarSearchQuery] = useState("");

  // Academic Calendar Modal states
  const [isOpenCalendarModal, setIsOpenCalendarModal] = useState(false);
  const [editingCalendarEvent, setEditingCalendarEvent] = useState<AcademicCalendarEvent | null>(null);
  const [calendarEventAr, setCalendarEventAr] = useState("");
  const [calendarEventEn, setCalendarEventEn] = useState("");
  const [calendarDateAr, setCalendarDateAr] = useState("");
  const [calendarDateEn, setCalendarDateEn] = useState("");
  const [calendarOrder, setCalendarOrder] = useState(0);

  // News Modal states
  const [isOpenNewsModal, setIsOpenNewsModal] = useState(false);
  const [newsModalTab, setNewsModalTab] = useState<"general" | "content" | "media" | "gallery" | "attachments">("general");
  const [newsContentLangTab, setNewsContentLangTab] = useState<"ar" | "en">("ar");
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);

  // Form Fields
  const [newsTitleAr, setNewsTitleAr] = useState("");
  const [newsTitleEn, setNewsTitleEn] = useState("");
  const [newsExcerptAr, setNewsExcerptAr] = useState("");
  const [newsExcerptEn, setNewsExcerptEn] = useState("");
  const [newsContentAr, setNewsContentAr] = useState("");
  const [newsContentEn, setNewsContentEn] = useState("");
  const [newsCategory, setNewsCategory] = useState<any>("announcement");
  const [newsScope, setNewsScope] = useState<"university" | "faculty" | "department">("university");
  const [newsFaculty, setNewsFaculty] = useState<number | null>(null);
  const [newsProgram, setNewsProgram] = useState<number | null>(null);
  const [newsDate, setNewsDate] = useState("");
  const [newsFeatured, setNewsFeatured] = useState(false);
  const [newsStatus, setNewsStatus] = useState<"published" | "draft" | "archived">("published");
  const [newsReadingTime, setNewsReadingTime] = useState(3);
  const [newsAuthorNameAr, setNewsAuthorNameAr] = useState("");
  const [newsAuthorTitleAr, setNewsAuthorTitleAr] = useState("");

  // Cover image & captions
  const [newsImage, setNewsImage] = useState("");
  const [newsImageCaptionAr, setNewsImageCaptionAr] = useState("");
  const [newsImageCaptionEn, setNewsImageCaptionEn] = useState("");
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  // Gallery & Attachments
  const [newsGallery, setNewsGallery] = useState<Array<{ url: string; captionAr?: string; captionEn?: string }>>([]);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [newsAttachments, setNewsAttachments] = useState<Array<{ titleAr: string; titleEn?: string; url: string; size?: string; fileType?: string }>>([]);
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);

  // Event Modal states
  const [isOpenEventModal, setIsOpenEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventTitleAr, setEventTitleAr] = useState("");
  const [eventTitleEn, setEventTitleEn] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventLocationAr, setEventLocationAr] = useState("");
  const [eventLocationEn, setEventLocationEn] = useState("");
  const [eventType, setEventType] = useState<any>("academic");
  const [eventFaculty, setEventFaculty] = useState<number | null>(null);

  // Upload Handlers
  const handleUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingCover(true);
      const res = await MediaUploadService.upload(file, "news/covers");
      setNewsImage(res.url);
      toast.success(isArabic ? "تم رفع صورة الغلاف بنجاح" : "Cover image uploaded successfully");
    } catch (err: any) {
      toast.error(err.message || (isArabic ? "فشل رفع الصورة" : "Failed to upload image"));
    } finally {
      setIsUploadingCover(false);
      e.target.value = "";
    }
  };

  const handleUploadGallery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      setIsUploadingGallery(true);
      const newItems: Array<{ url: string; captionAr?: string; captionEn?: string }> = [];
      for (let i = 0; i < files.length; i++) {
        const res = await MediaUploadService.upload(files[i], "news/gallery");
        newItems.push({
          url: res.url,
          captionAr: "",
          captionEn: "",
        });
      }
      setNewsGallery((prev) => [...prev, ...newItems]);
      toast.success(isArabic ? `تم رفع ${newItems.length} صورة بنجاح` : `Uploaded ${newItems.length} photos`);
    } catch (err: any) {
      toast.error(err.message || (isArabic ? "فشل رفع صور المعرض" : "Failed to upload gallery photos"));
    } finally {
      setIsUploadingGallery(false);
      e.target.value = "";
    }
  };

  const handleUploadAttachment = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingAttachment(true);
      const res = await MediaUploadService.upload(file, "news/attachments");
      setNewsAttachments((prev) => [
        ...prev,
        {
          titleAr: file.name.replace(/\.[^/.]+$/, ""),
          titleEn: file.name.replace(/\.[^/.]+$/, ""),
          url: res.url,
          size: res.sizeFormatted,
          fileType: res.fileType,
        },
      ]);
      toast.success(isArabic ? "تم رفع المستند بنجاح" : "Attachment uploaded successfully");
    } catch (err: any) {
      toast.error(err.message || (isArabic ? "فشل رفع الملف" : "Failed to upload attachment"));
    } finally {
      setIsUploadingAttachment(false);
      e.target.value = "";
    }
  };

  const handleInsertInlineImage = async (target: "ar" | "en", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await MediaUploadService.upload(file, "news/body");
      const imgMarkdown = `\n\n![${file.name.replace(/\.[^/.]+$/, "")}](${res.url})\n\n`;
      if (target === "ar") {
        setNewsContentAr((prev) => prev + imgMarkdown);
      } else {
        setNewsContentEn((prev) => prev + imgMarkdown);
      }
      toast.success(isArabic ? "تم إدراج الصورة في نص الخبر" : "Image inserted into article body");
    } catch (err: any) {
      toast.error(err.message || (isArabic ? "فشل رفع الصورة" : "Failed to upload image"));
    } finally {
      e.target.value = "";
    }
  };

  const insertMarkdown = (target: "ar" | "en", prefix: string, suffix: string = "") => {
    if (target === "ar") {
      setNewsContentAr((prev) => prev + prefix + (suffix ? suffix : ""));
    } else {
      setNewsContentEn((prev) => prev + prefix + (suffix ? suffix : ""));
    }
  };

  // News CRUD Actions
  const handleOpenAddNews = () => {
    setEditingArticle(null);
    setNewsTitleAr("");
    setNewsTitleEn("");
    setNewsExcerptAr("");
    setNewsExcerptEn("");
    setNewsContentAr("");
    setNewsContentEn("");
    setNewsCategory("announcement");
    setNewsScope("university");
    setNewsFaculty(null);
    setNewsProgram(null);
    setNewsDate(new Date().toISOString().split("T")[0]);
    setNewsFeatured(false);
    setNewsStatus("published");
    setNewsReadingTime(3);
    setNewsAuthorNameAr(isArabic ? "المكتب الإعلامي" : "Media Office");
    setNewsAuthorTitleAr(isArabic ? "جامعة أنطاكية السورية" : "Antioch Syrian University");
    setNewsImage("");
    setNewsImageCaptionAr("");
    setNewsImageCaptionEn("");
    setNewsGallery([]);
    setNewsAttachments([]);
    setNewsModalTab("general");
    setIsOpenNewsModal(true);
  };

  const handleOpenEditNews = (article: NewsArticle) => {
    setEditingArticle(article);
    setNewsTitleAr(article.titleAr);
    setNewsTitleEn(article.titleEn);
    setNewsExcerptAr(article.excerptAr);
    setNewsExcerptEn(article.excerptEn);
    setNewsContentAr(article.contentAr || article.excerptAr || "");
    setNewsContentEn(article.contentEn || article.excerptEn || "");
    setNewsCategory(article.category);
    setNewsScope(article.scope || (article.program ? "department" : article.faculty ? "faculty" : "university"));
    setNewsFaculty((article as any).faculty || null);
    setNewsProgram((article as any).program || null);
    setNewsDate(article.date);
    setNewsFeatured(article.featured || false);
    setNewsStatus(article.status || "published");
    setNewsReadingTime(article.readingTime || 3);
    setNewsAuthorNameAr(article.authorNameAr || "");
    setNewsAuthorTitleAr(article.authorTitleAr || "");
    setNewsImage(article.image || "");
    setNewsImageCaptionAr(article.imageCaptionAr || "");
    setNewsImageCaptionEn(article.imageCaptionEn || "");
    setNewsGallery(article.galleryImages || []);
    setNewsAttachments(article.attachments || []);
    setNewsModalTab("general");
    setIsOpenNewsModal(true);
  };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitleAr || !newsTitleEn || !newsExcerptAr || !newsExcerptEn || !newsDate) {
      toast.error(isArabic ? "يرجى ملء الحقول المطلوبة (العنوان، الموجز، التاريخ)" : "Please fill in required fields");
      return;
    }

    if (newsScope === "faculty" && !newsFaculty) {
      toast.error(isArabic ? "يرجى تحديد الكلية المستهدفة" : "Please select target faculty");
      return;
    }

    if (newsScope === "department" && (!newsFaculty || !newsProgram)) {
      toast.error(isArabic ? "يرجى تحديد الكلية والقسم المستهدف" : "Please select target faculty and department");
      return;
    }

    const payload: Partial<NewsArticle> = {
      titleAr: newsTitleAr,
      titleEn: newsTitleEn,
      excerptAr: newsExcerptAr,
      excerptEn: newsExcerptEn,
      contentAr: newsContentAr.trim() || newsExcerptAr,
      contentEn: newsContentEn.trim() || newsExcerptEn,
      category: newsCategory,
      scope: newsScope,
      faculty: (newsScope === "faculty" || newsScope === "department") ? newsFaculty : null,
      program: newsScope === "department" ? newsProgram : null,
      date: newsDate,
      featured: newsFeatured,
      status: newsStatus,
      readingTime: Number(newsReadingTime) || 3,
      authorNameAr: newsAuthorNameAr,
      authorTitleAr: newsAuthorTitleAr,
      image: newsImage || editingArticle?.image || "/images/news/registration.png",
      imageCaptionAr: newsImageCaptionAr,
      imageCaptionEn: newsImageCaptionEn,
      galleryImages: newsGallery,
      attachments: newsAttachments,
      slug: editingArticle?.slug || newsTitleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    };

    try {
      if (editingArticle) {
        await updateNewsMutation.mutateAsync({
          id: editingArticle.id,
          data: payload as any
        });
        toast.success(isArabic ? "تم تعديل الخبر بنجاح" : "Article updated successfully");
      } else {
        await createNewsMutation.mutateAsync(payload as any);
        toast.success(isArabic ? "تم إضافة الخبر الجديد بنجاح" : "New article added successfully");
      }
      setIsOpenNewsModal(false);
    } catch (err) {
      toast.error(isArabic ? "حدث خطأ أثناء الحفظ" : "An error occurred while saving");
    }
  };

  const handleDeleteNews = async (id: number, title: string) => {
    if (!confirm(isArabic ? `هل أنت متأكد من حذف الخبر "${title}"؟` : `Are you sure you want to delete article "${title}"?`)) return;
    try {
      await deleteNewsMutation.mutateAsync(id);
      toast.success(
        isArabic
          ? `تم حذف الخبر "${title}" بنجاح`
          : `Article "${title}" deleted successfully`
      );
    } catch (err) {
      toast.error(isArabic ? "حدث خطأ أثناء الحذف" : "An error occurred while deleting");
    }
  };

  // Event CRUD Actions
  const handleOpenAddEvent = () => {
    setEditingEvent(null);
    setEventTitleAr("");
    setEventTitleEn("");
    setEventDate(new Date().toISOString().split("T")[0]);
    setEventTime("10:00 AM - 12:00 PM");
    setEventLocationAr("");
    setEventLocationEn("");
    setEventType("academic");
    setIsOpenEventModal(true);
  };

  const handleOpenEditEvent = (event: Event) => {
    setEditingEvent(event);
    setEventTitleAr(event.titleAr);
    setEventTitleEn(event.titleEn);
    setEventDate(event.date);
    setEventTime(event.time);
    setEventLocationAr(event.location?.ar || "");
    setEventLocationEn(event.location?.en || "");
    setEventType(event.type);
    setEventFaculty((event as any).faculty || null);
    setIsOpenEventModal(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitleAr || !eventTitleEn || !eventDate || !eventTime || !eventLocationAr || !eventLocationEn) {
      toast.error(isArabic ? "يرجى ملء الحقول المطلوبة" : "Please fill in required fields");
      return;
    }

    const payload: Partial<Event> = {
      titleAr: eventTitleAr,
      titleEn: eventTitleEn,
      descriptionAr: eventTitleAr,
      descriptionEn: eventTitleEn,
      date: eventDate,
      time: eventTime,
      location: { ar: eventLocationAr, en: eventLocationEn } as any,
      type: eventType,
      faculty: eventFaculty as any,
    };


    try {
      if (editingEvent) {
        await updateEventMutation.mutateAsync({
          id: editingEvent.id,
          data: payload as any
        });
        toast.success(isArabic ? "تم تعديل الفعالية بنجاح" : "Event updated successfully");
      } else {
        await createEventMutation.mutateAsync(payload as any);
        toast.success(isArabic ? "تم إضافة الفعالية الجديدة بنجاح" : "New event added successfully");
      }
      setIsOpenEventModal(false);
    } catch (err) {
      toast.error(isArabic ? "حدث خطأ أثناء الحفظ" : "An error occurred while saving");
    }
  };

  const handleDeleteEvent = async (id: number, title: string) => {
    if (!confirm(isArabic ? `هل أنت متأكد من إلغاء الفعالية "${title}"؟` : `Are you sure you want to cancel event "${title}"?`)) return;
    try {
      await deleteEventMutation.mutateAsync(id);
      toast.success(
        isArabic
          ? `تم إلغاء الفعالية "${title}" بنجاح`
          : `Event "${title}" cancelled successfully`
      );
    } catch (err) {
      toast.error(isArabic ? "حدث خطأ أثناء الحذف" : "An error occurred while deleting");
    }
  };

  // Filters
  const filteredArticles = articles.filter(a =>
    a.titleAr.includes(newsSearchQuery) ||
    a.titleEn.toLowerCase().includes(newsSearchQuery.toLowerCase()) ||
    a.excerptAr.includes(newsSearchQuery) ||
    a.excerptEn.toLowerCase().includes(newsSearchQuery.toLowerCase())
  );

  const filteredEvents = events.filter(ev =>
    ev.titleAr.includes(eventsSearchQuery) ||
    ev.titleEn.toLowerCase().includes(eventsSearchQuery.toLowerCase()) ||
    (ev.location?.ar && ev.location.ar.includes(eventsSearchQuery)) ||
    (ev.location?.en && ev.location.en.toLowerCase().includes(eventsSearchQuery.toLowerCase()))
  );

  // Academic Calendar CRUD Actions
  const handleOpenAddCalendar = () => {
    setEditingCalendarEvent(null);
    setCalendarEventAr("");
    setCalendarEventEn("");
    setCalendarDateAr("");
    setCalendarDateEn("");
    setCalendarOrder(calendarEvents.length + 1);
    setIsOpenCalendarModal(true);
  };

  const handleOpenEditCalendar = (item: AcademicCalendarEvent) => {
    setEditingCalendarEvent(item);
    setCalendarEventAr(item.eventAr);
    setCalendarEventEn(item.eventEn);
    setCalendarDateAr(item.dateAr);
    setCalendarDateEn(item.dateEn);
    setCalendarOrder(item.order || 0);
    setIsOpenCalendarModal(true);
  };

  const handleSaveCalendar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!calendarEventAr || !calendarEventEn || !calendarDateAr || !calendarDateEn) {
      toast.error(isArabic ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill in all required fields");
      return;
    }

    const payload = {
      eventAr: calendarEventAr,
      eventEn: calendarEventEn,
      dateAr: calendarDateAr,
      dateEn: calendarDateEn,
      order: Number(calendarOrder) || 0,
    };

    try {
      if (editingCalendarEvent) {
        await updateAcademicCalendarMutation.mutateAsync({
          id: editingCalendarEvent.id,
          data: payload,
        });
        toast.success(isArabic ? "تم تعديل الحدث بنجاح" : "Calendar item updated successfully");
      } else {
        await createAcademicCalendarMutation.mutateAsync(payload);
        toast.success(isArabic ? "تم إضافة الحدث بنجاح" : "Calendar item created successfully");
      }
      setIsOpenCalendarModal(false);
    } catch (err) {
      toast.error(isArabic ? "حدث خطأ أثناء الحفظ" : "An error occurred while saving");
    }
  };

  const handleDeleteCalendar = async (id: number, name: string) => {
    if (!confirm(isArabic ? `هل أنت متأكد من حذف "${name}"؟` : `Are you sure you want to delete "${name}"?`)) return;
    try {
      await deleteAcademicCalendarMutation.mutateAsync(id);
      toast.success(isArabic ? `تم حذف "${name}" بنجاح` : `Item "${name}" deleted successfully`);
    } catch (err) {
      toast.error(isArabic ? "حدث خطأ أثناء الحذف" : "An error occurred while deleting");
    }
  };

  const filteredCalendar = calendarEvents.filter((item) =>
    item.eventAr.toLowerCase().includes(calendarSearchQuery.toLowerCase()) ||
    item.eventEn.toLowerCase().includes(calendarSearchQuery.toLowerCase()) ||
    item.dateAr.toLowerCase().includes(calendarSearchQuery.toLowerCase()) ||
    item.dateEn.toLowerCase().includes(calendarSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-start" dir={isArabic ? "rtl" : "ltr"}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isArabic ? "إدارة المحتوى" : "Content Management"}
          </h1>
          <p className="text-muted-foreground">
            {isArabic
              ? "إضافة وتعديل أخبار الجامعة والفعاليات القادمة."
              : "Add and edit university news and upcoming events."}
          </p>
        </div>
        <Button
          className="font-bold flex gap-2"
          onClick={
            activeTab === "news"
              ? handleOpenAddNews
              : activeTab === "events"
                ? handleOpenAddEvent
                : handleOpenAddCalendar
          }
        >
          <Plus className="h-4 w-4" />
          {activeTab === "news"
            ? (isArabic ? "خبر جديد" : "New Article")
            : activeTab === "events"
              ? (isArabic ? "فعالية جديدة" : "New Event")
              : (isArabic ? "حدث تقويم جديد" : "New Calendar Item")}
        </Button>
      </div>

      <Tabs defaultValue="news" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="news" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Newspaper className="h-4 w-4" />
            {isArabic ? "الأخبار" : "News"}
          </TabsTrigger>
          <TabsTrigger value="events" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Calendar className="h-4 w-4" />
            {isArabic ? "الفعاليات" : "Events"}
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <CalendarDays className="h-4 w-4" />
            {isArabic ? "التقويم الأكاديمي" : "Academic Calendar"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="news">
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-muted/30">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={isArabic ? "بحث عن خبر..." : "Search news..."}
                    value={newsSearchQuery}
                    onChange={(e) => setNewsSearchQuery(e.target.value)}
                    className="ps-10 bg-background"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                {isNewsLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    <p className="text-sm text-muted-foreground font-bold">{isArabic ? "جاري تحميل الأخبار..." : "Loading news..."}</p>
                  </div>
                ) : (
                  <Table className="w-full table-fixed">
                    <TableHeader>
                      <TableRow className="bg-muted/20">
                        <TableHead className="w-14 text-center">{isArabic ? "الصورة" : "Image"}</TableHead>
                        <TableHead className="font-bold text-start w-[36%]">{isArabic ? "عنوان الخبر" : "Title"}</TableHead>
                        <TableHead className="font-bold text-start w-[16%]">{isArabic ? "المستوى والنطاق" : "Scope"}</TableHead>
                        <TableHead className="font-bold text-start w-[12%]">{isArabic ? "التصنيف" : "Category"}</TableHead>
                        <TableHead className="font-bold text-start w-[12%]">{isArabic ? "التاريخ" : "Date"}</TableHead>
                        <TableHead className="font-bold text-center w-[36%]">{isArabic ? "عنوان الخبر" : "Title"}</TableHead>
                        <TableHead className="font-bold text-center w-[16%]">{isArabic ? "المستوى والنطاق" : "Scope"}</TableHead>
                        <TableHead className="font-bold text-center w-[12%]">{isArabic ? "التصنيف" : "Category"}</TableHead>
                        <TableHead className="font-bold text-center w-[12%]">{isArabic ? "التاريخ" : "Date"}</TableHead>
                        <TableHead className="font-bold text-center w-[8%]">{isArabic ? "مميز" : "Featured"}</TableHead>
                        <TableHead className="font-bold text-end px-4 w-[16%]">{isArabic ? "إجراءات" : "Actions"}</TableHead>
                        <TableHead className="font-bold text-center px-4 w-[16%]">{isArabic ? "إجراءات" : "Actions"}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredArticles.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground font-bold">
                            {isArabic ? "لا توجد نتائج مطابقة" : "No articles found"}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredArticles.map((article) => {
                          const articleFaculty = faculties.find(f => f.id === (article as any).faculty);
                          const articleProgram = programs.find(p => p.id === (article as any).program);
                          const scope = article.scope || (article.program ? "department" : article.faculty ? "faculty" : "university");

                          return (
                            <TableRow key={article.id} className="hover:bg-muted/30">
                              <TableCell className="p-2 text-center w-14 align-top">
                                <div className="relative w-12 h-10 rounded-lg overflow-hidden bg-muted border mx-auto">
                                  {article.image ? (
                                    <img
                                      src={article.image}
                                      alt={article.titleAr}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground font-bold">
                                      ASU
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="font-bold text-start align-top w-[36%] overflow-hidden">
                                <div className="space-y-0.5">
                                  <div className="line-clamp-2 hover:text-primary transition-colors cursor-pointer leading-snug" onClick={() => handleOpenEditNews(article)}>
                                    {isArabic ? article.titleAr : article.titleEn}
                                  </div>
                                  <div className="text-xs text-muted-foreground line-clamp-1 font-normal">
                                    {isArabic ? article.excerptAr : article.excerptEn}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-start align-top w-[16%] overflow-hidden">
                                {scope === "department" ? (
                                  <Badge variant="outline" className="border-emerald-500/40 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 text-xs truncate max-w-full block">
                                    {isArabic ? (articleProgram?.nameAr || "قسم أكاديمي") : (articleProgram?.nameEn || "Department")}
                                  </Badge>
                                ) : scope === "faculty" ? (
                                  <Badge variant="outline" className="border-blue-500/40 text-blue-600 bg-blue-50/50 dark:bg-blue-950/20 text-xs truncate max-w-full block">
                                    {isArabic ? (articleFaculty?.nameAr || "كلية") : (articleFaculty?.nameEn || "Faculty")}
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="border-purple-500/40 text-purple-600 bg-purple-50/50 dark:bg-purple-950/20 text-xs truncate max-w-full block">
                                    {isArabic ? "الجامعة (عام)" : "University"}
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-start align-top w-[12%]">
                                <Badge variant="secondary" className="capitalize text-xs">
                                  {isArabic ? (
                                    article.category === "announcement" ? "إعلان" :
                                      article.category === "event" ? "فعالية" :
                                        article.category === "achievement" ? "إنجاز" : "بحث علمي"
                                  ) : article.category}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-start tabular-nums text-xs text-muted-foreground whitespace-nowrap align-top w-[12%]">
                                {article.date}
                              </TableCell>
                              <TableCell className="text-center align-top w-[8%]">
                                {article.featured ? (
                                  <Star className="h-4 w-4 fill-amber-400 text-amber-400 mx-auto" />
                                ) : (
                                  <span className="text-muted-foreground">-</span>
                                )}
                              </TableCell>
                              <TableCell className="text-end px-4 align-top w-[16%]">
                                <div className="flex items-center justify-end gap-1">
                                  <a
                                    href={`/news/${article.slug}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted"
                                    title={isArabic ? "معاينة صفحة الخبر" : "View Article"}
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem className="gap-2" onClick={() => handleOpenEditNews(article)}>
                                        <Edit className="h-4 w-4" /> {isArabic ? "تعديل الخبر" : "Edit"}
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem className="gap-2 text-destructive font-bold" onClick={() => handleDeleteNews(article.id, isArabic ? article.titleAr : article.titleEn)}>
                                        <Trash2 className="h-4 w-4" /> {isArabic ? "حذف" : "Delete"}
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-muted/30">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={isArabic ? "بحث عن فعالية..." : "Search events..."}
                    value={eventsSearchQuery}
                    onChange={(e) => setEventsSearchQuery(e.target.value)}
                    className="ps-10 bg-background"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                {isEventsLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    <p className="text-sm text-muted-foreground font-bold">{isArabic ? "جاري تحميل الفعاليات..." : "Loading events..."}</p>
                  </div>
                ) : (
                  <Table className="w-full table-fixed">
                    <TableHeader>
                      <TableRow className="bg-muted/20">
                        <TableHead className="font-bold text-start w-[38%]">{isArabic ? "الفعالية" : "Event"}</TableHead>
                        <TableHead className="font-bold text-start w-[24%]">{isArabic ? "الموقع" : "Location"}</TableHead>
                        <TableHead className="font-bold text-start w-[18%]">{isArabic ? "التاريخ والوقت" : "Date & Time"}</TableHead>
                        <TableHead className="font-bold text-start w-[12%]">{isArabic ? "النوع" : "Type"}</TableHead>
                        <TableHead className="font-bold text-end px-4 w-[8%]">{isArabic ? "إجراءات" : "Actions"}</TableHead>
                        <TableHead className="font-bold text-center w-[38%]">{isArabic ? "الفعالية" : "Event"}</TableHead>
                        <TableHead className="font-bold text-center w-[24%]">{isArabic ? "الموقع" : "Location"}</TableHead>
                        <TableHead className="font-bold text-center w-[18%]">{isArabic ? "التاريخ والوقت" : "Date & Time"}</TableHead>
                        <TableHead className="font-bold text-center w-[12%]">{isArabic ? "النوع" : "Type"}</TableHead>
                        <TableHead className="font-bold text-center px-4 w-[8%]">{isArabic ? "إجراءات" : "Actions"}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEvents.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground font-bold">
                            {isArabic ? "لا توجد نتائج مطابقة" : "No events found"}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredEvents.map((event) => (
                          <TableRow key={event.id} className="hover:bg-muted/30">
                            <TableCell className="font-bold text-start align-top w-[38%] overflow-hidden">
                              <span className="line-clamp-2 leading-snug">
                                {isArabic ? event.titleAr : event.titleEn}
                              </span>
                            </TableCell>
                            <TableCell className="text-start align-top text-xs text-muted-foreground w-[24%] overflow-hidden">
                              <span className="line-clamp-2 leading-relaxed">
                                {isArabic ? event.location?.ar : event.location?.en}
                              </span>
                            </TableCell>
                            <TableCell className="text-start tabular-nums text-xs text-muted-foreground whitespace-nowrap align-top w-[18%]">
                              <div>{event.date}</div>
                              {event.time && <div className="text-[11px] text-muted-foreground/80">{event.time}</div>}
                            </TableCell>
                            <TableCell className="text-start align-top w-[12%]">
                              <Badge variant="outline" className="capitalize text-xs">
                                {isArabic ? (
                                  event.type === "academic" ? "أكاديمي" :
                                    event.type === "cultural" ? "ثقافي" :
                                      event.type === "sports" ? "رياضي" : "مهني"
                                ) : event.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-end px-4 align-top w-[8%]">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem className="gap-2" onClick={() => handleOpenEditEvent(event)}>
                                    <Edit className="h-4 w-4" /> {isArabic ? "تعديل" : "Edit"}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="gap-2 text-destructive font-bold" onClick={() => handleDeleteEvent(event.id, isArabic ? event.titleAr : event.titleEn)}>
                                    <Trash2 className="h-4 w-4" /> {isArabic ? "إلغاء الفعالية" : "Cancel Event"}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-muted/30">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={isArabic ? "بحث في التقويم الأكاديمي..." : "Search academic calendar..."}
                    value={calendarSearchQuery}
                    onChange={(e) => setCalendarSearchQuery(e.target.value)}
                    className="ps-10 bg-background"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                {isCalendarLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    <p className="text-sm text-muted-foreground font-bold">{isArabic ? "جاري تحميل التقويم الأكاديمي..." : "Loading academic calendar..."}</p>
                  </div>
                ) : (
                  <Table className="w-full table-fixed">
                    <TableHeader>
                      <TableRow className="bg-muted/20">
                        <TableHead className="font-bold text-start w-[32%]">{isArabic ? "الحدث (بالعربية)" : "Event (Arabic)"}</TableHead>
                        <TableHead className="font-bold text-start w-[30%]">{isArabic ? "الحدث (بالإنجليزية)" : "Event (English)"}</TableHead>
                        <TableHead className="font-bold text-start w-[15%]">{isArabic ? "التاريخ (بالعربية)" : "Date (Arabic)"}</TableHead>
                        <TableHead className="font-bold text-start w-[13%]">{isArabic ? "التاريخ (بالإنجليزية)" : "Date (English)"}</TableHead>
                        <TableHead className="font-bold text-center w-[32%]">{isArabic ? "الحدث (بالعربية)" : "Event (Arabic)"}</TableHead>
                        <TableHead className="font-bold text-center w-[30%]">{isArabic ? "الحدث (بالإنجليزية)" : "Event (English)"}</TableHead>
                        <TableHead className="font-bold text-center w-[15%]">{isArabic ? "التاريخ (بالعربية)" : "Date (Arabic)"}</TableHead>
                        <TableHead className="font-bold text-center w-[13%]">{isArabic ? "التاريخ (بالإنجليزية)" : "Date (English)"}</TableHead>
                        <TableHead className="font-bold text-center w-[5%]">{isArabic ? "الترتيب" : "Order"}</TableHead>
                        <TableHead className="font-bold text-end px-4 w-[5%]">{isArabic ? "إجراءات" : "Actions"}</TableHead>
                        <TableHead className="font-bold text-center px-4 w-[5%]">{isArabic ? "إجراءات" : "Actions"}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCalendar.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground font-bold">
                            {isArabic ? "لا توجد عناصر في التقويم الأكاديمي" : "No calendar items found"}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredCalendar.map((item) => (
                          <TableRow key={item.id} className="hover:bg-muted/30">
                            <TableCell className="font-bold text-start align-top w-[32%] overflow-hidden">
                              <span className="line-clamp-2 leading-snug">{item.eventAr}</span>
                            </TableCell>
                            <TableCell className="text-start align-top w-[30%] overflow-hidden">
                              <span className="line-clamp-2 leading-snug">{item.eventEn}</span>
                            </TableCell>
                            <TableCell className="text-start text-xs text-muted-foreground align-top w-[15%]">
                              <span>{item.dateAr}</span>
                            </TableCell>
                            <TableCell className="text-start text-xs text-muted-foreground align-top w-[13%]">
                              <span>{item.dateEn}</span>
                            </TableCell>
                            <TableCell className="text-center font-semibold align-top w-[5%]">{item.order || 0}</TableCell>
                            <TableCell className="text-end px-4 align-top w-[5%]">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem className="gap-2" onClick={() => handleOpenEditCalendar(item)}>
                                    <Edit className="h-4 w-4" /> {isArabic ? "تعديل" : "Edit"}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="gap-2 text-destructive font-bold" onClick={() => handleDeleteCalendar(item.id, isArabic ? item.eventAr : item.eventEn)}>
                                    <Trash2 className="h-4 w-4" /> {isArabic ? "حذف" : "Delete"}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add / Edit News Dialog */}
      <Dialog open={isOpenNewsModal} onOpenChange={setIsOpenNewsModal}>
        <DialogContent className="sm:max-w-4xl max-h-[92vh] flex flex-col p-0 overflow-hidden" dir={isArabic ? "rtl" : "ltr"}>
          <DialogHeader className="px-6 pt-5 pb-3 border-b bg-muted/20">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-bold text-start flex items-center gap-2">
                  <Newspaper className="h-5 w-5 text-primary" />
                  {editingArticle
                    ? (isArabic ? "تعديل الخبر التحريري" : "Edit News Article")
                    : (isArabic ? "إضافة خبر جامعي جديد" : "Add New University Article")}
                </DialogTitle>
                <DialogDescription className="text-start text-xs mt-1">
                  {isArabic
                    ? "إدارة متكاملة للخبر: المحتوى الغني، الهرمية المؤسساتية، الغلاف، ومعرض الصور والمرفقات."
                    : "Comprehensive news management: rich content, institutional hierarchy, cover, gallery, and attachments."}
                </DialogDescription>
              </div>
            </div>

            {/* Modal Internal Navigation Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-3 border-t mt-3 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setNewsModalTab("general")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${newsModalTab === "general"
                    ? "bg-primary text-primary-foreground shadow-xs font-bold"
                    : "hover:bg-muted text-muted-foreground"
                  }`}
              >
                <Layers className="h-3.5 w-3.5" />
                {isArabic ? "البيانات والهرمية" : "General & Scope"}
              </button>
              <button
                type="button"
                onClick={() => setNewsModalTab("content")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${newsModalTab === "content"
                    ? "bg-primary text-primary-foreground shadow-xs font-bold"
                    : "hover:bg-muted text-muted-foreground"
                  }`}
              >
                <FileText className="h-3.5 w-3.5" />
                {isArabic ? "المحتوى التحريري" : "Editorial Body"}
              </button>
              <button
                type="button"
                onClick={() => setNewsModalTab("media")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${newsModalTab === "media"
                    ? "bg-primary text-primary-foreground shadow-xs font-bold"
                    : "hover:bg-muted text-muted-foreground"
                  }`}
              >
                <ImageIcon className="h-3.5 w-3.5" />
                {isArabic ? "صورة الغلاف" : "Cover Image"}
                {newsImage && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
              </button>
              <button
                type="button"
                onClick={() => setNewsModalTab("gallery")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${newsModalTab === "gallery"
                    ? "bg-primary text-primary-foreground shadow-xs font-bold"
                    : "hover:bg-muted text-muted-foreground"
                  }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                {isArabic ? "معرض الصور" : "Photo Gallery"}
                {newsGallery.length > 0 && (
                  <span className="bg-primary/20 text-primary rounded-full px-1.5 py-0.2 text-[10px]">
                    {newsGallery.length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setNewsModalTab("attachments")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${newsModalTab === "attachments"
                    ? "bg-primary text-primary-foreground shadow-xs font-bold"
                    : "hover:bg-muted text-muted-foreground"
                  }`}
              >
                <Paperclip className="h-3.5 w-3.5" />
                {isArabic ? "المستندات والقرارات (PDF)" : "Attachments"}
                {newsAttachments.length > 0 && (
                  <span className="bg-primary/20 text-primary rounded-full px-1.5 py-0.2 text-[10px]">
                    {newsAttachments.length}
                  </span>
                )}
              </button>
            </div>
          </DialogHeader>

          <form onSubmit={handleSaveNews} className="flex flex-col flex-1 min-h-0 overflow-hidden text-start">
            <DialogBody className="space-y-5 py-5 px-6">
              {/* TAB 1: General & Scope */}
              {newsModalTab === "general" && (
                <div className="space-y-4 animate-in fade-in-50 duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newsTitleAr" className="font-bold">
                        {isArabic ? "عنوان الخبر (بالعربية) *" : "Article Title (Arabic) *"}
                      </Label>
                      <Input
                        id="newsTitleAr"
                        required
                        value={newsTitleAr}
                        onChange={(e) => setNewsTitleAr(e.target.value)}
                        placeholder="جامعة أنطاكية السورية تدشن..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newsTitleEn" className="font-bold">
                        {isArabic ? "عنوان الخبر (بالإنجليزية) *" : "Article Title (English) *"}
                      </Label>
                      <Input
                        id="newsTitleEn"
                        required
                        value={newsTitleEn}
                        onChange={(e) => setNewsTitleEn(e.target.value)}
                        placeholder="Antioch Syrian University launches..."
                      />
                    </div>
                  </div>

                  {/* Scope & Hierarchy Selection */}
                  <div className="rounded-xl border p-4 bg-muted/20 space-y-3">
                    <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                      <Layers className="h-4 w-4 text-primary" />
                      {isArabic ? "مستوى الخبر والنطاق المؤسساتي (الهرمية الجامعية)" : "Publishing Scope & Hierarchy"}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <label
                        className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer text-sm transition-all ${newsScope === "university"
                            ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                            : "hover:bg-muted/50 border-input"
                          }`}
                      >
                        <input
                          type="radio"
                          name="newsScope"
                          value="university"
                          checked={newsScope === "university"}
                          onChange={() => {
                            setNewsScope("university");
                            setNewsFaculty(null);
                            setNewsProgram(null);
                          }}
                          className="sr-only"
                        />
                        <span>🏛️ {isArabic ? "مستوى الجامعة عام" : "University-Wide"}</span>
                      </label>

                      <label
                        className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer text-sm transition-all ${newsScope === "faculty"
                            ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                            : "hover:bg-muted/50 border-input"
                          }`}
                      >
                        <input
                          type="radio"
                          name="newsScope"
                          value="faculty"
                          checked={newsScope === "faculty"}
                          onChange={() => {
                            setNewsScope("faculty");
                            setNewsProgram(null);
                          }}
                          className="sr-only"
                        />
                        <span>🏢 {isArabic ? "مستوى الكلية" : "Faculty Level"}</span>
                      </label>

                      <label
                        className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer text-sm transition-all ${newsScope === "department"
                            ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                            : "hover:bg-muted/50 border-input"
                          }`}
                      >
                        <input
                          type="radio"
                          name="newsScope"
                          value="department"
                          checked={newsScope === "department"}
                          onChange={() => setNewsScope("department")}
                          className="sr-only"
                        />
                        <span>🔬 {isArabic ? "مستوى القسم / البرنامج" : "Department Level"}</span>
                      </label>
                    </div>

                    {/* Hierarchy Cascade Dropdowns */}
                    {(newsScope === "faculty" || newsScope === "department") && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="space-y-1.5">
                          <Label htmlFor="newsFaculty" className="text-xs font-bold text-foreground">
                            {isArabic ? "حدد الكلية التابعة *" : "Target Faculty *"}
                          </Label>
                          <select
                            id="newsFaculty"
                            value={newsFaculty || ""}
                            onChange={(e) => {
                              const val = e.target.value ? Number(e.target.value) : null;
                              setNewsFaculty(val);
                              setNewsProgram(null);
                            }}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:ring-2 focus:ring-primary"
                          >
                            <option value="">{isArabic ? "-- اختر الكلية --" : "-- Select Faculty --"}</option>
                            {faculties.map((f) => (
                              <option key={f.id} value={f.id}>
                                {isArabic ? f.nameAr : f.nameEn}
                              </option>
                            ))}
                          </select>
                        </div>

                        {newsScope === "department" && (
                          <div className="space-y-1.5">
                            <Label htmlFor="newsProgram" className="text-xs font-bold text-foreground">
                              {isArabic ? "حدد القسم / البرنامج الأكاديمي *" : "Target Department / Program *"}
                            </Label>
                            <select
                              id="newsProgram"
                              value={newsProgram || ""}
                              onChange={(e) => setNewsProgram(e.target.value ? Number(e.target.value) : null)}
                              disabled={!newsFaculty}
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:ring-2 focus:ring-primary disabled:opacity-50"
                            >
                              <option value="">
                                {!newsFaculty
                                  ? (isArabic ? "-- يرجى اختيار الكلية أولاً --" : "-- Choose Faculty First --")
                                  : (isArabic ? "-- اختر القسم / البرنامج --" : "-- Select Department --")}
                              </option>
                              {programs
                                .filter((p) => p.faculty === newsFaculty)
                                .map((p) => (
                                  <option key={p.id} value={p.id}>
                                    {isArabic ? p.nameAr : p.nameEn}
                                  </option>
                                ))}
                            </select>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Category, Date & Read Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newsCategory" className="font-bold">{isArabic ? "التصنيف" : "Category"}</Label>
                      <select
                        id="newsCategory"
                        value={newsCategory}
                        onChange={(e) => setNewsCategory(e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="announcement">{isArabic ? "إعلانات رسمية" : "Official Announcements"}</option>
                        <option value="academic">{isArabic ? "أكاديمي" : "Academic"}</option>
                        <option value="events">{isArabic ? "فعاليات ومؤتمرات" : "Events & Conferences"}</option>
                        <option value="research">{isArabic ? "أبحاث وابتكارات" : "Research & Innovation"}</option>
                        <option value="achievement">{isArabic ? "إنجازات وجوائز" : "Achievements & Awards"}</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newsDate" className="font-bold">{isArabic ? "تاريخ النشر" : "Publish Date"}</Label>
                      <Input
                        id="newsDate"
                        type="date"
                        required
                        value={newsDate}
                        onChange={(e) => setNewsDate(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newsReadingTime" className="font-bold">{isArabic ? "وقت القراءة (بالدقائق)" : "Read Time (Mins)"}</Label>
                      <Input
                        id="newsReadingTime"
                        type="number"
                        min={1}
                        max={60}
                        value={newsReadingTime}
                        onChange={(e) => setNewsReadingTime(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  {/* Author / Source Attribution */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newsAuthorNameAr" className="font-bold">{isArabic ? "الكاتب / جهة النشر" : "Author / Publisher"}</Label>
                      <Input
                        id="newsAuthorNameAr"
                        value={newsAuthorNameAr}
                        onChange={(e) => setNewsAuthorNameAr(e.target.value)}
                        placeholder={isArabic ? "المكتب الإعلامي - كلية الهندسة" : "Faculty Media Office"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newsAuthorTitleAr" className="font-bold">{isArabic ? "صفة الناشر / الرتبة" : "Publisher Role / Title"}</Label>
                      <Input
                        id="newsAuthorTitleAr"
                        value={newsAuthorTitleAr}
                        onChange={(e) => setNewsAuthorTitleAr(e.target.value)}
                        placeholder={isArabic ? "عمادة الكلية / العلاقات العامة" : "Deanship / PR Office"}
                      />
                    </div>
                  </div>

                  {/* Status & Featured */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="newsStatus" className="font-bold">{isArabic ? "حالة النشر" : "Status"}</Label>
                      <select
                        id="newsStatus"
                        value={newsStatus}
                        onChange={(e) => setNewsStatus(e.target.value as any)}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="published">{isArabic ? "منشور فوري (Published)" : "Published"}</option>
                        <option value="draft">{isArabic ? "مسودة غير معلنة (Draft)" : "Draft"}</option>
                        <option value="archived">{isArabic ? "مؤرشف (Archived)" : "Archived"}</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-3 pt-6">
                      <input
                        id="newsFeatured"
                        type="checkbox"
                        checked={newsFeatured}
                        onChange={(e) => setNewsFeatured(e.target.checked)}
                        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor="newsFeatured" className="cursor-pointer font-bold flex items-center gap-1.5 text-sm">
                        <Star className={`h-4 w-4 ${newsFeatured ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
                        {isArabic ? "تثبيت الخبر في الصفحة الرئيسية (مميز)" : "Pin to Homepage (Featured)"}
                      </Label>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Editorial Body & Excerpt */}
              {newsModalTab === "content" && (
                <div className="space-y-5 animate-in fade-in-50 duration-200">
                  {/* Language Switcher */}
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="font-bold text-sm text-foreground flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      {isArabic ? "المحتوى التحريري الكامل للخبر" : "Editorial Article Content"}
                    </div>
                    <div className="flex gap-1 bg-muted p-1 rounded-lg text-xs">
                      <button
                        type="button"
                        onClick={() => setNewsContentLangTab("ar")}
                        className={`px-3 py-1 rounded-md font-bold transition-all ${newsContentLangTab === "ar" ? "bg-background text-primary shadow-xs" : "text-muted-foreground"
                          }`}
                      >
                        العربية (AR)
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewsContentLangTab("en")}
                        className={`px-3 py-1 rounded-md font-bold transition-all ${newsContentLangTab === "en" ? "bg-background text-primary shadow-xs" : "text-muted-foreground"
                          }`}
                      >
                        English (EN)
                      </button>
                    </div>
                  </div>

                  {/* Excerpt Section */}
                  <div className="space-y-2">
                    <Label className="font-bold text-sm">
                      {newsContentLangTab === "ar"
                        ? "الموجز التمهيدي (Lead Excerpt) بالعربية *"
                        : "Lead Excerpt (English) *"}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {isArabic
                        ? "يظهر هذا الموجز في بطاقة الخبر بالصفحة الرئيسية وفي مقدمة صفحة الخبر بخط عريض."
                        : "Appears on news cards and as the introductory lead paragraph in bold."}
                    </p>
                    {newsContentLangTab === "ar" ? (
                      <textarea
                        required
                        rows={2}
                        value={newsExcerptAr}
                        onChange={(e) => setNewsExcerptAr(e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
                        placeholder="أعلنت جامعة أنطاكية السورية عن انطلاق المرحلة الجديدة من خطة التحول الرقمي..."
                      />
                    ) : (
                      <textarea
                        required
                        rows={2}
                        value={newsExcerptEn}
                        onChange={(e) => setNewsExcerptEn(e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
                        placeholder="Antioch Syrian University announces the launch of its digital transformation phase..."
                      />
                    )}
                  </div>

                  {/* Rich Body Section with Formatting Toolbar */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Label className="font-bold text-sm">
                        {newsContentLangTab === "ar"
                          ? "جسم الخبر الكامل (Article Body)"
                          : "Full Article Body (English)"}
                      </Label>
                      {/* Formatting Toolbar */}
                      <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border text-xs">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          title={isArabic ? "ترويسة رئيسية H2" : "Heading 2"}
                          onClick={() => insertMarkdown(newsContentLangTab, "\n\n## عنوان فرعي\n\n")}
                        >
                          <Heading2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          title={isArabic ? "ترويسة فرعية H3" : "Heading 3"}
                          onClick={() => insertMarkdown(newsContentLangTab, "\n\n### عنوان تفصيلي\n\n")}
                        >
                          <Heading3 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          title={isArabic ? "خط عريض" : "Bold"}
                          onClick={() => insertMarkdown(newsContentLangTab, "**نص عريض**")}
                        >
                          <Bold className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          title={isArabic ? "خط مائل" : "Italic"}
                          onClick={() => insertMarkdown(newsContentLangTab, "*نص مائل*")}
                        >
                          <Italic className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          title={isArabic ? "اقتباس رسمي" : "Quote"}
                          onClick={() => insertMarkdown(newsContentLangTab, '\n\n> "تصريح أو اقتباس رسمي لرئيس الجامعة أو عميد الكلية"\n\n')}
                        >
                          <Quote className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          title={isArabic ? "قائمة نقطية" : "Bullet list"}
                          onClick={() => insertMarkdown(newsContentLangTab, "\n- بند أول\n- بند ثاني\n- بند ثالث\n")}
                        >
                          <List className="h-3.5 w-3.5" />
                        </Button>
                        <label
                          className="h-7 px-2 cursor-pointer flex items-center gap-1 rounded hover:bg-muted text-primary font-bold transition-colors"
                          title={isArabic ? "رفع وإدراج صورة داخل المقال" : "Upload inline image"}
                        >
                          <ImageIcon className="h-3.5 w-3.5" />
                          <span className="text-[11px]">{isArabic ? "إدراج صورة داخلية" : "Insert Image"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(e) => handleInsertInlineImage(newsContentLangTab, e)}
                          />
                        </label>
                      </div>
                    </div>

                    {newsContentLangTab === "ar" ? (
                      <textarea
                        rows={10}
                        value={newsContentAr}
                        onChange={(e) => setNewsContentAr(e.target.value)}
                        className="w-full rounded-md border border-input bg-background p-3 text-sm font-mono leading-relaxed placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
                        placeholder="اكتب نص الخبر التحريري الكامل هنا. يمكنك استخدام أدوات التنسيق أعلاه لإضافة عناوين فرعية، اقتباسات بارزة، وإدراج صور وسط المقال..."
                      />
                    ) : (
                      <textarea
                        rows={10}
                        value={newsContentEn}
                        onChange={(e) => setNewsContentEn(e.target.value)}
                        className="w-full rounded-md border border-input bg-background p-3 text-sm font-mono leading-relaxed placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
                        placeholder="Write the full editorial article here. You can use the formatting tools above for headings, quotes, and inline images..."
                      />
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: Cover Image */}
              {newsModalTab === "media" && (
                <div className="space-y-4 animate-in fade-in-50 duration-200">
                  <div className="border-b pb-2">
                    <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-primary" />
                      {isArabic ? "صورة الغلاف الرسمية للخبر" : "Article Cover Image"}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {isArabic
                        ? "صورة عالية الجودة تظهر في أعلى صفحة الخبر وبطاقات الأخبار (النسبة الموصى بها: 16:9 وبحجم أقل من 5MB)."
                        : "High quality image for hero banner and cards (recommended 16:9 ratio, under 5MB)."}
                    </p>
                  </div>

                  {/* Upload Box / Preview */}
                  {newsImage ? (
                    <div className="space-y-4">
                      <div className="relative rounded-2xl overflow-hidden border bg-muted aspect-video max-h-72 w-full max-w-xl mx-auto group shadow-md">
                        <img
                          src={newsImage}
                          alt="Cover Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <label className="cursor-pointer bg-white text-black font-bold px-3 py-1.5 rounded-lg text-xs shadow-md hover:bg-gray-100 flex items-center gap-1.5">
                            <UploadCloud className="h-3.5 w-3.5" />
                            {isArabic ? "تغيير الصورة" : "Change Image"}
                            <input
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              disabled={isUploadingCover}
                              onChange={handleUploadCover}
                            />
                          </label>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => setNewsImage("")}
                            className="text-xs font-bold"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                            {isArabic ? "حذف" : "Remove"}
                          </Button>
                        </div>
                      </div>

                      {/* Captions for Cover */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
                        <div className="space-y-1">
                          <Label className="text-xs font-bold">
                            {isArabic ? "شرح توضيحي أو حقوق الصورة (بالعربية)" : "Image Caption / Credit (Arabic)"}
                          </Label>
                          <Input
                            value={newsImageCaptionAr}
                            onChange={(e) => setNewsImageCaptionAr(e.target.value)}
                            placeholder="تصوير: المكتب الإعلامي لجامعة أنطاكية"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs font-bold">
                            {isArabic ? "شرح الصورة (بالإنجليزية)" : "Image Caption / Credit (English)"}
                          </Label>
                          <Input
                            value={newsImageCaptionEn}
                            onChange={(e) => setNewsImageCaptionEn(e.target.value)}
                            placeholder="Photo: ASU Media Office"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="max-w-xl mx-auto">
                      <label className="border-2 border-dashed border-primary/30 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all text-center">
                        <div className="p-3 rounded-full bg-primary/10 text-primary">
                          {isUploadingCover ? (
                            <Loader2 className="h-8 w-8 animate-spin" />
                          ) : (
                            <UploadCloud className="h-8 w-8" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-foreground">
                            {isUploadingCover
                              ? (isArabic ? "جاري رفع الصورة إلى السيرفر..." : "Uploading image to server...")
                              : (isArabic ? "انقر لاختيار صورة الغلاف أو اسحب الملف هنا" : "Click to select cover or drag & drop")}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            JPG, PNG, WebP (حتى 5 ميغابايت)
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          disabled={isUploadingCover}
                          onChange={handleUploadCover}
                        />
                      </label>

                      {/* Or manual URL */}
                      <div className="mt-4 pt-3 border-t">
                        <Label className="text-xs font-bold text-muted-foreground">
                          {isArabic ? "أو أدخل رابط صورة خارجي مباشر:" : "Or enter direct image URL:"}
                        </Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            value={newsImage}
                            onChange={(e) => setNewsImage(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: Gallery */}
              {newsModalTab === "gallery" && (
                <div className="space-y-4 animate-in fade-in-50 duration-200">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        {isArabic ? "ألبوم صور الفعالية (معرض الصور التفاعلي)" : "Event Photo Gallery"}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {isArabic
                          ? "أضف صوراً إضافية توثق وقائع المؤتمر أو الحفل؛ ستظهر كمعرض صور متجاوب مع تكبير بملء الشاشة."
                          : "Add event photos that will display in a full-screen interactive lightbox gallery."}
                      </p>
                    </div>

                    <label className="cursor-pointer bg-primary text-primary-foreground font-bold px-3 py-2 rounded-lg text-xs shadow-sm hover:bg-primary/90 flex items-center gap-1.5 shrink-0">
                      {isUploadingGallery ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                      {isArabic ? "إضافة صور للألبوم" : "Add Photos"}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="sr-only"
                        disabled={isUploadingGallery}
                        onChange={handleUploadGallery}
                      />
                    </label>
                  </div>

                  {newsGallery.length === 0 ? (
                    <div className="text-center py-12 border rounded-xl bg-muted/10">
                      <ImageIcon className="h-10 w-10 text-muted-foreground/40 mx-auto mb-2" />
                      <p className="font-bold text-sm text-muted-foreground">
                        {isArabic ? "لا توجد صور في المعرض بعد" : "No gallery photos yet"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {isArabic ? "اضغط على زر (إضافة صور للألبوم) لرفع مجموعة صور دفعة واحدة." : "Click 'Add Photos' to upload multiple photos at once."}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {newsGallery.map((item, idx) => (
                        <div key={idx} className="border rounded-xl p-2.5 bg-card space-y-2 relative group shadow-2xs">
                          <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                            <img src={item.url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                setNewsGallery(newsGallery.filter((_, i) => i !== idx));
                              }}
                              className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white hover:bg-destructive transition-colors"
                              title={isArabic ? "حذف الصورة" : "Delete photo"}
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <Input
                            placeholder={isArabic ? "شرح مختصر للصورة..." : "Photo caption..."}
                            value={item.captionAr || ""}
                            onChange={(e) => {
                              const updated = [...newsGallery];
                              updated[idx].captionAr = e.target.value;
                              setNewsGallery(updated);
                            }}
                            className="text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: Attachments */}
              {newsModalTab === "attachments" && (
                <div className="space-y-4 animate-in fade-in-50 duration-200">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                        <Paperclip className="h-4 w-4 text-primary" />
                        {isArabic ? "المستندات والقرارات المرفقة (PDF & Docs)" : "Official Documents & Attachments"}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {isArabic
                          ? "ارفع وثائق القرارات الجامعية، جداول الندوات، أو أدلة التسجيل بصيغة PDF ليتمكن الزوار من تحميلها مباشرة."
                          : "Upload official PDF resolutions, schedules, or guides for direct download by visitors."}
                      </p>
                    </div>

                    <label className="cursor-pointer bg-primary text-primary-foreground font-bold px-3 py-2 rounded-lg text-xs shadow-sm hover:bg-primary/90 flex items-center gap-1.5 shrink-0">
                      {isUploadingAttachment ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                      {isArabic ? "رفع مستند جديد" : "Upload Document"}
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                        className="sr-only"
                        disabled={isUploadingAttachment}
                        onChange={handleUploadAttachment}
                      />
                    </label>
                  </div>

                  {newsAttachments.length === 0 ? (
                    <div className="text-center py-12 border rounded-xl bg-muted/10">
                      <FileText className="h-10 w-10 text-muted-foreground/40 mx-auto mb-2" />
                      <p className="font-bold text-sm text-muted-foreground">
                        {isArabic ? "لا توجد ملفات مرفقة بهذا الخبر" : "No document attachments"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {isArabic ? "يمكنك رفع ملفات PDF للقرارات الإدارية والتنظيمية." : "You can upload PDF files for administrative decisions."}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {newsAttachments.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-3 p-3 rounded-xl border bg-card shadow-2xs">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-950/40 text-red-600 font-bold text-xs uppercase shrink-0">
                              {doc.fileType || "PDF"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <Input
                                value={doc.titleAr}
                                onChange={(e) => {
                                  const updated = [...newsAttachments];
                                  updated[idx].titleAr = e.target.value;
                                  setNewsAttachments(updated);
                                }}
                                className="text-xs font-semibold h-8"
                                placeholder={isArabic ? "عنوان المستند أو القرار..." : "Document title..."}
                              />
                              <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-2">
                                <span>{doc.size || "1.2 MB"}</span>
                                <span>•</span>
                                <a
                                  href={doc.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-primary hover:underline flex items-center gap-1"
                                >
                                  {isArabic ? "معاينة الملف" : "Preview"}
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            </div>
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setNewsAttachments(newsAttachments.filter((_, i) => i !== idx));
                            }}
                            className="text-destructive hover:bg-destructive/10 shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </DialogBody>

            <DialogFooter className="px-6 py-3.5 border-t bg-muted/20 gap-2 sm:justify-between items-center">
              <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                {isArabic ? "النظام يحفظ كافة التنسيقات والوسائط آلياً" : "All media and formatting saved automatically"}
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpenNewsModal(false)}
                  className="w-full sm:w-auto text-xs font-bold"
                >
                  {isArabic ? "إلغاء" : "Cancel"}
                </Button>
                <Button
                  type="submit"
                  className="w-full sm:w-auto text-xs font-bold gap-2"
                  disabled={createNewsMutation.isPending || updateNewsMutation.isPending}
                >
                  {(createNewsMutation.isPending || updateNewsMutation.isPending) ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {isArabic ? "جاري الحفظ..." : "Saving..."}
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      {editingArticle ? (isArabic ? "تحديث الخبر" : "Update Article") : (isArabic ? "نشر الخبر" : "Publish Article")}
                    </>
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>


      {/* Add / Edit Event Dialog */}
      <Dialog open={isOpenEventModal} onOpenChange={setIsOpenEventModal}>
        <DialogContent className="sm:max-w-md" dir={isArabic ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle className="text-start">
              {editingEvent
                ? (isArabic ? "تعديل الفعالية" : "Edit Event")
                : (isArabic ? "إضافة فعالية جديدة" : "Add New Event")}
            </DialogTitle>
            <DialogDescription className="text-start">
              {isArabic
                ? "أدخل تفاصيل الفعالية باللغتين العربية والإنجليزية وحدد وقتها وتاريخها وموقعها."
                : "Enter event details in both Arabic and English, then specify time, date, and location."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveEvent} className="flex flex-col flex-1 min-h-0 overflow-hidden text-start">
            <DialogBody className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="eventTitleAr">{isArabic ? "اسم الفعالية (بالعربية)" : "Event Title (Arabic)"}</Label>
                <Input
                  id="eventTitleAr"
                  required
                  value={eventTitleAr}
                  onChange={(e) => setEventTitleAr(e.target.value)}
                  placeholder="ندوة البحث العلمي..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventTitleEn">{isArabic ? "اسم الفعالية (بالإنجليزية)" : "Event Title (English)"}</Label>
                <Input
                  id="eventTitleEn"
                  required
                  value={eventTitleEn}
                  onChange={(e) => setEventTitleEn(e.target.value)}
                  placeholder="Scientific Research Seminar..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventDate">{isArabic ? "التاريخ" : "Date"}</Label>
                  <Input
                    id="eventDate"
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventTime">{isArabic ? "الوقت" : "Time"}</Label>
                  <Input
                    id="eventTime"
                    required
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    placeholder="10:00 AM - 12:00 PM"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventLocationAr">{isArabic ? "الموقع (بالعربية)" : "Location (Arabic)"}</Label>
                  <Input
                    id="eventLocationAr"
                    required
                    value={eventLocationAr}
                    onChange={(e) => setEventLocationAr(e.target.value)}
                    placeholder="المدرج الكبير"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventLocationEn">{isArabic ? "الموقع (بالإنجليزية)" : "Location (English)"}</Label>
                  <Input
                    id="eventLocationEn"
                    required
                    value={eventLocationEn}
                    onChange={(e) => setEventLocationEn(e.target.value)}
                    placeholder="Main Auditorium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventType">{isArabic ? "النوع" : "Type"}</Label>
                <select
                  id="eventType"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as any)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="academic">{isArabic ? "أكاديمي" : "Academic"}</option>
                  <option value="cultural">{isArabic ? "ثقافي" : "Cultural"}</option>
                  <option value="sports">{isArabic ? "رياضي" : "Sports"}</option>
                  <option value="career">{isArabic ? "مهني" : "Career"}</option>
                </select>
              </div>
            </DialogBody>

            <DialogFooter className="gap-2 sm:justify-start">
              <Button type="button" variant="outline" onClick={() => setIsOpenEventModal(false)} className="bg-transparent w-full sm:w-auto">
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button type="submit" className="w-full sm:w-auto font-bold" disabled={createEventMutation.isPending || updateEventMutation.isPending}>
                {(createEventMutation.isPending || updateEventMutation.isPending) ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {isArabic ? "جاري الحفظ..." : "Saving..."}
                  </>
                ) : (
                  isArabic ? "حفظ الفعالية" : "Save Event"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Academic Calendar Dialog Modal */}
      <Dialog open={isOpenCalendarModal} onOpenChange={setIsOpenCalendarModal}>
        <DialogContent className="sm:max-w-[550px]" dir={isArabic ? "rtl" : "ltr"}>
          <DialogHeader className="text-start">
            <DialogTitle className="text-xl font-bold">
              {editingCalendarEvent
                ? (isArabic ? "تعديل حدث بالتقويم الأكاديمي" : "Edit Academic Calendar Item")
                : (isArabic ? "إضافة حدث جديد بالتقويم الأكاديمي" : "Add New Academic Calendar Item")}
            </DialogTitle>
            <DialogDescription>
              {isArabic
                ? "أدخل تفاصيل الحدث الأكاديمي باللغتين العربية والإنجليزية."
                : "Enter academic calendar item details in both Arabic and English."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveCalendar} className="flex flex-col flex-1 min-h-0 overflow-hidden text-start">
            <DialogBody className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="calendarEventAr">{isArabic ? "اسم الحدث (بالعربية)" : "Event Name (Arabic)"}</Label>
                  <Input
                    id="calendarEventAr"
                    required
                    value={calendarEventAr}
                    onChange={(e) => setCalendarEventAr(e.target.value)}
                    placeholder="مثال: بداية الفصل الدراسي الأول"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="calendarEventEn">{isArabic ? "اسم الحدث (بالإنجليزية)" : "Event Name (English)"}</Label>
                  <Input
                    id="calendarEventEn"
                    required
                    value={calendarEventEn}
                    onChange={(e) => setCalendarEventEn(e.target.value)}
                    placeholder="e.g. First Semester Begins"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="calendarDateAr">{isArabic ? "التاريخ/الشهر (بالعربية)" : "Date/Month (Arabic)"}</Label>
                  <Input
                    id="calendarDateAr"
                    required
                    value={calendarDateAr}
                    onChange={(e) => setCalendarDateAr(e.target.value)}
                    placeholder="مثال: سبتمبر 2024"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="calendarDateEn">{isArabic ? "التاريخ/الشهر (بالإنجليزية)" : "Date/Month (English)"}</Label>
                  <Input
                    id="calendarDateEn"
                    required
                    value={calendarDateEn}
                    onChange={(e) => setCalendarDateEn(e.target.value)}
                    placeholder="e.g. September 2024"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="calendarOrder">{isArabic ? "ترتيب العرض" : "Display Order"}</Label>
                <Input
                  id="calendarOrder"
                  type="number"
                  value={calendarOrder}
                  onChange={(e) => setCalendarOrder(parseInt(e.target.value) || 0)}
                />
              </div>
            </DialogBody>

            <DialogFooter className="gap-2 sm:justify-start">
              <Button type="button" variant="outline" onClick={() => setIsOpenCalendarModal(false)} className="bg-transparent w-full sm:w-auto">
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button type="submit" className="w-full sm:w-auto font-bold" disabled={createAcademicCalendarMutation.isPending || updateAcademicCalendarMutation.isPending}>
                {(createAcademicCalendarMutation.isPending || updateAcademicCalendarMutation.isPending) ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {isArabic ? "جاري الحفظ..." : "Saving..."}
                  </>
                ) : (
                  isArabic ? "حفظ الحدث" : "Save Item"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
