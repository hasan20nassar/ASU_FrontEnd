"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowRight, ArrowLeft, Building2, Users, Award } from "lucide-react";
import { universityInfo } from "@/data/contact";

export function Hero() {
  const { language, t, dir } = useLanguage();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  return (
    <section className="relative overflow-hidden bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80000008_1px,transparent_1px),linear-gradient(to_bottom,#80000008_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

      <div className="section-container relative py-16 sm:py-24 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
          {/* Content */}
          <div className="flex flex-col justify-center">
            {/* Badge */}
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {language === "ar" ? "تأسست عام 2017" : "Established 2017"}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {language === "ar" ? (
                <>
                  جامعة{" "}
                  <span className="text-primary">أنطاكية</span>{" "}
                  السورية
                </>
              ) : (
                <>
                  <span className="text-primary">Antioch</span> Syrian
                  <br />
                  University
                </>
              )}
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-xl text-pretty text-lg text-muted-foreground">
              {t("hero.description")}
            </p>

            {/* Affiliation */}
            <p className="mt-4 text-sm text-muted-foreground">
              {language === "ar"
                ? universityInfo.affiliation.ar
                : universityInfo.affiliation.en}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/admissions">
                <Button size="lg" className="gap-2">
                  {t("hero.cta.admissions")}
                  <Arrow className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/academics">
                <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                  {t("hero.cta.explore")}
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div className="text-4xl font-bold text-foreground">
                {universityInfo.stats.faculties}
              </div>
              <div className="mt-1 text-muted-foreground">
                {t("stats.faculties")}
              </div>
              <div className="absolute -bottom-4 -end-4 h-24 w-24 rounded-full bg-primary/5 transition-transform group-hover:scale-150" />
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div className="text-4xl font-bold text-foreground">
                {universityInfo.stats.programs}+
              </div>
              <div className="mt-1 text-muted-foreground">
                {language === "ar" ? "برنامج أكاديمي" : "Academic Programs"}
              </div>
              <div className="absolute -bottom-4 -end-4 h-24 w-24 rounded-full bg-primary/5 transition-transform group-hover:scale-150" />
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg sm:col-span-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-xl font-semibold text-foreground">
                    {t("stats.system")}
                  </div>
                  <div className="mt-1 text-muted-foreground">
                    {t("stats.campus")}
                  </div>
                </div>
                <div className="text-end">
                  <div className="text-3xl font-bold text-primary">
                    {universityInfo.stats.students.toLocaleString()}+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("stats.students")}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -end-4 h-24 w-24 rounded-full bg-primary/5 transition-transform group-hover:scale-150" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
