export interface Program {
  id: string;
  slug: string;
  facultySlug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  creditHours: number;
  minScorePercent: number;
  minScorePoints: number;
  tuitionSyrian: number;
  tuitionNonResident: number;
  tuitionCurrency: {
    syrian: string;
    nonResident: string;
  };
  branch: "scientific" | "literary" | "both";
  duration: number;
}

export interface Faculty {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string;
  color: string;
  image?: string;
  programs: Program[];
}

export const faculties: Faculty[] = [
  {
    id: "engineering",
    slug: "engineering",
    nameAr: "كلية الهندسة",
    nameEn: "Faculty of Engineering",
    descriptionAr: "تقدم برامج متميزة في الهندسة المدنية والمعمارية وهندسة الحاسوب والاتصالات",
    descriptionEn: "Offers distinguished programs in Civil Engineering, Architecture, and Computer & Communications Engineering",
    icon: "Building2",
    color: "bg-blue-500",
    image: "/images/faculties/engineering.png",
    programs: [
      {
        id: "civil",
        slug: "civil",
        facultySlug: "engineering",
        nameAr: "الهندسة المدنية",
        nameEn: "Civil Engineering",
        descriptionAr: "برنامج شامل في تصميم وبناء البنية التحتية والمنشآت",
        descriptionEn: "Comprehensive program in infrastructure design and construction",
        creditHours: 168,
        minScorePercent: 70,
        minScorePoints: 1680,
        tuitionSyrian: 350000,
        tuitionNonResident: 100,
        tuitionCurrency: { syrian: "SYP", nonResident: "USD" },
        branch: "scientific",
        duration: 5,
      },
      {
        id: "architecture",
        slug: "architecture",
        facultySlug: "engineering",
        nameAr: "الهندسة المعمارية",
        nameEn: "Architecture",
        descriptionAr: "برنامج إبداعي يجمع بين الفن والهندسة في تصميم المباني",
        descriptionEn: "Creative program combining art and engineering in building design",
        creditHours: 168,
        minScorePercent: 70,
        minScorePoints: 1680,
        tuitionSyrian: 350000,
        tuitionNonResident: 100,
        tuitionCurrency: { syrian: "SYP", nonResident: "USD" },
        branch: "scientific",
        duration: 5,
      },
      {
        id: "computer",
        slug: "computer",
        facultySlug: "engineering",
        nameAr: "هندسة الحاسوب والاتصالات",
        nameEn: "Computer & Communications Engineering",
        descriptionAr: "برنامج متقدم في علوم الحاسوب وشبكات الاتصالات",
        descriptionEn: "Advanced program in computer science and communications networks",
        creditHours: 168,
        minScorePercent: 70,
        minScorePoints: 1680,
        tuitionSyrian: 350000,
        tuitionNonResident: 100,
        tuitionCurrency: { syrian: "SYP", nonResident: "USD" },
        branch: "scientific",
        duration: 5,
      },
    ],
  },
  {
    id: "dentistry",
    slug: "dentistry",
    nameAr: "كلية طب الأسنان",
    nameEn: "Faculty of Dentistry",
    descriptionAr: "تعليم طبي متميز في مجال طب وجراحة الفم والأسنان",
    descriptionEn: "Distinguished medical education in oral and dental medicine and surgery",
    icon: "Stethoscope",
    color: "bg-teal-500",
    image: "/images/faculties/dentistry.png",
    programs: [
      {
        id: "dentistry",
        slug: "dentistry",
        facultySlug: "dentistry",
        nameAr: "طب الأسنان",
        nameEn: "Dentistry",
        descriptionAr: "برنامج شامل في طب وجراحة الفم والأسنان",
        descriptionEn: "Comprehensive program in oral and dental medicine and surgery",
        creditHours: 200,
        minScorePercent: 88,
        minScorePoints: 2112,
        tuitionSyrian: 600000,
        tuitionNonResident: 200,
        tuitionCurrency: { syrian: "SYP", nonResident: "USD" },
        branch: "scientific",
        duration: 5,
      },
    ],
  },
  {
    id: "pharmacy",
    slug: "pharmacy",
    nameAr: "كلية الصيدلة",
    nameEn: "Faculty of Pharmacy",
    descriptionAr: "تعليم صيدلاني متقدم يجمع بين العلوم والممارسة المهنية",
    descriptionEn: "Advanced pharmaceutical education combining sciences and professional practice",
    icon: "Pill",
    color: "bg-green-500",
    image: "/images/faculties/pharmacy.png",
    programs: [
      {
        id: "pharmacy",
        slug: "pharmacy",
        facultySlug: "pharmacy",
        nameAr: "الصيدلة",
        nameEn: "Pharmacy",
        descriptionAr: "برنامج متكامل في العلوم الصيدلانية والممارسة السريرية",
        descriptionEn: "Integrated program in pharmaceutical sciences and clinical practice",
        creditHours: 180,
        minScorePercent: 86,
        minScorePoints: 2064,
        tuitionSyrian: 500000,
        tuitionNonResident: 150,
        tuitionCurrency: { syrian: "SYP", nonResident: "USD" },
        branch: "scientific",
        duration: 5,
      },
    ],
  },
  {
    id: "admin",
    slug: "administrative-sciences",
    nameAr: "كلية العلوم الإدارية والاقتصادية",
    nameEn: "Faculty of Administrative and Economic Sciences",
    descriptionAr: "برامج متميزة في إدارة الأعمال والتسويق ونظم المعلومات والمحاسبة والمصارف",
    descriptionEn: "Distinguished programs in Business Administration, Marketing, IT, Accounting, and Banking",
    icon: "Briefcase",
    color: "bg-amber-500",
    image: "/images/faculties/admin.png",
    programs: [
      {
        id: "business",
        slug: "business",
        facultySlug: "administrative-sciences",
        nameAr: "إدارة الأعمال",
        nameEn: "Business Administration",
        descriptionAr: "برنامج شامل في إدارة المؤسسات والقيادة",
        descriptionEn: "Comprehensive program in organizational management and leadership",
        creditHours: 132,
        minScorePercent: 50,
        minScorePoints: 1200,
        tuitionSyrian: 200000,
        tuitionNonResident: 75,
        tuitionCurrency: { syrian: "SYP", nonResident: "USD" },
        branch: "both",
        duration: 4,
      },
      {
        id: "marketing",
        slug: "marketing",
        facultySlug: "administrative-sciences",
        nameAr: "التسويق",
        nameEn: "Marketing",
        descriptionAr: "برنامج متخصص في استراتيجيات التسويق وسلوك المستهلك",
        descriptionEn: "Specialized program in marketing strategies and consumer behavior",
        creditHours: 132,
        minScorePercent: 50,
        minScorePoints: 1200,
        tuitionSyrian: 200000,
        tuitionNonResident: 75,
        tuitionCurrency: { syrian: "SYP", nonResident: "USD" },
        branch: "both",
        duration: 4,
      },
      {
        id: "it",
        slug: "information-technology",
        facultySlug: "administrative-sciences",
        nameAr: "نظم المعلومات",
        nameEn: "Information Technology",
        descriptionAr: "برنامج في تقنية المعلومات وإدارة الأنظمة",
        descriptionEn: "Program in information technology and systems management",
        creditHours: 132,
        minScorePercent: 50,
        minScorePoints: 1200,
        tuitionSyrian: 200000,
        tuitionNonResident: 75,
        tuitionCurrency: { syrian: "SYP", nonResident: "USD" },
        branch: "scientific",
        duration: 4,
      },
      {
        id: "mba",
        slug: "business-master",
        facultySlug: "administrative-sciences",
        nameAr: "ماجستير في إدارة الأعمال",
        nameEn: "Master of Business Administration",
        descriptionAr: "برنامج دراسات عليا متقدم لتطوير المهارات القيادية والإدارية",
        descriptionEn: "Advanced graduate program to develop leadership and management skills",
        creditHours: 45,
        minScorePercent: 65,
        minScorePoints: 1560,
        tuitionSyrian: 400000,
        tuitionNonResident: 150,
        tuitionCurrency: { syrian: "SYP", nonResident: "USD" },
        branch: "both",
        duration: 2,
      },
    ],
  },
  {
    id: "law",
    slug: "law",
    nameAr: "كلية الحقوق",
    nameEn: "Faculty of Law",
    descriptionAr: "تعليم قانوني شامل يؤهل للممارسة المهنية والقضائية",
    descriptionEn: "Comprehensive legal education preparing for professional and judicial practice",
    icon: "Scale",
    color: "bg-indigo-500",
    image: "/images/faculties/law.png",
    programs: [
      {
        id: "law",
        slug: "law",
        facultySlug: "law",
        nameAr: "الحقوق",
        nameEn: "Law",
        descriptionAr: "برنامج شامل في القانون والتشريعات",
        descriptionEn: "Comprehensive program in law and legislation",
        creditHours: 134,
        minScorePercent: 50,
        minScorePoints: 1200,
        tuitionSyrian: 200000,
        tuitionNonResident: 75,
        tuitionCurrency: { syrian: "SYP", nonResident: "USD" },
        branch: "literary",
        duration: 4,
      },
    ],
  },
  {
    id: "arts",
    slug: "arts",
    nameAr: "كلية الآداب والعلوم الإنسانية",
    nameEn: "Faculty of Arts and Humanities",
    descriptionAr: "برامج متميزة في اللغة الإنجليزية والترجمة لتأهيل الكوادر المتخصصة",
    descriptionEn: "Distinguished programs in English Language and Translation to qualify specialized personnel",
    icon: "BookOpen",
    color: "bg-purple-500",
    image: "/images/faculties/arts.png",
    programs: [
      {
        id: "english",
        slug: "english",
        facultySlug: "arts",
        nameAr: "اللغة الإنجليزية",
        nameEn: "English Language",
        descriptionAr: "برنامج في اللغة الإنجليزية وآدابها",
        descriptionEn: "Program in English language and literature",
        creditHours: 132,
        minScorePercent: 50,
        minScorePoints: 1200,
        tuitionSyrian: 180000,
        tuitionNonResident: 70,
        tuitionCurrency: { syrian: "SYP", nonResident: "USD" },
        branch: "literary",
        duration: 4,
      },
      {
        id: "translation",
        slug: "translation",
        facultySlug: "arts",
        nameAr: "الترجمة",
        nameEn: "Translation",
        descriptionAr: "برنامج متخصص في الترجمة التحريرية والفورية",
        descriptionEn: "Specialized program in written and simultaneous translation",
        creditHours: 132,
        minScorePercent: 50,
        minScorePoints: 1200,
        tuitionSyrian: 180000,
        tuitionNonResident: 70,
        tuitionCurrency: { syrian: "SYP", nonResident: "USD" },
        branch: "literary",
        duration: 4,
      },
    ],
  },
  {
    id: "science",
    slug: "basic-sciences",
    nameAr: "كلية العلوم الأساسية",
    nameEn: "Faculty of Basic Sciences",
    descriptionAr: "أساس متين في العلوم الطبيعية والرياضيات",
    descriptionEn: "Solid foundation in natural sciences and mathematics",
    icon: "Atom",
    color: "bg-cyan-500",
    image: "/images/faculties/science.png",
    programs: [
      {
        id: "basic-science",
        slug: "basic-science",
        facultySlug: "basic-sciences",
        nameAr: "العلوم الأساسية",
        nameEn: "Basic Sciences",
        descriptionAr: "برنامج أساسي في العلوم الطبيعية",
        descriptionEn: "Foundational program in natural sciences",
        creditHours: 130,
        minScorePercent: 50,
        minScorePoints: 1200,
        tuitionSyrian: 180000,
        tuitionNonResident: 70,
        tuitionCurrency: { syrian: "SYP", nonResident: "USD" },
        branch: "scientific",
        duration: 4,
      },
    ],
  },
];

export function getFacultyBySlug(slug: string): Faculty | undefined {
  return faculties.find((f) => f.slug === slug);
}

export function getProgramBySlug(facultySlug: string, programSlug: string): Program | undefined {
  const faculty = getFacultyBySlug(facultySlug);
  return faculty?.programs.find((p) => p.slug === programSlug);
}

export function getAllPrograms(): Program[] {
  return faculties.flatMap((f) => f.programs);
}
