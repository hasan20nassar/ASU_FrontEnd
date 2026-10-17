import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { GravityHero } from "@/components/home/gravity-hero";
import { StatsSection } from "@/components/home/stats-section";
import { FacultiesGrid } from "@/components/home/faculties-grid";
import { PartnersSection } from "@/components/home/partners-section";
import { NewsPreview } from "@/components/home/news-preview";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <GravityHero />
        <StatsSection />
        <FacultiesGrid />
        <PartnersSection />
        <NewsPreview />
      </main>
      <Footer />
    </div>
  );
}
