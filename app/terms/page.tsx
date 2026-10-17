"use client";

import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useLanguage } from "@/contexts/language-context";
import { FileText, UserCheck, ShieldOff, Server, AlertCircle, Scale } from "lucide-react";
import { motion } from "framer-motion";

export default function TermsPage() {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const terms = [
    {
      icon: Scale,
      titleAr: "قبول الشروط",
      titleEn: "Acceptance of Terms",
      contentAr: "باستخدامك لموقع جامعة أنطاكية السورية، فإنك تقبل وتوافق على الالتزام بهذه الشروط والأحكام بالكامل. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدامه.",
      contentEn: "By using the Antioch Syrian University website, you accept and agree to be bound by these Terms and Conditions in full. If you disagree with any part of these terms, please do not use it."
    },
    {
      icon: UserCheck,
      titleAr: "الاستخدام المسموح به",
      titleEn: "Permissible Use",
      contentAr: "يُسمح باستخدام الموقع لأغراض تعليمية وإعلامية فقط. يُحظر تماماً استخدام الموقع بطرق تضر بالنظام أو تسبب أضراراً للأمن السيبراني للجامعة.",
      contentEn: "The website is permitted for educational and informational purposes only. Using the site in ways that damage the system or cause harm to the university's cybersecurity is strictly prohibited."
    },
    {
      icon: ShieldOff,
      titleAr: "حقوق الملكية الفكرية",
      titleEn: "Intellectual Property Rights",
      contentAr: "جميع المواد والمحتويات المتوفرة على هذا الموقع هي ملك حصري لجامعة أنطاكية السورية أو مرخصة لها. لا يجوز إعادة إنتاج أو توزيع أي محتوى دون إذن كتابي مسبق.",
      contentEn: "All materials and content available on this website are the exclusive property of Antioch Syrian University or licensed to it. No content may be reproduced or distributed without prior written permission."
    },
    {
      icon: Server,
      titleAr: "التوفر والدقة",
      titleEn: "Availability & Accuracy",
      contentAr: "نسعى لضمان دقة وتوفر المعلومات بانتظام، ولكن الجامعة غير مسؤولة عن أي أخطاء أو انقطاع مفاجئ في الخدمات الرقمية.",
      contentEn: "We strive to ensure the regular accuracy and availability of information, but the university is not responsible for any errors or sudden interruptions in digital services."
    },
    {
      icon: AlertCircle,
      titleAr: "إخلاء المسؤولية",
      titleEn: "Disclaimer",
      contentAr: "المعلومات المتوفرة على الموقع مقدمة كما هي. الجامعة تخلي مسؤوليتها من أي استخدام خاطئ للمعلومات الموجودة أو الأضرار الناتجة عن الروابط الخارجية.",
      contentEn: "The information provided on the website is as is. The university disclaims responsibility for any misuse of the information or damages resulting from external links."
    },
    {
      icon: FileText,
      titleAr: "التعديلات",
      titleEn: "Amendments",
      contentAr: "تحتفظ جامعة أنطاكية السورية بالحق في تعديل هذه الشروط في أي وقت. سيتم نشر التغييرات على هذه الصفحة مباشرة.",
      contentEn: "Antioch Syrian University reserves the right to amend these terms at any time. Changes will be posted directly on this page."
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
              {isArabic ? "الشروط والأحكام" : "Terms and Conditions"}
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
              {terms.map((term, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <term.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-3">
                      {isArabic ? term.titleAr : term.titleEn}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {isArabic ? term.contentAr : term.contentEn}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Jurisdiction Notice */}
            <div className="mt-20 border border-primary/20 rounded-2xl bg-primary/5 p-8 text-center sm:p-12">
              <h3 className="text-xl font-semibold mb-4">
                {isArabic ? "القانون الواجب التطبيق" : "Governing Law"}
              </h3>
              <p className="text-muted-foreground mx-auto max-w-xl">
                {isArabic 
                  ? "تخضع هذه الشروط والأحكام وتفسر وفقاً لقوانين الجمهورية العربية السورية. أي نزاعات تنشأ تخضع حصرياً لاختصاص المحاكم السورية المعنية."
                  : "These terms and conditions are governed by and construed in accordance with the laws of the Syrian Arab Republic. Any disputes arising shall be subject exclusively to the jurisdiction of the relevant Syrian courts."}
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
