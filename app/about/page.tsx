"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useLanguage } from "@/contexts/language-context";
import { universityInfo } from "@/data/contact";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  History,
  Users,
  Target,
  Eye,
  Award,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  BookOpen,
  Globe,
  Quote,
} from "lucide-react";
import { MouseGravityIcons } from "@/components/ui/mouse-gravity-icons";

export default function AboutPage() {
  const { language, t, dir } = useLanguage();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  const milestones = [
    {
      year: "2017",
      titleAr: "صدور المرسوم التأسيسي",
      titleEn: "Founding Decree Issued",
      descAr: "صدور المرسوم الرئاسي رقم 233 لتأسيس جامعة أنطاكية السورية",
      descEn:
        "Presidential Decree No. 233 issued to establish Antioch Syrian University",
    },
    {
      year: "2018",
      titleAr: "افتتاح الجامعة",
      titleEn: "University Opening",
      descAr: "افتتاح الجامعة رسمياً واستقبال أول دفعة من الطلاب في سبتمبر",
      descEn:
        "Official university opening and welcoming the first batch of students in September",
    },
    {
      year: "2019",
      titleAr: "توسيع البرامج",
      titleEn: "Program Expansion",
      descAr: "إضافة برامج جديدة في كليات الصيدلة وطب الأسنان",
      descEn: "Addition of new programs in Pharmacy and Dentistry faculties",
    },
    {
      year: "2024",
      titleAr: "الاعتماد الأكاديمي",
      titleEn: "Academic Accreditation",
      descAr: "حصول عدة كليات على الاعتماد الأكاديمي الكامل",
      descEn: "Several faculties receive full academic accreditation",
    },
  ];

  const values = [
    {
      icon: Award,
      titleAr: "التميز الأكاديمي",
      titleEn: "Academic Excellence",
      descAr: "نسعى للتميز في التعليم والبحث العلمي",
      descEn: "We strive for excellence in education and scientific research",
    },
    {
      icon: Users,
      titleAr: "خدمة المجتمع",
      titleEn: "Community Service",
      descAr: "نلتزم بخدمة المجتمع المحلي والإقليمي",
      descEn: "We are committed to serving the local and regional community",
    },
    {
      icon: Globe,
      titleAr: "الانفتاح العالمي",
      titleEn: "Global Openness",
      descAr: "نبني جسور التعاون مع المؤسسات الدولية",
      descEn: "We build bridges of cooperation with international institutions",
    },
    {
      icon: BookOpen,
      titleAr: "التعلم المستمر",
      titleEn: "Lifelong Learning",
      descAr: "نشجع ثقافة التعلم والتطوير المستمر",
      descEn: "We encourage a culture of continuous learning and development",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 relative overflow-hidden">
        <MouseGravityIcons />
        {/* Hero */}
        <section className="relative border-b bg-muted/30 py-12 sm:py-16">
          <div className="relative section-container">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div className="text-start relative z-10">
                <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
                  {language === "ar"
                    ? "عن جامعة أنطاكية السورية"
                    : "About Antioch Syrian University"}
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                  {language === "ar"
                    ? "جامعة أنطاكية السورية مؤسسة تعليمية خاصة تأسست عام 2017 وتقدم تعليماً عالياً متميزاً في بيئة أكاديمية حديثة."
                    : "Antioch Syrian University is a private educational institution established in 2017, offering distinguished higher education in a modern academic environment."}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <CardContent className="p-6 text-center">
                    <GraduationCap className="mx-auto mb-2 h-8 w-8 text-primary" />
                    <div className="text-3xl font-bold">
                      {universityInfo.stats.faculties}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {language === "ar" ? "كليات" : "Faculties"}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <BookOpen className="mx-auto mb-2 h-8 w-8 text-primary" />
                    <div className="text-3xl font-bold">
                      {universityInfo.stats.programs}+
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {language === "ar" ? "برامج" : "Programs"}
                    </div>
                  </CardContent>
                </Card>
                <Card className="sm:col-span-2">
                  <CardContent className="p-6 text-center">
                    <Users className="mx-auto mb-2 h-8 w-8 text-primary" />
                    <div className="text-3xl font-bold">
                      {universityInfo.stats.students.toLocaleString()}+
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {language === "ar" ? "طالب وطالبة" : "Students"}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* President's Message */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <Card className="relative overflow-hidden border-primary/10 shadow-xl bg-gradient-to-br from-card to-primary/5">
              <div className="absolute top-0 right-0 max-w-[50%] p-6 opacity-[0.03] rtl:left-0 rtl:right-auto transform -rotate-12">
                <Quote className="h-64 w-64 text-primary" />
              </div>
              <CardContent className="relative flex flex-col items-center p-8 sm:p-14 text-center">
                <Quote className="mb-8 h-10 w-10 text-primary/40 rotate-180" />
                <p className="mb-10 text-xl sm:text-2xl md:text-3xl font-serif leading-relaxed text-foreground/90 max-w-4xl">
                  {language === "ar"
                    ? "«نسعى في جامعة أنطاكية السورية إلى بناء صرح علمي متين، يمثل منارة للعلم والمعرفة، وحاضنة للإبداع والابتكار. نحن ملتزمون بتقديم تعليم نوعي يواكب مستجدات العصر، ويؤهل جيل الشباب ليكون قادراً على المنافسة في سوق العمل، مساهماً بفاعلية في بناء المستقبل وازدهار مجتمعنا.»"
                    : `"At Antioch Syrian University, we strive to build a solid scientific edifice, serving as a beacon of knowledge and an incubator for creativity and innovation. We are committed to providing quality education that keeps pace with modern developments, empowering our youth to compete globally and actively contribute to the prosperity of our society."`}
                </p>
                <div className="flex flex-col items-center justify-center gap-3">
                  <h3 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                    {language === "ar"
                      ? "أ.د. راكان رزوق"
                      : "Prof. Dr. Rakan Razzouk"}
                  </h3>
                  <Badge
                    variant="outline"
                    className="text-sm font-semibold sm:text-base px-5 py-1.5 uppercase tracking-wider text-primary border-primary/20 bg-background/50 backdrop-blur-sm"
                  >
                    {language === "ar"
                      ? "رئيس الجامعة"
                      : "University President"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* History */}
        <section className="py-12 sm:py-16">
          <div className="section-container">
            <div className="text-start">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5 text-primary" />
                    {t("about.history")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t("about.historyText")}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="bg-muted/30 py-12 sm:py-16">
          <div className="section-container">
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 text-start">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Eye className="h-6 w-6 text-primary" />
                    {language === "ar" ? "رؤيتنا" : "Our Vision"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {language === "ar"
                      ? "أن نكون جامعة رائدة ومتميزة في التعليم العالي والبحث العلمي على المستوى الإقليمي والدولي، وأن نساهم في بناء مجتمع المعرفة وتحقيق التنمية المستدامة."
                      : "To be a leading and distinguished university in higher education and scientific research at the regional and international levels, contributing to building a knowledge society and achieving sustainable development."}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Target className="h-6 w-6 text-primary" />
                    {language === "ar" ? "رسالتنا" : "Our Mission"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {language === "ar"
                      ? "تقديم تعليم عالٍ متميز يواكب التطورات العلمية والتقنية، وإعداد كوادر مؤهلة قادرة على المنافسة في سوق العمل، وتعزيز البحث العلمي وخدمة المجتمع."
                      : "Providing distinguished higher education that keeps pace with scientific and technological developments, preparing qualified cadres capable of competing in the labor market, and enhancing scientific research and community service."}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-12 sm:py-16">
          <div className="section-container">
            <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
              {language === "ar" ? "قيمنا" : "Our Values"}
            </h2>
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                      <value.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="mb-2 font-semibold text-foreground">
                      {language === "ar" ? value.titleAr : value.titleEn}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {language === "ar" ? value.descAr : value.descEn}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline (Our Journey) */}
        <section className="bg-muted/30 py-12 sm:py-24">
          <div className="section-container">
            <h2 className="mb-16 text-center text-3xl font-bold text-foreground">
              {language === "ar" ? "مسيرتنا" : "Our Journey"}
            </h2>

            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-primary/20 md:block" />

              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div key={index} className="relative">
                    {/* Desktop View */}
                    <div className="hidden items-center md:flex">
                      <div
                        className={`w-1/2 flex ${index % 2 === 0 ? "pe-12 justify-end" : "ps-12 justify-start order-last"}`}
                      >
                        <Card className="w-full max-w-md text-start">
                          <CardContent className="p-6">
                            <Badge variant="secondary" className="mb-2">
                              {milestone.year}
                            </Badge>
                            <h3 className="text-lg font-bold text-foreground">
                              {language === "ar"
                                ? milestone.titleAr
                                : milestone.titleEn}
                            </h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                              {language === "ar"
                                ? milestone.descAr
                                : milestone.descEn}
                            </p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Center Dot */}
                      <div className="absolute left-1/2 z-10 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full bg-primary ring-4 ring-background" />

                      <div className="w-1/2" />
                    </div>

                    {/* Mobile View */}
                    <div className="flex gap-4 md:hidden text-start">
                      <div className="flex flex-col items-center">
                        <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary" />
                        <div className="h-full w-0.5 bg-primary/20" />
                      </div>
                      <Card className="flex-1 mb-4">
                        <CardContent className="p-4">
                          <Badge variant="secondary" className="mb-2">
                            {milestone.year}
                          </Badge>
                          <h3 className="font-bold text-foreground">
                            {language === "ar"
                              ? milestone.titleAr
                              : milestone.titleEn}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {language === "ar"
                              ? milestone.descAr
                              : milestone.descEn}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Jobs CTA */}
        <section className="py-12 sm:py-24">
          <div className="section-container">
            <Card className="bg-primary/5">
              <CardContent className="flex flex-col items-center gap-4 sm:gap-6 p-6 sm:p-8 text-center md:flex-row md:text-start">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Briefcase className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground">
                    {t("about.jobs")}
                  </h3>
                  <p className="mt-1 text-muted-foreground">
                    {language === "ar"
                      ? "انضم إلى فريق عمل جامعة أنطاكية السورية وكن جزءاً من مستقبل التعليم"
                      : "Join the Antioch Syrian University team and be part of the future of education"}
                  </p>
                </div>
                <Link href="/contact" className="w-full md:w-auto">
                  <Button size="lg" className="gap-2 w-full md:w-auto">
                    {language === "ar" ? "تقدم الآن" : "Apply Now"}
                    <Arrow className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
