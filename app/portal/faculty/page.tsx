"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogBody,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/auth-context";
import {
  useFacultyMembers,
  useUpdateFacultyMember,
  useFacultyAppointments
} from "@/hooks/use-faculty-members";
import {
  User,
  LogOut,
  BookOpen,
  Users,
  ClipboardEdit,
  Clock,
  MapPin,
  Mail,
  Save,
  X,
  UserPen,
  CalendarDays,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Upload,
  Loader2,
  GraduationCap,
  Sparkles
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface OfficeSlotItem {
  id?: string;
  dayAr: string;
  dayEn?: string;
  time: string;
  status: string;
}



export default function FacultyPortalPage() {
  const { language, dir } = useLanguage();
  const isArabic = language === "ar";
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // API Hooks
  const { data: facultyMembersList, isLoading: isMembersLoading } = useFacultyMembers();
  const { data: allAppointments } = useFacultyAppointments();
  const updateMemberMutation = useUpdateFacultyMember();


  // Find the professor profile associated with logged in user (by email or name match)
  const currentProfessor = useMemo(() => {
    if (!facultyMembersList || facultyMembersList.length === 0) return null;
    if (user?.email) {
      const match = facultyMembersList.find((m) => m.email.toLowerCase() === user.email.toLowerCase());
      if (match) return match;
    }
    // Default fallback to first professor if logged in user is admin/demo
    return facultyMembersList[0];
  }, [facultyMembersList, user]);


  // Office Hour Slots State
  const [officeSlots, setOfficeSlots] = useState<OfficeSlotItem[]>([]);
  const [isSlotsSaving, setIsSlotsSaving] = useState(false);

  // Profile Form State
  const [profile, setProfile] = useState({
    nameAr: "",
    nameEn: "",
    titleAr: "",
    titleEn: "",
    email: "",
    officeHours: "",
    locationAr: "",
    bioAr: "",
    image: "/user.png",
  });

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Initialize data when currentProfessor is loaded
  useEffect(() => {
    if (currentProfessor) {
      setProfile({
        nameAr: currentProfessor.nameAr || "",
        nameEn: currentProfessor.nameEn || "",
        titleAr: currentProfessor.titleAr || "أستاذ دكتور",
        titleEn: currentProfessor.titleEn || "Professor",
        email: currentProfessor.email || "",
        officeHours: currentProfessor.officeHours || "Sun, Tue 10:00 AM - 12:00 PM",
        locationAr: currentProfessor.locationAr || "حرم معرة صيدنايا - مبنى الكلية",
        bioAr: currentProfessor.bioAr || "",
        image: currentProfessor.image || "/user.png",
      });

      if (Array.isArray(currentProfessor.officeHourSlots) && currentProfessor.officeHourSlots.length > 0) {
        setOfficeSlots(currentProfessor.officeHourSlots as OfficeSlotItem[]);
      } else {
        setOfficeSlots([
          { id: "slot-1", dayAr: "الأحد", dayEn: "Sunday", time: "10:00 AM - 11:00 AM", status: "available" },
          { id: "slot-2", dayAr: "الأحد", dayEn: "Sunday", time: "11:00 AM - 12:00 PM", status: "available" },
          { id: "slot-3", dayAr: "الثلاثاء", dayEn: "Tuesday", time: "10:00 AM - 11:00 AM", status: "available" },
          { id: "slot-4", dayAr: "الثلاثاء", dayEn: "Tuesday", time: "11:00 AM - 12:00 PM", status: "available" },
        ]);
      }
    }
  }, [currentProfessor]);

  // Appointments booked for this professor
  const myBookedAppointments = useMemo(() => {
    if (!allAppointments || !currentProfessor) return [];
    return allAppointments.filter(
      (app) => app.facultyMember === currentProfessor.id || app.facultyMember === Number(currentProfessor.id)
    );
  }, [allAppointments, currentProfessor]);

  // Office Slots Builder Handlers
  const handleAddSlot = () => {
    setOfficeSlots((prev) => [
      ...prev,
      { id: `slot-${Date.now()}`, dayAr: "الأحد", dayEn: "Sunday", time: "10:00 AM - 11:00 AM", status: "available" },
    ]);
  };

  const handleUpdateSlot = (index: number, field: keyof OfficeSlotItem, value: string) => {
    setOfficeSlots((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleRemoveSlot = (index: number) => {
    setOfficeSlots((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveOfficeSlots = async () => {
    if (!currentProfessor) return;
    setIsSlotsSaving(true);
    try {
      await updateMemberMutation.mutateAsync({
        id: currentProfessor.id,
        data: {
          officeHourSlots: officeSlots,
        },
      });
      toast.success(isArabic ? "تم حفظ مواعيد الساعات المكتبية بنجاح!" : "Office hour slots saved successfully!");
    } catch (err) {
      toast.error(isArabic ? "حدث خطأ أثناء حفظ المواعيد" : "Failed to save slots");
    } finally {
      setIsSlotsSaving(false);
    }
  };

  // Image Upload Handler (Max 1MB)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      toast.error(isArabic ? "حجم الصورة كبير جداً! الحد الأقصى المسموح به هو 1 ميغابايت." : "Max image size is 1MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfile((prev) => ({ ...prev, image: reader.result as string }));
        toast.success(isArabic ? "تم تحميل الصورة بنجاح!" : "Image loaded!");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProfessor) return;

    try {
      await updateMemberMutation.mutateAsync({
        id: currentProfessor.id,
        data: {
          nameAr: profile.nameAr,
          nameEn: profile.nameEn,
          titleAr: profile.titleAr,
          titleEn: profile.titleEn,
          email: profile.email,
          officeHours: profile.officeHours,
          locationAr: profile.locationAr,
          bioAr: profile.bioAr,
          image: profile.image,
        },
      });
      toast.success(isArabic ? "تم تحديث الملف الشخصي بنجاح!" : "Profile updated successfully!");
      setIsEditDialogOpen(false);
    } catch (err) {
      toast.error(isArabic ? "حدث خطأ أثناء حفظ الملف الشخصي" : "Failed to update profile");
    }
  };

  return (
    <div className="flex min-h-screen flex-col" dir={dir}>
      <Navbar />
      <main className="flex-1 bg-muted/30 pb-16">
        {/* Header Profile Section */}
        <div className="border-b bg-card shadow-sm">
          <div className="container mx-auto px-4 py-6 sm:py-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-start">
                <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-primary/20 shadow-md shrink-0">
                  <AvatarImage src={profile.image} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
                    {profile.nameAr ? profile.nameAr[0] : "P"}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                      {isArabic ? profile.nameAr : profile.nameEn}
                    </h1>
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      {isArabic ? "بوابة الكادر التدريسي" : "Faculty Portal"}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-primary">
                    {isArabic ? profile.titleAr : profile.titleEn} - {currentProfessor ? (isArabic ? currentProfessor.departmentAr : currentProfessor.departmentEn) : ""}
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-muted-foreground pt-1">
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-primary" />
                      {profile.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {profile.locationAr}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="font-bold gap-2 bg-background shadow-sm">
                      <UserPen className="h-4 w-4 text-primary" />
                      {isArabic ? "تعديل ملفك الأكاديمي" : "Edit Profile"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg w-[95vw]">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <UserPen className="h-5 w-5 text-primary" />
                        {isArabic ? "تعديل الملف الأكاديمي الشامل" : "Edit Academic Profile"}
                      </DialogTitle>
                      <DialogDescription>
                        {isArabic ? "تحديث بياناتك الشخصية والسيرة الذاتية والصورة." : "Update your bio, title, and contact details."}
                      </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSaveProfile} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                      <DialogBody className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label htmlFor="prof-nameAr">{isArabic ? "الاسم الكامل (عربي)" : "Full Name (AR)"}</Label>
                            <Input
                              id="prof-nameAr"
                              value={profile.nameAr}
                              onChange={(e) => setProfile({ ...profile, nameAr: e.target.value })}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="prof-nameEn">{isArabic ? "الاسم الكامل (إنكليزي)" : "Full Name (EN)"}</Label>
                            <Input
                              id="prof-nameEn"
                              value={profile.nameEn}
                              onChange={(e) => setProfile({ ...profile, nameEn: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label htmlFor="prof-titleAr">{isArabic ? "الرتبة العلمية (عربي)" : "Title (AR)"}</Label>
                            <Input
                              id="prof-titleAr"
                              value={profile.titleAr}
                              onChange={(e) => setProfile({ ...profile, titleAr: e.target.value })}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="prof-email">{isArabic ? "البريد الإلكتروني" : "Email"}</Label>
                            <Input
                              id="prof-email"
                              type="email"
                              value={profile.email}
                              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="prof-locationAr">{isArabic ? "الموقع / المكتب" : "Office Location"}</Label>
                          <Input
                            id="prof-locationAr"
                            value={profile.locationAr}
                            onChange={(e) => setProfile({ ...profile, locationAr: e.target.value })}
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="prof-bioAr">{isArabic ? "السيرة الذاتية المختصرة" : "Bio"}</Label>
                          <Textarea
                            id="prof-bioAr"
                            rows={3}
                            value={profile.bioAr}
                            onChange={(e) => setProfile({ ...profile, bioAr: e.target.value })}
                          />
                        </div>

                        {/* Image Upload Box */}
                        <div className="space-y-2 pt-1">
                          <Label className="font-bold">{isArabic ? "تحديث الصورة الشخصية (أقل من 1MB)" : "Upload Avatar (Max 1MB)"}</Label>
                          <div className="flex items-center gap-3 p-3 border rounded-xl bg-muted/10">
                            <Avatar className="h-12 w-12 border shrink-0">
                              <AvatarImage src={profile.image || "/user.png"} />
                              <AvatarFallback>P</AvatarFallback>
                            </Avatar>
                            <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 shadow">
                              <Upload className="h-3.5 w-3.5" />
                              {isArabic ? "تحميل صورة من الجهاز..." : "Upload Image..."}
                              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
                          </div>
                        </div>
                      </DialogBody>

                      <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                          {isArabic ? "إلغاء" : "Cancel"}
                        </Button>
                        <Button type="submit" disabled={updateMemberMutation.isPending} className="font-bold">
                          {updateMemberMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {isArabic ? "حفظ التغييرات" : "Save Changes"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>

        {/* Portal Main Content */}
        <div className="container mx-auto px-4 py-8 space-y-8">
          <Tabs defaultValue="booking-slots" className="w-full space-y-6">
            <TabsList className="bg-background border p-1 h-12 gap-2 shadow-sm rounded-xl">
              <TabsTrigger value="booking-slots" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold gap-2">
                <CalendarDays className="h-4 w-4" />
                {isArabic ? "إدارة مواعيد وحجوزات الساعات المكتبية" : "Office Hours & Student Bookings"}
              </TabsTrigger>
              <TabsTrigger value="my-courses" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold gap-2">
                <BookOpen className="h-4 w-4" />
                {isArabic ? "المواد والدرجات" : "Courses & Grades"}
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: Office Hours & Booking Slots */}
            <TabsContent value="booking-slots" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bookable Office Slots Builder (2 Columns) */}
                <Card className="lg:col-span-2 border-none shadow-md overflow-hidden">
                  <CardHeader className="bg-primary/5 border-b pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <CardTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
                          <CalendarDays className="h-5 w-5 text-primary" />
                          {isArabic ? "إدارة مواعيد الساعات المكتبية المتاحة للحجز" : "Bookable Office Hours Slots Builder"}
                        </CardTitle>
                        <CardDescription className="pt-1">
                          {isArabic
                            ? "حدد الأيام والأوقات التي ترغب بإتاحتها للطلاب لحجز مقابلات معك. المواعيد المحفظة تظهر فوراً للطلاب."
                            : "Configure your weekly office hour slots. Saved slots will immediately appear to students."}
                        </CardDescription>
                      </div>
                      <Button onClick={handleAddSlot} size="sm" variant="outline" className="font-bold gap-1 shrink-0 bg-background shadow-sm">
                        <Plus className="h-4 w-4" />
                        {isArabic ? "إضافة موعد جديد" : "Add Time Slot"}
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 space-y-4">
                    {officeSlots.length === 0 ? (
                      <div className="text-center py-10 bg-muted/10 border border-dashed rounded-xl space-y-2">
                        <Clock className="h-10 w-10 text-muted-foreground/40 mx-auto" />
                        <p className="text-sm font-bold text-muted-foreground">
                          {isArabic ? "لم تقم بتحديد أي مواعيد ساعات مكتبية بعد" : "No office hour slots configured yet"}
                        </p>
                        <Button onClick={handleAddSlot} size="sm" className="font-bold gap-1">
                          <Plus className="h-4 w-4" />
                          {isArabic ? "إضافة أول موعد الآن" : "Add First Slot"}
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {officeSlots.map((slot, idx) => (
                          <div key={idx} className="p-4 border rounded-xl bg-card hover:bg-muted/20 transition-all shadow-sm space-y-3 relative group">
                            <button
                              type="button"
                              onClick={() => handleRemoveSlot(idx)}
                              className="absolute top-3 end-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-1.5 rounded-full transition-colors"
                              title={isArabic ? "حذف الموعد" : "Remove slot"}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>

                            <div className="space-y-2 pe-6">
                              <div className="space-y-1">
                                <Label className="text-xs font-bold text-muted-foreground">{isArabic ? "اليوم" : "Day"}</Label>
                                <Input
                                  value={slot.dayAr}
                                  onChange={(e) => handleUpdateSlot(idx, "dayAr", e.target.value)}
                                  placeholder="الأحد / الثلاثاء"
                                  className="bg-background h-9 text-xs font-medium"
                                />
                              </div>

                              <div className="space-y-1">
                                <Label className="text-xs font-bold text-muted-foreground">{isArabic ? "التوقيت (الساعة)" : "Time Slot"}</Label>
                                <Input
                                  value={slot.time}
                                  onChange={(e) => handleUpdateSlot(idx, "time", e.target.value)}
                                  placeholder="10:00 AM - 11:00 AM"
                                  className="bg-background h-9 text-xs font-medium"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-4 border-t flex justify-end">
                      <Button
                        onClick={handleSaveOfficeSlots}
                        disabled={isSlotsSaving}
                        className="font-bold gap-2 px-6 shadow-md"
                      >
                        {isSlotsSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {isArabic ? "حفظ التغييرات والمواعيد" : "Save All Slots"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Info Card */}
                <Card className="border-none shadow-md bg-gradient-to-br from-primary/5 to-primary/10 flex flex-col justify-between">
                  <CardHeader>
                    <div className="p-3 bg-primary/10 text-primary w-fit rounded-xl mb-2">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg font-bold">{isArabic ? "كيف يعمل حجز المواعيد؟" : "How Booking Works"}</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground leading-relaxed pt-2">
                      {isArabic
                        ? "المواعيد التي تقوم بإضافتها في هذه القائمة تظهر تلقائياً في دليل هيئة التدريس بصفحتك الخاصة. يستطيع الطالب حجز الموعد مباشرة مع تزويدك باسمه وإيميله وسبب المقابلة."
                        : "The slots you configure here will be displayed live on your public profile page for students to book appointments with you directly."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <div className="p-3 bg-background border rounded-xl text-xs space-y-1">
                      <span className="font-bold text-primary block">{isArabic ? "ملاحظة هامة:" : "Important:"}</span>
                      <p className="text-muted-foreground">{isArabic ? "يرجى الالتزام بالأوقات المحفوظة للتواجد في مكتبك الأكاديمي." : "Please ensure attendance during configured office hours."}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Booked Appointments List by Students */}
              <Card className="border-none shadow-md overflow-hidden">
                <CardHeader className="bg-muted/30 border-b pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        {isArabic ? "قائمة المقابلات والمواعيد المحجوزة من الطلاب" : "Booked Student Appointments List"}
                      </CardTitle>
                      <CardDescription>
                        {isArabic ? "عرض كافة الطلبات المحجوزة لمقابلتك مع تفاصيل الطالب وسبب المقابلة." : "All student meeting requests booked for your office hours."}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="font-bold text-xs bg-background">
                      {isArabic ? `إجمالي الحجوزات: ${myBookedAppointments.length}` : `Total Bookings: ${myBookedAppointments.length}`}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/20">
                          <TableHead className="text-start font-bold">{isArabic ? "اسم الطالب" : "Student Name"}</TableHead>
                          <TableHead className="text-start font-bold">{isArabic ? "البريد الإلكتروني" : "Email"}</TableHead>
                          <TableHead className="text-start font-bold">{isArabic ? "اليوم والتوقيت" : "Day & Time"}</TableHead>
                          <TableHead className="text-start font-bold">{isArabic ? "سبب المقابلة" : "Reason"}</TableHead>
                          <TableHead className="text-start font-bold">{isArabic ? "الحالة" : "Status"}</TableHead>
                          <TableHead className="text-center font-bold">{isArabic ? "اسم الطالب" : "Student Name"}</TableHead>
                          <TableHead className="text-center font-bold">{isArabic ? "البريد الإلكتروني" : "Email"}</TableHead>
                          <TableHead className="text-center font-bold">{isArabic ? "اليوم والتوقيت" : "Day & Time"}</TableHead>
                          <TableHead className="text-center font-bold">{isArabic ? "سبب المقابلة" : "Reason"}</TableHead>
                          <TableHead className="text-center font-bold">{isArabic ? "الحالة" : "Status"}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {myBookedAppointments.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-12 text-muted-foreground font-bold">
                              <div className="flex flex-col items-center gap-2">
                                <CheckCircle2 className="h-10 w-10 text-muted-foreground/30" />
                                <p>{isArabic ? "لا يوجد حجوزات قادمة من الطلاب حالياً" : "No student bookings yet"}</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          myBookedAppointments.map((app) => (
                            <TableRow key={app.id} className="hover:bg-muted/30 transition-colors">
                              <TableCell className="font-bold text-start text-sm">
                                {app.studentName}
                                {app.studentId && <span className="block text-xs text-muted-foreground font-normal">ID: {app.studentId}</span>}
                              </TableCell>
                              <TableCell className="text-xs text-start text-muted-foreground">
                                {app.studentEmail}
                              </TableCell>
                              <TableCell className="text-sm font-medium text-start">
                                <Badge variant="secondary" className="font-normal text-xs">
                                  {app.dayAr} ({app.timeSlot})
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs text-start max-w-xs truncate">
                                {app.reason || (isArabic ? "استفسار أكاديمي" : "Academic Inquiry")}
                              </TableCell>
                              <TableCell className="text-start">
                                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold">
                                  {isArabic ? "مؤكد" : "Confirmed"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 2: Courses & Grades */}
            <TabsContent value="my-courses" className="space-y-6">
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    {isArabic ? "المواد الدراسية والشعب" : "My Teaching Courses"}
                  </CardTitle>
                  <CardDescription>
                    {isArabic ? "المواد المسندة إليك للفصل الدراسي الحالي وإدخال الدرجات." : "Courses assigned for current semester."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 border border-dashed rounded-xl text-muted-foreground font-bold">
                    <p>{isArabic ? "قائمة المواد التدريسية مسندة تلقائياً بحسب الجدول الأكاديمي." : "Teaching courses assigned automatically per schedule."}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
