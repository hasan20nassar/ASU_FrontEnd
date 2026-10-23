"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { useSiteSettings } from "@/contexts/site-settings-context";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { NotFoundContent } from "@/components/layout/not-found-content";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();
  const { language } = useLanguage();
  const { isPagePublished } = useSiteSettings();

  const isProtectedPath = pathname.startsWith("/portal") || pathname.startsWith("/dashboard");
  const isSystemPath = isProtectedPath || pathname.startsWith("/login") || pathname === "/";
  const isUnpublishedPublicPage = !isSystemPath && !isPagePublished(pathname);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && isProtectedPath) {
        toast.error(
          language === "ar"
            ? "يرجى تسجيل الدخول للوصول إلى هذه الصفحة"
            : "Please log in to access this page"
        );
        router.push("/login");
      } else if (isAuthenticated && pathname === "/login") {
        router.push("/");
      }
    }
  }, [isAuthenticated, isLoading, pathname, router, isProtectedPath, language]);

  // Prevent flicker while checking auth on protected routes
  if (isLoading && isProtectedPath) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // Prevent rendering if not authenticated on a protected route while redirecting
  if (!isAuthenticated && isProtectedPath) {
    return null;
  }

  // Block public visitors from viewing unpublished pages via direct URL
  if (isUnpublishedPublicPage) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col justify-center">
          <NotFoundContent />
        </main>
        <Footer />
      </div>
    );
  }

  return <>{children}</>;
}
