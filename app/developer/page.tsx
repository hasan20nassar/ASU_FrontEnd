"use client";

import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useLanguage } from "@/contexts/language-context";
import {
  Code2,
  ShieldCheck,
  Mail,
  Laptop,
  User,
  Users,
  Zap,
  Building2,
} from "lucide-react";
import { motion } from "framer-motion";

export default function DeveloperPage() {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const services = [
    {
      icon: Code2,
      titleAr: "تطوير واجهات المستخدم التفاعلية",
      titleEn: "Interactive UI/UX Development",
      contentAr:
        "تصميم وبناء واجهات مستخدم حديثة وجذابة تدعم الهوية البصرية للجامعة، مع دعم كامل للغتين العربية والإنجليزية والتصميم المتجاوب.",
      contentEn:
        "Designing and building modern, appealing user interfaces that support the university's visual identity, with full Arabic & English support and responsive layout.",
    },
    {
      icon: Zap,
      titleAr: "الأداء والسرعة",
      titleEn: "Performance & Speed Optimization",
      contentAr:
        "بناء الهيكل البرمجي للموقع وتطويره لضمان سرعة تحميل فائقة وتجربة تصفح سلسة ومثالية للمستخدمين على جميع الأجهزة.",
      contentEn:
        "Constructing the website's backend and frontend architectures to ensure lightning-fast page loads and a smooth, optimal user experience across all devices.",
    },
    {
      icon: ShieldCheck,
      titleAr: "أمن البيانات",
      titleEn: "Data Security",
      contentAr:
        "تطبيق معايير أمان متقدمة لحماية بيانات الزوار وضمان خصوصيتها، وحماية المنصات الرقمية من التهديدات السيبرانية.",
      contentEn:
        "Implementing advanced security standards to safeguard visitor data, ensure privacy, and protect digital platforms from cyber threats.",
    },
    {
      icon: Laptop,
      titleAr: "التوافق والتجاوب",
      titleEn: "Responsive Compatibility",
      contentAr:
        "ضمان عمل الموقع بكفاءة واستقرار على جميع متصفحات الإنترنت وشاشات الهواتف المحمولة والأجهزة اللوحية والحواسيب.",
      contentEn:
        "Ensuring the website operates efficiently and stably across all web browsers, smartphones, tablets, and desktop displays.",
    },
  ];


  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-primary/5 py-16 sm:py-24 border-b">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 opacity-30" />
          <div className="relative mx-auto max-w-4xl px-4 text-center">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl"
            >
              {isArabic ? "الجهة المطورة" : "Developing Entity"}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-4 text-lg font-semibold text-primary sm:text-xl"
            >
              {isArabic
                ? "شراكة تطويرية متميزة"
                : "A Distinctive Development Partnership"}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-6 text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto"
            >
              {isArabic
                ? "تم تطوير هذا الموقع الإلكتروني  لجامعة أنطاكية السورية كجهد مشترك وتعاون تقني بين مطور البرمجيات المستقل محمد حسن ياسين نصار وقسم تقانة المعلومات في الجامعة، لتقديم حل رقمي متكامل يعكس تميز الجامعة."
                : "This website was developed for Antioch Syrian University as a collaborative technical effort between independent software developer Mohammad Hasan Yasin Nassar and the university's Directorate of Information Technology & Communications (ICTD), delivering an integrated digital solution that reflects the university's excellence."}
            </motion.p>
          </div>
        </section>

        {/* Collaboration Profiles */}
        <section className="py-16 px-4">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Profile 1: Muhammad Hasan Yasin Nassar */}
              <motion.div
                initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center text-center p-8 rounded-2xl border bg-card hover:shadow-md transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6 border border-primary/20">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-1">
                  {isArabic
                    ? "محمد حسن ياسين نصار"
                    : "Mohammad Hasan Yasin Nassar"}
                </h3>
                <p className="text-sm text-primary font-medium mb-4">
                  {isArabic
                    ? "مطور برمجيات مستقل"
                    : "Independent Software Developer"}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {isArabic
                    ? "تولى مسؤولية هندسة وبناء وتطوير البنية البرمجية الأمامية والخلفية للموقع، وتصميم تجربة المستخدم التفاعلية، والتأكد من مطابقة الموقع لأحدث المعايير التقنية العالمية."
                    : "Responsible for engineering, building, and developing the frontend & backend architectures of the website, designing the interactive user experience, and ensuring compliance with the latest global technical standards."}
                </p>
              </motion.div>

              {/* Profile 2: IT Directorate */}
              <motion.div
                initial={{ opacity: 0, x: isArabic ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center text-center p-8 rounded-2xl border bg-card hover:shadow-md transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6 border border-primary/20">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-1">
                  {isArabic
                    ? "قسم تقانة ا لمعلومات"
                    : "Directorate of Information Technology"}
                </h3>
                <p className="text-sm text-primary font-medium mb-4">
                  {isArabic
                    ? "جامعة أنطاكية السورية"
                    : "Antioch Syrian University (ICTD)"}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {isArabic
                    ? "أشرف على إدارة متطلبات المشروع، وتوفير البيانات والبنية التحتية للخوادم والشبكات، بالإضافة إلى تقديم الدعم التنظيمي والتقني المستمر لضمان إطلاق متميز وبوابة مستدامة."
                    : "Supervised project requirements, provided server and network infrastructures, and offered continuous organizational and technical support to ensure a premium launch and a sustainable portal."}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services / Contributions Section */}
        <section className="py-16 sm:py-24 bg-muted/20 border-t px-4">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-2xl font-bold sm:text-3xl text-foreground">
                {isArabic
                  ? "مساهماتنا الأساسية في المشروع"
                  : "Our Core Contributions"}
              </h2>
              <div className="mt-2 h-1 w-16 bg-primary mx-auto rounded-full" />
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex gap-5 p-6 rounded-2xl border bg-card hover:shadow-md transition-all duration-300"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {isArabic ? service.titleAr : service.titleEn}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {isArabic ? service.contentAr : service.contentEn}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>


        {/* Contact Section */}
        <section className="py-16 sm:py-24 px-4">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold sm:text-3xl text-foreground">
                {isArabic ? "تواصل معنا" : "Get In Touch"}
              </h2>
              <div className="mt-2 h-1 w-16 bg-primary mx-auto rounded-full" />
            </div>

            <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
              {/* Contact Developer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center flex flex-col justify-between"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-foreground">
                    {isArabic
                      ? "مطور البرمجيات المستقل"
                      : "Independent Software Developer"}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                    {isArabic
                      ? "للاستفسارات التقنية المباشرة، أو الأسئلة المتعلقة ببناء وهندسة الكود المصدري للموقع."
                      : "For direct technical inquiries or questions related to the website's source code architecture."}
                  </p>
                </div>
                <div className="inline-flex items-center justify-center gap-2 rounded-xl bg-background border px-4 py-2 text-sm font-semibold text-primary shadow-sm hover:border-primary/45 transition-colors w-fit mx-auto">
                  <a
                    href="mailto:hasan.25.nassar@gamil.com"
                    className="hover:underline"
                  >
                    hasan.25.nassar@gamil.com
                  </a>
                </div>
              </motion.div>

              {/* Contact IT Directorate */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center flex flex-col justify-between"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-foreground">
                    {isArabic
                      ? "قسم تقانة المعلومات"
                      : "Department of Information Technology"}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                    {isArabic
                      ? "للاستفسارات الرسمية المتعلقة بخدمات الجامعة الرقمية، أو الإبلاغ عن مشاكل تقنية عامة."
                      : "For official inquiries regarding the university's digital services or reporting general technical issues."}
                  </p>
                </div>
                <div className="inline-flex items-center justify-center gap-2 rounded-xl bg-background border px-4 py-2 text-sm font-semibold text-primary shadow-sm hover:border-primary/45 transition-colors w-fit mx-auto">
                  <a href="mailto:ictd@asu.edu.sy" className="hover:underline">
                    ictd@asu.edu.sy
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
