"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import { FacultyMember } from "@/lib/api";
import { useFacultyMembers, useBookAppointment } from "@/hooks/use-faculty-members";
import { useFaculties } from "@/hooks/use-faculties";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  Clock,
  MapPin,
  Building2,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Award,
  Calendar,
  CheckCircle2,
  Loader2,
  FileText,
  Info,
} from "lucide-react";
import { toast } from "sonner";

interface TimeSlot {
  id: string;
  dayAr: string;
  dayEn: string;
  time: string;
  status: "available" | "pending" | "booked";
  studentName?: string;
  reason?: string;
}

function generateSlots(professor: FacultyMember | undefined): TimeSlot[] {
  if (!professor) return [];

  // 1. If professor has custom configured slots in DB, use them
  if (Array.isArray(professor.officeHourSlots) && professor.officeHourSlots.length > 0) {
    return professor.officeHourSlots.map((s: any, idx: number) => ({
      id: s.id || `slot-db-${idx + 1}`,
      dayAr: s.dayAr || "الأحد",
      dayEn: s.dayEn || "Sunday",
      time: s.time || "10:00 AM - 11:00 AM",
      status: s.status || "available",
    }));
  }

  // 2. Default bookable slots fallback
  const officeHours = professor.officeHours || "";

  const daysList =
    officeHours.includes("Mon, Wed")
      ? [
        {
          dayAr: "الاثنين",
          dayEn: "Monday",
          times: ["01:00 PM - 02:00 PM", "02:00 PM - 03:00 PM"],
        },
        {
          dayAr: "الأربعاء",
          dayEn: "Wednesday",
          times: ["01:00 PM - 02:00 PM", "02:00 PM - 03:00 PM"],
        },
      ]
      : [
        {
          dayAr: "الأحد",
          dayEn: "Sunday",
          times: ["10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM"],
        },
        {
          dayAr: "الثلاثاء",
          dayEn: "Tuesday",
          times: ["10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM"],
        },
      ];



  const generatedSlots: TimeSlot[] = [];
  let idCounter = 1;
  daysList.forEach((dayGroup) => {
    dayGroup.times.forEach((timeStr) => {
      generatedSlots.push({
        id: `slot-${idCounter++}`,
        dayAr: dayGroup.dayAr,
        dayEn: dayGroup.dayEn,
        time: timeStr,
        status: "available",
      });
    });
  });

  return generatedSlots;
}

const formatTimeSlot = (timeStr: string, isAr: boolean) => {
  if (!isAr) return timeStr;
  return timeStr.replace(/\bAM\b/g, "ص").replace(/\bPM\b/g, "م");
};

export default function ProfessorProfilePage() {
  const params = useParams();
  const professorId = params.professorId as string;
  const router = useRouter();
  const { language, dir } = useLanguage();
  const isArabic = language === "ar";

  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const BackArrow = dir === "rtl" ? ArrowRight : ArrowLeft;

  const { data: backendMembers } = useFacultyMembers();
  const { data: backendFaculties } = useFaculties();
  const displayFaculties = backendFaculties || [];

  // Retrieve professor info
  const professor = useMemo(() => {
    if (!backendMembers) return undefined;
    return backendMembers.find(
      (p) => p.id.toString() === professorId || p.email === professorId
    );
  }, [backendMembers, professorId]);

  const getFacultyName = useCallback(
    (slug?: string) => {
      if (!slug) return isArabic ? "جامعة أنطاكية السورية" : "Antioch Syrian University";
      const f = displayFaculties.find((fac) => fac.slug === slug);
      return f ? (isArabic ? f.nameAr : f.nameEn) : isArabic ? "جامعة أنطاكية السورية" : "Antioch Syrian University";
    },
    [displayFaculties, isArabic],
  );


  // Profile detailed mock database
  const details = useMemo(() => {
    if (!professor) return null;

    // Rich custom data for key professors
    if (professor.id.toString() === "eng-head" || professor.email === "ali.mansour@asu.edu.sy") {
      return {
        bioAr:
          "أ.د. أحمد خليل هو أستاذ دكتور في الهندسة الإنشائية يتمتع بخبرة تزيد عن 25 عاماً في التدريس الأكاديمي والبحث العلمي وتصميم المشاريع الإنشائية الكبرى في سورية والشرق الأوسط. عمل عميداً لكلية الهندسة في جامعة أنطاكية السورية الخاصة منذ تأسيس الكلية، وله إسهامات هامة في تطوير المناهج الهندسية.",
        bioEn:
          "Prof. Ahmed Khalil is a Professor of Structural Engineering with over 25 years of experience in academic teaching, scientific research, and designing major structural projects in Syria and the Middle East. He has served as Dean of the Faculty of Engineering at ASU since the faculty's inception, contributing significantly to curriculum development.",
        education: [
          {
            degreeAr: "دكتوراه في الهندسة الإنشائية",
            degreeEn: "PhD in Structural Engineering",
            schoolAr: "جامعة دمشق بالتعاون مع جامعة شتوتغارت (ألمانيا)",
            schoolEn:
              "Damascus University in coop. with University of Stuttgart (Germany)",
            year: "1999",
          },
          {
            degreeAr: "ماجستير في الهندسة الإنشائية",
            degreeEn: "MSc in Structural Engineering",
            schoolAr: "جامعة دمشق",
            schoolEn: "Damascus University",
            year: "1995",
          },
          {
            degreeAr: "بكالوريوس في الهندسة المدنية",
            degreeEn: "BSc in Civil Engineering",
            schoolAr: "جامعة دمشق (المرتبة الأولى)",
            schoolEn: "Damascus University (First Class Honors)",
            year: "1992",
          },
        ],
        researchAr:
          "التصميم الزلزالي للمباني الخرسانية المسلحة، الهياكل الإنشائية المستدامة، تقييم متانة الخرسانة في البيئات الجافة، وتطبيقات الذكاء الاصطناعي في الهندسة الإنشائية.",
        researchEn:
          "Seismic design of reinforced concrete buildings, sustainable structural designs, durability assessment of concrete in arid environments, and application of AI in structural engineering.",
        publications: [
          {
            titleAr: "تقييم الضعف الزلزالي للمباني القائمة في ريف دمشق",
            titleEn:
              "Seismic Vulnerability Assessment of Existing Buildings in Damascus Countryside",
            journalAr: "مجلة جامعة دمشق للعلوم الهندسية",
            journalEn: "Damascus University Journal for Engineering Sciences",
            year: "2023",
          },
          {
            titleAr:
              "استخدام الخرسانة المضاف إليها ألياف الزجاج لتحسين مقاومة الزلازل",
            titleEn:
              "Using Glass-Fiber Reinforced Concrete to Enhance Seismic Performance",
            journalAr: "المجلة العربية للإنشاءات الهندسية",
            journalEn: "Arab Journal of Structural Engineering",
            year: "2021",
          },
          {
            titleAr:
              "النمذجة الرياضية لمتانة الخرسانة المسلحة تحت ظروف مناخية قاسية",
            titleEn:
              "Mathematical Modeling of RC Durability Under Extreme Climatic Conditions",
            journalAr: "المجلة الدولية للمواد والمنشآت",
            journalEn: "International Journal of Materials and Structures",
            year: "2019",
          },
        ],
      };
    }

    if (professor.id.toString() === "eng-f1" || professor.email === "salma.hasan@asu.edu.sy") {
      return {
        bioAr:
          "د. ريم محمود هي أستاذ مساعد في قسم هندسة الحاسوب والاتصالات بجامعة أنطاكية السورية الخاصة. تركز أبحاثها على تطبيق تقنيات تعلم الآلة والشبكات العصبونية العميقة في مجالات معالجة اللغات الطبيعية وتطوير الأنظمة الذكية، بالإضافة إلى إشرافها على عدة مشاريع تخرج متميزة.",
        bioEn:
          "Dr. Reem Mahmoud is an Associate Professor in the Computer and Communications Engineering department at ASU. Her research focuses on applying machine learning and deep neural networks in natural language processing and smart systems design. She also supervises several outstanding graduation projects.",
        education: [
          {
            degreeAr: "دكتوراه في هندسة الحاسوب (الذكاء الاصطناعي)",
            degreeEn: "PhD in Computer Engineering (AI)",
            schoolAr: "جامعة حلب",
            schoolEn: "University of Aleppo",
            year: "2013",
          },
          {
            degreeAr: "ماجستير في البرمجيات ونظم المعلومات",
            degreeEn: "MSc in Software and Information Systems",
            schoolAr: "جامعة حلب",
            schoolEn: "University of Aleppo",
            year: "2009",
          },
          {
            degreeAr: "بكالوريوس في هندسة الحاسوب والشبكات",
            degreeEn: "BSc in Computer Engineering & Networks",
            schoolAr: "جامعة حلب",
            schoolEn: "University of Aleppo",
            year: "2006",
          },
        ],
        researchAr:
          "معالجة اللغات الطبيعية للغة العربية الفصحى واللهجات المحلية، الشبكات العصبونية التلافيفية، إنترنت الأشياء (IoT) والأنظمة المدمجة الذكية.",
        researchEn:
          "Natural Language Processing (NLP) for Arabic and local dialects, Convolutional Neural Networks (CNNs), Internet of Things (IoT), and smart embedded systems.",
        publications: [
          {
            titleAr: "نموذج تعلم عميق لتحليل مشاعر التغريدات باللهجة السورية",
            titleEn:
              "A Deep Learning Model for Sentiment Analysis in Syrian Dialect Social Media",
            journalAr: "المجلة العربية للذكاء الاصطناعي",
            journalEn: "Arab Journal of Artificial Intelligence",
            year: "2023",
          },
          {
            titleAr: "تطوير نظام ري ذكي يعتمد على إنترنت الأشياء وحوسبة الحافة",
            titleEn:
              "Developing a Smart Irrigation System Based on IoT and Edge Computing",
            journalAr: "المجلة الدولية للحوسبة والشبكات",
            journalEn: "International Journal of Computing and Networks",
            year: "2021",
          },
          {
            titleAr: "خوارزمية ملاحة الروبوتات الذكية باستخدام التعلم المعزز",
            titleEn:
              "Smart Robot Navigation Algorithm using Reinforcement Learning",
            journalAr: "مجلة بحوث الأتمتة والتحكم",
            journalEn: "Journal of Automation and Control Research",
            year: "2018",
          },
        ],
      };
    }

    // Use professor custom DB data if present
    const customEdu = Array.isArray(professor.educationAr) && professor.educationAr.length > 0
      ? professor.educationAr
      : [];

    const customPubs = Array.isArray(professor.publications) && professor.publications.length > 0
      ? professor.publications
      : [];

    return {
      bioAr: professor.bioAr || `${professor.nameAr} هو ${professor.titleAr} في قسم ${professor.departmentAr} بكلية ${getFacultyName(professor.facultySlug)}.`,
      bioEn: professor.bioEn || `${professor.nameEn} is a ${professor.titleEn} in the department of ${professor.departmentEn} at the Faculty of ${getFacultyName(professor.facultySlug)}.`,
      education: customEdu,
      researchAr: professor.researchAr || "",
      researchEn: professor.researchEn || "",
      publications: customPubs,
    };
  }, [professor, getFacultyName]);

  // Office Hour Booking Slots State
  const [slots, setSlots] = useState<TimeSlot[]>(() =>
    generateSlots(professor),
  );

  // Synchronize slots whenever professor data loads or updates
  useEffect(() => {
    if (professor) {
      setSlots(generateSlots(professor));
    }
  }, [professor]);

  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form inputs
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [meetingReason, setMeetingReason] = useState("");

  const bookAppointmentMutation = useBookAppointment();

  const handleOpenBooking = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setIsBookingOpen(true);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentId.trim() || !meetingReason.trim()) {
      toast.error(
        isArabic
          ? "يرجى ملء جميع الحقول المطلوبة"
          : "Please fill in all required fields",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      if (professor && selectedSlot) {
        await bookAppointmentMutation.mutateAsync({
          facultyMember: professor.id,
          studentName,
          studentEmail: `${studentId}@student.asu.edu.sy`,
          studentId,
          dayAr: selectedSlot.dayAr,
          dayEn: selectedSlot.dayEn,
          timeSlot: selectedSlot.time,
          reason: meetingReason,
        });
      }

      setIsSubmitting(false);
      setIsBookingOpen(false);

      if (selectedSlot) {
        setSlots((prev) =>
          prev.map((s) =>
            s.id === selectedSlot.id
              ? {
                ...s,
                status: "pending",
                studentName,
                reason: meetingReason,
              }
              : s,
          ),
        );
      }

      toast.success(
        isArabic
          ? "تم إرسال طلب حجز المقابلة بنجاح وحفظه في قاعدة البيانات. سنرسل تأكيداً إلى بريدك الإلكتروني الجامعي."
          : "Office hours request submitted successfully and recorded in DB! A confirmation email will be sent.",
        {
          duration: 5000,
          icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
        },
      );

      setStudentName("");
      setStudentId("");
      setMeetingReason("");
      setSelectedSlot(null);
    } catch (err) {
      setIsSubmitting(false);
      toast.error(
        isArabic
          ? "حدث خطأ أثناء حجز الموعد. يرجى المحاولة مرة أخرى."
          : "An error occurred while booking the appointment. Please try again."
      );
    }
  };


  if (!professor || !details) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-8">
          <Card className="max-w-md w-full text-center p-6 border-dashed">
            <Building2 className="h-16 w-16 mx-auto text-primary/30 mb-4" />
            <h1 className="text-2xl font-bold mb-2">
              {isArabic
                ? "عضو هيئة التدريس غير موجود"
                : "Faculty Member Not Found"}
            </h1>
            <p className="text-muted-foreground mb-6 text-sm">
              {isArabic
                ? "لا يمكن العثور على الأستاذ المطلوب في قاعدة البيانات. يرجى التأكد من المعرّف."
                : "The requested faculty profile does not exist. Please check the ID and try again."}
            </p>
            <Button onClick={() => router.push("/about/directory")}>
              {isArabic ? "العودة إلى الدليل" : "Back to Directory"}
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/20">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Back button */}
          <div className="mb-6" dir={dir}>
            <Link
              href="/about/directory"
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
            >
              <BackArrow className="h-4 w-4" />
              {isArabic
                ? "العودة لدليل أعضاء هيئة التدريس"
                : "Back to Faculty Directory"}
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left sidebar: Professor Main Profile card */}
            <Card className="lg:col-span-1 border border-primary/10 shadow-md">
              <CardHeader className="flex flex-col items-center p-8 text-center border-b bg-muted/10 relative overflow-hidden">
                {/* Visual glow element */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-2xl rounded-full" />

                <Avatar className="h-32 w-32 border-4 border-background shadow-md mb-4">
                  {professor.image && (
                    <AvatarImage
                      src={professor.image}
                      alt={isArabic ? professor.nameAr : professor.nameEn}
                    />
                  )}
                  <AvatarFallback className="text-3xl font-semibold bg-primary/10 text-primary">
                    {professor.nameEn
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-1">
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    {isArabic ? professor.nameAr : professor.nameEn}
                  </h1>
                  <p className="text-sm font-bold text-primary">
                    {isArabic ? professor.titleAr : professor.titleEn}
                  </p>
                </div>
              </CardHeader>

              <CardContent
                className="p-6 space-y-5 text-start text-sm"
                dir={dir}
              >
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Building2 className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                    <div>
                      <p className="font-bold text-foreground">
                        {getFacultyName(professor.facultySlug)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {isArabic
                          ? professor.departmentAr
                          : professor.departmentEn}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-primary shrink-0" />
                    <div>
                      <span className="font-semibold block text-xs text-muted-foreground">
                        {isArabic ? "الساعات المكتبية" : "Office Hours"}
                      </span>
                      <span className="text-foreground text-xs font-bold">
                        {professor.officeHours}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <div>
                      <span className="font-semibold block text-xs text-muted-foreground">
                        {isArabic ? "الموقع" : "Location"}
                      </span>
                      <span className="text-foreground text-xs font-bold">
                        {isArabic
                          ? "حرم معرة صيدنايا - مبنى الإدارة"
                          : "Maarat Saidnaya Campus - Administration Building"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-primary shrink-0" />
                    <div className="truncate">
                      <span className="font-semibold block text-xs text-muted-foreground">
                        {isArabic ? "البريد الإلكتروني" : "Email Address"}
                      </span>
                      <a
                        href={`mailto:${professor.email}`}
                        className="text-primary hover:underline font-medium text-xs"
                      >
                        {professor.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={`mailto:${professor.email}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground font-bold px-4 py-3 transition-colors hover:bg-primary/95 text-xs shadow-sm"
                  >
                    <Mail className="h-4 w-4" />
                    {isArabic ? "إرسال رسالة بريد مباشر" : "Send Email Message"}
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Right main area: Tabs details & Calendar booking */}
            <div className="lg:col-span-2 space-y-6">
              <Tabs
                defaultValue="about"
                className="w-full border rounded-xl bg-card shadow-sm p-6"
                dir={dir}
              >
                <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/65 p-1 rounded-lg">
                  <TabsTrigger
                    value="about"
                    className="text-xs sm:text-sm font-bold gap-2"
                  >
                    <GraduationCap className="h-4 w-4 shrink-0" />
                    <span className="hidden sm:inline">
                      {isArabic ? "السيرة والتعليم" : "CV & Education"}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="research"
                    className="text-xs sm:text-sm font-bold gap-2"
                  >
                    <BookOpen className="h-4 w-4 shrink-0" />
                    <span className="hidden sm:inline">
                      {isArabic ? "الأبحاث والمنشورات" : "Research & Papers"}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="booking"
                    className="text-xs sm:text-sm font-bold gap-2"
                  >
                    <Calendar className="h-4 w-4 shrink-0" />
                    <span className="hidden sm:inline">
                      {isArabic ? "حجز موعد" : "Book Office Hours"}
                    </span>
                  </TabsTrigger>
                </TabsList>

                {/* TAB 1: Biography & Education */}
                <TabsContent value="about" className="space-y-6 text-start">
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-foreground border-b pb-2">
                      {isArabic ? "السيرة الذاتية" : "Biography"}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {isArabic ? details.bioAr : details.bioEn}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-foreground border-b pb-2 flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      {isArabic
                        ? "المؤهلات العلمية والشهادات"
                        : "Academic Credentials"}
                    </h3>
                    <div className="relative border-s border-primary/20 ps-6 ms-3 space-y-6">
                      {details.education.map((edu, idx) => (
                        <div key={idx} className="relative">
                          {/* Timeline dot */}
                          <span className="absolute -start-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-background border border-primary z-10">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          </span>
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-primary font-mono">
                              {edu.year}
                            </span>
                            <h4 className="font-bold text-sm text-foreground">
                              {isArabic ? edu.degreeAr : edu.degreeEn}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {isArabic ? edu.schoolAr : edu.schoolEn}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* TAB 2: Research Interests & Publications */}
                <TabsContent value="research" className="space-y-6 text-start">
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-foreground border-b pb-2 flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      {isArabic
                        ? "الاهتمامات والتوجهات البحثية"
                        : "Research Interests"}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {isArabic ? details.researchAr : details.researchEn}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-foreground border-b pb-2 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      {isArabic
                        ? "المنشورات الأكاديمية المختارة"
                        : "Selected Publications"}
                    </h3>
                    <div className="grid grid-cols-1 gap-3.5">
                      {details.publications.map((pub, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-all flex justify-between items-start gap-4"
                        >
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2.5">
                              <Badge className="bg-primary/10 border-primary/20 text-primary font-mono text-[9px] font-bold">
                                {pub.year}
                              </Badge>
                              <span className="text-[10px] text-muted-foreground">
                                {isArabic ? pub.journalAr : pub.journalEn}
                              </span>
                            </div>
                            <h4 className="font-bold text-sm text-foreground">
                              {isArabic ? pub.titleAr : pub.titleEn}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {isArabic
                                ? `بواسطة: ${professor.nameAr}`
                                : `By: ${professor.nameEn}`}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/10 shrink-0 text-xs"
                            onClick={() =>
                              toast.info(
                                isArabic
                                  ? "طلب تنزيل المخطوطة الكاملة للملف الشخصي..."
                                  : "Downloading full manuscript...",
                              )
                            }
                          >
                            PDF
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* TAB 3: Interactive Schedule Booking Grid */}
                <TabsContent value="booking" className="space-y-5 text-start">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-foreground border-b pb-2">
                      {isArabic ? "حجز موعد مقابلة" : "Book an Appointment"}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {isArabic
                        ? "اختر أحد المواعيد المتاحة أدناه لحجز مقابلة ساعات مكتبية مباشرة مع الأستاذ. سيتم محاكاة الطلب والتحقق منه فوراً."
                        : "Select an available slot below to request an office hour appointment. The process will be simulated live."}
                    </p>
                  </div>

                  {/* Designated Appointment Hall / Room Banner */}
                  {professor?.appointmentLocation && (
                    <div className="p-4 rounded-xl border bg-primary/5 border-primary/20 flex items-center gap-3.5 text-foreground shadow-sm">
                      <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-bold text-muted-foreground block">
                          {isArabic ? "مكان / قاعة المقابلة المخصصة:" : "Designated Meeting Hall / Room:"}
                        </span>
                        <span className="font-bold text-sm text-primary">
                          {professor.appointmentLocation}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Grid of scheduling options */}
                  {slots.length === 0 ? (
                    <div className="text-center py-10 px-4 rounded-xl border border-dashed border-border bg-muted/20 space-y-2">
                      <Clock className="h-8 w-8 mx-auto text-muted-foreground/60" />
                      <p className="text-sm font-semibold text-foreground">
                        {isArabic ? "لا توجد مواعيد ساعات مكتبية متاحة حالياً" : "No office hours available at the moment"}
                      </p>
                      <p className="text-xs text-muted-foreground max-w-md mx-auto">
                        {isArabic
                          ? "لم يقم عضو هيئة التدريس بتحديد مواعيد حجز حالياً، يرجى التواصل عبر البريد الإلكتروني لتنسيق موعد."
                          : "The faculty member has not published bookable slots yet. Please reach out via email."}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {slots.map((slot) => {
                        const isPending = slot.status === "pending";
                        return (
                          <div
                            key={slot.id}
                            className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all ${isPending
                                ? "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400"
                                : "bg-muted/30 border-border hover:bg-muted/50 dark:bg-slate-900/40 dark:border-white/5 dark:hover:border-primary/40 text-foreground"
                              }`}
                          >
                            <div className="space-y-1">
                              <span className="text-xs font-bold text-muted-foreground">
                                {isArabic ? slot.dayAr : slot.dayEn}
                              </span>
                              <p className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                                <Clock className="h-3.5 w-3.5 shrink-0 text-primary" />
                                <span dir="ltr" className="inline-block">
                                  {formatTimeSlot(slot.time, isArabic)}
                                </span>
                              </p>
                            </div>

                            <div className="flex justify-between items-center pt-1 border-t border-border dark:border-white/5">
                              <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                                {isPending
                                  ? isArabic
                                    ? "بانتظار الموافقة"
                                    : "Pending Approval"
                                  : isArabic
                                    ? "متاح للحجز"
                                    : "Available"}
                              </span>

                              <Button
                                size="sm"
                                disabled={isPending}
                                variant={isPending ? "ghost" : "default"}
                                className={
                                  isPending
                                    ? "text-amber-600 dark:text-amber-400"
                                    : "bg-primary text-white text-xs font-semibold px-3 py-1.5 h-7 rounded-md hover:bg-primary/95"
                                }
                                onClick={() => handleOpenBooking(slot)}
                              >
                                {isPending ? (
                                  <span className="flex items-center gap-1">
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    {isArabic ? "طلب معلق" : "Pending"}
                                  </span>
                                ) : isArabic ? (
                                  "حجز الآن"
                                ) : (
                                  "Book Now"
                                )}
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex gap-3 items-start mt-4">
                    <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {isArabic
                        ? "ملاحظة: الساعات المكتبية مخصصة للاستفسارات الأكاديمية والبحثية للطلاب، وفي حال طلب مواعيد خارج الساعات المعلنة، يرجى مراسلة الأستاذ مباشرة بالبريد الإلكتروني."
                        : "Note: Office hours are dedicated to academic inquiries. If you require an appointment outside these slots, please send an email request directly."}
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      {/* Booking Form Dialog Modal */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="max-w-md" dir={dir}>
          <DialogHeader className="text-start">
            <DialogTitle className="text-lg font-bold">
              {isArabic ? "تأكيد طلب حجز موعد" : "Confirm Appointment Request"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {isArabic ? (
                <>
                  طلب مقابلة مع الأستاذ في موعد: {selectedSlot?.dayAr} (
                  <span dir="ltr" className="inline-block">
                    {selectedSlot && formatTimeSlot(selectedSlot.time, true)}
                  </span>
                  )
                </>
              ) : (
                `Booking appointment on: ${selectedSlot?.dayEn} (${selectedSlot?.time})`
              )}
            </DialogDescription>
            {professor?.appointmentLocation && (
              <div className="mt-2.5 p-2.5 rounded-lg border bg-primary/5 border-primary/20 flex items-center gap-2 text-xs">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span className="text-muted-foreground">{isArabic ? "مكان المقابلة المخصص:" : "Designated Location:"}</span>
                <span className="font-bold text-primary">{professor.appointmentLocation}</span>
              </div>
            )}
          </DialogHeader>

          <form
            onSubmit={handleConfirmBooking}
            className="space-y-4 pt-4 text-start"
          >
            <div className="space-y-1.5">
              <Label htmlFor="student-name" className="text-xs">
                {isArabic
                  ? "اسم الطالب الكامل (ثنائي على الأقل) *"
                  : "Full Student Name *"}
              </Label>
              <Input
                id="student-name"
                placeholder={isArabic ? "مثال: حسان نصار" : "e.g. Hasan Nassar"}
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                required
                className="focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="student-id" className="text-xs">
                {isArabic ? "الرقم الجامعي الطالب *" : "Student Academic ID *"}
              </Label>
              <Input
                id="student-id"
                placeholder={isArabic ? "مثال: 191036" : "e.g. 191036"}
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
                className="focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="meeting-reason" className="text-xs">
                {isArabic ? "سبب حجز الموعد *" : "Purpose of Meeting *"}
              </Label>
              <Textarea
                id="meeting-reason"
                placeholder={
                  isArabic
                    ? "يرجى ذكر رمز المادة أو موضوع المناقشة..."
                    : "Please mention the course code or topic of discussion..."
                }
                value={meetingReason}
                onChange={(e) => setMeetingReason(e.target.value)}
                required
                className="min-h-[80px] focus:border-primary"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsBookingOpen(false)}
                className="border-border hover:bg-muted text-foreground"
              >
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-white font-bold gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isArabic ? "جاري الإرسال..." : "Submitting..."}
                  </>
                ) : isArabic ? (
                  "تأكيد الطلب"
                ) : (
                  "Confirm Request"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
