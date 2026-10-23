"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/language-context";
import { useSiteSettings } from "@/contexts/site-settings-context";
import { useFaculties } from "@/hooks/use-faculties";
import { Faculty } from "@/lib/api/models/Faculty";
import { Button } from "@/components/ui/button";
import { TiltCard } from "@/components/ui/tilt-card";
import { Magnetic } from "@/components/ui/magnetic";
import Image from "next/image";
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

function FacultyHomeCard({ faculty }: { faculty: Faculty }) {
  const { language, dir } = useLanguage();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const [isHovered, setIsHovered] = useState(false);
  const Icon = (faculty.icon && iconMap[faculty.icon]) || BookOpen;
  const primaryColor = faculty.primaryColor || "#003366";
  const accentColor = faculty.accentColor || "#e0a800";

  return (
    <Link
      href={`/academics/${faculty.slug}`}
      className="group block h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <TiltCard tiltAmount={6} scale={1.02} className="h-full">
        <div
          className="group relative h-full overflow-hidden rounded-2xl border bg-card transition-all duration-300 flex flex-col justify-between"
          style={{
            borderColor: isHovered
              ? hexToRgba(primaryColor, 0.45)
              : "var(--border)",
            boxShadow: isHovered
              ? `0 12px 30px ${hexToRgba(primaryColor, 0.12)}`
              : "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          {/* Top Identity Line */}
          <div
            className="w-full shrink-0 h-1 transition-opacity duration-300"
            style={{
              background: `linear-gradient(90deg, ${primaryColor} 0%, ${accentColor} 100%)`,
              opacity: isHovered ? 1 : 0.75,
            }}
          />

          {faculty.image && (
            <div className="relative h-32 w-full overflow-hidden">
              <Image
                src={faculty.image}
                alt={language === "ar" ? faculty.nameAr : faculty.nameEn}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
            </div>
          )}

          <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
            <div>
              {/* Faculty Logo / Icon Container */}
              <div
                className={cn(
                  "mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl border bg-background p-2 transition-transform duration-300 group-hover:scale-105 overflow-hidden",
                  faculty.image && "relative -mt-12 border-2 border-card shadow-md"
                )}
                style={{
                  borderColor: isHovered
                    ? hexToRgba(primaryColor, 0.5)
                    : hexToRgba(primaryColor, 0.25),
                  boxShadow: `0 4px 14px ${hexToRgba(primaryColor, 0.08)}`,
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
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                  </div>
                )}
              </div>

              {/* Title */}
              <h3
                className="text-base sm:text-lg font-bold text-foreground transition-colors line-clamp-1"
                style={{ color: isHovered ? primaryColor : undefined }}
              >
                {language === "ar" ? faculty.nameAr : faculty.nameEn}
              </h3>

              {/* Description */}
              <p className="mt-2 line-clamp-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {language === "ar"
                  ? faculty.descriptionAr
                  : faculty.descriptionEn}
              </p>
            </div>

            {/* Footer with Programs Badge & Arrow */}
            <div className="mt-5 pt-3 border-t border-border/50 flex items-center justify-between">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-md border"
                style={{
                  backgroundColor: hexToRgba(primaryColor, 0.06),
                  borderColor: hexToRgba(primaryColor, 0.2),
                  color: primaryColor,
                }}
              >
                {faculty.programs?.length || 0}{" "}
                {language === "ar" ? "برامج" : "programs"}
              </span>

              <div
                className="flex items-center gap-1 text-xs font-bold transition-all"
                style={{ color: primaryColor }}
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                  {language === "ar" ? "استكشف" : "Explore"}
                </span>
                <Arrow className="h-4 w-4 transform transition-transform group-hover:translate-x-[-2px] rtl:group-hover:translate-x-[2px]" />
              </div>
            </div>
          </div>
        </div>
      </TiltCard>
    </Link>
  );
}

export function FacultiesGrid() {
  const { language, t, dir } = useLanguage();
  const { isPagePublished } = useSiteSettings();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

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

  if (!isPagePublished("/academics") || displayFaculties.length === 0) {
    return null;
  }

  return (
    <section className="bg-muted/30 py-16 sm:py-24">
      <div className="section-container">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            {language === "ar" ? "البرامج والكليات" : "Programs and Faculties"}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {language === "ar"
              ? "برامج أكاديمية متنوعة تلبي تطلعاتك المهنية"
              : "Diverse academic programs to meet your career aspirations"}
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6">
          {displayFaculties.map((faculty, index) => (
            <motion.div
              key={faculty.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <FacultyHomeCard faculty={faculty} />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Magnetic strength={0.3} radius={100}>
            <Link href="/academics">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 bg-transparent"
              >
                {t("common.viewAll")}
                <Arrow className="h-4 w-4" />
              </Button>
            </Link>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  );
}
