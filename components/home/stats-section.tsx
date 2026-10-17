"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/language-context";
import { useFaculties } from "@/hooks/use-faculties";
import { universityInfo } from "@/data/contact";
import { Counter } from "@/components/ui/counter";
import { Building2, GraduationCap, Users } from "lucide-react";

export function StatsSection() {
  const { language, t } = useLanguage();
  const { data: backendFaculties } = useFaculties();
  const faculties = backendFaculties || [];
  const facultyCount = faculties.length;
  const programCount = faculties.reduce((acc, f) => acc + (f.programs?.length || 0), 0);

  return (
    <section className="bg-background py-16">
      <div className="section-container">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <motion.div
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div className="text-4xl font-bold text-foreground">
              <Counter value={facultyCount} />
            </div>
            <div className="mt-1 text-muted-foreground">{t("stats.faculties")}</div>
            <div className="absolute -bottom-4 -end-4 h-24 w-24 rounded-full bg-primary/5 transition-transform group-hover:scale-150" />
          </motion.div>

          <motion.div
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div className="text-4xl font-bold text-foreground">
              <Counter value={programCount} />+
            </div>
            <div className="mt-1 text-muted-foreground">
              {language === "ar" ? "برنامج أكاديمي" : "Academic Programs"}
            </div>
            <div className="absolute -bottom-4 -end-4 h-24 w-24 rounded-full bg-primary/5 transition-transform group-hover:scale-150" />
          </motion.div>

          <motion.div
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg sm:col-span-2 lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="text-xl font-semibold text-foreground">
                  {t("stats.system")}
                </div>
                <div className="mt-1 text-muted-foreground">{t("stats.campus")}</div>
              </div>
              <div className="text-end">
                <div className="text-3xl font-bold text-primary">
                  <Counter value={universityInfo.stats.students} />+
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("stats.students")}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -end-4 h-24 w-24 rounded-full bg-primary/5 transition-transform group-hover:scale-150" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

