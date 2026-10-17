"use client";

import React from "react";
import { useLanguage } from "@/contexts/language-context";
import {
  School,
  Building2,
  Landmark,
  GraduationCap,
  Award,
  BookOpen,
  Briefcase,
  Library,
  Globe,
  HeartHandshake,
} from "lucide-react";

const partners = [
  { id: 1, icon: School },
  { id: 2, icon: Building2 },
  { id: 3, icon: Landmark },
  { id: 4, icon: GraduationCap },
  { id: 5, icon: Award },
  { id: 6, icon: BookOpen },
  { id: 7, icon: Briefcase },
  { id: 8, icon: Library },
  { id: 9, icon: Globe },
  { id: 10, icon: HeartHandshake },
];

export function PartnersSection() {
  const { language, dir } = useLanguage();

  // Duplicate partners to allow seamless infinite loop scrolling
  const triplePartners = [...partners, ...partners, ...partners];

  return (
    <section className="py-16 sm:py-24 bg-background">
      {/* Self-contained CSS Marquee styles with hover control */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee-rtl {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.3333%); }
        }
        @keyframes marquee-ltr {
          0% { transform: translateX(-33.3333%); }
          100% { transform: translateX(0%); }
        }
        .marquee-track {
          display: flex;
          gap: 6rem; /* gap-24 equivalent */
          align-items: center;
          width: max-content;
          animation-name: ${dir === "rtl" ? "marquee-rtl" : "marquee-ltr"};
          animation-duration: 25s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .marquee-container:hover .marquee-track {
          animation-play-state: paused;
        }
      `}} />

      <div className="section-container">
        {/* Header */}
        <div className="mb-12 text-start">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            {language === "ar" ? "شركاء النجاح" : "Success Partners"}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {language === "ar"
              ? "مؤسسات وشركات شريكة في تحقيق التميز الأكاديمي والعملي"
              : "Partner organizations contributing to academic and practical excellence"}
          </p>
        </div>

        {/* Infinite Marquee Scroll Container */}
        <div 
          dir="ltr"
          className="marquee-container relative w-full overflow-hidden py-4"
          style={{
            WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
            maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
          }}
        >
          <div className="marquee-track">
            {triplePartners.map((partner, idx) => {
              const Icon = partner.icon;
              return (
                <div
                  key={idx}
                  className="w-16 h-16 flex items-center justify-center flex-shrink-0 transition-all duration-300 ease-out origin-center hover:scale-[1.3] hover:text-primary dark:hover:text-primary z-0 hover:z-10 cursor-pointer"
                >
                  <Icon className="w-16 h-16 text-[#4A5568] dark:text-[#E2E8F0] transition-colors duration-300" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
