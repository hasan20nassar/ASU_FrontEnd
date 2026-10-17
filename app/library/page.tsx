import { Metadata } from "next";
import { Suspense } from "react";
import CatalogClient from "@/components/library/catalog-client";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "المكتبة وفهرس المراجع والكتب | University Library - Antioch Syrian University",
  description: "ابحث في المجموعات الأكاديمية والمراجع العلمية في مكتبة جامعة أنطاكية السورية، واستعر الكتب وحمل النسخ الرقمية مباشرة.",
};

export default function LibraryPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col bg-background justify-between">
          <Navbar />
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground mt-4 font-medium">جاري تحميل مكتبة وفهرس جامعة أنطاكية السورية...</p>
          </div>
          <Footer />
        </div>
      }
    >
      <CatalogClient />
    </Suspense>
  );
}
