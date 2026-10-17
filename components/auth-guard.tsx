"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();
  const { language } = useLanguage();

  const isProtectedPath = pathname.startsWith("/portal") || pathname.startsWith("/dashboard");

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

  return <>{children}</>;
}