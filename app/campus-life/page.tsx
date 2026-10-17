"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useHousingFeatures,
  useStudentClubs,
  useSportActivities,
  useCampusLifeOverview,
} from "@/hooks/use-campus-life";
import {
  HousingFeature,
  StudentClub,
  SportActivity,
} from "@/lib/api";
import {
  Home,
  Users,
  Dumbbell,
  ArrowRight,
  ArrowLeft,
  Bed,
  Utensils,
  Wifi,
  Bus,
  Music,
  Palette,
  BookOpen,
  Globe,
  Trophy,
  Heart,
  Shield,
  Coffee,
  Code,
  Camera,
  Activity,
  Target,
  Flame,
  Sparkles,
  Building2,
} from "lucide-react";

// Icon mapping dictionary
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Users,
  Dumbbell,
  Bed,
  Utensils,
  Wifi,
  Bus,
  Music,
  Palette,
  BookOpen,
  Globe,
  Trophy,
  Heart,
  Shield,
  Building2,
  Coffee,
  Code,
  Camera,
  Activity,
  Target,
  Flame,
  Sparkles,
};

function getLucideIcon(
  iconName?: string,
  fallback: React.ComponentType<{ className?: string }> = Sparkles
): React.ComponentType<{ className?: string }> {
  if (!iconName) return fallback;
  return ICON_MAP[iconName] || fallback;
}

const DEFAULT_HOUSING_FEATURES: HousingFeature[] = [
  {
    id: 1,
    icon: "Bed",
    titleAr: "غرف مريحة",
    titleEn: "Comfortable Rooms",
    descriptionAr: "غرف مفردة ومزدوجة مجهزة بالكامل",
    descriptionEn: "Fully equipped single and double rooms",
  },
  {
    id: 2,
    icon: "Utensils",
    titleAr: "وجبات يومية",
    titleEn: "Daily Meals",
    descriptionAr: "مطعم جامعي يقدم وجبات متنوعة",
    descriptionEn: "University cafeteria serving diverse meals",
  },
  {
    id: 3,
    icon: "Wifi",
    titleAr: "إنترنت مجاني",
    titleEn: "Free WiFi",
    descriptionAr: "إنترنت عالي السرعة في جميع المرافق",
    descriptionEn: "High-speed internet in all facilities",
  },
  {
    id: 4,
    icon: "Bus",
    titleAr: "مواصلات",
    titleEn: "Transportation",
    descriptionAr: "خدمة نقل منتظمة من وإلى الحرم",
    descriptionEn: "Regular shuttle service to and from campus",
  },
];

const DEFAULT_CLUBS: StudentClub[] = [
  {
    id: 1,
    icon: "Music",
    nameAr: "نادي الموسيقى",
    nameEn: "Music Club",
    descriptionAr: "للطلاب المهتمين بالموسيقى والغناء",
    descriptionEn: "For students interested in music and singing",
    category: "فنون وموسيقى",
  },
  {
    id: 2,
    icon: "Palette",
    nameAr: "نادي الفنون",
    nameEn: "Arts Club",
    descriptionAr: "رسم وتصوير وفنون تشكيلية",
    descriptionEn: "Painting, photography, and visual arts",
    category: "فنون وموسيقى",
  },
  {
    id: 3,
    icon: "BookOpen",
    nameAr: "نادي القراءة",
    nameEn: "Reading Club",
    descriptionAr: "مناقشات أدبية وثقافية",
    descriptionEn: "Literary and cultural discussions",
    category: "ثقافي وأدبي",
  },
  {
    id: 4,
    icon: "Globe",
    nameAr: "نادي اللغات",
    nameEn: "Language Club",
    descriptionAr: "تعلم لغات جديدة وتبادل ثقافي",
    descriptionEn: "Learn new languages and cultural exchange",
    category: "ثقافي وأدبي",
  },
  {
    id: 5,
    icon: "Trophy",
    nameAr: "نادي ريادة الأعمال",
    nameEn: "Entrepreneurship Club",
    descriptionAr: "دعم المشاريع الناشئة والأفكار الإبداعية",
    descriptionEn: "Supporting startups and creative ideas",
    category: "ريادة وتقنية",
  },
  {
    id: 6,
    icon: "Heart",
    nameAr: "نادي العمل التطوعي",
    nameEn: "Volunteer Club",
    descriptionAr: "مبادرات خدمة المجتمع",
    descriptionEn: "Community service initiatives",
    category: "اجتماعي وتطوعي",
  },
];

const DEFAULT_SPORTS: SportActivity[] = [
  { id: 1, nameAr: "كرة القدم", nameEn: "Football", icon: "Flame" },
  { id: 2, nameAr: "كرة السلة", nameEn: "Basketball", icon: "Target" },
  { id: 3, nameAr: "كرة الطائرة", nameEn: "Volleyball", icon: "Activity" },
  { id: 4, nameAr: "تنس الطاولة", nameEn: "Table Tennis", icon: "Target" },
  { id: 5, nameAr: "الشطرنج", nameEn: "Chess", icon: "Trophy" },
  { id: 6, nameAr: "السباحة", nameEn: "Swimming", icon: "Flame" },
];

export default function CampusLifePage() {
  const { language, dir } = useLanguage();
  const isArabic = language === "ar";
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  // Live queries
  const { data: housingData } = useHousingFeatures();
  const { data: clubsData } = useStudentClubs();
  const { data: sportsData } = useSportActivities();
  const { data: overview } = useCampusLifeOverview();

  // Active items or fallbacks
  const housingFeatures = useMemo(() => {
    if (housingData && housingData.length > 0) {
      const active = housingData.filter((item) => item.isActive !== false);
      if (active.length > 0) return active;
    }
    return DEFAULT_HOUSING_FEATURES;
  }, [housingData]);

  const clubs = useMemo(() => {
    if (clubsData && clubsData.length > 0) {
      const active = clubsData.filter((item) => item.isActive !== false);
      if (active.length > 0) return active;
    }
    return DEFAULT_CLUBS;
  }, [clubsData]);

  const sports = useMemo(() => {
    if (sportsData && sportsData.length > 0) {
      const active = sportsData.filter((item) => item.isActive !== false);
      if (active.length > 0) return active;
    }
    return DEFAULT_SPORTS;
  }, [sportsData]);

  // Overview texts
  const housingTitle =
    (isArabic ? overview?.housingTitleAr : overview?.housingTitleEn) ||
    (isArabic ? "السكن الجامعي" : "Student Housing");

  const housingDesc =
    (isArabic ? overview?.housingDescAr : overview?.housingDescEn) ||
    (isArabic
      ? "توفر جامعة أنطاكية السورية سكناً جامعياً مريحاً وآمناً للطلاب من خارج دمشق، مع توفير جميع الخدمات الأساسية."
      : "Antioch Syrian University provides comfortable and safe housing for students from outside Damascus, with all essential services.");

  const housingImage = overview?.housingImage || "/images/pages/campus-life.png";

  const housingContactNote =
    (isArabic ? overview?.housingContactNoteAr : overview?.housingContactNoteEn) ||
    (isArabic
      ? "تواصل مع قسم شؤون الطلاب للحصول على مزيد من المعلومات"
      : "Contact the Student Affairs department for more information");

  const sportsTitle =
    (isArabic ? overview?.sportsTitleAr : overview?.sportsTitleEn) ||
    (isArabic ? "الأنشطة الرياضية" : "Sports Activities");

  const sportsDesc =
    (isArabic ? overview?.sportsDescAr : overview?.sportsDescEn) ||
    (isArabic
      ? "تولي الجامعة اهتماماً كبيراً بالجانب الرياضي وتوفر مرافق رياضية متنوعة للطلاب."
      : "The university pays great attention to sports and provides various sports facilities for students.");

  const sportsImage = overview?.sportsImage || "/images/pages/campus-life.png";

  const championshipsTitle =
    (isArabic ? overview?.championshipsTitleAr : overview?.championshipsTitleEn) ||
    (isArabic ? "البطولات السنوية" : "Annual Championships");

  const championshipsDesc =
    (isArabic ? overview?.championshipsDescAr : overview?.championshipsDescEn) ||
    (isArabic
      ? "تنظم الجامعة بطولات رياضية سنوية بين الكليات في مختلف الألعاب"
      : "The university organizes annual sports championships between faculties in various games");

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[40vh] min-h-[350px] w-full overflow-hidden bg-gradient-to-br from-primary to-zinc-950">
          <div className="relative h-full flex items-center">
            <div className="section-container w-full text-start">
              <Badge
                variant="secondary"
                className="mb-4 bg-primary text-primary-foreground border-none"
              >
                {isArabic ? "الحياة الجامعية" : "Campus Life"}
              </Badge>
              <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
                {isArabic ? "حياة جامعة نابضة بالحيوية" : "A Vibrant Campus Life"}
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-white/90">
                {isArabic
                  ? "اكتشف تجربة جامعية متكاملة تجمع بين التعليم والأنشطة الثقافية والرياضية"
                  : "Discover a complete university experience combining education with cultural and sports activities"}
              </p>
            </div>
          </div>
        </section>

        {/* Tabs Content */}
        <section className="py-12 sm:py-16">
          <div className="section-container">
            <Tabs defaultValue="housing" className="w-full" dir={dir}>
              <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-muted mb-8 rounded-xl gap-1">
                <TabsTrigger
                  value="housing"
                  className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-1 py-2 sm:py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground w-full rounded-lg"
                >
                  <Home className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-medium hidden sm:inline">
                    {isArabic ? "السكن" : "Housing"}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="clubs"
                  className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-1 py-2 sm:py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground w-full rounded-lg"
                >
                  <Users className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-medium hidden sm:inline">
                    {isArabic ? "النوادي" : "Clubs"}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="sports"
                  className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-1 py-2 sm:py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground w-full rounded-lg"
                >
                  <Dumbbell className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-medium hidden sm:inline">
                    {isArabic ? "الرياضة" : "Sports"}
                  </span>
                </TabsTrigger>
              </TabsList>

              {/* Housing Tab */}
              <TabsContent value="housing">
                <div className="grid gap-8 lg:grid-cols-2">
                  <div className="text-start">
                    <h2 className="mb-4 text-2xl font-bold text-foreground">
                      {housingTitle}
                    </h2>
                    <p className="mb-6 text-muted-foreground">
                      {housingDesc}
                    </p>
                    <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                      {housingFeatures.map((feature, index) => {
                        const FeatureIcon = getLucideIcon(feature.icon, Bed);
                        return (
                          <Card key={feature.id || index} className="transition-all hover:shadow-sm">
                            <CardContent className="flex items-start gap-3 p-4 text-start">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                <FeatureIcon className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-foreground">
                                  {isArabic ? feature.titleAr : feature.titleEn}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {isArabic ? feature.descriptionAr : feature.descriptionEn}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                  <Card className="h-fit">
                    <CardContent className="p-0">
                      <div className="relative h-64 overflow-hidden rounded-t-xl">
                        <Image
                          src={housingImage}
                          alt="Student Housing"
                          fill
                          className="object-cover opacity-85"
                        />
                      </div>
                      <div className="p-6 text-start">
                        <h3 className="mb-2 font-semibold text-foreground">
                          {isArabic ? "للتقديم على السكن" : "Apply for Housing"}
                        </h3>
                        <p className="mb-4 text-sm text-muted-foreground">
                          {housingContactNote}
                        </p>
                        <Link href="/contact" className="w-full sm:w-auto">
                          <Button className="gap-2 w-full sm:w-auto">
                            {isArabic ? "تواصل معنا" : "Contact Us"}
                            <Arrow className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Clubs Tab */}
              <TabsContent value="clubs">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground text-start">
                    {isArabic ? "النوادي الطلابية" : "Student Clubs"}
                  </h2>
                  <Badge variant="outline" className="text-xs px-2.5 py-1">
                    {isArabic
                      ? `${clubs.length} نادٍ نشط`
                      : `${clubs.length} Active Clubs`}
                  </Badge>
                </div>
                <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-6 text-start">
                  {clubs.map((club, index) => {
                    const ClubIcon = getLucideIcon(club.icon, Users);
                    return (
                      <Card
                        key={club.id || index}
                        className="transition-all hover:shadow-lg flex flex-col justify-between"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                              <ClubIcon className="h-7 w-7 text-primary" />
                            </div>
                            {club.category && (
                              <Badge variant="secondary" className="text-xs">
                                {club.category}
                              </Badge>
                            )}
                          </div>
                          <h3 className="mb-2 text-lg font-semibold text-foreground">
                            {isArabic ? club.nameAr : club.nameEn}
                          </h3>
                          <p className="text-muted-foreground text-sm line-clamp-3">
                            {isArabic ? club.descriptionAr : club.descriptionEn}
                          </p>
                          {club.supervisor && (
                            <div className="mt-4 pt-3 border-t text-xs text-muted-foreground flex items-center gap-1.5">
                              <Users className="h-3.5 w-3.5 text-primary shrink-0" />
                              <span className="truncate">
                                {isArabic
                                  ? `إشراف: ${club.supervisor}`
                                  : `Supervisor: ${club.supervisor}`}
                              </span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              {/* Sports Tab */}
              <TabsContent value="sports">
                <div className="grid gap-8 lg:grid-cols-2">
                  <div className="text-start">
                    <h2 className="mb-4 text-2xl font-bold text-foreground">
                      {sportsTitle}
                    </h2>
                    <p className="mb-6 text-muted-foreground">
                      {sportsDesc}
                    </p>
                    <div className="grid gap-2 sm:gap-3 sm:grid-cols-2">
                      {sports.map((sport, index) => {
                        const SportIcon = getLucideIcon(sport.icon, Dumbbell);
                        return (
                          <div
                            key={sport.id || index}
                            className="flex items-center gap-3 rounded-lg border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm"
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                              <SportIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="font-medium text-foreground block truncate">
                                {isArabic ? sport.nameAr : sport.nameEn}
                              </span>
                              {sport.descriptionAr && (
                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                  {isArabic ? sport.descriptionAr : sport.descriptionEn}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <Card className="h-fit">
                    <CardContent className="p-0 text-start">
                      <div className="relative h-64 overflow-hidden rounded-t-xl">
                        <Image
                          src={sportsImage}
                          alt="Sports Facilities"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="mb-2 font-semibold text-foreground">
                          {championshipsTitle}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {championshipsDesc}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
