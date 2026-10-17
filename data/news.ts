export interface NewsArticle {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  excerptAr: string;
  excerptEn: string;
  contentAr: string;
  contentEn: string;
  image: string;
  category: "announcement" | "event" | "achievement" | "research";
  date: string;
  featured: boolean;
}

export interface Event {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  date: string;
  time: string;
  location: {
    ar: string;
    en: string;
  };
  type: "academic" | "cultural" | "sports" | "career";
}

export const newsArticles: NewsArticle[] = [
  {
    id: "1",
    slug: "registration-steps-2025-2026",
    titleAr: "خطوات التسجيل للمقبولين وفق مفاضلات الفصل الأول 2025-2026",
    titleEn: "Registration Steps for Admitted Students Fall 2025-2026",
    excerptAr: "دليل شامل لطلابنا المقبولين حول إجراءات التسجيل للفصل الدراسي الأول",
    excerptEn: "Comprehensive guide for admitted students on registration procedures for the first semester",
    contentAr: "أعلنت جامعة أنطاكية السورية عن خطوات التسجيل للطلاب المقبولين وفق مفاضلات الفصل الأول للعام الدراسي 2025-2026. تتضمن الخطوات مراجعة شؤون الطلاب واستكمال الأوراق المطلوبة.",
    contentEn: "Antioch Syrian University announced the registration steps for students admitted according to the first semester competitions for the academic year 2025-2026. Steps include visiting student affairs and completing the required documents.",
    image: "/images/news/registration.png",
    category: "announcement",
    date: "2025-11-18",
    featured: true,
  },
  {
    id: "2",
    slug: "required-documents-2025-2026",
    titleAr: "الوثائق المطلوبة للتسجيل في الجامعة 2025-2026",
    titleEn: "Required Documents for University Registration 2025-2026",
    excerptAr: "قائمة الأوراق والوثائق الرسمية المطلوبة لإتمام عملية التسجيل الجامعي",
    excerptEn: "List of official papers and documents required to complete the university registration process",
    contentAr: "حددت الجامعة الوثائق المطلوبة للتسجيل للعام الدراسي 2025-2026، بما في ذلك الشهادات الثانوية الأصلية وصور الهوية وصور الشخصية.",
    contentEn: "The university has specified the documents required for registration for the academic year 2025-2026, including original secondary school certificates, ID copies, and personal photos.",
    image: "/images/news/docs.png",
    category: "announcement",
    date: "2025-11-18",
    featured: true,
  },
  {
    id: "3",
    slug: "architecture-field-trip",
    titleAr: "رحلة ميدانية لطلاب كلية العمارة",
    titleEn: "Field Trip for Architecture Students",
    excerptAr: "طلاب كلية العمارة في رحلة ميدانية لزيارة المواقع الأثرية والتاريخية",
    excerptEn: "Architecture students on a field trip to visit archaeological and historical sites",
    contentAr: "نظمت كلية العمارة رحلة ميدانية لطلابها كجزء من المنهج العملي لاستكشاف التصاميم المعمارية والمواقع التاريخية.",
    contentEn: "The Faculty of Architecture organized a field trip for its students as part of the practical curriculum to explore architectural designs and historical sites.",
    image: "/images/news/trip.png",
    category: "event",
    date: "2025-11-07",
    featured: false,
  },
  {
    id: "4",
    slug: "dentistry-faculty-info",
    titleAr: "كلية طب الأسنان - جامعة أنطاكية السورية الخاصة",
    titleEn: "Faculty of Dentistry - Antioch Syrian Private University",
    excerptAr: "نظرة عامة على البرامج التدريبية والعيادات السنية في كلية طب الأسنان",
    excerptEn: "Overview of training programs and dental clinics at the Faculty of Dentistry",
    contentAr: "تواصل كلية طب الأسنان تقديم أفضل مستويات التدريب السريري لطلابها في العيادات التابعة للجامعة.",
    contentEn: "The Faculty of Dentistry continues to provide the best levels of clinical training for its students in the university's clinics.",
    image: "/images/news/dentistry.png",
    category: "achievement",
    date: "2025-11-05",
    featured: false,
  },
  {
    id: "5",
    slug: "academic-scholarships-2025-2026",
    titleAr: "منح التفوق الأكاديمي لعام 2025-2026",
    titleEn: "Academic Excellence Scholarships 2025-2026",
    excerptAr: "الجامعة تعلن عن تقديم منح دراسية كاملة وجزئية للطلاب المتفوقين أكاديمياً",
    excerptEn: "The university announces full and partial scholarships for academically outstanding students",
    contentAr: "أعلنت جامعة أنطاكية السورية عن تقديم منح دراسية كاملة وجزئية للطلاب المتفوقين أكاديمياً للفصل الدراسي الأول من العام الدراسي 2025-2026. تهدف هذه الخطوة لتشجيع التميز والابتكار العلمي.",
    contentEn: "Antioch Syrian University announced full and partial scholarships for academically outstanding students for the first semester of the academic year 2025-2026. This step aims to encourage excellence and scientific innovation.",
    image: "/images/news/docs.png",
    category: "announcement",
    date: "2025-11-15",
    featured: true,
  },
  {
    id: "6",
    slug: "it-faculty-seminar",
    titleAr: "ندوة علمية حول تطبيقات الذكاء الاصطناعي في التعليم",
    titleEn: "Scientific Seminar on AI Applications in Education",
    excerptAr: "كلية العلوم الإدارية ونظم المعلومات تنظم ندوة حول دور الذكاء الاصطناعي",
    excerptEn: "Faculty of Administrative Sciences & IT organizes a seminar on AI's role",
    contentAr: "نظمت كلية العلوم الإدارية ونظم المعلومات ندوة علمية حول تطبيقات الذكاء الاصطناعي في التعليم، وشارك فيها نخبة من الأكاديميين والمهتمين.",
    contentEn: "The Faculty of Administrative Sciences & IT organized a scientific seminar on AI applications in education, with participation from elite academics and researchers.",
    image: "/images/news/trip.png",
    category: "research",
    date: "2025-11-10",
    featured: true,
  },
];


export const events: Event[] = [
  {
    id: "1",
    titleAr: "يوم التوظيف السنوي",
    titleEn: "Annual Career Fair",
    descriptionAr: "فرصة للطلاب والخريجين للتواصل مع أصحاب العمل",
    descriptionEn: "Opportunity for students and graduates to connect with employers",
    date: "2024-10-15",
    time: "09:00",
    location: {
      ar: "قاعة المؤتمرات الرئيسية",
      en: "Main Conference Hall",
    },
    type: "career",
  },
  {
    id: "2",
    titleAr: "ورشة عمل: مهارات البحث العلمي",
    titleEn: "Workshop: Scientific Research Skills",
    descriptionAr: "ورشة تدريبية للطلاب حول منهجية البحث العلمي",
    descriptionEn: "Training workshop for students on scientific research methodology",
    date: "2024-10-20",
    time: "14:00",
    location: {
      ar: "كلية العلوم الأساسية",
      en: "Faculty of Basic Sciences",
    },
    type: "academic",
  },
  {
    id: "3",
    titleAr: "البطولة الرياضية بين الكليات",
    titleEn: "Inter-Faculty Sports Championship",
    descriptionAr: "منافسات رياضية متنوعة بين كليات الجامعة",
    descriptionEn: "Various sports competitions between university faculties",
    date: "2024-11-01",
    time: "10:00",
    location: {
      ar: "الملاعب الرياضية",
      en: "Sports Fields",
    },
    type: "sports",
  },
];

export function getFeaturedNews(): NewsArticle[] {
  return newsArticles.filter((article) => article.featured);
}

export function getNewsByCategory(category: NewsArticle["category"]): NewsArticle[] {
  return newsArticles.filter((article) => article.category === category);
}

export function getArticleBySlug(slug: string): NewsArticle | undefined {
  return newsArticles.find((article) => article.slug === slug);
}

export function getUpcomingEvents(): Event[] {
  const now = new Date();
  return events
    .filter((event) => new Date(event.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
