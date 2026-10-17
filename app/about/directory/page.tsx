"use client";

import { FacultyDirectory } from "@/components/about/faculty-directory";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useLanguage } from "@/contexts/language-context";

export default function FacultyDirectoryPage() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/20">
        <div className="section-container py-12">
          <div className="mb-10 max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-primary">
              {t("nav.directory")}
            </h1>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              {t("nav.directory.description")}
            </p>
          </div>
          
          <FacultyDirectory />
        </div>
      </main>
      <Footer />
    </div>
  );
}
