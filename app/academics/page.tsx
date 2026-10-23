"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useLanguage } from "@/contexts/language-context";
import { useSiteSettings } from "@/contexts/site-settings-context";
import { useFaculties } from "@/hooks/use-faculties";
import { Faculty } from "@/lib/api/models/Faculty";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Building2,
  Stethoscope,
  Pill,
  Briefcase,
  Scale,
  BookOpen,
  Atom,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Clock,
  Sparkles,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  Stethoscope,
  Pill,
  Briefcase,
  Scale,
  BookOpen,
  Atom,
};

function hexToRgba(hex: string, alpha: number) {
  if (!hex || !hex.startsWith("#")) return `rgba(30, 58, 138, ${alpha})`;
  let c = hex.substring(1);
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const num = parseInt(c, 16);
  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
}

function FacultyAcademicsCard({ faculty }: { faculty: Faculty }) {
  const { language, dir } = useLanguage();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const [isHovered, setIsHovered] = useState(false);
  const Icon = (faculty.icon && iconMap[faculty.icon]) || BookOpen;
  const primaryColor = faculty.primaryColor || "#003366";
  const accentColor = faculty.accentColor || "#e0a800";

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="overflow-hidden transition-all duration-300 border border-border/70 rounded-2xl relative bg-card shadow-xs"
      style={{
        borderColor: isHovered ? hexToRgba(primaryColor, 0.45) : "var(--border)",
        boxShadow: isHovered
          ? `0 14px 40px ${hexToRgba(primaryColor, 0.1)}`
          : "0 2px 10px rgba(0,0,0,0.03)",
      }}
    >
      {/* Top Identity Stripe */}
      <div
        className="w-full h-1 shrink-0 transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, ${primaryColor} 0%, ${accentColor} 100%)`,
          opacity: isHovered ? 1 : 0.75,
        }}
      />

      <CardHeader className="p-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Faculty Logo / Icon Container */}
            <div
              className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl border bg-background p-2.5 shadow-xs transition-transform duration-300 group-hover:scale-105 overflow-hidden"
              style={{
                borderColor: isHovered
                  ? hexToRgba(primaryColor, 0.5)
                  : hexToRgba(primaryColor, 0.25),
                boxShadow: `0 4px 16px ${hexToRgba(primaryColor, 0.08)}`,
              }}
            >
              {faculty.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={faculty.logoUrl}
                  alt={language === "ar" ? faculty.nameAr : faculty.nameEn}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div
                  className="w-full h-full rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Icon className="h-8 w-8" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-2 h-5 rounded-full shrink-0"
                  style={{ backgroundColor: primaryColor }}
                />
                <span
                  className="w-1.5 h-3.5 rounded-full shrink-0"
                  style={{ backgroundColor: accentColor }}
                />
                <CardTitle
                  className="text-xl sm:text-2xl font-extrabold tracking-tight transition-colors"
                  style={{ color: isHovered ? primaryColor : undefined }}
                >
                  {language === "ar" ? faculty.nameAr : faculty.nameEn}
                </CardTitle>
              </div>

              {faculty.mottoAr && (
                <div
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold mb-1"
                  style={{
                    backgroundColor: hexToRgba(accentColor, 0.1),
                    color: accentColor,
                  }}
                >
                  <Sparkles className="h-3 w-3" />
                  <span>{language === "ar" ? faculty.mottoAr : faculty.mottoEn}</span>
                </div>
              )}

              <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
                {language === "ar"
                  ? faculty.descriptionAr
                  : faculty.descriptionEn}
              </p>
            </div>
          </div>

          {/* Color Identity Swatch */}
          <div className="flex items-center gap-1.5 self-end sm:self-center">
            <span
              className="w-3.5 h-3.5 rounded-full border shadow-2xs inline-block"
              style={{ backgroundColor: primaryColor }}
              title={language === "ar" ? "اللون الأساسي للكلية" : "Primary Color"}
            />
            <span
              className="w-3.5 h-3.5 rounded-full border shadow-2xs inline-block"
              style={{ backgroundColor: accentColor }}
              title={language === "ar" ? "اللون الثانوي للكلية" : "Accent Color"}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-2">
        {/* Programs Grid */}
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {faculty.programs.map((program) => (
            <Link
              key={program.id}
              href={`/academics/${faculty.slug}/${program.slug}`}
              className="group/prog block"
            >
              <div
                className="h-full rounded-xl border border-border bg-muted/20 p-4 transition-all duration-300 hover:shadow-xs hover:border-primary/40 hover:bg-muted/40"
              >
                <h3 className="font-bold text-sm text-foreground transition-colors group-hover/prog:text-primary">
                  {language === "ar" ? program.nameAr : program.nameEn}
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="outline" className="gap-1 text-[11px] font-mono">
                    <GraduationCap className="h-3 w-3" />
                    {program.creditHours} {language === "ar" ? "ساعة" : "hrs"}
                  </Badge>
                  <Badge variant="outline" className="gap-1 text-[11px]">
                    <Clock className="h-3 w-3" />
                    {program.duration} {language === "ar" ? "سنوات" : "years"}
                  </Badge>
                </div>
                <div
                  className="mt-3 flex items-center gap-1 text-xs font-bold opacity-0 transition-opacity group-hover/prog:opacity-100"
                  style={{ color: primaryColor }}
                >
                  <span>{language === "ar" ? "تفاصيل التخصص" : "Details"}</span>
                  <Arrow className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Visit Microsite Action */}
        <div className="mt-6 border-t border-border/50 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Link href={`/academics/${faculty.slug}`}>
            <Button
              variant="outline"
              className="gap-2 font-bold transition-all duration-300"
              style={{
                borderColor: hexToRgba(primaryColor, 0.3),
                color: primaryColor,
              }}
            >
              {language === "ar"
                ? `زيارة الموقع الفرعي لـ ${faculty.nameAr}`
                : `Visit ${faculty.nameEn} Microsite`}
              <Arrow className="h-4 w-4" />
            </Button>
          </Link>

          <span className="text-xs text-muted-foreground font-medium">
            {faculty.programs?.length || 0}{" "}
            {language === "ar" ? "أقسام وبرامج أكاديمية معتمدة" : "Accredited Programs"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AcademicsPage() {
  const { language } = useLanguage();
  const { isPagePublished } = useSiteSettings();
  const { data: backendFaculties } = useFaculties();
  const rawFaculties = backendFaculties || [];
  const displayFaculties = rawFaculties
    .filter((f) => isPagePublished(`/academics/${f.slug}`))
    .map((f) => ({
      ...f,
      programs: (f.programs || []).filter((p) =>
        isPagePublished(`/academics/${f.slug}/${p.slug}`)
      ),
    }));

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="border-b bg-muted/30 py-12 sm:py-16">
          <div className="section-container">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
                {language === "ar"
                  ? "الكليات والبرامج"
                  : "Faculties & Programs"}
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                {language === "ar"
                  ? "تضم جامعة أنطاكية السورية سبع كليات تقدم برامج أكاديمية متنوعة بنظام الساعات المعتمدة"
                  : "Antioch Syrian University comprises seven faculties offering diverse academic programs under the credit hour system"}
              </p>
            </div>
          </div>
        </section>

        {/* Faculties Grid */}
        <section className="py-12 sm:py-16">
          <div className="section-container">
            <div className="grid gap-8">
              {displayFaculties.map((faculty) => (
                <FacultyAcademicsCard key={faculty.id} faculty={faculty} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
