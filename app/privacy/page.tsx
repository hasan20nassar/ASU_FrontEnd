"use client";

import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useLanguage } from "@/contexts/language-context";
import { ShieldCheck, Lock, Eye, FileText, Share2, Cookie } from "lucide-react";
import { motion } from "framer-motion";

export default function PrivacyPage() {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const sections = [
    {
      icon: ShieldCheck,
      titleAr: "مقدمة",
      titleEn: "Introduction",
      contentAr: "تلتزم جامعة أنطاكية السورية بحماية خصوصية زوار موقعها الإلكتروني وطلابها وأعضاء هيئة التدريس. توضح هذه السياسة كيفية جمع واستخدام وحماية المعلومات الشخصية التي تقدمها لنا.",
      contentEn: "Antioch Syrian University is committed to protecting the privacy of its website visitors, students, and faculty. This policy outlines how we collect, use, and protect the personal information you provide to us."
    },
    {
      icon: Eye,
      titleAr: "جمع المعلومات",
      titleEn: "Information Collection",
      contentAr: "نقوم بجمع المعلومات التي تقدمها لنا عند التسجيل في الدورات، أو ملء نماذج الاتصال، أو التفاعل مع بواباتنا الإلكترونية. يشمل ذلك الاسم، والبريد الإلكتروني، والمعلومات الأكاديمية.",
      contentEn: "We collect information you provide when registering for courses, filling out contact forms, or interacting with our portals. This includes name, email, and academic information."
    },
    {
      icon: Lock,
      titleAr: "استخدام المعلومات",
      titleEn: "Use of Information",
      contentAr: "نستخدم معلوماتك لتحسين خدماتنا التعليمية، والتواصل معك بشأن طلباتك، وتوفير تجربة مخصصة لك على منصاتنا الرقمية.",
      contentEn: "We use your information to improve our educational services, communicate with you regarding your requests, and provide a personalized experience on our digital platforms."
    },
    {
      icon: Share2,
      titleAr: "مشاركة البيانات",
      titleEn: "Data Sharing",
      contentAr: "لا نقوم ببيع أو تأجير معلوماتك الشخصية لأطراف ثالثة. قد نشارك البيانات فقط مع الجهات الرسمية أو الشركاء الأكاديميين وفقاً للقوانين والأنظمة المعمول بها.",
      contentEn: "We do not sell or rent your personal information to third parties. We may only share data with official authorities or academic partners in accordance with applicable laws and regulations."
    },
    {
      icon: Cookie,
      titleAr: "ملفات التعريف (Cookies)",
      titleEn: "Cookies",
      contentAr: "يستخدم موقعنا ملفات التعريف لتحسين أداء الموقع وتحليل حركة الزوار. يمكنك التحكم في إعدادات ملفات التعريف من خلال متصفحك.",
      contentEn: "Our website uses cookies to enhance performance and analyze visitor traffic. You can control cookie settings through your browser."
    },
    {
      icon: FileText,
      titleAr: "حقوقك",
      titleEn: "Your Rights",
      contentAr: "لديك الحق في الوصول إلى معلوماتك الشخصية التي نحتفظ بها، وطلب تصحيحها أو حذفها في حالات معينة وفقاً لسياسات الجامعة.",
      contentEn: "You have the right to access the personal information we hold about you, and request its correction or deletion in certain cases according to university policies."
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Simple Hero */}
        <section className="bg-primary/5 py-12 sm:py-20 border-b">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              {isArabic ? "سياسة الخصوصية" : "Privacy Policy"}
            </h1>
            <p className="mt-4 text-muted-foreground italic">
              {isArabic ? "آخر تحديث: مارس 2024" : "Last Updated: March 2024"}
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 sm:py-20 px-4">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-12 text-start">
              {sections.map((section, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <section.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-3">
                      {isArabic ? section.titleAr : section.titleEn}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {isArabic ? section.contentAr : section.contentEn}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Support Box */}
            <div className="mt-20 rounded-2xl bg-muted/50 p-8 text-center sm:p-12">
              <h3 className="text-xl font-semibold mb-4">
                {isArabic ? "هل لديك استفسارات؟" : "Have Questions?"}
              </h3>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                {isArabic 
                  ? "إذا كان لديك أي أسئلة حول سياسة الخصوصية الخاصة بنا، فلا تتردد في التواصل مع فريق تكنولوجيا المعلومات بالجامعة."
                  : "If you have any questions about our privacy policy, please feel free to reach out to the University's IT team."}
              </p>
              <div className="flex justify-center gap-4">
                <span className="font-bold text-primary">privacy@asu.edu.sy</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
