"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import { FacultyMember } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Crown,
  Mail,
  Sparkles,
  Play,
  Pause,
  ArrowRight,
  ArrowLeft,
  Check,
  Copy,
  Award,
  BookOpen,
} from "lucide-react";

interface StaffCarouselProps {
  staff: FacultyMember[];
  title?: string;
  subtitle?: string;
  badgeText?: string;
  viewAllHref?: string;
  viewAllText?: string;
  primaryColor?: string;
  accentColor?: string;
  className?: string;
  bgProps?: {
    className?: string;
    style?: React.CSSProperties;
    isSolid?: boolean;
  };
}

function hexToRgba(hex: string, alpha: number) {
  if (!hex || !hex.startsWith("#")) return `rgba(30, 58, 138, ${alpha})`;
  let c = hex.substring(1);
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const num = parseInt(c, 16);
  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
}

function getStaffRank(member: FacultyMember, isArabic: boolean) {
  if (member.isHead) {
    return {
      text: isArabic ? "رئيس القسم" : "Head of Dept",
      isHead: true,
      variant: "gold",
    };
  }
  const titleAr = member.titleAr || "";
  if (titleAr.includes("عميد")) {
    return {
      text: isArabic ? "عميد الكلية" : "Dean",
      isHead: true,
      variant: "gold",
    };
  }
  if (titleAr.includes("أستاذ دكتور") || titleAr.includes("أ.د")) {
    return {
      text: isArabic ? "أستاذ دكتور" : "Full Professor",
      isHead: false,
      variant: "primary",
    };
  }
  if (titleAr.includes("أستاذ مشارك")) {
    return {
      text: isArabic ? "أستاذ مشارك" : "Associate Professor",
      isHead: false,
      variant: "blue",
    };
  }
  if (titleAr.includes("أستاذ مساعد")) {
    return {
      text: isArabic ? "أستاذ مساعد" : "Assistant Professor",
      isHead: false,
      variant: "indigo",
    };
  }
  if (titleAr.includes("مدرس دكتور") || titleAr.includes("دكتور")) {
    return {
      text: isArabic ? "مدرس دكتور" : "Lecturer (PhD)",
      isHead: false,
      variant: "emerald",
    };
  }
  if (titleAr.includes("مشرف") || titleAr.includes("محاضر")) {
    return {
      text: isArabic ? "مشرف ومحاضر" : "Instructor",
      isHead: false,
      variant: "purple",
    };
  }
  if (titleAr.includes("مهندس") || titleAr.includes("م.")) {
    return {
      text: isArabic ? "مهندس وباحث" : "Engineer",
      isHead: false,
      variant: "cyan",
    };
  }
  return {
    text: isArabic ? "هيئة تدريسية" : "Faculty Member",
    isHead: false,
    variant: "default",
  };
}

export function AcademicsStaffCarousel({
  staff,
  title,
  subtitle,
  badgeText,
  viewAllHref,
  viewAllText,
  primaryColor = "#059669",
  accentColor = "#10B981",
  className = "",
  bgProps,
}: StaffCarouselProps) {
  const { language, dir } = useLanguage();
  const isArabic = language === "ar";

  const [isManualPaused, setIsManualPaused] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [speedMultiplier] = useState<"normal" | "slow">("normal");

  const handleCopyEmail = (email: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard?.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => {
      setCopiedEmail(null);
    }, 2000);
  };

  if (!staff || staff.length === 0) {
    return null;
  }

  // Ensure seamless loop: repeat list to guarantee width exceeds all screens
  const repeatCount = staff.length < 6 ? 4 : 2;
  const duplicatedStaff = Array.from({ length: repeatCount }, () => staff).flat();

  // Animation duration based on total count (calm, steady, and elegant flow)
  const baseDuration = Math.max(75, staff.length * 9.5); // e.g. 8 items -> 76 seconds
  const currentDuration = speedMultiplier === "slow" ? baseDuration * 1.5 : baseDuration;

  const isSolid = bgProps?.isSolid ?? false;
  const ReadMoreArrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  return (
    <section
      className={`py-14 sm:py-20 text-start overflow-hidden relative ${bgProps?.className || className}`}
      style={bgProps?.style}
    >
      <style>{`
        @keyframes staff-continuous-glide {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }

        .staff-marquee-track {
          display: flex;
          gap: 1.5rem;
          width: max-content;
          animation: staff-continuous-glide ${currentDuration}s linear infinite;
          will-change: transform;
        }

        /* Hover pauses the continuous glide instantly */
        .staff-marquee-viewport:hover .staff-marquee-track,
        .staff-marquee-track.track-paused {
          animation-play-state: paused !important;
        }

        /* Hover on individual card scales up and lifts */
        .staff-card-pop {
          position: relative;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.3s ease;
          will-change: transform, box-shadow;
        }

        .staff-card-pop:hover {
          transform: scale(1.06) translateY(-10px) translateZ(0);
          z-index: 50 !important;
        }

        .staff-card-pop:hover .staff-card-inner {
          border-color: ${hexToRgba(primaryColor, 0.55)} !important;
          box-shadow: 0 24px 45px -12px ${hexToRgba(primaryColor, 0.3)}, 0 0 0 1px ${hexToRgba(accentColor, 0.4)} !important;
        }
      `}</style>

      {/* 1. Header (Inside section-container for aligned margins) */}
      <div className="section-container">
        <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-2.5 h-6 rounded-full shrink-0"
                style={{ backgroundColor: primaryColor }}
              />
              <span
                className="w-1.5 h-4 rounded-full shrink-0"
                style={{ backgroundColor: accentColor }}
              />
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: hexToRgba(accentColor, 0.12),
                  color: accentColor,
                }}
              >
                <Users className="h-3.5 w-3.5" />
                <span>{subtitle || (isArabic ? "الهيئة التدريسية" : "Academic Faculty")}</span>
              </div>
            </div>

            <h2
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                isSolid ? "text-white" : "text-foreground"
              }`}
            >
              {title || (isArabic ? "دليل الكادر التدريسي والأكاديمي" : "Faculty Teaching Staff")}
            </h2>
            <p
              className={`text-xs sm:text-sm ${
                isSolid ? "text-white/80" : "text-muted-foreground"
              }`}
            >
              {isArabic
                ? "نخبة متميزة من الأساتذة والباحثين الحائزين على أرقى الدرجات الأكاديمية والخبرات العملية"
                : "Distinguished professors and scholars with cutting-edge academic excellence"}
            </p>
          </div>

          {/* Action & Control Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Badge
              variant="outline"
              className={`font-bold text-xs py-1.5 px-3 rounded-xl border ${
                isSolid ? "border-white/40 text-white" : ""
              }`}
              style={{
                borderColor: hexToRgba(primaryColor, 0.25),
                backgroundColor: hexToRgba(primaryColor, 0.05),
                color: primaryColor,
              }}
            >
              {badgeText || `${staff.length} ${isArabic ? "أساتذة وباحثين" : "Faculty Members"}`}
            </Badge>

            {/* Play / Pause Toggle Button */}
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setIsManualPaused((prev) => !prev)}
              className="h-9 w-9 rounded-xl border transition-all hover:scale-105 active:scale-95 shadow-xs"
              style={{
                borderColor: hexToRgba(primaryColor, 0.3),
              }}
              title={
                isManualPaused
                  ? isArabic
                    ? "استئناف الحركة"
                    : "Resume continuous motion"
                  : isArabic
                  ? "إيقاف الحركة مؤقتاً"
                  : "Pause continuous motion"
              }
            >
              {isManualPaused ? (
                <Play className="h-4 w-4" style={{ color: primaryColor }} />
              ) : (
                <Pause className="h-4 w-4" style={{ color: primaryColor }} />
              )}
            </Button>

            {/* View All CTA */}
            {viewAllHref && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="gap-1.5 font-bold rounded-xl text-xs border hover:shadow-xs transition-all"
                style={{
                  borderColor: hexToRgba(primaryColor, 0.3),
                }}
              >
                <Link href={viewAllHref}>
                  <span>{viewAllText || (isArabic ? "الدليل الكامل" : "Directory")}</span>
                  <ReadMoreArrow className="h-3.5 w-3.5" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Full-Width Edge-to-Edge Continuous Carousel (OUTSIDE section-container) */}
      <div className="relative w-full overflow-hidden py-4 staff-marquee-viewport">
        {/* Pure edge-to-edge flow with NO obscuring white lines or overlays */}
        <div
          className={`staff-marquee-track py-6 px-4 ${
            isManualPaused ? "track-paused" : ""
          }`}
        >
          {duplicatedStaff.map((member, index) => {
            const rankInfo = getStaffRank(member, isArabic);
            const departmentName = isArabic ? member.departmentAr : member.departmentEn;
            const doctorName = isArabic ? member.nameAr : member.nameEn;
            const doctorTitle = isArabic ? member.titleAr : member.titleEn;
            const isEmailCopied = copiedEmail === member.email;

            return (
              <div
                key={`${member.id}-${index}`}
                className="staff-card-pop w-[285px] sm:w-[315px] shrink-0 select-none group"
              >
                {/* Card Container without unwanted padding at the top */}
                <div
                  className="staff-card-inner h-full rounded-3xl overflow-hidden border bg-card text-card-foreground shadow-sm flex flex-col transition-all duration-300"
                  style={{
                    borderColor: hexToRgba(primaryColor, 0.18),
                    background: `linear-gradient(180deg, ${hexToRgba(primaryColor, 0.02)} 0%, var(--card) 100%)`,
                  }}
                >
                  {/* Top Prominent Doctor Photo Container (Flush at the top with 0px gap) */}
                  <div className="relative w-full h-[270px] sm:h-[300px] overflow-hidden bg-muted/40 shrink-0">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={doctorName}
                        fill
                        sizes="(max-width: 768px) 285px, 315px"
                        className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108 select-none"
                        draggable={false}
                        priority={index < 4}
                      />
                    ) : (
                      <div
                        className="w-full h-full flex flex-col items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${hexToRgba(primaryColor, 0.15)} 0%, ${hexToRgba(primaryColor, 0.05)} 100%)`,
                        }}
                      >
                        <Users className="h-16 w-16 mb-2" style={{ color: primaryColor, opacity: 0.6 }} />
                        <span className="font-bold text-sm text-muted-foreground">{doctorName}</span>
                      </div>
                    )}

                    {/* Photo Top Subtle Vignette & Bottom Card Blend */}
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/15 to-black/25 pointer-events-none" />

                    {/* Academic Rank Badge (Top Corner) */}
                    <div className="absolute top-3.5 end-3.5 z-10">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-sm border ${
                          rankInfo.isHead
                            ? "text-white"
                            : "bg-background/90 text-foreground border-border/80"
                        }`}
                        style={
                          rankInfo.isHead
                            ? {
                                backgroundColor: accentColor,
                                borderColor: hexToRgba(accentColor, 0.6),
                              }
                            : {}
                        }
                      >
                        {rankInfo.isHead ? (
                          <Crown className="h-3.5 w-3.5 text-white fill-white/80 animate-pulse" />
                        ) : (
                          <Award className="h-3.5 w-3.5" style={{ color: accentColor }} />
                        )}
                        <span>{rankInfo.text}</span>
                      </div>
                    </div>

                    {/* Department Badge (Bottom Corner of Photo) */}
                    {departmentName && (
                      <div className="absolute bottom-3 start-3.5 z-10">
                        <span
                          className="inline-block px-2.5 py-0.5 rounded-lg text-[11px] font-bold backdrop-blur-md shadow-xs border"
                          style={{
                            backgroundColor: hexToRgba(accentColor, 0.18),
                            color: accentColor,
                            borderColor: hexToRgba(accentColor, 0.35),
                          }}
                        >
                          {departmentName}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Content (Name, Role, and Contact) */}
                  <div className="p-5 pt-3.5 flex flex-col flex-1 justify-between space-y-3">
                    <div>
                      {/* Doctor's Name */}
                      <h3 className="font-extrabold text-base sm:text-lg text-foreground tracking-tight line-clamp-1 transition-colors duration-300 group-hover:text-primary">
                        {doctorName}
                      </h3>

                      {/* Academic Title & Specialization */}
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed font-normal min-h-[36px]">
                        {doctorTitle}
                      </p>
                    </div>

                    {/* Contact / Email Row */}
                    <div
                      className="pt-3 border-t flex items-center justify-between text-xs gap-2"
                      style={{ borderColor: hexToRgba(primaryColor, 0.12) }}
                    >
                      {member.email ? (
                        <>
                          <a
                            href={`mailto:${member.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors group/mail truncate flex-1"
                            title={member.email}
                          >
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 border transition-all group-hover/mail:scale-110"
                              style={{
                                backgroundColor: hexToRgba(primaryColor, 0.08),
                                borderColor: hexToRgba(primaryColor, 0.25),
                              }}
                            >
                              <Mail className="h-3.5 w-3.5" style={{ color: primaryColor }} />
                            </div>
                            <span className="truncate">{member.email}</span>
                          </a>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleCopyEmail(member.email, e)}
                            className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground shrink-0 transition-all hover:bg-muted"
                            title={isArabic ? "نسخ البريد الإلكتروني" : "Copy email"}
                          >
                            {isEmailCopied ? (
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <BookOpen className="h-3.5 w-3.5" style={{ color: primaryColor }} />
                          <span>{isArabic ? "جامعة أنطاكية السورية" : "Antioch Syrian University"}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Informative Hint (Inside section-container) */}
      <div className="section-container">
        <div className="mt-2 text-center text-xs text-muted-foreground/70 flex items-center justify-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" style={{ color: accentColor }} />
          <span>
            {isArabic
              ? "مرر مؤشر الماوس فوق بطاقة أي دكتور لتثبيت الحركة وتكبير الصورة والاطلاع على التفاصيل"
              : "Hover over any faculty card to pause the carousel and zoom in on details"}
          </span>
        </div>
      </div>
    </section>
  );
}
