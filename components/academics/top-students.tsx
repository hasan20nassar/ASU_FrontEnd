"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/language-context";
import { useStudents } from "@/hooks/use-students";
import { Student } from "@/lib/api";
import { Trophy, Star, Hash, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopStudentsProps {
  facultySlug: string;
  programSlug?: string;
  primaryColor?: string;
  accentColor?: string;
}

function hexToRgba(hex: string, alpha: number) {
  if (!hex || !hex.startsWith("#")) return `rgba(30, 58, 138, ${alpha})`;
  let c = hex.substring(1);
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const num = parseInt(c, 16);
  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
}

function getStudentRankStyles(
  rankVal: number,
  primaryColor: string,
  accentColor: string
) {
  if (rankVal === 1) {
    return {
      topStripe: `linear-gradient(90deg, ${primaryColor} 0%, ${accentColor} 50%, ${primaryColor} 100%)`,
      cardBg: `linear-gradient(175deg, ${hexToRgba(accentColor, 0.09)} 0%, ${hexToRgba(primaryColor, 0.04)} 35%, var(--card) 100%)`,
      borderColor: hexToRgba(accentColor, 0.45),
      hoverBorderColor: accentColor,
      shadow: `0 8px 30px ${hexToRgba(accentColor, 0.14)}`,
      hoverShadow: `0 16px 45px ${hexToRgba(accentColor, 0.22)}`,
      badgeBg: `linear-gradient(135deg, ${hexToRgba(accentColor, 0.22)}, ${hexToRgba(primaryColor, 0.15)})`,
      badgeBorder: hexToRgba(accentColor, 0.55),
      badgeColor: accentColor,
      avatarRing: `linear-gradient(135deg, ${accentColor} 0%, ${primaryColor} 50%, ${accentColor} 100%)`,
      avatarGlow: `0 0 16px ${hexToRgba(accentColor, 0.35)}`,
      rankPillBg: hexToRgba(accentColor, 0.1),
      rankPillBorder: hexToRgba(accentColor, 0.25),
      rankPillColor: accentColor,
      gpaBoxBg: hexToRgba(accentColor, 0.06),
      gpaBoxBorder: hexToRgba(accentColor, 0.22),
      gpaLabelColor: accentColor,
      gpaValColor: accentColor,
      gpaBar: `linear-gradient(90deg, ${primaryColor} 0%, ${accentColor} 100%)`,
      icon: "🥇",
      labelAr: "المركز الأول",
      labelEn: "1st Place",
    };
  }
  if (rankVal === 2) {
    return {
      topStripe: `linear-gradient(90deg, ${primaryColor} 0%, ${hexToRgba(primaryColor, 0.6)} 100%)`,
      cardBg: `linear-gradient(175deg, ${hexToRgba(primaryColor, 0.07)} 0%, var(--card) 40%)`,
      borderColor: hexToRgba(primaryColor, 0.32),
      hoverBorderColor: primaryColor,
      shadow: `0 6px 24px ${hexToRgba(primaryColor, 0.08)}`,
      hoverShadow: `0 14px 40px ${hexToRgba(primaryColor, 0.18)}`,
      badgeBg: hexToRgba(primaryColor, 0.12),
      badgeBorder: hexToRgba(primaryColor, 0.35),
      badgeColor: primaryColor,
      avatarRing: `linear-gradient(135deg, ${primaryColor} 0%, ${hexToRgba(primaryColor, 0.5)} 100%)`,
      avatarGlow: `0 0 12px ${hexToRgba(primaryColor, 0.2)}`,
      rankPillBg: hexToRgba(primaryColor, 0.08),
      rankPillBorder: hexToRgba(primaryColor, 0.2),
      rankPillColor: primaryColor,
      gpaBoxBg: hexToRgba(primaryColor, 0.04),
      gpaBoxBorder: hexToRgba(primaryColor, 0.18),
      gpaLabelColor: primaryColor,
      gpaValColor: "var(--foreground)",
      gpaBar: `linear-gradient(90deg, ${primaryColor} 0%, ${hexToRgba(primaryColor, 0.7)} 100%)`,
      icon: "🥈",
      labelAr: "المركز الثاني",
      labelEn: "2nd Place",
    };
  }
  if (rankVal === 3) {
    return {
      topStripe: `linear-gradient(90deg, ${accentColor} 0%, ${hexToRgba(accentColor, 0.5)} 100%)`,
      cardBg: `linear-gradient(175deg, ${hexToRgba(accentColor, 0.05)} 0%, ${hexToRgba(primaryColor, 0.02)} 40%, var(--card) 100%)`,
      borderColor: hexToRgba(accentColor, 0.28),
      hoverBorderColor: accentColor,
      shadow: `0 6px 22px ${hexToRgba(accentColor, 0.06)}`,
      hoverShadow: `0 14px 38px ${hexToRgba(accentColor, 0.16)}`,
      badgeBg: hexToRgba(accentColor, 0.12),
      badgeBorder: hexToRgba(accentColor, 0.3),
      badgeColor: accentColor,
      avatarRing: `linear-gradient(135deg, ${accentColor} 0%, ${hexToRgba(primaryColor, 0.4)} 100%)`,
      avatarGlow: `0 0 12px ${hexToRgba(accentColor, 0.18)}`,
      rankPillBg: hexToRgba(accentColor, 0.08),
      rankPillBorder: hexToRgba(accentColor, 0.2),
      rankPillColor: accentColor,
      gpaBoxBg: hexToRgba(accentColor, 0.035),
      gpaBoxBorder: hexToRgba(accentColor, 0.16),
      gpaLabelColor: accentColor,
      gpaValColor: "var(--foreground)",
      gpaBar: `linear-gradient(90deg, ${accentColor} 0%, ${primaryColor} 100%)`,
      icon: "🥉",
      labelAr: "المركز الثالث",
      labelEn: "3rd Place",
    };
  }

  // Fallback for rank >= 4
  return {
    topStripe: hexToRgba(primaryColor, 0.5),
    cardBg: `var(--card)`,
    borderColor: hexToRgba(primaryColor, 0.2),
    hoverBorderColor: primaryColor,
    shadow: `0 4px 16px rgba(0,0,0,0.06)`,
    hoverShadow: `0 10px 30px ${hexToRgba(primaryColor, 0.12)}`,
    badgeBg: hexToRgba(primaryColor, 0.08),
    badgeBorder: hexToRgba(primaryColor, 0.25),
    badgeColor: primaryColor,
    avatarRing: hexToRgba(primaryColor, 0.3),
    avatarGlow: "none",
    rankPillBg: hexToRgba(primaryColor, 0.06),
    rankPillBorder: hexToRgba(primaryColor, 0.18),
    rankPillColor: primaryColor,
    gpaBoxBg: hexToRgba(primaryColor, 0.03),
    gpaBoxBorder: hexToRgba(primaryColor, 0.14),
    gpaLabelColor: primaryColor,
    gpaValColor: "var(--foreground)",
    gpaBar: primaryColor,
    icon: `#${rankVal}`,
    labelAr: `المركز ${rankVal}`,
    labelEn: `Rank #${rankVal}`,
  };
}

function StudentCard({
  student,
  primaryColor,
  accentColor,
}: {
  student: Student;
  primaryColor: string;
  accentColor: string;
}) {
  const { language } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const rankVal =
    student.rank && typeof student.rank === "number" ? student.rank : 1;
  const styles = getStudentRankStyles(rankVal, primaryColor, accentColor);
  const gpaNum = Number(student.gpa || 0);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative rounded-2xl overflow-hidden text-center transition-all duration-300 w-full max-w-[320px] mx-auto flex flex-col justify-between"
      style={{
        background: styles.cardBg,
        borderWidth: rankVal === 1 ? "1.5px" : "1px",
        borderStyle: "solid",
        borderColor: isHovered ? styles.hoverBorderColor : styles.borderColor,
        boxShadow: isHovered ? styles.hoverShadow : styles.shadow,
        transform: isHovered ? "translateY(-6px)" : "translateY(0)",
      }}
    >
      {/* Top Identity Stripe */}
      <div
        className="w-full shrink-0"
        style={{
          height: rankVal === 1 ? "4px" : "3px",
          background: styles.topStripe,
        }}
      />

      <div className="p-6 sm:p-7 flex flex-col items-center flex-1 justify-between relative">
        {/* Rank Medal Badge */}
        <div
          className="absolute top-4 start-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-xs"
          style={{
            background: styles.badgeBg,
            borderColor: styles.badgeBorder,
            borderWidth: "1px",
            borderStyle: "solid",
            color: styles.badgeColor,
          }}
        >
          <span className="text-sm leading-none">{styles.icon}</span>
          <span>{language === "ar" ? styles.labelAr : styles.labelEn}</span>
        </div>

        {/* Student Image with Ring */}
        <div className="flex justify-center mt-6 mb-4">
          <div
            className="rounded-full p-1 transition-transform duration-500"
            style={{
              background: styles.avatarRing,
              boxShadow: styles.avatarGlow,
              transform: isHovered ? "scale(1.05)" : "scale(1)",
            }}
          >
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-[3px] border-background bg-muted">
              <Image
                src={student.image || "/images/students/default.png"}
                alt={language === "ar" ? student.nameAr : student.nameEn}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 112px, 128px"
              />
            </div>
          </div>
        </div>

        {/* Student Information */}
        <div className="w-full flex flex-col items-center mb-4">
          <h4
            className="text-lg sm:text-xl font-extrabold text-foreground mb-1.5 transition-colors line-clamp-1"
            style={{
              color: isHovered && rankVal === 1 ? accentColor : undefined,
            }}
          >
            {language === "ar" ? student.nameAr : student.nameEn}
          </h4>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground mb-1">
            <div className="inline-flex items-center gap-1 bg-muted/60 dark:bg-slate-900/60 px-2 py-0.5 rounded-md font-mono">
              <Hash className="h-3 w-3" />
              <span>{student.studentId}</span>
            </div>
            <div
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-xs"
              style={{
                backgroundColor: styles.rankPillBg,
                borderColor: styles.rankPillBorder,
                borderWidth: "1px",
                borderStyle: "solid",
                color: styles.rankPillColor,
              }}
            >
              <Award className="h-3 w-3" />
              <span>{language === "ar" ? styles.labelAr : styles.labelEn}</span>
            </div>
          </div>
        </div>

        {/* GPA Box */}
        <div
          className="w-full p-3.5 rounded-xl border transition-colors"
          style={{
            backgroundColor: styles.gpaBoxBg,
            borderColor: styles.gpaBoxBorder,
          }}
        >
          <div className="flex items-center justify-between mb-1.5 text-xs font-semibold">
            <span
              className="inline-flex items-center gap-1 uppercase tracking-wider font-bold"
              style={{ color: styles.gpaLabelColor }}
            >
              <Star className="h-3.5 w-3.5 fill-current" />
              <span>GPA</span>
            </span>
            <div className="flex items-baseline gap-1">
              <span
                className="text-lg font-black"
                style={{ color: styles.gpaValColor }}
              >
                {gpaNum.toFixed(2)}
              </span>
              <span className="text-[11px] text-muted-foreground font-medium">
                / 4.00
              </span>
            </div>
          </div>

          {/* GPA Progress Bar */}
          <div className="w-full h-2 rounded-full bg-border/40 dark:bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${Math.min(100, (gpaNum / 4) * 100)}%`,
                background: styles.gpaBar,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TopStudents({
  facultySlug,
  programSlug,
  primaryColor = "#003366",
  accentColor = "#e0a800",
}: TopStudentsProps) {
  const { language } = useLanguage();
  const { data: backendStudents } = useStudents();

  // Filter students: if programSlug provided and has matching top students, prioritize them; else use faculty top students
  const allCandidates = backendStudents || [];
  const programMatches = programSlug
    ? allCandidates.filter((s) => s.isTop && s.programSlug === programSlug)
    : [];

  const students = (programMatches.length > 0
    ? programMatches
    : allCandidates.filter((s) => s.isTop && s.facultySlug === facultySlug)
  ).sort((a, b) => {
    const rankA = a.rank && typeof a.rank === "number" ? a.rank : 99;
    const rankB = b.rank && typeof b.rank === "number" ? b.rank : 99;
    return rankA - rankB;
  });

  if (students.length === 0) return null;

  // Podium order for top 3: [2nd, 1st, 3rd]
  let podiumOrder: Student[] = [];
  if (students.length === 1) {
    podiumOrder = [students[0]];
  } else if (students.length === 2) {
    podiumOrder = [students[1], students[0]];
  } else {
    podiumOrder = [students[1], students[0], students[2]];
  }

  // Any additional students beyond top 3
  const remainingStudents = students.slice(3);

  return (
    <section className="py-14 sm:py-20 relative overflow-hidden">
      {/* Subtle identity background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full blur-[140px]"
          style={{
            background: `radial-gradient(circle, ${hexToRgba(accentColor, 0.15)} 0%, ${hexToRgba(primaryColor, 0.08)} 60%, transparent 100%)`,
          }}
        />
      </div>

      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="mb-12 text-center max-w-2xl mx-auto space-y-3">
          {/* Dual-Pill Indicator & Honor Badge */}
          <div className="inline-flex items-center gap-2 mb-1">
            <span
              className="w-2.5 h-6 rounded-full shrink-0"
              style={{ backgroundColor: primaryColor }}
            />
            <span
              className="w-1.5 h-4 rounded-full shrink-0"
              style={{ backgroundColor: accentColor }}
            />
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
              style={{
                backgroundColor: hexToRgba(accentColor, 0.12),
                borderColor: hexToRgba(accentColor, 0.3),
                color: accentColor,
              }}
            >
              <Trophy className="h-3.5 w-3.5" />
              <span>
                {language === "ar"
                  ? "لوحة الشرف الأكاديمي"
                  : "Academic Honor Roll"}
              </span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
            {language === "ar"
              ? "الطلاب الأوائل والمتفوقون"
              : "Top Outstanding Students"}
          </h2>

          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
            {language === "ar"
              ? "نفخر بفرسان التميز الأكاديمي الذين حققوا أعلى المراتب والمعدلات بجهدهم ومثابرتهم"
              : "Celebrating our top academic achievers who earned the highest GPAs through dedication and excellence"}
          </p>
        </div>

        {/* Podium Layout */}
        <div className="w-full">
          {/* Mobile list: simple stacked layout in 1st, 2nd, 3rd order */}
          <div className="flex flex-col gap-6 items-center md:hidden w-full max-w-sm mx-auto">
            {students.slice(0, 3).map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                primaryColor={primaryColor}
                accentColor={accentColor}
              />
            ))}
          </div>

          {/* Desktop podium: 2nd on side, 1st in center elevated, 3rd on side */}
          <div className="hidden md:flex items-end justify-center gap-6 lg:gap-8 max-w-5xl mx-auto">
            {podiumOrder.map((student) => {
              const isFirst = student.rank === 1;
              return (
                <div
                  key={student.id}
                  className={cn(
                    "flex-1 max-w-[320px] transition-all duration-300",
                    isFirst
                      ? "transform scale-105 -translate-y-2 z-10"
                      : "opacity-95"
                  )}
                >
                  <StudentCard
                    student={student}
                    primaryColor={primaryColor}
                    accentColor={accentColor}
                  />
                </div>
              );
            })}
          </div>

          {/* Additional Top Students (Rank 4+) */}
          {remainingStudents.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border/40 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {remainingStudents.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  primaryColor={primaryColor}
                  accentColor={accentColor}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

