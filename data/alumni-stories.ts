export interface AlumniStory {
  id: string;
  nameAr: string;
  nameEn: string;
  graduationYear: number;
  programAr: string;
  programEn: string;
  currentRoleAr: string;
  currentRoleEn: string;
  companyAr: string;
  companyEn: string;
  storyAr: string;
  storyEn: string;
  image: string;
}

export const alumniStoriesByFaculty: Record<string, AlumniStory[]> = {
  engineering: [
    {
      id: "eng-a1",
      nameAr: "المهندسة رغد سلامة",
      nameEn: "Eng. Raghad Salameh",
      graduationYear: 2021,
      programAr: "هندسة الحاسوب",
      programEn: "Computer Engineering",
      currentRoleAr: "مهندسة برمجيات أولى",
      currentRoleEn: "Senior Software Engineer",
      companyAr: "أحد المراكز البحثية التقنية",
      companyEn: "A Lead Tech Research Center",
      storyAr: "بدأت رحلتي في جامعة أنطاكية السورية حيث أسست مشاريع برمجية ريادية حصلت على دعم الجامعة. أعمل حالياً على تطوير خوارزميات ذكاء اصطناعي ونظم مدمجة.",
      storyEn: "My journey started at Antioch Syrian University, where I founded programming projects supported by the university. Today, I work on developing AI algorithms and embedded systems.",
      image: "/images/alumni/alumni_female_1.png"
    },
    {
      id: "eng-a2",
      nameAr: "المهندس مجد حاصباني",
      nameEn: "Eng. Majd Hasbani",
      graduationYear: 2020,
      programAr: "الهندسة المدنية",
      programEn: "Civil Engineering",
      currentRoleAr: "مدير مشاريع إنشائية",
      currentRoleEn: "Construction Project Manager",
      companyAr: "شركة التطوير العمراني الحديث",
      companyEn: "Modern Urban Development Co.",
      storyAr: "وفرت لي المناهج التطبيقية والتدريب الميداني بالكلية المهارات اللازمة للإشراف على بناء مجمعات سكنية صديقة للبيئة ومقاومة للزلازل في المنطقة.",
      storyEn: "The applied curricula and field training at the college provided me with the skills to supervise the construction of eco-friendly and earthquake-resistant residential complexes.",
      image: "/images/alumni/alumni_male_1.png"
    }
  ],
  dentistry: [
    {
      id: "dent-a1",
      nameAr: "الدكتور أنس نحاس",
      nameEn: "Dr. Anas Nahas",
      graduationYear: 2020,
      programAr: "طب وجراحة الفم والأسنان",
      programEn: "Dentistry and Oral Surgery",
      currentRoleAr: "طبيب أسنان وأخصائي تجميل",
      currentRoleEn: "Dentist & Cosmetic Specialist",
      companyAr: "عيادات النحاس التخصصية",
      companyEn: "Nahas Specialty Dental Clinics",
      storyAr: "التدريب العملي المكثف في العيادات السريرية لجامعة أنطاكية السورية كان حجر الأساس لنجاحي المهني وتأسيس مركزي الطبي الخاص لخدمة مئات المرضى يومياً.",
      storyEn: "The intensive practical training in clinical rooms at ASU was the cornerstone of my professional success and starting my private medical clinic serving hundreds of patients.",
      image: "/images/alumni/alumni_male_2.png"
    }
  ],
  pharmacy: [
    {
      id: "pharm-a1",
      nameAr: "الدكتورة ميسون قطان",
      nameEn: "Dr. Maysoon Qattan",
      graduationYear: 2021,
      programAr: "الصيدلة الكيميائية والدوائية",
      programEn: "Pharmaceutical Sciences",
      currentRoleAr: "باحثة أولى في التطوير الدوائي",
      currentRoleEn: "Senior Drug Development Researcher",
      companyAr: "الشركة السورية للصناعات الدوائية",
      companyEn: "Syrian Pharmaceutical Industries",
      storyAr: "العمل المخبري المتقدم تحت إشراف نخبة من أساتذة الكلية فتح لي آفاق البحث العلمي. أشارك اليوم في قيادة تجارب سريرية لتطوير تركيبات علاجية جديدة.",
      storyEn: "Advanced laboratory research under the guidance of elite professors opened scientific research doors. Today, I participate in clinical trials for new therapeutics.",
      image: "/images/alumni/alumni_female_2.png"
    }
  ],
  "administrative-sciences": [
    {
      id: "admin-a1",
      nameAr: "الأستاذ خالد اليوسف",
      nameEn: "Mr. Khaled Al-Youssef",
      graduationYear: 2020,
      programAr: "إدارة الأعمال",
      programEn: "Business Administration",
      currentRoleAr: "رئيس قسم التخطيط الاستراتيجي",
      currentRoleEn: "Head of Strategic Planning",
      companyAr: "مجموعة البنك الوطني",
      companyEn: "National Banking Group",
      storyAr: "المهارات المالية والتحليلية التي اكتسبتها في كلية العلوم الإدارية مكنتني من قيادة مشاريع التحول الرقمي وإدارة المخاطر بكفاءة في القطاع المصرفي.",
      storyEn: "The financial and analytical skills I acquired in the Administrative Sciences Faculty enabled me to lead digital transformation projects and manage risks in the banking sector.",
      image: "/images/alumni/alumni_male_3.png"
    }
  ],
  law: [
    {
      id: "law-a1",
      nameAr: "المستشار باسل رضوان",
      nameEn: "Counselor Basel Radwan",
      graduationYear: 2019,
      programAr: "القانون العام والخاص",
      programEn: "Law",
      currentRoleAr: "شريك قانوني ومحامٍ دولي",
      currentRoleEn: "Legal Partner & International Lawyer",
      companyAr: "الرضوان للمحاماة والاستشارات القانونية",
      companyEn: "Radwan Law and Legal Consultations",
      storyAr: "التدريب على المرافعات والمحاكم الافتراضية أثناء الدراسة الجامعية منحني الثقة الكاملة للدفاع عن الحقوق في المحاكم وصياغة الاتفاقيات التجارية الكبرى.",
      storyEn: "Pleading training and moot courts during my studies gave me the full confidence to advocate in courts and draft major commercial agreements.",
      image: "/images/alumni/alumni_male_1.png"
    }
  ],
  arts: [
    {
      id: "arts-a1",
      nameAr: "الأستاذة لين الكوا",
      nameEn: "Ms. Leen Al-Kawa",
      graduationYear: 2021,
      programAr: "اللغة الإنكليزية والترجمة",
      programEn: "English Translation",
      currentRoleAr: "مترجمة فورية وكاتبة محتوى",
      currentRoleEn: "Simultaneous Interpreter & Content Writer",
      companyAr: "منظمات التنمية الدولية والتعاون الدولي",
      companyEn: "International Development Organizations",
      storyAr: "الدراسة المتعمقة لنظريات الترجمة والتواصل الثقافي بالكلية ساعدتني على التميز في مجال الترجمة الفورية للمؤتمرات الدولية وصياغة المقالات الصحفية.",
      storyEn: "Deep study of translation theories and cultural communication helped me stand out in simultaneous translation for international conferences.",
      image: "/images/alumni/alumni_female_3.png"
    }
  ],
  "basic-sciences": [
    {
      id: "sci-a1",
      nameAr: "الدكتور يوسف عبد الصمد",
      nameEn: "Dr. Youssef Abdul-Samad",
      graduationYear: 2020,
      programAr: "الرياضيات التطبيقية",
      programEn: "Applied Mathematics",
      currentRoleAr: "أستاذ وباحث في الإحصاء وتحليل البيانات",
      currentRoleEn: "Professor & Data Analytics Researcher",
      companyAr: "معهد البحوث الإحصائية المتقدمة",
      companyEn: "Advanced Statistical Research Institute",
      storyAr: "العلوم الأساسية هي عصب التطور التكنولوجي. تأسيسي الأكاديمي المتين في الكلية ساعدني على نشر أبحاث متميزة في التنبؤ المالي والتحليل الرقمي.",
      storyEn: "Basic sciences are the backbone of technological progress. My strong academic foundation helped me publish outstanding research in financial forecasting.",
      image: "/images/alumni/alumni_male_2.png"
    }
  ]
};

export function getAlumniStoriesByFaculty(slug: string): AlumniStory[] {
  return alumniStoriesByFaculty[slug] || [];
}
