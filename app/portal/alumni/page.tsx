"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogBody,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useAuth } from "@/contexts/auth-context";
import { useEvents } from "@/hooks/use-events";

const Spinner = ({ className }: { className?: string }) => <Loader2 className={`animate-spin ${className}`} />;

const alumniProfile = { graduationYear: 2024, programAr: "الهندسة", program: "Engineering" };
const graduationProject = {
  titleAr: "مشروع التخرج",
  titleEn: "Graduation Project",
  date: "2024",
  supervisorsAr: [] as string[],
  supervisorsEn: [] as string[],
  overviewAr: "",
  overviewEn: "",
  thesisUrl: "/docs/thesis.pdf",
  gallery: [] as string[],
};
import {

  User,
  LogOut,
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  Clock,
  ExternalLink,
  Save,
  GraduationCap,
  Users,
  CalendarDays,
  UserPen,
  Mail,
  FileText,
  Download,
  Camera,
  ClipboardEdit,
  BookOpen,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

const translations = {
  ar: {
    alumniNetwork: "شبكة الخريجين",
    logout: "تسجيل الخروج",
    graduationProject: "مشروع التخرج",
    projectDetails: "تفاصيل المشروع",
    projectOverview: "لمحة عن المشروع",
    thesisVersion: "نسخة الأطروحة",
    ceremonyGallery: "معرض الحفل",
    supervisors: "الأساتذة المشرفون",
    date: "التاريخ",
    downloadThesis: "تحميل الأطروحة",
    courseName: "اسم المشروع",
    graduationYear: "سنة التخرج",
    program: "التخصص",
    exclusiveJobs: "وظائف حصرية للخريجين",
    events: "الفعاليات",
    jobTitle: "المسمى الوظيفي",
    company: "الشركة",
    location: "الموقع",
    type: "النوع",
    deadline: "آخر موعد",
    apply: "التقديم",
    requirements: "المتطلبات",
    postedOn: "تاريخ النشر",
    eventDate: "التاريخ",
    eventTime: "الوقت",
    eventLocation: "المكان",
    viewDetails: "عرض التفاصيل",
    noEvents: "لا توجد فعاليات قادمة",
    savedSuccessfully: "تم الحفظ بنجاح",
    editProfile: "تعديل الملف الشخصي",
    nameAr: "الاسم (بالعربية)",
    nameEn: "الاسم (بالإنجليزية)",
    email: "البريد الإلكتروني",
    saveProfile: "حفظ التغييرات",
    updateImage: "تحديث الصورة",
    deleteImage: "حذف الصورة",
    profilePicture: "الصورة الشخصية",
    currentCompany: "الشركة الحالية",
    currentJobTitle: "المسمى الوظيفي الحالي",
    linkedIn: "LinkedIn",
  },
  en: {
    alumniNetwork: "Alumni Network",
    logout: "Logout",
    graduationProject: "Graduation Project",
    projectDetails: "Project Details",
    projectOverview: "Project Overview",
    thesisVersion: "Thesis Version",
    ceremonyGallery: "Ceremony Gallery",
    supervisors: "Supervisor Professors",
    date: "Date",
    downloadThesis: "Download Thesis",
    courseName: "Project Name",
    graduationYear: "Graduation Year",
    program: "Program",
    exclusiveJobs: "Exclusive Alumni Jobs",
    events: "Events",
    jobTitle: "Job Title",
    company: "Company",
    location: "Location",
    type: "Type",
    deadline: "Deadline",
    apply: "Apply Now",
    requirements: "Requirements",
    postedOn: "Posted on",
    eventDate: "Date",
    eventTime: "Time",
    eventLocation: "Location",
    viewDetails: "View Details",
    noEvents: "No upcoming events",
    savedSuccessfully: "Saved successfully",
    editProfile: "Edit Profile",
    nameAr: "Name (Arabic)",
    nameEn: "Name (English)",
    email: "Email",
    saveProfile: "Save Changes",
    updateImage: "Update Image",
    deleteImage: "Delete Image",
    profilePicture: "Profile Picture",
    currentCompany: "Current Company",
    currentJobTitle: "Current Job Title",
    linkedIn: "LinkedIn",
  },
};

import { useJobs } from "@/hooks/use-jobs";

export default function AlumniPortalPage() {
  const { language, dir } = useLanguage();
  const t = translations[language];
  const isArabic = language === "ar";

  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const { data: backendJobs } = useJobs();
  const { data: backendEvents } = useEvents();

  const alumniJobs = backendJobs || [];
  const alumniEvents = backendEvents || [];

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);



  const [profile, setProfile] = useState({
    nameAr: user?.first_name || "",
    nameEn: user?.username || "",
    email: user?.email || "",
    currentCompanyAr: "",
    currentCompanyEn: "",
    jobTitleAr: "",
    jobTitleEn: "",
    linkedIn: "",
    profileImage: null as string | null,
  });

  React.useEffect(() => {
    if (user) {
      Promise.resolve().then(() => {
        setProfile((prev) => ({
          ...prev,
          nameAr: user.first_name || prev.nameAr,
          nameEn: user.username || prev.nameEn,
          email: user.email || prev.email,
        }));
      });
    }
  }, [user]);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setProfile({ ...profile, profileImage: null });
  };
  const [showSaved, setShowSaved] = useState(false);

  const handleSave = () => {
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const [isPdfLoading, setIsPdfLoading] = useState(true);

  const alumniName = isArabic ? profile.nameAr : profile.nameEn;
  const programName = isArabic ? alumniProfile.programAr : alumniProfile.program;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/30">
        {/* Header */}
        <div className="border-b bg-card">
          <div className="container mx-auto px-4 py-4 sm:py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-start">
              <div className="flex items-center gap-3 sm:gap-4">
                <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
                  <DialogTrigger asChild>
                    <button className="group relative flex h-12 w-12 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground overflow-hidden transition-transform hover:scale-105 active:scale-95 focus:outline-none ring-offset-2 focus:ring-2 focus:ring-primary">
                      {profile.profileImage ? (
                        <Image src={profile.profileImage} alt={alumniName} fill className="object-cover" unoptimized priority />
                      ) : (
                        <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8" />
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <UserPen className="h-5 w-5 text-white" />
                      </div>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md" dir={language === "ar" ? "rtl" : "ltr"}>
                    <DialogHeader>
                      <DialogTitle className="text-start">{t.profilePicture}</DialogTitle>
                      <DialogDescription className="sr-only">Your current profile picture</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-6 py-4">
                      <div className="relative h-48 w-48 sm:h-64 sm:w-64 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center border-4 border-muted shadow-xl">
                        {profile.profileImage ? (
                          <Image src={profile.profileImage} alt={alumniName} fill className="object-cover" unoptimized />
                        ) : (
                          <GraduationCap className="h-20 w-20 sm:h-32 sm:w-32 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center w-full">
                        <Button variant="outline" className="gap-2 bg-transparent" onClick={() => fileInputRef.current?.click()}>
                          <UserPen className="h-4 w-4" />
                          {t.updateImage}
                        </Button>
                        {profile.profileImage && (
                          <Button variant="destructive" className="gap-2" onClick={handleDeleteImage}>
                            <LogOut className="h-4 w-4 rotate-180" />
                            {t.deleteImage}
                          </Button>
                        )}
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">{alumniName}</h1>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    {programName} | {t.graduationYear}: {alumniProfile.graduationYear}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2 bg-transparent flex-1 sm:flex-initial">
                      <UserPen className="h-4 w-4" />
                      {t.editProfile}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md" dir={language === "ar" ? "rtl" : "ltr"}>
                    <DialogHeader>
                      <DialogTitle className="text-start">{t.editProfile}</DialogTitle>
                      <DialogDescription className="sr-only">Update your profile information</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={(e) => { e.preventDefault(); setIsEditDialogOpen(false); }} className="flex flex-col flex-1 min-h-0 overflow-hidden text-start">
                      <DialogBody className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="nameAr" className="block text-start">{t.nameAr}</Label>
                            <Input
                              id="nameAr"
                              value={profile.nameAr}
                              onChange={(e) => setProfile({ ...profile, nameAr: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="nameEn" className="block text-start">{t.nameEn}</Label>
                            <Input
                              id="nameEn"
                              value={profile.nameEn}
                              onChange={(e) => setProfile({ ...profile, nameEn: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="block text-start">{t.email}</Label>
                          <div className="relative">
                            <Mail className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              id="email"
                              type="email"
                              value={profile.email}
                              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                              className="ps-10"
                            />
                          </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="jobTitleAr" className="block text-start">{t.currentJobTitle} (العربية)</Label>
                            <Input
                              id="jobTitleAr"
                              value={profile.jobTitleAr}
                              onChange={(e) => setProfile({ ...profile, jobTitleAr: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="jobTitleEn" className="block text-start">{t.currentJobTitle} (English)</Label>
                            <Input
                              id="jobTitleEn"
                              value={profile.jobTitleEn}
                              onChange={(e) => setProfile({ ...profile, jobTitleEn: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="companyAr" className="block text-start">{t.currentCompany} (العربية)</Label>
                            <Input
                              id="companyAr"
                              value={profile.currentCompanyAr}
                              onChange={(e) => setProfile({ ...profile, currentCompanyAr: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="companyEn" className="block text-start">{t.currentCompany} (English)</Label>
                            <Input
                              id="companyEn"
                              value={profile.currentCompanyEn}
                              onChange={(e) => setProfile({ ...profile, currentCompanyEn: e.target.value })}
                            />
                          </div>
                        </div>
                      </DialogBody>

                      <DialogFooter className="sm:justify-start gap-2">
                        <Button type="submit" className="w-full sm:w-auto">
                          {t.saveProfile}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 sm:py-8">
          <Tabs defaultValue="project" className="space-y-4 sm:space-y-6" dir={dir}>
            <TabsList className="grid w-full grid-cols-3 h-auto p-1">
              <TabsTrigger value="project" className="gap-2">
                <ClipboardEdit className="h-4 w-4" />
                <span className="hidden sm:inline">{t.graduationProject}</span>
              </TabsTrigger>
              <TabsTrigger value="jobs" className="gap-2">
                <Briefcase className="h-4 w-4" />
                <span className="hidden sm:inline">{t.exclusiveJobs}</span>
              </TabsTrigger>
              <TabsTrigger value="events" className="gap-2">
                <CalendarDays className="h-4 w-4" />
                <span className="hidden sm:inline">{t.events}</span>
              </TabsTrigger>
            </TabsList>

            {/* Graduation Project Tab */}
            <TabsContent value="project">
              <div className="space-y-4 sm:space-y-6 text-start">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <ClipboardEdit className="h-5 w-5 text-primary" />
                        {t.projectDetails}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{t.courseName}</p>
                        <p className="font-medium text-base">
                          {isArabic ? graduationProject.titleAr : graduationProject.titleEn}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">{t.date}</p>
                          <p className="font-medium">{graduationProject.date}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{t.graduationYear}</p>
                          <p className="font-medium">{alumniProfile.graduationYear}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">{t.supervisors}</p>
                        <div className="flex flex-wrap gap-2">
                          {(isArabic ? graduationProject.supervisorsAr : graduationProject.supervisorsEn).map((sup, idx) => (
                            <Badge key={idx} variant="secondary" className="px-2 py-1">
                              {sup}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <BookOpen className="h-5 w-5 text-primary" />
                        {t.projectOverview}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                        {isArabic ? graduationProject.overviewAr : graduationProject.overviewEn}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <Card className="flex flex-col w-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <FileText className="h-5 w-5 text-primary" />
                        {t.thesisVersion}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-4">
                      <div className="relative aspect-video sm:aspect-[21/9] rounded-lg border overflow-hidden bg-muted/20">
                        {isPdfLoading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-muted/10 z-10">
                            <Spinner className="h-8 w-8" />
                          </div>
                        )}
                        <iframe
                          src={`${graduationProject.thesisUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                          className="w-full h-full border-none"
                          onLoad={() => setIsPdfLoading(false)}
                        />
                      </div>
                      <div className="flex items-center justify-between gap-4 mt-auto">
                        <div className="text-start">
                          <p className="font-medium text-sm truncate max-w-[200px] sm:max-w-md">
                            {isArabic ? "أطروحة المشروع.pdf" : "Thesis.pdf"}
                          </p>
                          <p className="text-xs text-muted-foreground">PDF (3.1 MB)</p>
                        </div>
                        <Button className="gap-2 shrink-0" size="sm" asChild>
                          <a href={graduationProject.thesisUrl} download>
                            <Download className="h-4 w-4" />
                            {t.downloadThesis}
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="flex flex-col w-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <Camera className="h-5 w-5 text-primary" />
                        {t.ceremonyGallery}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <Carousel className="w-full" dir="ltr">
                        <CarouselContent>
                          {graduationProject.gallery.map((img, idx) => (
                            <CarouselItem key={idx} className="sm:basis-1/2 lg:basis-1/3">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <div className="aspect-square relative rounded-lg overflow-hidden group cursor-pointer border">
                                    <Image
                                      src={img}
                                      alt={`Gallery ${idx + 1}`}
                                      fill
                                      className="object-cover transition-transform group-hover:scale-105"
                                      priority={idx === 0}
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <Maximize2 className="h-6 w-6 text-white" />
                                    </div>
                                  </div>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none">
                                  <DialogHeader className="sr-only">
                                    <DialogTitle>صورة معرض حفل التخرج</DialogTitle>
                                    <DialogDescription>عرض مكبر لصورة حفل التخرج</DialogDescription>
                                  </DialogHeader>
                                  <div className="relative flex flex-col">
                                    <Image
                                      src={img}
                                      alt={`Full Gallery ${idx + 1}`}
                                      width={1200}
                                      height={800}
                                      className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-2xl"
                                    />
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/60 rounded-full backdrop-blur-sm border border-white/10 opacity-0 hover:opacity-100 transition-opacity">
                                      <Button variant="ghost" className="h-10 w-10 p-0 text-white hover:bg-white/20" asChild>
                                        <a href={img} download={`graduation_${idx + 1}.jpg`}>
                                          <Download className="h-5 w-5" />
                                        </a>
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <div className="flex items-center justify-center gap-2 pt-4">
                          <CarouselPrevious className="static translate-y-0 h-8 w-8" />
                          <CarouselNext className="static translate-y-0 h-8 w-8" />
                        </div>
                      </Carousel>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Jobs Tab */}
            <TabsContent value="jobs" className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 text-start">
                {alumniJobs.length === 0 ? (
                  <div className="col-span-2 text-center py-12 text-muted-foreground font-bold">
                    {isArabic ? "لا توجد وظائف شاغرة حالياً" : "No job vacancies currently posted"}
                  </div>
                ) : (
                  alumniJobs.map((job) => (
                    <Card key={job.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <CardTitle className="text-lg font-bold">
                              {isArabic ? job.titleAr : job.titleEn}
                            </CardTitle>
                            <CardDescription className="mt-1 flex items-center gap-1">
                              <Building2 className="h-4 w-4" />
                              {isArabic ? job.departmentAr : job.departmentEn}
                            </CardDescription>
                          </div>
                          <Badge variant="secondary" className="font-bold">
                            {job.type === "full_time" ? (isArabic ? "دوام كامل" : "Full Time") : (isArabic ? "عقد / جزئي" : "Part Time")}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {isArabic ? job.locationAr : job.locationEn}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {t.deadline}: {job.deadline}
                          </span>
                        </div>
                        <div>
                          <p className="mb-1 text-xs font-bold text-foreground">{t.requirements}:</p>
                          <p className="text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-lg whitespace-pre-line">
                            {isArabic ? job.requirementsAr : job.requirementsEn}
                          </p>
                        </div>
                        <Button className="w-full gap-2 font-bold" onClick={() => toast.success(isArabic ? "تم استلام رغبتك بالتقدم، سيتم التواصل معك عبر البريد الإلكتروني" : "Application intent received, we will contact you by email.")}>
                          <ExternalLink className="h-4 w-4" />
                          {t.apply}
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>


            {/* Events Tab */}
            <TabsContent value="events" className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 text-start">
                {alumniEvents.map((event) => (
                  <Card key={event.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {isArabic ? event.titleAr : event.titleEn}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(event.date).toLocaleDateString(isArabic ? "ar-SY" : "en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {event.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {typeof event.location === "object" && event.location ? (isArabic ? event.location.ar : event.location.en) : ((event as any).locationAr || "")}

                      </div>
                      <Button variant="outline" className="w-full gap-2 bg-transparent">
                        <Users className="h-4 w-4" />
                        {t.viewDetails}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}