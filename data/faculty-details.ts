export interface FacultyActivity {
  id: string;
  titleAr: string;
  titleEn: string;
  date: string;
  descriptionAr: string;
  descriptionEn: string;
  image: string;
}

export interface BoardMember {
  id: string;
  nameAr: string;
  nameEn: string;
  roleAr: string;
  roleEn: string;
  image: string;
}

export interface FacultyDepartment {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  headAr: string;
  headEn: string;
}

export interface Course {
  code: string;
  nameAr: string;
  nameEn: string;
  credits: number;
  descriptionAr?: string;
  descriptionEn?: string;
}

export interface StudyYear {
  yearAr: string;
  yearEn: string;
  courses: Course[];
}

export interface ResearchProject {
  id: string;
  titleAr: string;
  titleEn: string;
  authorsAr: string;
  authorsEn: string;
  year: string;
  journalAr: string;
  journalEn: string;
}

export interface FacultyDetails {
  facultySlug: string;
  deanWordAr: string;
  deanWordEn: string;
  activities: FacultyActivity[];
  board: BoardMember[];
  departments: FacultyDepartment[];
  studyPlan: StudyYear[];
  research: ResearchProject[];
}

export const facultyDetails: Record<string, FacultyDetails> = {
  engineering: {
    facultySlug: "engineering",
    deanWordAr: "ترحب بكم كلية الهندسة في جامعة انطاكية السورية الخاصة، حيث نسعى للتميز في التعليم الهندسي والبحث العلمي والابتكار.",
    deanWordEn: "The Faculty of Engineering at ASU welcomes you. We strive for excellence in engineering education, scientific research, and innovation.",
    activities: [
      {
        id: "1",
        titleAr: "ورشة عمل حول الذكاء الاصطناعي",
        titleEn: "AI Workshop",
        date: "2024-03-15",
        descriptionAr: "ورشة عمل متقدمة تناولت تطبيقات الذكاء الاصطناعي في الهندسة المدنية والمعمارية.",
        descriptionEn: "Advanced workshop on AI applications in Civil and Architectural Engineering.",
        image: "/images/activities/eng_1.png"
      },
      {
        id: "2",
        titleAr: "مسابقة البرمجة لطلاب الكلية",
        titleEn: "Faculty Programming Contest",
        date: "2024-02-10",
        descriptionAr: "مسابقة سنوية تهدف لتطوير المهارات البرمجية لطلاب قسم هندسة الحاسوب.",
        descriptionEn: "Annual contest aiming to develop programming skills for Computer Engineering students.",
        image: "/images/activities/eng_2.png"
      }
    ],
    board: [
      {
        id: "b1",
        nameAr: "أ.د. أحمد خليل",
        nameEn: "Prof. Ahmed Khalil",
        roleAr: "عميد الكلية",
        roleEn: "Dean",
        image: "/images/faculty/prof_male_1.png"
      },
      {
        id: "b2",
        nameAr: "د. ريم محمود",
        nameEn: "Dr. Reem Mahmoud",
        roleAr: "نائب العميد للشؤون العلمية",
        roleEn: "Vice Dean for Scientific Affairs",
        image: "/images/faculty/prof_female_1.png"
      }
    ],
    departments: [
      {
        id: "d1",
        nameAr: "قسم الهندسة المدنية",
        nameEn: "Department of Civil Engineering",
        descriptionAr: "يركز على البناء وإدارة المشاريع والري والموارد المائية.",
        descriptionEn: "Focuses on construction, project management, irrigation, and water resources.",
        headAr: "د. باسل العلي",
        headEn: "Dr. Basel Al-Ali"
      },
      {
        id: "d2",
        nameAr: "قسم الهندسة المعمارية",
        nameEn: "Department of Architecture",
        descriptionAr: "عمارة مستدامة، تصميم داخلي، وتخطيط مدن.",
        descriptionEn: "Sustainable architecture, interior design, and urban planning.",
        headAr: "د. عمر الحسين",
        headEn: "Dr. Omar Al-Hussein"
      }
    ],
    studyPlan: [
      {
        yearAr: "السنة الأولى",
        yearEn: "First Year",
        courses: [
          { code: "ENG101", nameAr: "رياضيات هندسية 1", nameEn: "Engineering Math 1", credits: 4 },
          { code: "ENG102", nameAr: "فيزياء هندسية", nameEn: "Engineering Physics", credits: 3 },
          { code: "ENG103", nameAr: "كيمياء هندسية", nameEn: "Engineering Chemistry", credits: 2 }
        ]
      },
      {
        yearAr: "السنة الثانية",
        yearEn: "Second Year",
        courses: [
          { code: "ENG201", nameAr: "ميكانيك هندسي", nameEn: "Engineering Mechanics", credits: 3 },
          { code: "ENG202", nameAr: "خوارزميات وبرمجة 1", nameEn: "Algorithms & Programming 1", credits: 4 }
        ]
      }
    ],
    research: [
      {
        id: "r1",
        titleAr: "تصميم أنظمة خرسانية مقاومة للزلازل في سوريا",
        titleEn: "Design of Seismic Resistant Concrete Systems in Syria",
        authorsAr: "أ.د. أحمد خليل، د. باسل العلي",
        authorsEn: "Prof. Ahmed Khalil, Dr. Basel Al-Ali",
        year: "2023",
        journalAr: "مجلة الهندسة والعلوم",
        journalEn: "Journal of Engineering and Science"
      }
    ]
  },
  dentistry: {
    facultySlug: "dentistry",
    deanWordAr: "تعد كلية طب الأسنان من الكليات الرائدة التي تهدف لتخريج أطباء أكفاء مجهزين بأحدث التقنيات الطبية.",
    deanWordEn: "The Faculty of Dentistry is a leading faculty aiming to graduate competent dentists equipped with the latest medical technologies.",
    activities: [
      {
        id: "1",
        titleAr: "اليوم العلمي التخصصي لطب الأسنان",
        titleEn: "Dental Scientific Day",
        date: "2024-04-05",
        descriptionAr: "ندوات علمية حول أحدث طرق زراعة الأسنان الرقمية.",
        descriptionEn: "Scientific seminars on the latest digital dental implant methods.",
        image: "/images/activities/dent_1.png"
      }
    ],
    board: [
      {
        id: "b1",
        nameAr: "أ.د. سامر السيد",
        nameEn: "Prof. Samer Al-Sayed",
        roleAr: "عميد الكلية",
        roleEn: "Dean",
        image: "/images/faculty/prof_male_4.png"
      }
    ],
    departments: [
      {
        id: "d1",
        nameAr: "قسم جراحة الفم والفكين",
        nameEn: "Department of Oral and Maxillofacial Surgery",
        descriptionAr: "الجراحات الصغرى والكبرى في تجويف الفم.",
        descriptionEn: "Minor and major surgeries in the oral cavity.",
        headAr: "أ.د. سامر السيد",
        headEn: "Prof. Samer Al-Sayed"
      }
    ],
    studyPlan: [
      {
        yearAr: "السنة الأولى",
        yearEn: "First Year",
        courses: [
          { code: "DEN101", nameAr: "بيولوجيا الفم", nameEn: "Oral Biology", credits: 3 },
          { code: "DEN102", nameAr: "تشريح الأسنان", nameEn: "Dental Anatomy", credits: 4 }
        ]
      }
    ],
    research: [
      {
        id: "r1",
        titleAr: "تأثير الليزر في جراحة اللثة",
        titleEn: "Effect of Laser in Gingival Surgery",
        authorsAr: "د. فادي حمدان",
        authorsEn: "Dr. Fadi Hamdan",
        year: "2024",
        journalAr: "المجلة الطبية السورية",
        journalEn: "Syrian Medical Journal"
      }
    ]
  },
  pharmacy: {
    facultySlug: "pharmacy",
    deanWordAr: "تلتزم كلية الصيدلة بتقديم تعليم صيدلاني متميز يجمع بين المعرفة النظرية والخبرة العملية في المخابر.",
    deanWordEn: "The Faculty of Pharmacy is committed to providing excellent pharmaceutical education combining theoretical knowledge with practical lab experience.",
    activities: [
      {
        id: "1",
        titleAr: "حملة التوعية بالاستخدام الرشيد للمضادات الحيوية",
        titleEn: "Antibiotic Awareness Campaign",
        date: "2024-05-12",
        descriptionAr: "حملة طلابية لتوعية المجتمع حول مخاطر سوء استخدام المضادات.",
        descriptionEn: "Student campaign to raise community awareness about antibiotic misuse risks.",
        image: "/images/activities/pharm_1.png"
      }
    ],
    board: [
      {
        id: "b1",
        nameAr: "أ.د. ليلى عبد الرحمن",
        nameEn: "Prof. Laila Abdulrahman",
        roleAr: "عميدة الكلية",
        roleEn: "Dean",
        image: "/images/faculty/prof_female_3.png"
      }
    ],
    departments: [
      {
        id: "d1",
        nameAr: "قسم الصيدلانيات",
        nameEn: "Department of Pharmaceutics",
        descriptionAr: "تحضير الأشكال الصيدلانية وضمان جودتها.",
        descriptionEn: "Preparation of pharmaceutical forms and ensuring quality.",
        headAr: "أ.د. ليلى عبد الرحمن",
        headEn: "Prof. Laila Abdulrahman"
      }
    ],
    studyPlan: [
      {
        yearAr: "السنة الأولى",
        yearEn: "First Year",
        courses: [
          { code: "PHM101", nameAr: "كيمياء عامة", nameEn: "General Chemistry", credits: 3 },
          { code: "PHM102", nameAr: "مدخل إلى الصيدلة", nameEn: "Introduction to Pharmacy", credits: 2 }
        ]
      }
    ],
    research: [
      {
        id: "r1",
        titleAr: "تطوير أنظمة نانوية لإيصال الأدوية السرطانية",
        titleEn: "Developing Nanosystems for Cancer Drug Delivery",
        authorsAr: "أ.د. ليلى عبد الرحمن",
        authorsEn: "Prof. Laila Abdulrahman",
        year: "2023",
        journalAr: "مجلة العلوم الصيدلانية",
        journalEn: "Journal of Pharmaceutical Sciences"
      }
    ]
  },
  "administrative-sciences": {
    facultySlug: "administrative-sciences",
    deanWordAr: "نهدف في كلية العلوم الإدارية لإعداد قيادات أعمال قادرة على مواجهة التحديات الاقتصادية المعاصرة.",
    deanWordEn: "In the Faculty of Administrative Sciences, we aim to prepare business leaders capable of facing contemporary economic challenges.",
    activities: [
      {
        id: "1",
        titleAr: "منتدى ريادة الأعمال الشبابي",
        titleEn: "Youth Entrepreneurship Forum",
        date: "2024-06-20",
        descriptionAr: "لقاء بين الطلاب ورواد أعمال سوريين ناجحين.",
        descriptionEn: "A meeting between students and successful Syrian entrepreneurs.",
        image: "/images/activities/admin_1.png"
      }
    ],
    board: [
      {
        id: "b1",
        nameAr: "أ.د. منير الصباغ",
        nameEn: "Prof. Munir Al-Sabbagh",
        roleAr: "عميد الكلية",
        roleEn: "Dean",
        image: "/images/faculty/prof_male_1.png"
      }
    ],
    departments: [
      {
        id: "d1",
        nameAr: "قسم إدارة الأعمال",
        nameEn: "Department of Business Administration",
        descriptionAr: "تطوير المهارات القيادية والإدارية.",
        descriptionEn: "Developing leadership and management skills.",
        headAr: "أ.د. منير الصباغ",
        headEn: "Prof. Munir Al-Sabbagh"
      }
    ],
    studyPlan: [
      {
        yearAr: "السنة الأولى",
        yearEn: "First Year",
        courses: [
          { code: "ADM101", nameAr: "مبادئ الإدارة", nameEn: "Principles of Management", credits: 3 },
          { code: "ADM102", nameAr: "مبادئ الاقتصاد", nameEn: "Principles of Economics", credits: 3 }
        ]
      }
    ],
    research: [
      {
        id: "r1",
        titleAr: "التحول الرقمي في المصارف السورية",
        titleEn: "Digital Transformation in Syrian Banks",
        authorsAr: "د. طارق زيدان",
        authorsEn: "Dr. Tarek Zaidan",
        year: "2024",
        journalAr: "مجلة الاقتصاد والإدارة",
        journalEn: "Journal of Economics and Management"
      }
    ]
  },
  law: {
    facultySlug: "law",
    deanWordAr: "تسعى كلية الحقوق لترسيخ قيم العدالة وسيادة القانون من خلال تعليم قانوني رصين.",
    deanWordEn: "The Faculty of Law seeks to establish values of justice and the rule of law through solid legal education.",
    activities: [
      {
        id: "1",
        titleAr: "محكمة افتراضية لطلاب السنة الرابعة",
        titleEn: "Moot Court for Fourth Year Students",
        date: "2024-07-05",
        descriptionAr: "نشاط تدريبي يحاكي المحاكمات الحقيقية لتطوير مهارات الترافع.",
        descriptionEn: "Training activity simulating real trials to develop pleading skills.",
        image: "/images/activities/law_1.png"
      }
    ],
    board: [
      {
        id: "b1",
        nameAr: "أ.د. يوسف ناصيف",
        nameEn: "Prof. Youssef Nassif",
        roleAr: "عميد الكلية",
        roleEn: "Dean",
        image: "/images/faculty/prof_male_4.png"
      }
    ],
    departments: [
      {
        id: "d1",
        nameAr: "قسم القانون الخاص",
        nameEn: "Department of Private Law",
        descriptionAr: "القانون المدني، التجاري، والقانون الدولي الخاص.",
        descriptionEn: "Civil law, commercial law, and private international law.",
        headAr: "أ.د. يوسف ناصيف",
        headEn: "Prof. Youssef Nassif"
      }
    ],
    studyPlan: [
      {
        yearAr: "السنة الأولى",
        yearEn: "First Year",
        courses: [
          { code: "LAW101", nameAr: "مدخل إلى علم القانون", nameEn: "Introduction to Law", credits: 4 },
          { code: "LAW102", nameAr: "تاريخ القانون", nameEn: "History of Law", credits: 2 }
        ]
      }
    ],
    research: [
      {
        id: "r1",
        titleAr: "حماية المستهلك في التجارة الإلكترونية",
        titleEn: "Consumer Protection in E-Commerce",
        authorsAr: "د. لينا شاهين",
        authorsEn: "Dr. Lina Shaheen",
        year: "2023",
        journalAr: "مجلة الدراسات القانونية",
        journalEn: "Journal of Legal Studies"
      }
    ]
  },
  arts: {
    facultySlug: "arts",
    deanWordAr: "تعتبر كلية الآداب جسراً للتواصل الحضاري من خلال برامج اللغة والترجمة المتميزة.",
    deanWordEn: "The Faculty of Arts is a bridge for cultural communication through its excellent language and translation programs.",
    activities: [
      {
        id: "1",
        titleAr: "يوم اللغات العالمي",
        titleEn: "International Languages Day",
        date: "2024-09-26",
        descriptionAr: "فعالية ثقافية لعرض التعدد اللغوي والحضاري.",
        descriptionEn: "Cultural event showcasing linguistic and cultural diversity.",
        image: "/images/activities/arts_1.png"
      }
    ],
    board: [
      {
        id: "b1",
        nameAr: "أ.د. سارة عثمان",
        nameEn: "Prof. Sarah Othman",
        roleAr: "عميدة الكلية",
        roleEn: "Dean",
        image: "/images/faculty/prof_female_3.png"
      }
    ],
    departments: [
      {
        id: "d1",
        nameAr: "قسم الترجمة",
        nameEn: "Department of Translation",
        descriptionAr: "تأهيل مترجمين محترفين.",
        descriptionEn: "Qualifying professional translators.",
        headAr: "د. مايا حبيب",
        headEn: "Dr. Maya Habib"
      }
    ],
    studyPlan: [
      {
        yearAr: "السنة الأولى",
        yearEn: "First Year",
        courses: [
          { code: "ENG101", nameAr: "قواعد اللغة الإنجليزية 1", nameEn: "English Grammar 1", credits: 4 },
          { code: "ENG102", nameAr: "استيعاب ومحادثة", nameEn: "Listening & Speaking", credits: 3 }
        ]
      }
    ],
    research: [
      {
        id: "r1",
        titleAr: "استراتيجيات ترجمة المصطلحات الطبية",
        titleEn: "Strategies for Translating Medical Terminology",
        authorsAr: "أ.د. سارة عثمان",
        authorsEn: "Prof. Sarah Othman",
        year: "2024",
        journalAr: "مجلة الترجمة واللسانيات",
        journalEn: "Journal of Translation and Linguistics"
      }
    ]
  },
  "basic-sciences": {
    facultySlug: "basic-sciences",
    deanWordAr: "كلية العلوم الأساسية هي الحجر الزواية لكل العلوم التطبيقية والهندسية.",
    deanWordEn: "The Faculty of Basic Sciences is the cornerstone of all applied and engineering sciences.",
    activities: [
      {
        id: "1",
        titleAr: "المعرض العلمي السنوي للفيزياء",
        titleEn: "Annual Physics Science Fair",
        date: "2024-10-15",
        descriptionAr: "عرض لتجارب فيزيائية تطبيقية من عمل الطلاب.",
        descriptionEn: "Showcase of applied physics experiments conducted by students.",
        image: "/images/activities/sci_1.png"
      }
    ],
    board: [
      {
        id: "b1",
        nameAr: "أ.د. جمال العمري",
        nameEn: "Prof. Jamal Al-Omari",
        roleAr: "عميد الكلية",
        roleEn: "Dean",
        image: "/images/faculty/prof_male_4.png"
      }
    ],
    departments: [
      {
        id: "d1",
        nameAr: "قسم الرياضيات",
        nameEn: "Department of Mathematics",
        descriptionAr: "أساسيات الرياضيات والتحليل العددي.",
        descriptionEn: "Fundamentals of mathematics and numerical analysis.",
        headAr: "أ.د. جمال العمري",
        headEn: "Prof. Jamal Al-Omari"
      }
    ],
    studyPlan: [
      {
        yearAr: "السنة الأولى",
        yearEn: "First Year",
        courses: [
          { code: "SCI101", nameAr: "تحليل رياضي 1", nameEn: "Mathematical Analysis 1", credits: 4 },
          { code: "SCI102", nameAr: "فيزياء عامة 1", nameEn: "General Physics 1", credits: 4 }
        ]
      }
    ],
    research: [
      {
        id: "r1",
        titleAr: "الحلول العددية للمعادلات التفاضلية",
        titleEn: "Numerical Solutions for Differential Equations",
        authorsAr: "أ.د. جمال العمري",
        authorsEn: "Prof. Jamal Al-Omari",
        year: "2023",
        journalAr: "مجلة العلوم الأساسية",
        journalEn: "Journal of Basic Sciences"
      }
    ]
  }
};

export function getFacultyDetails(slug: string): FacultyDetails | undefined {
  return facultyDetails[slug];
}
