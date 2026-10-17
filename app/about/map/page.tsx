"use client";

import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useLanguage } from "@/contexts/language-context";
import { CampusEvolution } from "@/components/about/campus-evolution";
import dynamic from "next/dynamic";

const CampusLeafletMap = dynamic(
  () =>
    import("@/components/about/campus-leaflet-map").then(
      (mod) => mod.CampusLeafletMap,
    ),
  { ssr: false },
);

export default function CampusMapPage() {
  const { language, t, dir } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="border-b bg-muted/30 py-12 sm:py-16">
          <div className="section-container">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
                {t("nav.map")}
              </h1>
              <p className="mx-auto mt-4 max-w-3xl text-muted-foreground">
                {language === "ar"
                  ? "استكشف أبنية وتفاصيل الحرم الجامعي لجامعة أنطاكية السورية مباشرة عبر الخريطة التفاعلية، وتعرف على مواقع الكليات ومرافق الجامعة المختلفة."
                  : "Explore the campus buildings and details of Antioch Syrian University directly through the interactive map, and learn the locations of faculties and various university facilities."}
              </p>
            </div>
          </div>
        </section>

        <div className="section-container py-12" dir={dir}>
          {/* Section 1: Leaflet Map */}
          <div className="mb-16">
            <div className="mb-6 text-start">
              <h2 className="text-2xl font-bold text-foreground">
                {language === "ar" ? "مخطط الحرم الجامعي" : "Campus Layout"}
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                {language === "ar"
                  ? "تصفّح المعالم والمباني الجامعية الأساسية."
                  : "Browse key university landmarks and buildings ."}
              </p>
            </div>
            <CampusLeafletMap />
          </div>

          {/* Section 2: Campus Evolution */}
          <div className="mt-16">
            <div className="mb-6 text-start">
              <h2 className="text-2xl font-bold text-foreground">
                {language === "ar"
                  ? "تطور البنية التحتية للحرم الجامعي"
                  : "Campus Infrastructure Evolution"}
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                {language === "ar"
                  ? "اسحب الشريط العمودي لليسار واليمين للمقارنة بين البنية التحتية للحرم الجامعي قديماً  والآن."
                  : "Drag the vertical slider left and right to compare the campus infrastructure between the past  and present."}
              </p>
            </div>
            <CampusEvolution />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
