"use client";

import { useLanguage } from "@/contexts/language-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MonitorPlay, MessageSquare, BookOpenCheck, ExternalLink, Library } from "lucide-react";

export function LibraryServices() {
  const { language, dir } = useLanguage();
  const isArabic = language === "ar";



  const services = [
    {
      icon: BookOpenCheck,
      titleAr: "استعارة وتجديد الكتب",
      titleEn: "Borrow and Renew Books",
      descAr: "إدارة استعاراتك، تجديد الكتب إلكترونياً، والاطلاع على الغرامات إن وجدت.",
      descEn: "Manage your borrowings, renew books online, and view any accumulated fines.",
    },
    {
      icon: MonitorPlay,
      titleAr: "حجز غرف الدراسة",
      titleEn: "Book Study Rooms",
      descAr: "احجز غرف دراسة هادئة أو قاعات نقاش جماعية مزودة بشاشات تفاعلية.",
      descEn: "Reserve quiet study rooms or group discussion halls equipped with interactive screens.",
    },
    {
      icon: MessageSquare,
      titleAr: "اسأل أمين المكتبة",
      titleEn: "Ask a Librarian",
      descAr: "تواصل مع خبراء المكتبة للحصول على مساعدة في أبحاثك و تحديد المراجع.",
      descEn: "Contact library experts to get help with your research and identifying references.",
    },
    {
      icon: Library,
      titleAr: "المستودع المؤسسي (DSpace)",
      titleEn: "Institutional Repository",
      descAr: "تصفح رسائل الماجستير وأبحاث وتطبيقات طلاب ومدرسي الجامعة.",
      descEn: "Browse master's theses, research, and applications by university students and teachers.",
    }
  ];

  return (
    <section className="py-16 sm:py-24">
      <div className="section-container">
        
        {/* Core Services Grid */}
        <div className="mb-20">
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              {isArabic ? "خدمات المكتبة الرقمية" : "Digital Library Services"}
            </h2>
            <p className="text-muted-foreground">
              {isArabic 
                ? "نوفر لك مجموعة شاملة من الخدمات المؤتمتة لتسهيل سير عملك الأكاديمي داخل وخارج الحرم الجامعي."
                : "We provide a comprehensive suite of automated services to facilitate your academic workflow on and off campus."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
              <Card key={index} className="border-none shadow-md bg-card/50 hover:bg-card transition-colors">
                <CardHeader className="pb-4">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{isArabic ? service.titleAr : service.titleEn}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed mb-6">
                    {isArabic ? service.descAr : service.descEn}
                  </CardDescription>
                  <Button variant="link" className="p-0 h-auto font-semibold" dir={dir}>
                    {isArabic ? "التفاصيل" : "View Details"} <ExternalLink className="mx-1 h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            )})}
          </div>
        </div>



      </div>
    </section>
  );
}
