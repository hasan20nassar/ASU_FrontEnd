"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  DialogTrigger,
  DialogFooter,
  DialogBody,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import {
  Calendar,
  GraduationCap,
  CreditCard,
  FileText,
  BookOpen,
  LogOut,
  User,
  UserPen,
  TrendingUp,
  Clock,
  Mail,
  AlertTriangle,
  Check,
  CheckCircle2,
  Info,
} from "lucide-react";
import { toast } from "sonner";

const translations = {
  ar: {
    welcome: "مرحباً",
    logout: "تسجيل الخروج",
    mySchedule: "جدولي الدراسي",
    gradesSummary: "ملخص الدرجات",
    currentGPA: "المعدل التراكمي",
    credits: "الساعات المكتملة",
    financialStatus: "الحالة المالية",
    balance: "الرصيد المتبقي",
    paid: "المدفوع",
    quickActions: "إجراءات سريعة",
    registerCourses: "تسجيل المواد",
    requestTranscript: "طلب كشف درجات",
    viewGrades: "عرض الدرجات",
    payFees: "دفع الرسوم",
    courseCode: "رمز المادة",
    courseName: "اسم المادة",
    day: "اليوم",
    time: "الوقت",
    room: "القاعة",
    instructor: "المدرس",
    grade: "الدرجة",
    recentGrades: "آخر الدرجات",
    noBalance: "لا يوجد رصيد مستحق",
    outstanding: "مستحق",
    days: {
      sunday: "الأحد",
      monday: "الاثنين",
      tuesday: "الثلاثاء",
      wednesday: "الأربعاء",
      thursday: "الخميس",
    },
    editProfile: "تعديل الملف الشخصي",
    nameAr: "الاسم (بالعربية)",
    nameEn: "الاسم (بالإنجليزية)",
    email: "البريد الإلكتروني",
    save: "حفظ التغييرات",
    updateImage: "تحديث الصورة",
    deleteImage: "حذف الصورة",
    profilePicture: "الصورة الشخصية",
    registerCoursesTitle: "تسجيل المواد الدراسية",
    availableCoursesList: "المواد المتاحة للتسجيل",
    weeklyScheduleVisual: "مخطط جدول المحاضرات الأسبوعي",
    conflictDetected: "تعارض في الوقت!",
    creditsSelected: "الساعات المحددة للتسجيل",
    confirmRegistration: "تأكيد تسجيل المواد",
    alreadyRegistered: "مسجلة بالفعل",
    timeConflict: "تعارض وقت",
    tentative: "مؤقت",
    roomShort: "قاعة",
  },
  en: {
    welcome: "Welcome",
    logout: "Logout",
    mySchedule: "My Schedule",
    gradesSummary: "Grades Summary",
    currentGPA: "Current GPA",
    credits: "Completed Credits",
    financialStatus: "Financial Status",
    balance: "Balance",
    paid: "Paid",
    quickActions: "Quick Actions",
    registerCourses: "Register Courses",
    requestTranscript: "Request Transcript",
    viewGrades: "View Grades",
    payFees: "Pay Fees",
    courseCode: "Course Code",
    courseName: "Course Name",
    day: "Day",
    time: "Time",
    room: "Room",
    instructor: "Instructor",
    grade: "Grade",
    recentGrades: "Recent Grades",
    noBalance: "No Outstanding Balance",
    outstanding: "Outstanding",
    days: {
      sunday: "Sunday",
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
    },
    editProfile: "Edit Profile",
    nameAr: "Name (Arabic)",
    nameEn: "Name (English)",
    email: "Email",
    save: "Save Changes",
    updateImage: "Update Image",
    deleteImage: "Delete Image",
    profilePicture: "Profile Picture",
    registerCoursesTitle: "Course Registration",
    availableCoursesList: "Available Courses",
    weeklyScheduleVisual: "Weekly Schedule Visualizer",
    conflictDetected: "Time Conflict Detected!",
    creditsSelected: "Credits Selected",
    confirmRegistration: "Confirm Registration",
    alreadyRegistered: "Already Registered",
    timeConflict: "Conflict",
    tentative: "Tentative",
    roomShort: "Rm",
  },
};

const availableCourses = [
  {
    id: 11,
    courseCode: "CE306",
    courseNameAr: "هندسة الأساسات",
    courseNameEn: "Foundation Engineering",
    day: "sunday",
    dayAr: "الأحد",
    dayEn: "Sunday",
    time: "08:00 - 09:30",
    room: "B-204",
    instructor: "د. محمد العلي",
    instructorEn: "Dr. Mohammad Al-Ali",
    credits: 3,
  },
  {
    id: 12,
    courseCode: "CE307",
    courseNameAr: "الهندسة البيئية",
    courseNameEn: "Environmental Engineering",
    day: "monday",
    dayAr: "الاثنين",
    dayEn: "Monday",
    time: "10:00 - 11:30",
    room: "C-202",
    instructor: "د. رنا خليل",
    instructorEn: "Dr. Rana Khalil",
    credits: 3,
  },
  {
    id: 13,
    courseCode: "CE308",
    courseNameAr: "تصميم المنشآت المعدنية",
    courseNameEn: "Steel Design",
    day: "tuesday",
    dayAr: "الثلاثاء",
    dayEn: "Tuesday",
    time: "10:00 - 11:30",
    room: "B-105",
    instructor: "د. ليلى حسن",
    instructorEn: "Dr. Laila Hassan",
    credits: 3,
  },
  {
    id: 14,
    courseCode: "CE309",
    courseNameAr: "الخرسانة المسلحة 2",
    courseNameEn: "Reinforced Concrete II",
    day: "wednesday",
    dayAr: "الأربعاء",
    dayEn: "Wednesday",
    time: "10:00 - 11:30",
    room: "B-201",
    instructor: "د. سامر العلي",
    instructorEn: "Dr. Samer Al-Ali",
    credits: 4,
  },
  {
    id: 15,
    courseCode: "GE102",
    courseNameAr: "اللغة العربية",
    courseNameEn: "Arabic Language",
    day: "thursday",
    dayAr: "الخميس",
    dayEn: "Thursday",
    time: "12:00 - 13:30",
    room: "C-102",
    instructor: "أ. نور أحمد",
    instructorEn: "Ms. Nour Ahmad",
    credits: 2,
  },
];

export default function StudentPortalPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const isArabic = language === "ar";

  const { studentProfile, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);


  const [profile, setProfile] = React.useState({
    nameAr: studentProfile?.nameAr || "",
    nameEn: studentProfile?.nameEn || "",
    email: studentProfile?.email || "",
    profileImage: studentProfile?.image || null,
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Registration States
  const [schedule, setSchedule] = React.useState<any[]>(studentProfile?.schedule || []);
  const [selectedAvailableCourses, setSelectedAvailableCourses] = React.useState<number[]>([]);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = React.useState(false);

  // Update local state when backend student profile is loaded
  React.useEffect(() => {
    if (studentProfile) {
      Promise.resolve().then(() => {
        setProfile({
          nameAr: studentProfile.nameAr || "",
          nameEn: studentProfile.nameEn || "",
          email: studentProfile.email || "",
          profileImage: studentProfile.image || null,
        });
        if (studentProfile.schedule) {
          setSchedule(studentProfile.schedule);
        }
      });
    }
  }, [studentProfile]);

  const displayGpa = studentProfile ? parseFloat(studentProfile.gpa || "0") : 0;
  const displayCompletedCredits = studentProfile ? studentProfile.completedCredits : 0;
  const displayTotalCredits = studentProfile ? studentProfile.totalCredits : 0;
  const displayId = studentProfile ? studentProfile.studentId : "";

  const displayGrades = studentProfile && studentProfile.grades ? studentProfile.grades : [];

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

  const studentName = isArabic ? profile.nameAr : profile.nameEn;
  const hasBalance = false;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditDialogOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/30">
        {/* Header */}
        <div className="border-b bg-card">
          <div className="container mx-auto px-4 py-4 sm:py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 sm:gap-4">
                <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
                  <DialogTrigger asChild>
                    <button className="group relative flex h-12 w-12 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground overflow-hidden transition-transform hover:scale-105 active:scale-95 focus:outline-none ring-offset-2 focus:ring-2 focus:ring-primary">
                      {profile.profileImage ? (
                        <Image src={profile.profileImage} alt={studentName} fill className="object-cover" unoptimized priority />
                      ) : (
                        <User className="h-6 w-6 sm:h-8 sm:w-8" />
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <UserPen className="h-5 w-5 text-white" />
                      </div>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md" dir={language === "ar" ? "rtl" : "ltr"}>
                    <DialogHeader>
                      <DialogTitle className="text-start">{t.profilePicture}</DialogTitle>
                      <DialogDescription className="sr-only">Update your profile picture</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-6 py-4">
                      <div className="relative h-48 w-48 sm:h-64 sm:w-64 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center border-4 border-muted shadow-xl">
                        {profile.profileImage ? (
                          <Image src={profile.profileImage} alt={studentName} fill className="object-cover" unoptimized />
                        ) : (
                          <User className="h-20 w-20 sm:h-32 sm:w-32 text-muted-foreground" />
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
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">
                    {t.welcome}, {studentName}
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    {displayId} | {profile.email}
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
                      <DialogDescription className="sr-only">Update your personal information</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveProfile} className="flex flex-col flex-1 min-h-0 overflow-hidden text-start">
                      <DialogBody className="space-y-4">
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
                      </DialogBody>

                      <DialogFooter className="sm:justify-start gap-2">
                        <Button type="submit" className="w-full sm:w-auto">
                          {t.save}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* GPA Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t.currentGPA}
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary">
                  {displayGpa.toFixed(2)}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t.credits}: {displayCompletedCredits}/{displayTotalCredits}
                </p>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width: `${(displayCompletedCredits / displayTotalCredits) * 100}%`,
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Financial Status */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t.financialStatus}
                </CardTitle>
                <CreditCard className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${hasBalance ? "text-destructive" : "text-green-600"}`}
                >
                  {hasBalance
                    ? `0 SYP`
                    : t.noBalance}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t.paid}: 0 SYP
                </p>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="sm:col-span-2 lg:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t.quickActions}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  className="h-auto flex-col gap-2 py-4 bg-transparent hover:bg-primary/5 transition-colors"
                  onClick={() => setIsRegisterDialogOpen(true)}
                >
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span className="text-xs font-bold">{t.registerCourses}</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col gap-2 py-4 bg-transparent">
                  <FileText className="h-5 w-5" />
                  <span className="text-xs">{t.requestTranscript}</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col gap-2 py-4 bg-transparent">
                  <GraduationCap className="h-5 w-5" />
                  <span className="text-xs">{t.viewGrades}</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col gap-2 py-4 bg-transparent">
                  <CreditCard className="h-5 w-5" />
                  <span className="text-xs">{t.payFees}</span>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Schedule Table */}
          <Card className="mt-4 sm:mt-6">
            <CardHeader className="flex flex-row items-center gap-2 px-4 sm:px-6">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <CardTitle className="text-base sm:text-lg">{t.mySchedule}</CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t.courseCode}</TableHead>
                        <TableHead>{t.courseName}</TableHead>
                        <TableHead>{t.day}</TableHead>
                        <TableHead>{t.time}</TableHead>
                        <TableHead>{t.room}</TableHead>
                        <TableHead>{t.instructor}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {schedule.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">{course.courseCode}</TableCell>
                          <TableCell>
                            {isArabic ? course.courseNameAr : course.courseNameEn}
                          </TableCell>
                          <TableCell>{isArabic ? course.dayAr : course.dayEn}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              {course.time}
                            </div>
                          </TableCell>
                          <TableCell>{course.room}</TableCell>
                          <TableCell>
                            {isArabic ? course.instructor : course.instructorEn}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Grades */}
          <Card className="mt-4 sm:mt-6">
            <CardHeader className="flex flex-row items-center gap-2 px-4 sm:px-6">
              <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <CardTitle className="text-base sm:text-lg">{t.recentGrades}</CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t.courseCode}</TableHead>
                        <TableHead>{t.courseName}</TableHead>
                        <TableHead>{t.grade}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayGrades.map((course) => (
                        <TableRow key={course.courseCode}>
                          <TableCell className="font-medium">{course.courseCode}</TableCell>
                          <TableCell>
                            {isArabic ? course.courseNameAr : course.courseNameEn}
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary">
                              {course.grade}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Registration Dialog */}
        <Dialog open={isRegisterDialogOpen} onOpenChange={(open) => {
          setIsRegisterDialogOpen(open);
          if (!open) setSelectedAvailableCourses([]);
        }}>
          <DialogContent className="max-w-6xl w-[95vw] h-[calc(100dvh-2.5rem)] sm:h-[calc(100dvh-4rem)] flex flex-col" dir={language === "ar" ? "rtl" : "ltr"}>
            <DialogHeader className="pb-2 border-b">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-start">
                <BookOpen className="h-6 w-6 text-primary" />
                {t.registerCoursesTitle}
              </DialogTitle>
              <DialogDescription className="text-start">
                {isArabic
                  ? "حدد المواد التي ترغب في تسجيلها للفصل القادم. سيتم تحديث جدول الحصص فوراً وعرض أي تعارضات."
                  : "Select courses you wish to register for the upcoming semester. The schedule visualizer will update live with conflict alerts."}
              </DialogDescription>
            </DialogHeader>

            {/* Dialog Content Grid */}
            <div className="flex-1 min-h-0 py-4 grid grid-cols-1 lg:grid-cols-5 gap-6 overflow-y-auto lg:overflow-hidden">
              {/* Left Column: Available Courses List */}
              <div className="lg:col-span-2 flex flex-col gap-3 overflow-y-auto pr-1 text-start">
                <h3 className="font-bold text-lg mb-1 flex items-center justify-between">
                  <span>{t.availableCoursesList}</span>
                  <Badge variant="outline" className="font-mono text-sm px-2.5 py-0.5">
                    {availableCourses.filter(c => selectedAvailableCourses.includes(c.id)).reduce((acc, c) => acc + c.credits, 0)} {isArabic ? "ساعة" : "Credits"}
                  </Badge>
                </h3>

                <div className="space-y-3">
                  {availableCourses.map((course) => {
                    const isSelected = selectedAvailableCourses.includes(course.id);
                    const isAlreadyInSchedule = schedule.some(c => c.courseCode === course.courseCode);

                    // Check for conflicts:
                    // 1. overlaps with any already registered course
                    const registeredConflict = schedule.find(c => c.day === course.day && c.time === course.time);
                    // 2. overlaps with other currently selected courses
                    const selectedConflict = availableCourses.find(c =>
                      c.id !== course.id &&
                      selectedAvailableCourses.includes(c.id) &&
                      c.day === course.day &&
                      c.time === course.time
                    );

                    const hasConflict = !!registeredConflict || !!selectedConflict;
                    const conflictWith = registeredConflict || selectedConflict;

                    return (
                      <div
                        key={course.id}
                        className={`relative border rounded-xl p-4 transition-all duration-200 flex flex-col gap-2 ${isAlreadyInSchedule
                            ? "bg-muted/50 border-muted opacity-80"
                            : isSelected
                              ? "bg-primary/5 border-primary shadow-sm"
                              : "bg-card hover:bg-muted/20 border-border"
                          }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex flex-col">
                            <span className="font-mono text-xs font-bold text-primary">{course.courseCode}</span>
                            <span className="font-bold text-sm text-foreground mt-0.5">
                              {isArabic ? course.courseNameAr : course.courseNameEn}
                            </span>
                          </div>

                          {isAlreadyInSchedule ? (
                            <Badge variant="secondary" className="gap-1 flex items-center shrink-0">
                              <Check className="h-3 w-3" />
                              {t.alreadyRegistered}
                            </Badge>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedAvailableCourses(selectedAvailableCourses.filter(id => id !== course.id));
                                } else {
                                  setSelectedAvailableCourses([...selectedAvailableCourses, course.id]);
                                }
                              }}
                              className={`h-6 w-6 rounded-md flex items-center justify-center border transition-all ${isSelected
                                  ? "bg-primary border-primary text-primary-foreground shadow"
                                  : "border-muted-foreground/30 hover:border-primary bg-background"
                                }`}
                            >
                              {isSelected && <Check className="h-4 w-4 stroke-[3px]" />}
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{isArabic ? course.dayAr : course.dayEn} {course.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-3.5 w-3.5" />
                            <span>{course.credits} {isArabic ? "ساعات" : "credits"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5" />
                            <span className="truncate">{isArabic ? course.instructor : course.instructorEn}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3.5 w-3.5" />
                            <span>{t.roomShort}: {course.room}</span>
                          </div>
                        </div>

                        {/* Conflict Alert Banner */}
                        {!isAlreadyInSchedule && isSelected && hasConflict && (
                          <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 rounded-lg p-2 animate-in slide-in-from-top-1 duration-200">
                            <AlertTriangle className="h-4 w-4 shrink-0" />
                            <span className="font-semibold text-start">
                              {isArabic
                                ? `تعارض مع: ${conflictWith ? (isArabic ? conflictWith.courseNameAr : conflictWith.courseNameEn) : ""}`
                                : `Conflicts with: ${conflictWith ? (isArabic ? conflictWith.courseNameAr : conflictWith.courseNameEn) : ""}`}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Weekly Schedule Visualizer */}
              <div className="lg:col-span-3 flex flex-col overflow-hidden border rounded-xl bg-card">
                <h3 className="font-bold text-lg p-4 border-b bg-muted/20 text-start">
                  {t.weeklyScheduleVisual}
                </h3>

                <div className="flex-1 overflow-auto p-4 min-h-[300px]">
                  <table className="w-full border-collapse text-xs select-none min-w-[500px]">
                    <thead>
                      <tr>
                        <th className="border p-2 bg-muted/30 text-muted-foreground w-20 font-bold">{t.time}</th>
                        {["sunday", "monday", "tuesday", "wednesday", "thursday"].map(day => (
                          <th key={day} className="border p-2 bg-muted/30 text-muted-foreground font-bold capitalize">
                            {t.days[day as keyof typeof t.days]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {["08:00 - 09:30", "10:00 - 11:30", "12:00 - 13:30", "14:00 - 15:30"].map((timeSlot) => (
                        <tr key={timeSlot} className="h-20">
                          <td className="border p-2 bg-muted/10 font-bold text-center tabular-nums text-muted-foreground border-border">
                            {timeSlot}
                          </td>
                          {["sunday", "monday", "tuesday", "wednesday", "thursday"].map((dayName) => {
                            // Find registered courses in this slot:
                            const regCourses = schedule.filter(c => c.day === dayName && c.time === timeSlot);
                            // Find newly selected available courses in this slot:
                            const tentativeCourses = availableCourses.filter(c =>
                              selectedAvailableCourses.includes(c.id) &&
                              c.day === dayName &&
                              c.time === timeSlot
                            );

                            const allSlotCourses = [...regCourses, ...tentativeCourses];
                            const hasSlotConflict = allSlotCourses.length > 1;

                            return (
                              <td key={dayName} className="border p-1 relative min-w-[90px] border-border align-top h-full">
                                {allSlotCourses.map((course, idx) => {
                                  const isTentative = 'credits' in course; // selected courses have 'credits' field

                                  return (
                                    <div
                                      key={course.id || idx}
                                      className={`absolute inset-1 p-2 rounded-lg flex flex-col justify-between overflow-hidden shadow-sm transition-all select-none ${hasSlotConflict
                                          ? "bg-rose-50 dark:bg-rose-950/20 border-rose-500 border-2 text-rose-700 dark:text-rose-400 animate-pulse z-10"
                                          : isTentative
                                            ? "bg-primary/10 border-primary border-dashed border-2 text-primary"
                                            : "bg-primary text-primary-foreground"
                                        }`}
                                    >
                                      <div className="flex flex-col justify-start text-start">
                                        <div className="flex items-center justify-between gap-1">
                                          <span className="font-bold text-[10px] uppercase truncate">{course.courseCode}</span>
                                          {hasSlotConflict && idx === 0 && (
                                            <AlertTriangle className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                                          )}
                                        </div>
                                        <span className="font-bold text-[10px] leading-tight truncate mt-0.5">
                                          {isArabic ? course.courseNameAr : course.courseNameEn}
                                        </span>
                                      </div>
                                      <div className="flex justify-between items-center text-[8px] opacity-90 mt-1">
                                        <span className="truncate">{course.room}</span>
                                        {isTentative && !hasSlotConflict && (
                                          <span className="font-semibold uppercase tracking-wider">{t.tentative}</span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t gap-2 sm:justify-start">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setIsRegisterDialogOpen(false);
                  setSelectedAvailableCourses([]);
                }}
                className="bg-transparent w-full sm:w-auto"
              >
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                type="button"
                disabled={
                  selectedAvailableCourses.length === 0 ||
                  availableCourses.some(course => {
                    if (!selectedAvailableCourses.includes(course.id)) return false;
                    // If selected course conflicts with a registered course:
                    if (schedule.some(c => c.day === course.day && c.time === course.time)) return true;
                    // If selected course conflicts with another selected course:
                    if (availableCourses.some(c =>
                      c.id !== course.id &&
                      selectedAvailableCourses.includes(c.id) &&
                      c.day === course.day &&
                      c.time === course.time
                    )) return true;
                    return false;
                  })
                }
                onClick={() => {
                  // Add selected courses to schedule
                  const newCoursesToRegister = availableCourses.filter(c => selectedAvailableCourses.includes(c.id));
                  const formattedNewCourses = newCoursesToRegister.map(course => ({
                    id: course.id,
                    courseCode: course.courseCode,
                    courseNameAr: course.courseNameAr,
                    courseNameEn: course.courseNameEn,
                    day: course.day,
                    dayAr: course.dayAr,
                    dayEn: course.dayEn,
                    time: course.time,
                    room: course.room,
                    instructor: course.instructor,
                    instructorEn: course.instructorEn,
                  }));

                  setSchedule([...schedule, ...formattedNewCourses]);
                  setIsRegisterDialogOpen(false);
                  setSelectedAvailableCourses([]);

                  toast.success(
                    isArabic
                      ? `تم تسجيل ${newCoursesToRegister.length} مواد بنجاح!`
                      : `Registered ${newCoursesToRegister.length} courses successfully!`
                  );
                }}
                className="w-full sm:w-auto font-bold"
              >
                {t.confirmRegistration}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
}
