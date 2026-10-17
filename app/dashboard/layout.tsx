"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { useLanguage } from "@/contexts/language-context";
import { useAuth, getUserRole, getRoleRedirectPath } from "@/contexts/auth-context";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { dir } = useLanguage();
  const { user, isAuthenticated, isLoading } = useAuth();
  const userRole = getUserRole(user);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (userRole !== "admin" && userRole !== "content_manager") {
        // Non-admin / non-content_manager users are redirected to their dedicated portal
        router.push(getRoleRedirectPath(userRole));
      }
    }
  }, [isLoading, isAuthenticated, userRole, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || (userRole !== "admin" && userRole !== "content_manager")) {
    return null;
  }


  return (
    <SidebarProvider className="max-w-full overflow-x-hidden">
      <div className="flex min-h-screen w-full max-w-full min-w-0 overflow-x-hidden bg-muted/30" dir={dir}>
        <DashboardSidebar />
        <SidebarInset className="flex flex-col min-w-0 max-w-full overflow-x-hidden">
          <DashboardHeader />
          <main className="flex-1 p-4 md:p-6 lg:p-8 min-w-0 max-w-full overflow-x-hidden">
            <div className="mx-auto max-w-7xl space-y-8 w-full min-w-0">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
