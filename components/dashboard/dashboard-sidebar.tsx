"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  Building2,
  GraduationCap,
  Newspaper,
  Settings,
  Sliders,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  UserCheck,
  Briefcase,
  ShieldCheck,
  FileText,
  BookMarked,
  Microscope,
  Sparkles,
  Layers,
} from "lucide-react";
import { ASULogo } from "@/components/ui/asu-logo";
import { cn } from "@/lib/utils";

export function DashboardSidebar() {
  const { language, dir } = useLanguage();
  const pathname = usePathname();

  const menuGroups = [
    {
      label: language === "ar" ? "الرئيسية" : "Main",
      items: [
        {
          title: language === "ar" ? "لوحة التحكم" : "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: language === "ar" ? "مدير الصفحات" : "Pages Manager",
          href: "/dashboard/pages-manager",
          icon: Layers,
        },
      ],
    },
    {
      label: language === "ar" ? "إدارة المستخدمين" : "User Management",
      items: [
        {
          title: language === "ar" ? "مدراء النظام" : "System Admins",
          href: "/dashboard/admins",
          icon: ShieldCheck,
        },
        {
          title: language === "ar" ? "إدارة المحتوى" : "Content Managers",
          href: "/dashboard/content-managers",
          icon: FileText,
        },
        {
          title: language === "ar" ? "أعضاء التدريس" : "Faculty Members",
          href: "/dashboard/faculty-members",
          icon: Users,
        },
        {
          title: language === "ar" ? "الطلاب" : "Students",
          href: "/dashboard/students",
          icon: GraduationCap,
        },
        {
          title: language === "ar" ? "الخريجين" : "Alumni",
          href: "/dashboard/alumni",
          icon: Briefcase,
        },
      ],
    },
    {
      label: language === "ar" ? "الأكاديميات" : "Academics",
      items: [
        {
          title: language === "ar" ? "الكليات" : "Faculties",
          href: "/dashboard/faculties",
          icon: Building2,
        },
        {
          title: language === "ar" ? "الأقسام" : "Departments",
          href: "/dashboard/programs",
          icon: BookOpen,
        },
        {
          title: language === "ar" ? "المكتبة" : "Library",
          href: "/dashboard/library",
          icon: BookMarked,
        },
        {
          title: language === "ar" ? "البحث العلمي" : "Research",
          href: "/dashboard/research",
          icon: Microscope,
        },
      ],
    },
    {
      label: language === "ar" ? "المحتوى والتواصل" : "Content & Communication",
      items: [
        {
          title: language === "ar" ? "الأخبار والفعاليات" : "News & Events",
          href: "/dashboard/news",
          icon: Newspaper,
        },
        {
          title: language === "ar" ? "الحياة الجامعية" : "Campus Life",
          href: "/dashboard/campus-life",
          icon: Sparkles,
        },
      ],
    },
  ];

  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" side={language === "ar" ? "right" : "left"} className="border-e">
      <SidebarHeader className="p-4 flex items-center justify-center">
        <Link href="/" className="flex items-center gap-2">
          {isCollapsed ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <GraduationCap className="h-5 w-5 font-bold" />
            </div>
          ) : (
            <ASULogo imageClassName="h-8 w-auto" priority />
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {menuGroups.map((group, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2 transition-all duration-200",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Link href={item.href}>
                          <item.icon className={cn("h-5 w-5", isActive ? "text-sidebar-accent-foreground" : "text-primary")} />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/dashboard/site-settings"}
              className={cn(
                "flex items-center gap-3 px-4 py-2 transition-all duration-200",
                pathname === "/dashboard/site-settings"
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <Link href="/dashboard/site-settings">
                <Sliders className={cn("h-5 w-5", pathname === "/dashboard/site-settings" ? "text-sidebar-accent-foreground" : "text-primary")} />
                <span className="font-medium">
                  {language === "ar" ? "إعدادات النظام" : "System Settings"}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => {
                localStorage.removeItem("asu_auth");
                window.location.href = "/";
              }}
              className="flex items-center gap-3 px-4 py-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">
                {language === "ar" ? "تسجيل الخروج" : "Logout"}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
