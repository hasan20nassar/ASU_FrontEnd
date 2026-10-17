"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "ar" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: "rtl" | "ltr";
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Navigation
    "nav.home": "الرئيسية",
    "nav.about": "عن الجامعة",
    "nav.academics": "الكليات",
    "nav.admissions": "القبول والتسجيل",
    "nav.campusLife": "الحياة الجامعية",
    "nav.research": "البحث العلمي",
    "nav.news": "الأخبار",
    "nav.contact": "اتصل بنا",
    "nav.portals": "البوابات",
    "nav.facultyPortal": "بوابة أعضاء هيئة التدريس",
    "nav.alumniPortal": "بوابة الخريجين",
    "nav.studentPortal": "بوابة الطلاب",
    "nav.dashboard": "لوحة التحكم",
    "nav.accountSettings": "إعدادات الحساب",
    "nav.directory": "دليل أعضاء هيئة التدريس",
    "nav.directory.description": "تعرّف على نخبة الأساتذة والباحثين في جامعة أنطاكية السورية. يمكنك البحث والتواصل المباشر مع أعضاء الهيئة التدريسية ومعرفة مجالات تخصصهم وأوقات الساعات المكتبية.",
    "nav.map": "خريطة الجامعة",
    "nav.logout": "تسجيل الخروج",

    // Hero
    "hero.title": "جامعة أنطاكية السورية",
    "hero.subtitle": "تأسست عام 2017",
    "hero.description": "مفتاح مستقبلكم",
    "hero.cta.admissions": "التقديم الآن",
    "hero.cta.explore": "استكشاف الكليات",

    // Stats
    "stats.faculties": "كلية",
    "stats.system": "نظام الساعات المعتمدة",
    "stats.campus": "حرم معرة صيدنايا",
    "stats.students": "طالب",

    // Faculties
    "faculty.engineering": "كلية الهندسة",
    "faculty.engineering.civil": "الهندسة المدنية",
    "faculty.engineering.architecture": "الهندسة المعمارية",
    "faculty.engineering.computer": "هندسة الحاسوب والاتصالات",
    "faculty.dentistry": "كلية طب الأسنان",
    "faculty.pharmacy": "كلية الصيدلة",
    "faculty.admin": "كلية العلوم الإدارية والاقتصادية",
    "faculty.admin.business": "إدارة الأعمال",
    "faculty.admin.marketing": "التسويق",
    "faculty.admin.it": "نظم المعلومات",
    "faculty.law": "كلية الحقوق",
    "faculty.arts": "كلية الآداب والعلوم الإنسانية",
    "faculty.arts.english": "اللغة الإنجليزية",
    "faculty.arts.translation": "الترجمة",
    "faculty.science": "كلية العلوم الأساسية",

    // About
    "about.history": "لمحة عن الجامعة",
    "about.historyText": "تأسست جامعة أنطاكية السورية الخاصة بموجب المرسوم رقم /233/ لعام 2017، وتم الافتتاح في أيلول 2018 في معرة صيدنايا بريف دمشق لتكون رافداً لمنظومة التعليم العالي في سورية وتساهم في التنمية البشرية والاقتصادية والاجتماعية.",
    "about.affiliation": "الانتساب",
    "about.affiliationText": "تابعة للبطريركية الأرثوذكسية الأنطاكية وسائر المشرق",
    "about.location": "الموقع",
    "about.locationText": "معرة صيدنايا، ريف دمشق",
    "about.jobs": "الوظائف الشاغرة",

    // Admissions
    "admissions.requirements": "شروط القبول",
    "admissions.tuition": "الرسوم الدراسية",
    "admissions.scholarships": "المنح الدراسية",
    "admissions.scholarshipText": "5% منح كاملة لوزارة التعليم العالي وخصومات التفوق الأكاديمي",
    "admissions.syrian": "سوريون",
    "admissions.nonResident": "غير مقيمين",
    "admissions.perHour": "/ساعة",

    // Contact
    "contact.title": "تواصل معنا",
    "contact.phone": "الهاتف",
    "contact.email": "البريد الإلكتروني",
    "contact.address": "العنوان",
    "contact.name": "الاسم الكامل",
    "contact.subject": "موضوع الرسالة",
    "contact.message": "رسالتك",
    "contact.send": "إرسال الرسالة",
    "contact.form.name": "الاسم",
    "contact.form.email": "البريد الإلكتروني",
    "contact.form.message": "الرسالة",
    "contact.form.submit": "إرسال",

    // Footer
    "footer.rights": "جميع الحقوق محفوظة",
    "footer.quickLinks": "روابط سريعة",
    "footer.followUs": "تابعنا",
    "footer.developer": "الجهة المطورة",

    // Common
    "common.learnMore": "اقرأ المزيد",
    "common.viewAll": "عرض الكل",
    "common.creditHours": "ساعة معتمدة",
    "common.minScore": "الحد الأدنى للدرجات",
    "common.curriculum": "الخطة الدراسية",
    "common.fees": "الرسوم",
    "common.admission": "القبول",

    // Program Finder
    "programs.title": "مستكشف التخصصات",
    "programs.description": "استكشف مجموعة واسعة من البرامج الأكاديمية التي تقدمها كليات جامعة أنطاكية السورية. يمكنك البحث والتصفية للعثور على التخصص الذي يناسب طموحاتك وميولك.",
    "programs.filter": "تصفية البرامج",
    "programs.clear": "مسح",
    "programs.searchLabel": "بحث بالاسم",
    "programs.searchPlaceholder": "مثال: هندسة...",
    "programs.facultyLabel": "الكلية",
    "programs.allFaculties": "جميع الكليات",
    "programs.branchLabel": "الفرع الثانوي المطلوب",
    "programs.allBranches": "جميع الفروع",
    "programs.found": "تم العثور على",
    "programs.programFound": "برنامج أكاديمي",
    "programs.noPrograms": "لم يتم العثور على برامج",
    "programs.noProgramsDesc": "حاول تعديل كلمات البحث أو تغيير الفلاتر للحصول على نتائج أفضل.",
    "programs.clearAll": "مسح جميع الفلاتر",
    "programs.minScore": "الحد الأدنى للقبول",
    "programs.details": "التفاصيل",
    "programs.years": "سنوات",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.about": "About",
    "nav.academics": "Academics",
    "nav.admissions": "Admissions",
    "nav.campusLife": "Campus Life",
    "nav.research": "Research",
    "nav.news": "News",
    "nav.contact": "Contact",
    "nav.portals": "Portals",
    "nav.facultyPortal": "Faculty Portal",
    "nav.alumniPortal": "Alumni Portal",
    "nav.studentPortal": "Student Portal",
    "nav.dashboard": "Dashboard",
    "nav.accountSettings": "Account Settings",
    "nav.directory": "Faculty Directory",
    "nav.directory.description": "Meet our distinguished faculty members and researchers at Antioch Syrian University. You can search, contact them directly, and find their areas of expertise and office hours.",
    "nav.map": "Campus Map",
    "nav.logout": "Logout",

    // Hero
    "hero.title": "Antioch Syrian University",
    "hero.subtitle": "Established 2017",
    "hero.description": "Your Key to the Future",
    "hero.cta.admissions": "Apply Now",
    "hero.cta.explore": "Explore Faculties",

    // Stats
    "stats.faculties": "Faculties",
    "stats.system": "Credit Hour System",
    "stats.campus": "Maarat Saidnaya Campus",
    "stats.students": "Students",

    // Faculties
    "faculty.engineering": "Faculty of Engineering",
    "faculty.engineering.civil": "Civil Engineering",
    "faculty.engineering.architecture": "Architecture",
    "faculty.engineering.computer": "Computer & Communications",
    "faculty.dentistry": "Faculty of Dentistry",
    "faculty.pharmacy": "Faculty of Pharmacy",
    "faculty.admin": "Faculty of Administrative and Economic Sciences",
    "faculty.admin.business": "Business Administration",
    "faculty.admin.marketing": "Marketing",
    "faculty.admin.it": "Information Technology",
    "faculty.law": "Faculty of Law",
    "faculty.arts": "Faculty of Arts and Humanities",
    "faculty.arts.english": "English Language",
    "faculty.arts.translation": "Translation",
    "faculty.science": "Faculty of Basic Sciences",

    // About
    "about.history": "University Overview",
    "about.historyText": "Antioch Syrian Private University was established by Decree No. /233/ of 2017, and opened in September 2018 in Maarat Saidnaya, Damascus Countryside, to be a contributor to the higher education system in Syria and participate in human, economic, and social development.",
    "about.affiliation": "Affiliation",
    "about.affiliationText": "Affiliated with the Greek Orthodox Patriarchate of Antioch and All the East",
    "about.location": "Location",
    "about.locationText": "Maarat Saidnaya, Damascus Countryside",
    "about.jobs": "Job Opportunities",

    // Admissions
    "admissions.requirements": "Admission Requirements",
    "admissions.tuition": "Tuition Fees",
    "admissions.scholarships": "Scholarships",
    "admissions.scholarshipText": "5% Full Scholarships for Ministry of Higher Education and Academic Excellence Discounts",
    "admissions.syrian": "Syrians",
    "admissions.nonResident": "Non-Residents",
    "admissions.perHour": "/hour",

    // Contact
    "contact.title": "Contact Us",
    "contact.phone": "Phone",
    "contact.email": "Email",
    "contact.address": "Address",
    "contact.name": "Full Name",
    "contact.subject": "Subject",
    "contact.message": "Message",
    "contact.send": "Send Message",
    "contact.form.name": "Name",
    "contact.form.email": "Email",
    "contact.form.message": "Message",
    "contact.form.submit": "Submit",

    // Footer
    "footer.rights": "All Rights Reserved",
    "footer.quickLinks": "Quick Links",
    "footer.followUs": "Follow Us",
    "footer.developer": "Developer",

    // Common
    "common.learnMore": "Learn More",
    "common.viewAll": "View All",
    "common.creditHours": "Credit Hours",
    "common.minScore": "Minimum Score",
    "common.curriculum": "Curriculum",
    "common.fees": "Fees",
    "common.admission": "Admission",

    // Program Finder
    "programs.title": "Program Finder",
    "programs.description": "Explore a wide range of academic programs offered by the faculties of Antioch Syrian University. You can search and filter to find the specialty that suits your ambitions and interests.",
    "programs.filter": "Filter Programs",
    "programs.clear": "Clear",
    "programs.searchLabel": "Search by name",
    "programs.searchPlaceholder": "e.g. Engineering...",
    "programs.facultyLabel": "Faculty",
    "programs.allFaculties": "All Faculties",
    "programs.branchLabel": "Required High School Branch",
    "programs.allBranches": "All Branches",
    "programs.found": "Found",
    "programs.programFound": "academic programs",
    "programs.noPrograms": "No programs found",
    "programs.noProgramsDesc": "Try adjusting your search terms or filters to get better results.",
    "programs.clearAll": "Clear all filters",
    "programs.minScore": "Min. Score",
    "programs.details": "Details",
    "programs.years": "Years",
  },
};

import { DirectionProvider } from "@radix-ui/react-direction";

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ar");

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("asu-language", lang);
    }
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem("asu-language") as Language;
    if (savedLanguage && (savedLanguage === "ar" || savedLanguage === "en")) {
      Promise.resolve().then(() => setLanguageState(savedLanguage));
    } else if (typeof navigator !== "undefined") {
      // Auto-detect browser language
      const browserLang = navigator.language || navigator.languages?.[0] || "";
      if (browserLang.toLowerCase().startsWith("en")) {
        Promise.resolve().then(() => setLanguageState("en"));
      } else {
        Promise.resolve().then(() => setLanguageState("ar")); // Default fallback
      }
    }
  }, []);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      <DirectionProvider dir={dir}>
        {children}
      </DirectionProvider>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: "ar" as const,
      setLanguage: () => { },
      t: (key: string) => key,
      dir: "rtl" as const,
    };
  }
  return context;
}