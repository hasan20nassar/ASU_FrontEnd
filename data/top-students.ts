export interface TopStudent {
  id: string;
  nameAr: string;
  nameEn: string;
  studentId: string;
  facultySlug: string;
  gpa: number;
  rank: 1 | 2 | 3;
  image: string;
}

export const topStudents: TopStudent[] = [
  // ===================== Engineering =====================
  {
    id: "eng-s1",
    nameAr: "محمد حسن نصار",
    nameEn: "Mohammad Hassan Nassar",
    studentId: "ENG-2021-0045",
    facultySlug: "engineering",
    gpa: 3.97,
    rank: 1,
    image: "/images/students/student_male_1.png",
  },
  {
    id: "eng-s2",
    nameAr: "لمى العبد الله",
    nameEn: "Lama Al-Abdullah",
    studentId: "ENG-2021-0112",
    facultySlug: "engineering",
    gpa: 3.92,
    rank: 2,
    image: "/images/students/student_female_1.png",
  },
  {
    id: "eng-s3",
    nameAr: "أحمد الشيخ",
    nameEn: "Ahmad Al-Sheikh",
    studentId: "ENG-2021-0078",
    facultySlug: "engineering",
    gpa: 3.88,
    rank: 3,
    image: "/images/students/student_male_2.png",
  },

  // ===================== Dentistry =====================
  {
    id: "dent-s1",
    nameAr: "رنا الحلاق",
    nameEn: "Rana Al-Hallaq",
    studentId: "DEN-2020-0023",
    facultySlug: "dentistry",
    gpa: 3.95,
    rank: 1,
    image: "/images/students/student_female_2.png",
  },
  {
    id: "dent-s2",
    nameAr: "عمر الكردي",
    nameEn: "Omar Al-Kurdi",
    studentId: "DEN-2020-0041",
    facultySlug: "dentistry",
    gpa: 3.91,
    rank: 2,
    image: "/images/students/student_male_3.png",
  },
  {
    id: "dent-s3",
    nameAr: "سلمى يوسف",
    nameEn: "Salma Youssef",
    studentId: "DEN-2020-0057",
    facultySlug: "dentistry",
    gpa: 3.87,
    rank: 3,
    image: "/images/students/student_female_3.png",
  },

  // ===================== Pharmacy =====================
  {
    id: "pharm-s1",
    nameAr: "يزن الأسعد",
    nameEn: "Yazan Al-Asaad",
    studentId: "PHA-2021-0015",
    facultySlug: "pharmacy",
    gpa: 3.96,
    rank: 1,
    image: "/images/students/student_male_1.png",
  },
  {
    id: "pharm-s2",
    nameAr: "دانا خليفة",
    nameEn: "Dana Khalifa",
    studentId: "PHA-2021-0033",
    facultySlug: "pharmacy",
    gpa: 3.90,
    rank: 2,
    image: "/images/students/student_female_1.png",
  },
  {
    id: "pharm-s3",
    nameAr: "كرم الشهابي",
    nameEn: "Karam Al-Shihabi",
    studentId: "PHA-2021-0067",
    facultySlug: "pharmacy",
    gpa: 3.85,
    rank: 3,
    image: "/images/students/student_male_2.png",
  },

  // ===================== Administrative Sciences =====================
  {
    id: "admin-s1",
    nameAr: "نور الجندي",
    nameEn: "Nour Al-Jundi",
    studentId: "ADM-2022-0008",
    facultySlug: "administrative-sciences",
    gpa: 3.94,
    rank: 1,
    image: "/images/students/student_female_2.png",
  },
  {
    id: "admin-s2",
    nameAr: "خالد الإبراهيم",
    nameEn: "Khaled Al-Ibrahim",
    studentId: "ADM-2022-0029",
    facultySlug: "administrative-sciences",
    gpa: 3.89,
    rank: 2,
    image: "/images/students/student_male_3.png",
  },
  {
    id: "admin-s3",
    nameAr: "ريم العباس",
    nameEn: "Reem Al-Abbas",
    studentId: "ADM-2022-0044",
    facultySlug: "administrative-sciences",
    gpa: 3.83,
    rank: 3,
    image: "/images/students/student_female_3.png",
  },

  // ===================== Law =====================
  {
    id: "law-s1",
    nameAr: "سامر المحمد",
    nameEn: "Samer Al-Mohammad",
    studentId: "LAW-2022-0011",
    facultySlug: "law",
    gpa: 3.93,
    rank: 1,
    image: "/images/students/student_male_1.png",
  },
  {
    id: "law-s2",
    nameAr: "هبة الزعبي",
    nameEn: "Hiba Al-Zoubi",
    studentId: "LAW-2022-0036",
    facultySlug: "law",
    gpa: 3.88,
    rank: 2,
    image: "/images/students/student_female_1.png",
  },
  {
    id: "law-s3",
    nameAr: "فراس الحمود",
    nameEn: "Firas Al-Hamoud",
    studentId: "LAW-2022-0052",
    facultySlug: "law",
    gpa: 3.82,
    rank: 3,
    image: "/images/students/student_male_2.png",
  },

  // ===================== Arts & Humanities =====================
  {
    id: "arts-s1",
    nameAr: "ميس الخطيب",
    nameEn: "Mais Al-Khatib",
    studentId: "ART-2022-0019",
    facultySlug: "arts",
    gpa: 3.95,
    rank: 1,
    image: "/images/students/student_female_2.png",
  },
  {
    id: "arts-s2",
    nameAr: "بشار العمر",
    nameEn: "Bashar Al-Omar",
    studentId: "ART-2022-0027",
    facultySlug: "arts",
    gpa: 3.90,
    rank: 2,
    image: "/images/students/student_male_3.png",
  },
  {
    id: "arts-s3",
    nameAr: "تالا الصالح",
    nameEn: "Tala Al-Saleh",
    studentId: "ART-2022-0041",
    facultySlug: "arts",
    gpa: 3.84,
    rank: 3,
    image: "/images/students/student_female_3.png",
  },

  // ===================== Basic Sciences =====================
  {
    id: "sci-s1",
    nameAr: "علي المصطفى",
    nameEn: "Ali Al-Mustafa",
    studentId: "SCI-2022-0006",
    facultySlug: "basic-sciences",
    gpa: 3.96,
    rank: 1,
    image: "/images/students/student_male_1.png",
  },
  {
    id: "sci-s2",
    nameAr: "جنى الحسين",
    nameEn: "Jana Al-Hussein",
    studentId: "SCI-2022-0022",
    facultySlug: "basic-sciences",
    gpa: 3.91,
    rank: 2,
    image: "/images/students/student_female_1.png",
  },
  {
    id: "sci-s3",
    nameAr: "مهند الأحمد",
    nameEn: "Muhannad Al-Ahmad",
    studentId: "SCI-2022-0038",
    facultySlug: "basic-sciences",
    gpa: 3.86,
    rank: 3,
    image: "/images/students/student_male_2.png",
  },
];

export function getTopStudentsByFaculty(facultySlug: string): TopStudent[] {
  return topStudents
    .filter((s) => s.facultySlug === facultySlug)
    .sort((a, b) => a.rank - b.rank);
}
