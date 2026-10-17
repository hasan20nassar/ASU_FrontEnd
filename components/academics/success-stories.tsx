"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/language-context";
import { useAlumniStories } from "@/hooks/use-alumni-stories";
import { GraduationCap, Briefcase, Building2, Quote, Sparkles } from "lucide-react";

interface SuccessStoriesProps {
  facultySlug: string;
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

export function SuccessStories({
  facultySlug,
  primaryColor = "#003366",
  accentColor = "#e0a800",
}: SuccessStoriesProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const { data: alumniStories } = useAlumniStories();
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);

  const stories = (alumniStories || []).filter(
    (story) => story.facultySlug === facultySlug
  );

  if (stories.length === 0) return null;

  return (
    <section className="py-16 bg-muted/10 relative overflow-hidden border-t border-border dark:border-white/5">
      {/* Background visual decorations matching identity */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-25">
        <div
          className="absolute top-[20%] right-[10%] w-[25vw] h-[25vw] rounded-full blur-[100px] animate-pulse"
          style={{ backgroundColor: hexToRgba(primaryColor, 0.12) }}
        />
        <div
          className="absolute bottom-[20%] left-[10%] w-[30vw] h-[30vw] rounded-full blur-[120px]"
          style={{ backgroundColor: hexToRgba(accentColor, 0.1) }}
        />
      </div>

      <div className="section-container relative z-10">
        {/* Section Title with Dual-Pill Indicator */}
        <div className="mb-12 text-center max-w-2xl mx-auto space-y-3">
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
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isArabic ? "سفراء النجاح" : "Success Ambassadors"}</span>
            </div>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {isArabic ? "قصص نجاح خريجينا" : "Alumni Success Stories"}
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {isArabic
              ? "نفخر بخريجي جامعة أنطاكية السورية الذين يقودون التطور والتميز في مختلف قطاعات سوق العمل والبحث العلمي."
              : "We take pride in ASU graduates who are leading innovation and excellence in various sectors of the job market and research."}
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {stories.map((story) => {
            const isHovered = hoveredCardId === story.id;
            return (
              <div
                key={story.id}
                onMouseEnter={() => setHoveredCardId(story.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                className="group relative flex flex-col justify-between bg-card dark:bg-slate-950/40 border rounded-3xl p-6 md:p-8 transition-all duration-300 shadow-sm"
                style={{
                  borderColor: isHovered
                    ? hexToRgba(primaryColor, 0.4)
                    : "var(--border)",
                  boxShadow: isHovered
                    ? `0 14px 35px ${hexToRgba(primaryColor, 0.12)}`
                    : undefined,
                  transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                }}
              >
                {/* Spine/Side accent indicator */}
                <div
                  className="absolute top-0 bottom-0 left-0 w-1 transition-all duration-500 rtl:right-0 rtl:left-auto rounded-full"
                  style={{
                    background: isHovered
                      ? `linear-gradient(to bottom, transparent, ${primaryColor}, transparent)`
                      : `linear-gradient(to bottom, transparent, ${hexToRgba(primaryColor, 0.4)}, transparent)`,
                  }}
                />

                <div className="space-y-6">
                  {/* Header: Photo and details */}
                  <div className="flex items-center gap-4 text-start">
                    <div
                      className="relative h-16 w-16 md:h-20 md:w-20 shrink-0 rounded-2xl overflow-hidden border-2 shadow-md transition-all duration-300"
                      style={{
                        borderColor: isHovered
                          ? primaryColor
                          : hexToRgba(primaryColor, 0.25),
                      }}
                    >
                      <Image
                        src={story.image || "/images/alumni/default.png"}
                        alt={isArabic ? story.nameAr : story.nameEn}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 80px, 100px"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3
                        className="font-extrabold text-lg md:text-xl text-foreground transition-colors"
                        style={{
                          color: isHovered ? primaryColor : undefined,
                        }}
                      >
                        {isArabic ? story.nameAr : story.nameEn}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground mt-1 font-medium">
                        <span className="flex items-center gap-1">
                          <GraduationCap
                            className="h-3.5 w-3.5"
                            style={{ color: primaryColor }}
                          />
                          {isArabic ? story.programAr : story.programEn} (
                          {story.graduationYear})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Body Quote */}
                  <div className="relative bg-muted/30 dark:bg-slate-900/20 p-5 rounded-2xl border border-border/50 dark:border-white/5">
                    <Quote
                      className="absolute -top-3 right-4 rtl:left-4 rtl:right-auto h-8 w-8 transform rotate-12 transition-colors"
                      style={{
                        color: hexToRgba(accentColor, 0.25),
                      }}
                    />
                    <p className="text-sm text-foreground/90 leading-relaxed text-start italic">
                      &ldquo;{isArabic ? story.storyAr : story.storyEn}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Footer: Career placement info */}
                <div className="mt-6 pt-4 border-t border-border dark:border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-start">
                  <div className="flex items-center gap-2 text-xs">
                    <Briefcase
                      className="h-4 w-4 shrink-0"
                      style={{ color: primaryColor }}
                    />
                    <span className="font-bold text-foreground/80">
                      {isArabic ? story.currentRoleAr : story.currentRoleEn}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Building2 className="h-4 w-4 text-slate-500 shrink-0" />
                    <span className="truncate max-w-[180px]">
                      {isArabic ? story.companyAr : story.companyEn}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

