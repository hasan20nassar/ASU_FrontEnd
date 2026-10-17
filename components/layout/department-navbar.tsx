"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";
import { useTheme } from "@/contexts/theme-context";
import { useAuth, getUserRole, getRoleRedirectPath } from "@/contexts/auth-context";
import { ASULogo } from "@/components/ui/asu-logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Search,
  Globe,
  Sun,
  Moon,
  User as UserIcon,
  LayoutDashboard,
  LogOut,
  Settings,
  BookOpen,
  FlaskConical,
  Briefcase,
  Users,
  DollarSign,
  Crown,
  BarChart3,
  GraduationCap,
  Menu,
  Building2,
  Phone,
  Home,
  School,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

function hexToRgba(hex: string, alpha: number) {
  if (!hex || !hex.startsWith("#")) return `rgba(30, 58, 138, ${alpha})`;
  let c = hex.substring(1);
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const num = parseInt(c, 16);
  if (isNaN(num)) return `rgba(30, 58, 138, ${alpha})`;
  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
}

interface DepartmentNavbarProps {
  faculty: {
    nameAr: string;
    nameEn: string;
    slug: string;
  };
  program: {
    id?: number | string;
    nameAr: string;
    nameEn: string;
    slug: string;
    primaryColor?: string;
    accentColor?: string;
    logoUrl?: string;
    duration?: number;
    creditHours?: number;
    courses?: any[];
  };
  primaryColor: string;
  accentColor: string;
}

export function DepartmentNavbar({
  faculty,
  program,
  primaryColor,
  accentColor,
}: DepartmentNavbarProps) {
  const { language, setLanguage, dir } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const isArabic = language === "ar";
  const userRole = getUserRole(user);

  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Keyboard shortcut Ctrl+K to open department search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const jumpToSection = (sectionId: string) => {
    setSearchOpen(false);
    setIsMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Department quick navigation items
  const departmentSections = [
    {
      id: "curriculum",
      labelAr: "الخطة الدراسية وتوزيع المقررات",
      labelEn: "Curriculum & Study Plan",
      icon: BookOpen,
      keywords: "خطة مقررات مواد دراسة فصل سنة syllabus courses",
    },
    {
      id: "stats",
      labelAr: "أرقام وإحصائيات التخصص",
      labelEn: "Department Statistics",
      icon: BarChart3,
      keywords: "إحصائيات أرقام طلاب ساعات رسوم معدل قبول numbers stats",
    },
    {
      id: "head",
      labelAr: "كلمة رئيس القسم",
      labelEn: "Head of Department Message",
      icon: Crown,
      keywords: "رئيس القسم عمادة كلمة رسالة رؤية head message dean",
    },
    {
      id: "career_paths",
      labelAr: "الفرص والآفاق المهنية للخريجين",
      labelEn: "Career Paths & Opportunities",
      icon: Briefcase,
      keywords: "وظائف عمل مهنة فرص شركات توظيف career jobs",
    },
    {
      id: "facilities",
      labelAr: "المختبرات والمشاغل التخصصية",
      labelEn: "Specialized Laboratories & Labs",
      icon: FlaskConical,
      keywords: "مخابر مختبرات ورش أجهزة حواسيب labs equipment",
    },
    {
      id: "staff",
      labelAr: "دليل أساتذة وكادر القسم",
      labelEn: "Department Faculty Staff",
      icon: Users,
      keywords: "أساتذة دكاترة كادر هيئة تدريسية مدرسين faculty staff professors",
    },
    {
      id: "admissions-fees",
      labelAr: "شروط القبول والرسوم والأقساط",
      labelEn: "Admissions Criteria & Tuition Fees",
      icon: DollarSign,
      keywords: "رسوم أقساط تكلفة منحة قبول شروط ثانوية tuition admission fees",
    },
  ];

  return (
    <>
      <style>{`
        /* Department Header Hover Styling */
        .dept-breadcrumb-link {
          transition: color 0.15s ease-in-out;
        }
        .dept-breadcrumb-link:hover {
          color: ${primaryColor} !important;
          text-decoration: underline;
        }
        .dept-nav-icon-btn {
          color: var(--muted-foreground);
          transition: all 0.2s ease-in-out;
        }
        .dept-nav-icon-btn:hover {
          background-color: ${hexToRgba(primaryColor, 0.12)} !important;
          color: ${primaryColor} !important;
        }
        .dept-search-btn {
          transition: all 0.2s ease-in-out;
        }
        .dept-search-btn:hover {
          background-color: ${hexToRgba(primaryColor, 0.16)} !important;
          box-shadow: 0 0 0 2px ${hexToRgba(primaryColor, 0.25)} !important;
        }
        .dept-avatar-btn {
          transition: all 0.2s ease-in-out;
        }
        .dept-avatar-btn:hover {
          box-shadow: 0 0 0 3px ${primaryColor} !important;
          transform: scale(1.05);
        }

        /* User Dropdown Menu Item Hover Styling */
        .dept-dropdown-menu [data-slot="dropdown-menu-item"]:not([data-variant="destructive"]):hover,
        .dept-dropdown-menu [data-slot="dropdown-menu-item"]:not([data-variant="destructive"]):focus {
          background-color: ${hexToRgba(primaryColor, 0.1)} !important;
          color: ${primaryColor} !important;
        }
        .dept-dropdown-menu [data-slot="dropdown-menu-item"]:not([data-variant="destructive"]):hover svg,
        .dept-dropdown-menu [data-slot="dropdown-menu-item"]:not([data-variant="destructive"]):focus svg {
          color: ${primaryColor} !important;
        }

        /* Department Search Command Dialog Theming */
        .dept-command-dialog {
          --accent: ${primaryColor} !important;
          --accent-foreground: #ffffff !important;
          border-color: ${hexToRgba(primaryColor, 0.25)} !important;
        }
        .dept-command-dialog [data-slot="command-input-wrapper"] {
          border-bottom-color: ${hexToRgba(primaryColor, 0.16)} !important;
        }
        .dept-command-dialog [data-slot="command-input-wrapper"] svg {
          color: ${primaryColor} !important;
        }
        .dept-command-dialog [cmdk-group-heading] {
          color: ${primaryColor} !important;
          font-weight: 700 !important;
        }
        .dept-command-dialog [data-slot="command-item"][data-selected="true"],
        .dept-command-dialog [cmdk-item][data-selected="true"],
        .dept-command-dialog [data-slot="command-item"]:hover,
        .dept-command-dialog [cmdk-item]:hover {
          background-color: ${primaryColor} !important;
          color: #ffffff !important;
        }
        .dept-command-dialog [data-slot="command-item"][data-selected="true"] *,
        .dept-command-dialog [cmdk-item][data-selected="true"] *,
        .dept-command-dialog [data-slot="command-item"]:hover * {
          color: #ffffff !important;
        }
        .dept-command-dialog [data-slot="command-item"][data-selected="true"] .dept-icon-box,
        .dept-command-dialog [cmdk-item][data-selected="true"] .dept-icon-box,
        .dept-command-dialog [data-slot="command-item"]:hover .dept-icon-box {
          background-color: rgba(255, 255, 255, 0.25) !important;
          color: #ffffff !important;
        }
        .dept-command-dialog [data-slot="command-item"][data-selected="true"] .dept-course-code,
        .dept-command-dialog [cmdk-item][data-selected="true"] .dept-course-code,
        .dept-command-dialog [data-slot="command-item"]:hover .dept-course-code {
          background-color: rgba(255, 255, 255, 0.25) !important;
          color: #ffffff !important;
        }
      `}</style>

      <header
        className="sticky top-0 z-50 w-full border-b bg-background/85 backdrop-blur-md shadow-xs transition-all"
        style={{
          borderBottomColor: hexToRgba(primaryColor, 0.18),
          backgroundColor: hexToRgba(primaryColor, 0.02),
        }}
      >
        <div className="section-container flex h-16 items-center justify-between gap-2 sm:gap-4">
          {/* Right Side (Start in RTL): University Logo + Divider + Hierarchy Breadcrumb (Desktop) */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* University Logo */}
            <Link
              href="/"
              className="flex items-center shrink-0 transition-opacity hover:opacity-90"
              title={isArabic ? "جامعة أنطاكية السورية" : "Antioch Syrian University"}
            >
              <ASULogo priority imageClassName="max-h-8 sm:max-h-9" />
            </Link>

            {/* Subtle Divider - Desktop Only */}
            <div
              className="hidden md:block h-5 sm:h-6 w-px shrink-0"
              style={{ backgroundColor: hexToRgba(primaryColor, 0.25) }}
            />

            {/* Department Hierarchy Breadcrumb - Desktop Only */}
            <nav className="hidden md:flex items-center flex-wrap gap-1 sm:gap-2 text-xs sm:text-sm md:text-base font-semibold min-w-0">
              <Link
                href="/academics"
                className="dept-breadcrumb-link text-muted-foreground transition-colors shrink-0"
              >
                {isArabic ? "الكليات" : "Faculties"}
              </Link>

              <span className="text-muted-foreground/40 text-xs sm:text-sm select-none">/</span>

              <Link
                href={`/academics/${faculty.slug}`}
                className="dept-breadcrumb-link text-muted-foreground transition-colors truncate max-w-[130px] lg:max-w-none"
              >
                {isArabic ? faculty.nameAr : faculty.nameEn}
              </Link>

              <span className="text-muted-foreground/40 text-xs sm:text-sm select-none">/</span>

              <span
                className="font-bold tracking-tight truncate max-w-[160px] lg:max-w-none flex items-center gap-1.5"
                style={{ color: primaryColor }}
              >
                <span className="w-1.5 h-1.5 rounded-full shrink-0 inline-block" style={{ backgroundColor: accentColor }} />
                <span>{isArabic ? program.nameAr : program.nameEn}</span>
              </span>
            </nav>
          </div>

          {/* Left Side (End in RTL): Actions (Search, Language, Theme, User Profile, Mobile Menu) */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* 1. Search Within Department */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="dept-nav-icon-btn h-9 w-9 rounded-xl"
                  onClick={() => setSearchOpen(true)}
                  aria-label={isArabic ? "البحث ضمن القسم" : "Search in Department"}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="flex items-center gap-1.5 text-xs">
                  <span>{isArabic ? "البحث ضمن القسم" : "Search Department"}</span>
                  <kbd
                    className="px-1.5 py-0.5 rounded text-[10px] font-mono border"
                    style={{ borderColor: hexToRgba(primaryColor, 0.3) }}
                  >
                    Ctrl+K
                  </kbd>
                </p>
              </TooltipContent>
            </Tooltip>

            {/* 2. Language Switcher */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setLanguage(isArabic ? "en" : "ar")}
                  className="dept-nav-icon-btn h-9 w-9 rounded-xl"
                  aria-label={isArabic ? "Switch to English" : "التبديل إلى العربية"}
                >
                  <Globe className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{isArabic ? "English" : "العربية"}</p>
              </TooltipContent>
            </Tooltip>

            {/* 3. Theme Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="dept-nav-icon-btn h-9 w-9 rounded-xl"
                  aria-label={
                    theme === "light"
                      ? (isArabic ? "تفعيل الوضع الليلي" : "Switch to Dark Mode")
                      : (isArabic ? "تفعيل الوضع النهاري" : "Switch to Light Mode")
                  }
                >
                  {theme === "light" ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>
                  {theme === "light"
                    ? (isArabic ? "الوضع الليلي" : "Dark Mode")
                    : (isArabic ? "الوضع النهاري" : "Light Mode")}
                </p>
              </TooltipContent>
            </Tooltip>

            {/* 4. User Profile / Account Dropdown (Desktop/Tablet Only) */}
            <div className="hidden sm:block">
              {!isAuthenticated ? (
                <Link href="/login">
                  <Button
                    size="sm"
                    className="font-bold text-xs h-9 px-3.5 rounded-xl text-white shadow-xs hover:opacity-95 transition-opacity"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {isArabic ? "تسجيل الدخول" : "Login"}
                  </Button>
                </Link>
              ) : (
                <DropdownMenu
                  open={userDropdownOpen}
                  onOpenChange={setUserDropdownOpen}
                  modal={false}
                  dir={dir}
                >
                  <Tooltip open={userDropdownOpen ? false : undefined}>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="dept-avatar-btn relative h-9 w-9 rounded-full p-0 ring-2 cursor-pointer focus-visible:outline-none"
                          style={{
                            boxShadow: `0 0 0 2px ${hexToRgba(primaryColor, 0.35)}`,
                          }}
                          aria-label={isArabic ? "الملف الشخصي والحساب" : "User Profile & Account"}
                        >
                          <Avatar className="h-9 w-9">
                            <AvatarImage
                              src={(user as any)?.avatar || (user as any)?.profile_picture || "/user.png"}
                              alt={user?.username || "User"}
                            />
                            <AvatarFallback
                              className="font-bold text-xs flex items-center justify-center text-white"
                              style={{ backgroundColor: primaryColor }}
                            >
                              {user?.first_name ? (
                                user.first_name[0].toUpperCase()
                              ) : user?.username ? (
                                user.username[0].toUpperCase()
                              ) : (
                                <UserIcon className="h-4 w-4" />
                              )}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>{isArabic ? "الملف الشخصي والحساب" : "User Profile & Account"}</p>
                    </TooltipContent>
                  </Tooltip>

                  <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="dept-dropdown-menu w-60 p-1.5 shadow-xl border rounded-2xl"
                    style={{ borderColor: hexToRgba(primaryColor, 0.2) }}
                  >
                    {/* User info Header */}
                    <div className="flex flex-col space-y-1 px-3 py-2 text-start">
                      <p className="text-sm font-bold text-foreground truncate">
                        {isArabic
                          ? (user?.first_name || user?.username || "مستخدم")
                          : (user?.last_name || user?.first_name || user?.username || "User")}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email || ""}
                      </p>
                    </div>

                    <DropdownMenuSeparator className="my-1" />

                    {/* Dashboard / Portal link */}
                    <DropdownMenuItem asChild className="cursor-pointer font-medium rounded-xl">
                      <Link
                        href={
                          userRole === "admin"
                            ? "/dashboard"
                            : getRoleRedirectPath(userRole)
                        }
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 w-full text-start py-2 px-2.5"
                      >
                        <LayoutDashboard className="h-4 w-4" style={{ color: primaryColor }} />
                        <span className="flex-1 text-xs sm:text-sm font-semibold">
                          {userRole === "admin"
                            ? (isArabic ? "لوحة التحكم" : "Dashboard")
                            : userRole === "faculty"
                              ? (isArabic ? "بوابة عضو الهيئة التدريسية" : "Faculty Portal")
                              : userRole === "alumni"
                                ? (isArabic ? "بوابة الخريجين" : "Alumni Portal")
                                : (isArabic ? "البوابة الطلابية" : "Student Portal")}
                        </span>
                      </Link>
                    </DropdownMenuItem>

                    {/* Account Settings link */}
                    <DropdownMenuItem asChild className="cursor-pointer font-medium rounded-xl">
                      <Link
                        href="/dashboard/settings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 w-full text-start py-2 px-2.5"
                      >
                        <Settings className="h-4 w-4 text-muted-foreground" />
                        <span className="flex-1 text-xs sm:text-sm">
                          {isArabic ? "إعدادات الحساب" : "Account Settings"}
                        </span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="my-1" />

                    {/* Logout button */}
                    <DropdownMenuItem
                      onClick={() => {
                        handleLogout();
                        setUserDropdownOpen(false);
                      }}
                      className="flex items-center gap-2.5 w-full text-start py-2 px-2.5 font-bold text-destructive hover:bg-destructive/10 focus:text-destructive focus:bg-destructive/10 cursor-pointer rounded-xl transition-colors"
                    >
                      <LogOut className="h-4 w-4 text-destructive shrink-0" />
                      <span className="flex-1 text-xs sm:text-sm">
                        {isArabic ? "تسجيل الخروج" : "Logout"}
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* 5. Mobile Menu Trigger (Mobile Only - Drawer Sheet) */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="dept-nav-icon-btn h-9 w-9 rounded-xl md:hidden"
                  aria-label={isArabic ? "فتح القائمة" : "Open Menu"}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side={dir === "rtl" ? "right" : "left"}
                className="w-80 sm:w-96 p-0 flex flex-col"
              >
                {/* Header of Drawer */}
                <SheetHeader className="text-start border-b p-5 pb-4">
                  <SheetTitle className="flex items-center justify-between">
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                      <ASULogo imageClassName="max-h-8" />
                    </Link>
                  </SheetTitle>

                  {/* Department & Faculty Themed Badge & Hierarchy Card */}
                  <div
                    className="mt-3 p-3.5 rounded-2xl border text-start space-y-1.5"
                    style={{
                      background: `linear-gradient(135deg, ${hexToRgba(primaryColor, 0.08)} 0%, ${hexToRgba(primaryColor, 0.02)} 100%)`,
                      borderColor: hexToRgba(primaryColor, 0.22),
                    }}
                  >
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium flex-wrap">
                      <Link
                        href="/academics"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="hover:underline"
                      >
                        {isArabic ? "الكليات" : "Faculties"}
                      </Link>
                      <span>/</span>
                      <Link
                        href={`/academics/${faculty.slug}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="hover:underline truncate max-w-[130px]"
                      >
                        {isArabic ? faculty.nameAr : faculty.nameEn}
                      </Link>
                    </div>
                    <h3 className="font-extrabold text-sm" style={{ color: primaryColor }}>
                      {isArabic ? program.nameAr : program.nameEn}
                    </h3>
                  </div>
                </SheetHeader>

                {/* Body of Drawer */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
                  {/* Search within Department Button */}
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2.5 text-xs font-semibold h-10 rounded-xl"
                    style={{
                      borderColor: hexToRgba(primaryColor, 0.25),
                      backgroundColor: hexToRgba(primaryColor, 0.03),
                    }}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setSearchOpen(true);
                    }}
                  >
                    <Search className="h-4 w-4 shrink-0" style={{ color: primaryColor }} />
                    <span className="text-muted-foreground flex-1 text-start">
                      {isArabic ? `بحث ضمن ${program.nameAr}...` : `Search in ${program.nameEn}...`}
                    </span>
                    <kbd
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono border"
                      style={{ borderColor: hexToRgba(primaryColor, 0.3) }}
                    >
                      Ctrl+K
                    </kbd>
                  </Button>

                  {/* Section 1: Quick Jump to Department Sections */}
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-2">
                      {isArabic ? "أقسام صفحة القسم" : "Department Sections"}
                    </p>
                    <div className="space-y-1">
                      {departmentSections.map((sec) => {
                        const Icon = sec.icon;
                        return (
                          <button
                            key={sec.id}
                            type="button"
                            onClick={() => jumpToSection(sec.id)}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-foreground hover:bg-muted/80 transition-colors text-start cursor-pointer"
                          >
                            <span
                              className="p-1.5 rounded-lg shrink-0"
                              style={{
                                backgroundColor: hexToRgba(primaryColor, 0.12),
                                color: primaryColor,
                              }}
                            >
                              <Icon className="h-4 w-4" />
                            </span>
                            <span className="flex-1">{isArabic ? sec.labelAr : sec.labelEn}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section 2: Return to Faculty & General Links */}
                  <div className="space-y-1.5 pt-3 border-t">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-2">
                      {isArabic ? "التنقل العام والكلية" : "Navigation & Links"}
                    </p>
                    <div className="space-y-1">
                      <Link
                        href={`/academics/${faculty.slug}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-colors text-start"
                        style={{
                          backgroundColor: hexToRgba(primaryColor, 0.08),
                          color: primaryColor,
                        }}
                      >
                        <School className="h-4 w-4 shrink-0" />
                        <span className="flex-1">
                          {isArabic ? `العودة إلى ${faculty.nameAr}` : `Back to ${faculty.nameEn}`}
                        </span>
                      </Link>

                      {[
                        { href: "/", label: isArabic ? "الرئيسية" : "Home", icon: Building2 },
                        { href: "/academics", label: isArabic ? "دليل الكليات" : "Faculties", icon: School },
                        { href: "/admissions", label: isArabic ? "القبول والتسجيل" : "Admissions", icon: GraduationCap },
                        { href: "/contact", label: isArabic ? "اتصل بنا" : "Contact Us", icon: Phone },
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-muted/80 transition-colors text-start"
                          >
                            <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="flex-1">{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section 3: User Account / Login */}
                  <div className="pt-3 border-t">
                    {!isAuthenticated ? (
                      <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button
                          className="w-full font-bold text-xs h-10 rounded-xl text-white shadow-xs"
                          style={{ backgroundColor: primaryColor }}
                        >
                          {isArabic ? "تسجيل الدخول للنظام" : "Login to Portal"}
                        </Button>
                      </Link>
                    ) : (
                      <div className="space-y-2">
                        <div
                          className="flex items-center gap-3 p-3 rounded-2xl border"
                          style={{
                            backgroundColor: hexToRgba(primaryColor, 0.05),
                            borderColor: hexToRgba(primaryColor, 0.18),
                          }}
                        >
                          <Avatar className="h-10 w-10 ring-2 shrink-0" style={{ borderColor: primaryColor }}>
                            <AvatarImage
                              src={(user as any)?.avatar || (user as any)?.profile_picture || "/user.png"}
                              alt={user?.username || "User"}
                            />
                            <AvatarFallback
                              className="font-bold text-xs text-white"
                              style={{ backgroundColor: primaryColor }}
                            >
                              {user?.first_name ? user.first_name[0].toUpperCase() : "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0 text-start">
                            <p className="text-xs font-bold text-foreground truncate">
                              {user?.first_name
                                ? `${user.first_name} ${user.last_name || ""}`.trim()
                                : user?.username || "User"}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate">{user?.email || ""}</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1 pt-1">
                          <Link
                            href={userRole === "admin" ? "/dashboard" : getRoleRedirectPath(userRole)}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Button variant="ghost" size="sm" className="w-full justify-start gap-2.5 text-xs font-bold">
                              <LayoutDashboard className="h-4 w-4 shrink-0" style={{ color: primaryColor }} />
                              <span>
                                {userRole === "admin"
                                  ? (isArabic ? "لوحة التحكم" : "Dashboard")
                                  : (isArabic ? "البوابة الأكاديمية" : "Portal")}
                              </span>
                            </Button>
                          </Link>

                          <Link href="/dashboard/settings" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button variant="ghost" size="sm" className="w-full justify-start gap-2.5 text-xs font-medium">
                              <Settings className="h-4 w-4 text-muted-foreground shrink-0" />
                              <span>{isArabic ? "إعدادات الحساب" : "Account Settings"}</span>
                            </Button>
                          </Link>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              handleLogout();
                            }}
                            className="w-full justify-start gap-2.5 text-xs font-bold text-destructive hover:bg-destructive/10"
                          >
                            <LogOut className="h-4 w-4 shrink-0" />
                            <span>{isArabic ? "تسجيل الخروج" : "Logout"}</span>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* DEPARTMENT SEARCH COMMAND DIALOG (البحث ضمن القسم)                          */}
      {/* ========================================================================= */}
      <CommandDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        className="dept-command-dialog"
      >
        <div className="p-2 border-b" style={{ borderColor: hexToRgba(primaryColor, 0.14) }}>
          <div className="flex items-center gap-2 px-3 py-1">
            <Search className="h-4 w-4 shrink-0" style={{ color: primaryColor }} />
            <span className="text-xs font-bold" style={{ color: primaryColor }}>
              {isArabic ? `البحث ضمن ${program.nameAr}` : `Search in ${program.nameEn}`}
            </span>
          </div>
        </div>

        <CommandInput
          placeholder={
            isArabic
              ? "ابحث عن المقررات، المختبرات، الكادر، الرسوم..."
              : "Search courses, labs, faculty staff, tuition..."
          }
        />

        <CommandList>
          <CommandEmpty>
            {isArabic ? "لا توجد نتائج مطابقة لبحثك." : "No results found."}
          </CommandEmpty>

          {/* Quick Jump to Sections */}
          <CommandGroup heading={isArabic ? "أقسام ومعلومات التخصص" : "Department Sections"}>
            {departmentSections.map((sec) => {
              const SecIcon = sec.icon;
              return (
                <CommandItem
                  key={sec.id}
                  onSelect={() => jumpToSection(sec.id)}
                  className="dept-command-item cursor-pointer flex items-center gap-3 py-2.5 rounded-xl transition-all"
                >
                  <div
                    className="dept-icon-box p-1.5 rounded-lg shrink-0 transition-colors"
                    style={{
                      backgroundColor: hexToRgba(primaryColor, 0.12),
                      color: primaryColor,
                    }}
                  >
                    <SecIcon className="h-4 w-4" />
                  </div>
                  <span className="font-semibold text-sm">
                    {isArabic ? sec.labelAr : sec.labelEn}
                  </span>
                </CommandItem>
              );
            })}
          </CommandGroup>

          <CommandSeparator style={{ backgroundColor: hexToRgba(primaryColor, 0.1) }} />

          {/* Courses Search within Program */}
          {program.courses && program.courses.length > 0 && (
            <CommandGroup heading={isArabic ? "مقررات القسم الدراسية" : "Department Courses"}>
              {program.courses.slice(0, 8).map((course: any, idx: number) => (
                <CommandItem
                  key={course.code || idx}
                  onSelect={() => jumpToSection("curriculum")}
                  className="dept-command-item cursor-pointer flex items-center justify-between py-2 rounded-xl transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="dept-icon-box p-1 rounded-md shrink-0 transition-colors"
                      style={{
                        backgroundColor: hexToRgba(primaryColor, 0.1),
                        color: primaryColor,
                      }}
                    >
                      <GraduationCap className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-sm font-medium">
                      {isArabic ? course.nameAr : course.nameEn}
                    </span>
                  </div>
                  <span
                    className="dept-course-code text-xs font-mono font-bold px-2 py-0.5 rounded-md transition-colors"
                    style={{
                      backgroundColor: hexToRgba(primaryColor, 0.1),
                      color: primaryColor,
                    }}
                  >
                    {course.code}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          <CommandSeparator style={{ backgroundColor: hexToRgba(primaryColor, 0.1) }} />

          {/* External Navigation Link back to University Homepage */}
          <CommandGroup heading={isArabic ? "روابط سريعة" : "Quick Links"}>
            <CommandItem
              onSelect={() => {
                setSearchOpen(false);
                router.push("/admissions");
              }}
              className="dept-command-item cursor-pointer flex items-center gap-2.5 py-2 rounded-xl transition-all"
            >
              <div
                className="dept-icon-box p-1.5 rounded-lg shrink-0 transition-colors"
                style={{
                  backgroundColor: hexToRgba(primaryColor, 0.12),
                  color: primaryColor,
                }}
              >
                <DollarSign className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">{isArabic ? "تقديم طلب القبول والتسجيل" : "Apply for Admission"}</span>
            </CommandItem>

            <CommandItem
              onSelect={() => {
                setSearchOpen(false);
                router.push(`/academics/${faculty.slug}`);
              }}
              className="dept-command-item cursor-pointer flex items-center gap-2.5 py-2 rounded-xl transition-all"
            >
              <div
                className="dept-icon-box p-1.5 rounded-lg shrink-0 transition-colors"
                style={{
                  backgroundColor: hexToRgba(primaryColor, 0.12),
                  color: primaryColor,
                }}
              >
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">{isArabic ? `العودة إلى ${faculty.nameAr}` : `Back to ${faculty.nameEn}`}</span>
            </CommandItem>

            <CommandItem
              onSelect={() => {
                setSearchOpen(false);
                router.push("/");
              }}
              className="dept-command-item cursor-pointer flex items-center gap-2.5 py-2 rounded-xl transition-all"
            >
              <div
                className="dept-icon-box p-1.5 rounded-lg shrink-0 transition-colors"
                style={{
                  backgroundColor: hexToRgba(primaryColor, 0.12),
                  color: primaryColor,
                }}
              >
                <Globe className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">{isArabic ? "الصفحة الرئيسية للجامعة" : "University Homepage"}</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
