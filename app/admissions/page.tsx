"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useLanguage } from "@/contexts/language-context";
import { useFaculties } from "@/hooks/use-faculties";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  GraduationCap,
  FileText,
  DollarSign,
  Award,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

import { useCreateAdmissionApplication } from "@/hooks/use-admissions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Send, Check } from "lucide-react";

export default function AdmissionsPage() {
  const { language, t, dir } = useLanguage();
  const isArabic = language === "ar";
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const { data: backendFaculties } = useFaculties();
  const faculties = backendFaculties || [];
  const allPrograms = faculties.flatMap((f) => f.programs || []);

  const createAdmissionMutation = useCreateAdmissionApplication();

  // Application Form State
  const [fullNameAr, setFullNameAr] = React.useState("");
  const [fullNameEn, setFullNameEn] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [highSchoolBranch, setHighSchoolBranch] = React.useState("علمي");
  const [highSchoolScore, setHighSchoolScore] = React.useState(85);
  const [desiredFaculty, setDesiredFaculty] = React.useState<string>("");
  const [desiredProgram, setDesiredProgram] = React.useState<string>("");
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullNameAr || !email || !phone) {
      toast.error(isArabic ? "يرجى تعبئة الاسم، البريد الإلكتروني والهاتف" : "Please fill required fields");
      return;
    }

    try {
      await createAdmissionMutation.mutateAsync({
        fullNameAr,
        fullNameEn: fullNameEn || fullNameAr,
        email,
        phone,
        highSchoolBranch,
        highSchoolScore: Number(highSchoolScore),
        desiredFaculty: desiredFaculty ? Number(desiredFaculty) : null,
        desiredProgram: desiredProgram ? Number(desiredProgram) : null,
        status: "pending",
      });

      setIsSubmitted(true);
      toast.success(isArabic ? "تم تقديم طلب الالتحاق بالجامعة بنجاح!" : "Admission application submitted!");
    } catch (err) {
      toast.error(isArabic ? "حدث خطأ أثناء تقديم الطلب" : "Failed to submit application");
    }
  };


  const steps = [
    {
      titleAr: "اختر البرنامج",
      titleEn: "Choose Program",
      descAr: "استعرض الكليات والبرامج المتاحة واختر ما يناسب تطلعاتك",
      descEn:
        "Browse available faculties and programs and choose what suits your aspirations",
    },
    {
      titleAr: "تحقق من الشروط",
      titleEn: "Check Requirements",
      descAr: "تأكد من استيفائك لشروط القبول والحد الأدنى للدرجات",
      descEn: "Ensure you meet the admission requirements and minimum scores",
    },
    {
      titleAr: "قدم طلبك",
      titleEn: "Submit Application",
      descAr: "أكمل نموذج التقديم وأرفق المستندات المطلوبة",
      descEn: "Complete the application form and attach required documents",
    },
    {
      titleAr: "انتظر الرد",
      titleEn: "Await Response",
      descAr: "سيتم مراجعة طلبك وإعلامك بالنتيجة خلال أيام",
      descEn:
        "Your application will be reviewed and you'll be notified within days",
    },
  ];

  const faqs = [
    {
      questionAr: "ما هي شروط القبول العامة؟",
      questionEn: "What are the general admission requirements?",
      answerAr:
        "الشهادة الثانوية السورية (علمي أو أدبي حسب التخصص) مع تحقيق الحد الأدنى من الدرجات المطلوبة لكل برنامج.",
      answerEn:
        "Syrian Baccalaureate (Scientific or Literary depending on major) with meeting the minimum score required for each program.",
    },
    {
      questionAr: "هل تقبل الجامعة الطلاب غير السوريين؟",
      questionEn: "Does the university accept non-Syrian students?",
      answerAr:
        "نعم، تقبل الجامعة الطلاب من جميع الجنسيات مع رسوم دراسية خاصة بغير المقيمين.",
      answerEn:
        "Yes, the university accepts students of all nationalities with special tuition fees for non-residents.",
    },
    {
      questionAr: "ما هي المنح الدراسية المتاحة؟",
      questionEn: "What scholarships are available?",
      answerAr:
        "تقدم الجامعة 5% منح كاملة لوزارة التعليم العالي، بالإضافة إلى خصومات التفوق الأكاديمي.",
      answerEn:
        "The university offers 5% full scholarships for Ministry of Higher Education, plus academic excellence discounts.",
    },
    {
      questionAr: "متى تبدأ فترة التسجيل؟",
      questionEn: "When does the registration period start?",
      answerAr:
        "تبدأ فترة التسجيل عادة في شهر أغسطس وتستمر حتى بداية الفصل الدراسي.",
      answerEn:
        "The registration period usually starts in August and continues until the beginning of the semester.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b bg-muted/30 py-12 sm:py-16">
          <div className="section-container">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
                {language === "ar"
                  ? "ابدأ رحلتك الأكاديمية"
                  : "Start Your Academic Journey"}
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                {language === "ar"
                  ? "انضم إلى مجتمع جامعة أنطاكية السورية واستثمر في مستقبلك"
                  : "Join the Antioch Syrian University community and invest in your future"}
              </p>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="py-12 sm:py-16">
          <div className="section-container">
            <h2 className="mb-8 text-center text-2xl font-bold text-foreground">
              {language === "ar" ? "خطوات التقديم" : "Application Steps"}
            </h2>
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <Card key={index} className="relative">
                  <CardContent className="pt-6">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                      {index + 1}
                    </div>
                    <h3 className="mb-2 font-semibold text-foreground">
                      {language === "ar" ? step.titleAr : step.titleEn}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {language === "ar" ? step.descAr : step.descEn}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="bg-muted/30 py-12 sm:py-16">
          <div className="section-container">
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
              {/* General Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    {t("admissions.requirements")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      {
                        ar: "الشهادة الثانوية السورية (علمي/أدبي)",
                        en: "Syrian Baccalaureate (Scientific/Literary)",
                      },
                      {
                        ar: "تحقيق الحد الأدنى من الدرجات المطلوبة",
                        en: "Meeting minimum required scores",
                      },
                      {
                        ar: "صورة مصدقة عن الشهادة الثانوية",
                        en: "Certified copy of Secondary Certificate",
                      },
                      {
                        ar: "صورة عن الهوية الشخصية أو جواز السفر",
                        en: "Copy of ID or Passport",
                      },
                      {
                        ar: "6 صور شخصية حديثة",
                        en: "6 recent passport photos",
                      },
                      {
                        ar: "طلب التحاق مملوء وموقع",
                        en: "Completed and signed application form",
                      },
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                        <span>{language === "ar" ? item.ar : item.en}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Scholarships */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    {t("admissions.scholarships")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg bg-primary/5 p-4">
                      <h4 className="mb-2 font-semibold text-primary">
                        {language === "ar"
                          ? "منح وزارة التعليم العالي"
                          : "Ministry of Higher Education Scholarships"}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {language === "ar"
                          ? "5% منح كاملة للطلاب المتفوقين"
                          : "5% full scholarships for outstanding students"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-primary/5 p-4">
                      <h4 className="mb-2 font-semibold text-primary">
                        {language === "ar"
                          ? "خصومات التفوق الأكاديمي"
                          : "Academic Excellence Discounts"}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {language === "ar"
                          ? "خصومات على الرسوم للطلاب المتفوقين"
                          : "Fee discounts for high-achieving students"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Tuition Fees Table */}
        <section id="fees" className="py-12 sm:py-16">
          <div className="section-container">
            <h2 className="mb-8 text-center text-2xl font-bold text-foreground">
              {t("admissions.tuition")}
            </h2>
            <Card>
              <CardContent className="p-0 sm:p-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          {language === "ar" ? "البرنامج" : "Program"}
                        </TableHead>
                        <TableHead>
                          {language === "ar" ? "الساعات" : "Hours"}
                        </TableHead>
                        <TableHead>
                          {language === "ar" ? "سوريون" : "Syrians"}
                        </TableHead>
                        <TableHead>
                          {language === "ar" ? "غير مقيمين" : "Non-Residents"}
                        </TableHead>
                        <TableHead>
                          {language === "ar" ? "الحد الأدنى" : "Min Score"}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allPrograms.map((program) => (
                        <TableRow key={program.id}>
                          <TableCell className="font-medium">
                            <Link
                              href={`/academics/${program.facultySlug}/${program.slug}`}
                              className="hover:text-primary hover:underline"
                            >
                              {language === "ar"
                                ? program.nameAr
                                : program.nameEn}
                            </Link>
                          </TableCell>
                          <TableCell>{program.creditHours}</TableCell>
                          <TableCell>
                            {program.tuitionSyrian.toLocaleString()}{" "}
                            {program.tuitionCurrency.syrian}
                          </TableCell>
                          <TableCell>
                            ${program.tuitionNonResident}{" "}
                            {program.tuitionCurrency.nonResident}
                          </TableCell>
                          <TableCell>
                            {program.minScorePercent}% ({program.minScorePoints}
                            )
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-muted/30 py-12 sm:py-16">
          <div className="section-container">
            <h2 className="mb-8 text-center text-2xl font-bold text-foreground">
              {language === "ar"
                ? "الأسئلة الشائعة"
                : "Frequently Asked Questions"}
            </h2>
            <Card className="mx-auto max-w-3xl">
              <CardContent className="p-4 sm:p-6">
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>
                        {language === "ar" ? faq.questionAr : faq.questionEn}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {language === "ar" ? faq.answerAr : faq.answerEn}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Online Admission Application Form Section */}
        <section className="py-12 sm:py-16 bg-card border-y" id="apply-online">
          <div className="section-container max-w-4xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                {isArabic ? "تقديم طلب الالتحاق بالجامعة أونلاين" : "Apply for Admission Online"}
              </h2>
              <p className="text-muted-foreground mt-2">
                {isArabic 
                  ? "أدخل بياناتك الشخصية والدراسية لتقديم طلب التسجيل مباشرة في قاعدة بيانات الجامعة." 
                  : "Enter your personal and academic info to submit your admission application directly."}
              </p>
            </div>

            {isSubmitted ? (
              <Card className="border-emerald-500/30 bg-emerald-500/5 p-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                  {isArabic ? "تم تقديم طلبك بنجاح!" : "Application Submitted Successfully!"}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  {isArabic 
                    ? "شكراً لاهتمامك بالانضمام لجامعة أنطاكية السورية. سيقوم فريق القبول والتسجيل بمراجعة طلبك والتواصل معك عبر البريد أو الهاتف قريباً." 
                    : "Thank you for applying to Antioch Syrian University. Our admissions team will review your application and contact you soon."}
                </p>
                <Button variant="outline" className="font-bold mt-4" onClick={() => setIsSubmitted(false)}>
                  {isArabic ? "تقديم طلب آخر" : "Submit Another Application"}
                </Button>
              </Card>
            ) : (
              <Card className="shadow-lg border">
                <CardContent className="p-6 sm:p-8">
                  <form onSubmit={handleSubmitApplication} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="app-nameAr">{isArabic ? "الاسم الكامل (بالعربية) *" : "Full Name (AR) *"}</Label>
                        <Input
                          id="app-nameAr"
                          placeholder="مثال: أحمد محمد علي"
                          value={fullNameAr}
                          onChange={(e) => setFullNameAr(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="app-nameEn">{isArabic ? "الاسم الكامل (بالإنكليزية)" : "Full Name (EN)"}</Label>
                        <Input
                          id="app-nameEn"
                          placeholder="e.g. Ahmad Mohammad Ali"
                          value={fullNameEn}
                          onChange={(e) => setFullNameEn(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="app-email">{isArabic ? "البريد الإلكتروني *" : "Email *"}</Label>
                        <Input
                          id="app-email"
                          type="email"
                          placeholder="student@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="app-phone">{isArabic ? "رقم الهاتف / الواتساب *" : "Phone Number *"}</Label>
                        <Input
                          id="app-phone"
                          placeholder="+963 9xx xxx xxx"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{isArabic ? "فرع الشهادة الثانوية *" : "High School Branch *"}</Label>
                        <Select value={highSchoolBranch} onValueChange={setHighSchoolBranch}>
                          <SelectTrigger className="bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="علمي">{isArabic ? "الفرع العلمي" : "Scientific Branch"}</SelectItem>
                            <SelectItem value="أدبي">{isArabic ? "الفرع الأدبي" : "Literary Branch"}</SelectItem>
                            <SelectItem value="تجاري">{isArabic ? "تجاري / مهني" : "Commercial / Vocational"}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="app-score">{isArabic ? "مجموع / نسبة الثانوية (%) *" : "High School Score (%) *"}</Label>
                        <Input
                          id="app-score"
                          type="number"
                          min={50}
                          max={100}
                          value={highSchoolScore}
                          onChange={(e) => setHighSchoolScore(Number(e.target.value))}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{isArabic ? "الكلية المرغوبة" : "Desired Faculty"}</Label>
                        <Select value={desiredFaculty} onValueChange={setDesiredFaculty}>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder={isArabic ? "اختر الكلية" : "Select Faculty"} />
                          </SelectTrigger>
                          <SelectContent>
                            {faculties.map((f) => (
                              <SelectItem key={f.id} value={f.id.toString()}>
                                {isArabic ? f.nameAr : f.nameEn}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>{isArabic ? "التخصص / البرنامج المرغوب" : "Desired Program"}</Label>
                        <Select value={desiredProgram} onValueChange={setDesiredProgram}>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder={isArabic ? "اختر البرنامج" : "Select Program"} />
                          </SelectTrigger>
                          <SelectContent>
                            {allPrograms.map((p) => (
                              <SelectItem key={p.id} value={p.id.toString()}>
                                {isArabic ? p.nameAr : p.nameEn}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button type="submit" disabled={createAdmissionMutation.isPending} size="lg" className="w-full font-bold gap-2 text-base">
                      {createAdmissionMutation.isPending ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                      {isArabic ? "إرسال طلب الالتحاق بالجامعة" : "Submit Admission Application"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 sm:py-16">

          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              {language === "ar" ? "مستعد للتقديم؟" : "Ready to Apply?"}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              {language === "ar"
                ? "تواصل معنا للحصول على المزيد من المعلومات أو ابدأ عملية التقديم الآن"
                : "Contact us for more information or start your application process now"}
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  {language === "ar" ? "تواصل معنا" : "Contact Us"}
                  <Arrow className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/academics" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  {language === "ar" ? "استعرض البرامج" : "Browse Programs"}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
