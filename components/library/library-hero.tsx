"use client";

import { useLanguage } from "@/contexts/language-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function LibraryHero() {
  const { language, dir } = useLanguage();
  const isArabic = language === "ar";
  const router = useRouter();
  const [query, setQuery] = useState("");

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32">

      
      <div className="section-container relative z-10">
        <div className="mx-auto max-w-3xl text-center">

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-4">
            {isArabic ? "المكتبة المركزية للجامعة" : "University Central Library"}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-10 leading-relaxed">
            {isArabic
              ? "بوابتك المفتوحة نحو المعرفة. ابحث في آلاف الكتب والمراجع العلمية لدعم مسيرتك الأكاديمية والبحثية."
              : "Your open gateway to knowledge. Search through thousands of books and scientific references to support your academic and research journey."}
          </p>

          <form 
            className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto" 
            dir={dir}
            onSubmit={(e) => {
              e.preventDefault();
              if (query.trim()) {
                router.push(`/library/catalog?q=${encodeURIComponent(query.trim())}`);
              } else {
                router.push("/library/catalog");
              }
            }}
          >
            <div className="relative flex-1">
              <Search className={cn(
                "absolute top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground",
                dir === "rtl" ? "right-4" : "left-4"
              )} />
              <Input
                type="text"
                placeholder={isArabic ? "ابحث عن كتاب، مؤلف، أو موضوع..." : "Search for a book, author, or subject..."}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={cn(
                  "h-14 rounded-full bg-background border-primary/20 shadow-sm text-base placeholder:text-muted-foreground/70",
                  dir === "rtl" ? "pr-12 pl-6" : "pl-12 pr-6"
                )}
              />
            </div>
            <Button size="lg" className="h-14 rounded-full px-8 font-bold text-base shrink-0">
              {isArabic ? "بحث في الفهرس" : "Search Catalog"}
            </Button>
          </form>

          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground font-medium">
            <span>{isArabic ? "أكثر من 50,000 كتاب مطبوع" : "Over 50,000 printed books"}</span>
            <span className="hidden sm:inline">•</span>
            <span>{isArabic ? "مساحات دراسية مفتوحة 24/7" : "24/7 open study spaces"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
