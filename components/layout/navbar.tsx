"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";
import { useTheme } from "@/contexts/theme-context";
import { useAuth, getUserRole, getRoleRedirectPath } from "@/contexts/auth-context";
import { useFaculties } from "@/hooks/use-faculties";

import { cn } from "@/lib/utils";
import { ASULogo } from "@/components/ui/asu-logo";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  ChevronDown,
  GraduationCap,
  Building2,
  Users,
  BookOpen,
  Phone,
  Newspaper,
  FlaskConical,
  TreePine,
  LayoutDashboard,
  User as UserIcon,
  LogOut,
} from "lucide-react";
import { CommandMenu } from "@/components/layout/command-menu";

export function Navbar() {
  const { language, setLanguage, t, dir } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { data: backendFaculties } = useFaculties();
  const faculties = backendFaculties || [];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isAcademicsOpen, setIsAcademicsOpen] = useState(false);
  const [isCampusLifeOpen, setIsCampusLifeOpen] = useState(false);
  const [isPortalsOpen, setIsPortalsOpen] = useState(false);
  const router = useRouter();

  const pathname = usePathname();

  const aboutOpenTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const aboutCloseTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const academicsOpenTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const academicsCloseTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const campusLifeOpenTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const campusLifeCloseTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const portalsOpenTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const portalsCloseTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const aboutContainerRef = React.useRef<HTMLDivElement>(null);
  const academicsContainerRef = React.useRef<HTMLDivElement>(null);
  const campusLifeContainerRef = React.useRef<HTMLDivElement>(null);
  const portalsContainerRef = React.useRef<HTMLDivElement>(null);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (aboutOpenTimeout.current) clearTimeout(aboutOpenTimeout.current);
      if (aboutCloseTimeout.current) clearTimeout(aboutCloseTimeout.current);
      if (academicsOpenTimeout.current)
        clearTimeout(academicsOpenTimeout.current);
      if (academicsCloseTimeout.current)
        clearTimeout(academicsCloseTimeout.current);
      if (campusLifeOpenTimeout.current)
        clearTimeout(campusLifeOpenTimeout.current);
      if (campusLifeCloseTimeout.current)
        clearTimeout(campusLifeCloseTimeout.current);
      if (portalsOpenTimeout.current) clearTimeout(portalsOpenTimeout.current);
      if (portalsCloseTimeout.current)
        clearTimeout(portalsCloseTimeout.current);
    };
  }, []);

  const handleAboutMouseEnter = () => {
    if (aboutCloseTimeout.current) {
      clearTimeout(aboutCloseTimeout.current);
      aboutCloseTimeout.current = null;
    }
    if (isAboutOpen) return;
    if (!aboutOpenTimeout.current) {
      aboutOpenTimeout.current = setTimeout(() => {
        setIsAboutOpen(true);
        aboutOpenTimeout.current = null;
      }, 500); // 0.5s hover delay
    }
  };

  const handleAboutMouseLeave = () => {
    if (aboutOpenTimeout.current) {
      clearTimeout(aboutOpenTimeout.current);
      aboutOpenTimeout.current = null;
    }
    if (isAboutOpen) {
      if (!aboutCloseTimeout.current) {
        aboutCloseTimeout.current = setTimeout(() => {
          setIsAboutOpen(false);
          aboutCloseTimeout.current = null;
        }, 200); // 0.2s grace period
      }
    }
  };

  const handleAboutContentMouseEnter = () => {
    if (aboutCloseTimeout.current) {
      clearTimeout(aboutCloseTimeout.current);
      aboutCloseTimeout.current = null;
    }
  };

  const handleAboutContentMouseLeave = () => {
    if (!aboutCloseTimeout.current) {
      aboutCloseTimeout.current = setTimeout(() => {
        setIsAboutOpen(false);
        aboutCloseTimeout.current = null;
      }, 200);
    }
  };

  const handleAcademicsMouseEnter = () => {
    if (academicsCloseTimeout.current) {
      clearTimeout(academicsCloseTimeout.current);
      academicsCloseTimeout.current = null;
    }
    if (isAcademicsOpen) return;
    if (!academicsOpenTimeout.current) {
      academicsOpenTimeout.current = setTimeout(() => {
        setIsAcademicsOpen(true);
        academicsOpenTimeout.current = null;
      }, 500); // 0.5s hover delay
    }
  };

  const handleAcademicsMouseLeave = () => {
    if (academicsOpenTimeout.current) {
      clearTimeout(academicsOpenTimeout.current);
      academicsOpenTimeout.current = null;
    }
    if (isAcademicsOpen) {
      if (!academicsCloseTimeout.current) {
        academicsCloseTimeout.current = setTimeout(() => {
          setIsAcademicsOpen(false);
          academicsCloseTimeout.current = null;
        }, 200); // 0.2s grace period
      }
    }
  };

  const handleAcademicsContentMouseEnter = () => {
    if (academicsCloseTimeout.current) {
      clearTimeout(academicsCloseTimeout.current);
      academicsCloseTimeout.current = null;
    }
  };

  const handleAcademicsContentMouseLeave = () => {
    if (!academicsCloseTimeout.current) {
      academicsCloseTimeout.current = setTimeout(() => {
        setIsAcademicsOpen(false);
        academicsCloseTimeout.current = null;
      }, 200);
    }
  };

  const handleCampusLifeMouseEnter = () => {
    if (campusLifeCloseTimeout.current) {
      clearTimeout(campusLifeCloseTimeout.current);
      campusLifeCloseTimeout.current = null;
    }
    if (isCampusLifeOpen) return;
    if (!campusLifeOpenTimeout.current) {
      campusLifeOpenTimeout.current = setTimeout(() => {
        setIsCampusLifeOpen(true);
        campusLifeOpenTimeout.current = null;
      }, 500); // 0.5s hover delay
    }
  };

  const handleCampusLifeMouseLeave = () => {
    if (campusLifeOpenTimeout.current) {
      clearTimeout(campusLifeOpenTimeout.current);
      campusLifeOpenTimeout.current = null;
    }
    if (isCampusLifeOpen) {
      if (!campusLifeCloseTimeout.current) {
        campusLifeCloseTimeout.current = setTimeout(() => {
          setIsCampusLifeOpen(false);
          campusLifeCloseTimeout.current = null;
        }, 200); // 0.2s grace period
      }
    }
  };

  const handleCampusLifeContentMouseEnter = () => {
    if (campusLifeCloseTimeout.current) {
      clearTimeout(campusLifeCloseTimeout.current);
      campusLifeCloseTimeout.current = null;
    }
  };

  const handleCampusLifeContentMouseLeave = () => {
    if (!campusLifeCloseTimeout.current) {
      campusLifeCloseTimeout.current = setTimeout(() => {
        setIsCampusLifeOpen(false);
        campusLifeCloseTimeout.current = null;
      }, 200);
    }
  };

  const handlePortalsMouseEnter = () => {
    if (portalsCloseTimeout.current) {
      clearTimeout(portalsCloseTimeout.current);
      portalsCloseTimeout.current = null;
    }
    if (isPortalsOpen) return;
    if (!portalsOpenTimeout.current) {
      portalsOpenTimeout.current = setTimeout(() => {
        setIsPortalsOpen(true);
        portalsOpenTimeout.current = null;
      }, 2000); // 2 seconds delay before activating dropdown on hover
    }
  };

  const handlePortalsOpenChange = (open: boolean) => {
    if (portalsOpenTimeout.current) {
      clearTimeout(portalsOpenTimeout.current);
      portalsOpenTimeout.current = null;
    }
    if (portalsCloseTimeout.current) {
      clearTimeout(portalsCloseTimeout.current);
      portalsCloseTimeout.current = null;
    }
    setIsPortalsOpen(open);
  };

  const handlePortalsMouseLeave = () => {
    if (portalsOpenTimeout.current) {
      clearTimeout(portalsOpenTimeout.current);
      portalsOpenTimeout.current = null;
    }
    if (isPortalsOpen) {
      if (!portalsCloseTimeout.current) {
        portalsCloseTimeout.current = setTimeout(() => {
          setIsPortalsOpen(false);
          portalsCloseTimeout.current = null;
        }, 200); // 0.2s grace period
      }
    }
  };

  const handlePortalsContentMouseEnter = () => {
    if (portalsCloseTimeout.current) {
      clearTimeout(portalsCloseTimeout.current);
      portalsCloseTimeout.current = null;
    }
  };

  const handlePortalsContentMouseLeave = () => {
    if (!portalsCloseTimeout.current) {
      portalsCloseTimeout.current = setTimeout(() => {
        setIsPortalsOpen(false);
        portalsCloseTimeout.current = null;
      }, 200);
    }
  };

  const { user, isAuthenticated, logout } = useAuth();
  const userRole = getUserRole(user);
  const isLoggedIn = isAuthenticated;

  useEffect(() => {
    Promise.resolve().then(() => {
      setIsAboutOpen(false);
      setIsAcademicsOpen(false);
      setIsCampusLifeOpen(false);
      setIsPortalsOpen(false);
    });
  }, [pathname]);

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    logout();
  };


  const navLinks = [
    { href: "/", label: t("nav.home"), icon: Building2 },
    { href: "/admissions", label: t("nav.admissions"), icon: GraduationCap },
    { href: "/news", label: t("nav.news"), icon: Newspaper },
    { href: "/contact", label: t("nav.contact"), icon: Phone },
  ];

  const campusLifeLinks = [
    { href: "/campus-life", label: t("nav.campusLife"), icon: TreePine },
    {
      href: "/library",
      label: language === "ar" ? "المكتبة" : "Library",
      icon: BookOpen,
    },
    { href: "/research", label: t("nav.research"), icon: FlaskConical },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="section-container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <ASULogo priority />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center lg:flex">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="px-2 text-sm font-medium tracking-tight"
            >
              {t("nav.home")}
            </Button>
          </Link>
          {/* About Dropdown */}
          <div
            ref={aboutContainerRef}
            className="inline-flex h-9 items-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
            onMouseEnter={handleAboutMouseEnter}
            onMouseLeave={handleAboutMouseLeave}
          >
            <Link
              href="/about"
              className="flex h-full items-center ps-3 pe-1 text-sm font-medium tracking-tight focus-visible:outline-none"
            >
              {t("nav.about")}
            </Link>
            <DropdownMenu
              open={isAboutOpen}
              onOpenChange={setIsAboutOpen}
              modal={false}
              dir={dir}
            >
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex h-full items-center pe-3 ps-1 focus-visible:outline-none"
                >
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 transition-transform duration-200",
                      isAboutOpen && "rotate-180",
                    )}
                  />
                  <span className="sr-only">Toggle About Submenu</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                sideOffset={8}
                className="w-56 p-1"
                onMouseEnter={handleAboutContentMouseEnter}
                onMouseLeave={handleAboutContentMouseLeave}
                onPointerDownOutside={(event) => {
                  if (
                    aboutContainerRef.current?.contains(event.target as Node)
                  ) {
                    event.preventDefault();
                  }
                }}
              >
                <DropdownMenuItem asChild>
                  <Link
                    href="/about/directory"
                    className="w-full text-start cursor-pointer font-medium"
                    onClick={() => setIsAboutOpen(false)}
                  >
                    {t("nav.directory")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/about/map"
                    className="w-full text-start cursor-pointer font-medium"
                    onClick={() => setIsAboutOpen(false)}
                  >
                    {t("nav.map")}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Academics Dropdown */}
          <div
            ref={academicsContainerRef}
            className="inline-flex h-9 items-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
            onMouseEnter={handleAcademicsMouseEnter}
            onMouseLeave={handleAcademicsMouseLeave}
          >
            <Link
              href="/academics"
              className="flex h-full items-center ps-3 pe-1 text-sm font-medium tracking-tight focus-visible:outline-none"
            >
              {t("nav.academics")}
            </Link>
            <DropdownMenu
              open={isAcademicsOpen}
              onOpenChange={setIsAcademicsOpen}
              modal={false}
              dir={dir}
            >
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex h-full items-center pe-3 ps-1 focus-visible:outline-none"
                >
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 transition-transform duration-200",
                      isAcademicsOpen && "rotate-180",
                    )}
                  />
                  <span className="sr-only">Toggle Academics Submenu</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                sideOffset={8}
                className="w-56 p-1"
                onMouseEnter={handleAcademicsContentMouseEnter}
                onMouseLeave={handleAcademicsContentMouseLeave}
                onPointerDownOutside={(event) => {
                  if (
                    academicsContainerRef.current?.contains(
                      event.target as Node,
                    )
                  ) {
                    event.preventDefault();
                  }
                }}
              >
                {faculties.map((faculty) => (
                  <DropdownMenuItem key={faculty.id} asChild>
                    <Link
                      href={`/academics/${faculty.slug}`}
                      className="w-full text-start cursor-pointer font-medium"
                      onClick={() => setIsAcademicsOpen(false)}
                    >
                      {language === "ar" ? faculty.nameAr : faculty.nameEn}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Link href="/admissions">
            <Button
              variant="ghost"
              size="sm"
              className="px-2 text-sm font-medium tracking-tight"
            >
              {t("nav.admissions")}
            </Button>
          </Link>

          {/* Campus Life Dropdown */}
          <div
            ref={campusLifeContainerRef}
            className="inline-flex h-9 items-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
            onMouseEnter={handleCampusLifeMouseEnter}
            onMouseLeave={handleCampusLifeMouseLeave}
          >
            <Link
              href="/campus-life"
              className="flex h-full items-center ps-3 pe-1 text-sm font-medium tracking-tight focus-visible:outline-none"
            >
              {t("nav.campusLife")}
            </Link>
            <DropdownMenu
              open={isCampusLifeOpen}
              onOpenChange={setIsCampusLifeOpen}
              modal={false}
              dir={dir}
            >
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex h-full items-center pe-3 ps-1 focus-visible:outline-none"
                >
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 transition-transform duration-200",
                      isCampusLifeOpen && "rotate-180",
                    )}
                  />
                  <span className="sr-only">Toggle Campus Life Submenu</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                sideOffset={8}
                className="w-56 p-1"
                onMouseEnter={handleCampusLifeContentMouseEnter}
                onMouseLeave={handleCampusLifeContentMouseLeave}
                onPointerDownOutside={(event) => {
                  if (
                    campusLifeContainerRef.current?.contains(
                      event.target as Node,
                    )
                  ) {
                    event.preventDefault();
                  }
                }}
              >
                {campusLifeLinks
                  .filter((link) => link.href !== "/campus-life")
                  .map((link) => (
                    <DropdownMenuItem key={link.href} asChild>
                      <Link
                        href={link.href}
                        className="w-full text-start cursor-pointer font-medium"
                        onClick={() => setIsCampusLifeOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Link href="/news">
            <Button
              variant="ghost"
              size="sm"
              className="px-2 text-sm font-medium tracking-tight"
            >
              {t("nav.news")}
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              variant="ghost"
              size="sm"
              className="px-2 text-sm font-medium tracking-tight"
            >
              {t("nav.contact")}
            </Button>
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Global Search */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <CommandMenu compact />
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{language === "ar" ? "البحث" : "Search"}</p>
            </TooltipContent>
          </Tooltip>

          {/* Language Switcher */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
                className="h-9 w-9"
                aria-label={language === "ar" ? "تبديل اللغة" : "Switch language"}
              >
                <Globe className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{language === "ar" ? "تبديل اللغة" : "Switch language"}</p>
            </TooltipContent>
          </Tooltip>

          {/* Theme Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-9 w-9"
                aria-label={
                  theme === "light"
                    ? (language === "ar" ? "تفعيل الوضع الليلي" : "Switch to Dark Mode")
                    : (language === "ar" ? "تفعيل الوضع النهاري" : "Switch to Light Mode")
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
                  ? (language === "ar" ? "تفعيل الوضع الليلي" : "Switch to Dark Mode")
                  : (language === "ar" ? "تفعيل الوضع النهاري" : "Switch to Light Mode")}
              </p>
            </TooltipContent>
          </Tooltip>

          {/* Login / User Avatar Dropdown */}
          {!isLoggedIn ? (
            <Link href="/login" className="hidden sm:block">
              <Button variant="default" size="sm" className="font-bold">
                {language === "ar" ? "تسجيل الدخول" : "Login"}
              </Button>
            </Link>
          ) : (
            <div
              ref={portalsContainerRef}
              className="hidden sm:block"
              onMouseEnter={handlePortalsMouseEnter}
              onMouseLeave={handlePortalsMouseLeave}
            >
              <DropdownMenu
                open={isPortalsOpen}
                onOpenChange={handlePortalsOpenChange}
                modal={false}
                dir={dir}
              >
                <Tooltip open={isPortalsOpen ? false : undefined}>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-9 w-9 rounded-full p-0 ring-2 ring-primary/20 hover:ring-primary/40 focus-visible:outline-none transition-all cursor-pointer"
                        aria-label={language === "ar" ? "الملف الشخصي والحساب" : "User Profile & Account"}
                      >
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={(user as any)?.avatar || (user as any)?.profile_picture || "/user.png"}
                            alt={user?.username || "User"}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
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
                    <p>{language === "ar" ? "الملف الشخصي والحساب" : "User Profile & Account"}</p>
                  </TooltipContent>
                </Tooltip>
                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-60 p-1.5 shadow-xl border rounded-xl"
                  onMouseEnter={handlePortalsContentMouseEnter}
                  onMouseLeave={handlePortalsContentMouseLeave}
                  onPointerDownOutside={(event) => {
                    if (
                      portalsContainerRef.current?.contains(
                        event.target as Node,
                      )
                    ) {
                      event.preventDefault();
                    }
                  }}
                >
                  {/* User info Header */}
                  <div className="flex flex-col space-y-0.5 px-3 py-2 text-start">
                    <p className="text-sm font-bold text-foreground truncate">
                      {language === "ar"
                        ? (user?.first_name || user?.username || "مدير النظام")
                        : (user?.last_name || user?.first_name || user?.username || "Admin")}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email || ""}
                    </p>
                  </div>

                  <DropdownMenuSeparator className="my-1" />

                  {/* Dashboard / Portal link */}
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer font-medium"
                  >
                    <Link
                      href={
                        userRole === "admin"
                          ? "/dashboard"
                          : getRoleRedirectPath(userRole)
                      }
                      onClick={() => setIsPortalsOpen(false)}
                      className="flex items-center gap-2.5 w-full text-start py-2 px-2.5 rounded-md hover:bg-accent transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4 text-primary shrink-0" />
                      <span className="flex-1">
                        {userRole === "admin"
                          ? (language === "ar" ? "لوحة التحكم" : "Dashboard")
                          : userRole === "faculty"
                            ? (language === "ar" ? "بوابة عضو الهيئة التدريسية" : "Faculty Portal")
                            : userRole === "alumni"
                              ? (language === "ar" ? "بوابة الخريجين" : "Alumni Portal")
                              : (language === "ar" ? "البوابة الطلابية" : "Student Portal")}
                      </span>
                    </Link>
                  </DropdownMenuItem>

                  {/* Account Settings link */}
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer font-medium"
                  >
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setIsPortalsOpen(false)}
                      className="flex items-center gap-2.5 w-full text-start py-2 px-2.5 rounded-md hover:bg-accent transition-colors"
                    >
                      <UserIcon className="h-4 w-4 text-primary shrink-0" />
                      <span className="flex-1">
                        {language === "ar" ? "إعدادات الحساب" : "Account Settings"}
                      </span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-1" />

                  {/* Logout button */}
                  <DropdownMenuItem
                    onClick={() => {
                      handleLogout();
                      setIsPortalsOpen(false);
                    }}
                    className="flex items-center gap-2.5 w-full text-start py-2 px-2.5 rounded-md font-bold text-destructive hover:bg-destructive/10 focus:text-destructive focus:bg-destructive/10 cursor-pointer transition-colors"
                  >
                    <LogOut className="h-4 w-4 text-destructive shrink-0" />
                    <span className="flex-1">
                      {language === "ar" ? "تسجيل الخروج" : "Logout"}
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side={dir === "rtl" ? "right" : "left"}
              className="w-80 p-0 flex flex-col"
            >
              <SheetHeader className="text-start border-b p-6">
                <SheetTitle>
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                    <ASULogo imageClassName="max-h-8" />
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto px-6 pb-8">
                <div className="mt-4">
                  <CommandMenu />
                </div>
                <div className="mt-4 flex flex-col gap-1">
                  {navLinks.slice(0, 1).map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 font-medium"
                      >
                        <link.icon className="h-5 w-5 text-primary" />
                        {link.label}
                      </Button>
                    </Link>
                  ))}

                  {/* Mobile About Collapsible */}
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between gap-3 font-medium"
                      >
                        <span className="flex items-center gap-3">
                          <Users className="h-5 w-5 text-primary" />
                          {t("nav.about")}
                        </span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ps-10 space-y-1 py-1">
                      <Link
                        href="/about"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-muted-foreground font-normal"
                        >
                          {t("about.history")}
                        </Button>
                      </Link>
                      <Link
                        href="/about/directory"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-muted-foreground font-normal"
                        >
                          {t("nav.directory")}
                        </Button>
                      </Link>
                      <Link
                        href="/about/map"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-muted-foreground font-normal"
                        >
                          {t("nav.map")}
                        </Button>
                      </Link>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Mobile Academics Collapsible */}
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between gap-3 font-medium"
                      >
                        <span className="flex items-center gap-3">
                          <BookOpen className="h-5 w-5 text-primary" />
                          {t("nav.academics")}
                        </span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ps-10 space-y-1 py-1">
                      {faculties.map((faculty) => (
                        <Link
                          key={faculty.id}
                          href={`/academics/${faculty.slug}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-muted-foreground font-normal"
                          >
                            {language === "ar"
                              ? faculty.nameAr
                              : faculty.nameEn}
                          </Button>
                        </Link>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Mobile Campus Life Collapsible */}
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between gap-3 font-medium"
                      >
                        <span className="flex items-center gap-3">
                          <TreePine className="h-5 w-5 text-primary" />
                          {t("nav.campusLife")}
                        </span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ps-10 space-y-1 py-1">
                      {campusLifeLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-muted-foreground font-normal"
                          >
                            {link.label}
                          </Button>
                        </Link>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>

                  {navLinks.slice(1).map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 font-medium"
                      >
                        <link.icon className="h-5 w-5 text-primary" />
                        {link.label}
                      </Button>
                    </Link>
                  ))}

                  {/* Mobile Portals/Login */}
                  <div className="my-4 border-t" />
                  {!isLoggedIn ? (
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start font-bold text-primary"
                      >
                        {language === "ar" ? "تسجيل الدخول" : "Login"}
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 p-3 mb-3 bg-muted/40 rounded-xl border">
                        <Avatar className="h-10 w-10 ring-2 ring-primary/20 shrink-0">
                          <AvatarImage
                            src={(user as any)?.avatar || (user as any)?.profile_picture || "/user.png"}
                            alt={user?.username || "User"}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                            {user?.first_name ? (
                              user.first_name[0].toUpperCase()
                            ) : user?.username ? (
                              user.username[0].toUpperCase()
                            ) : (
                              <UserIcon className="h-4 w-4" />
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col text-start overflow-hidden">
                          <p className="text-sm font-bold text-foreground truncate">
                            {user?.first_name
                              ? `${user.first_name} ${user.last_name || ""}`.trim()
                              : user?.username || (language === "ar" ? "المستخدم" : "User")}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{user?.email || ""}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Link
                          href={
                            userRole === "admin"
                              ? "/dashboard"
                              : getRoleRedirectPath(userRole)
                          }
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Button
                            variant="ghost"
                            className="w-full justify-start gap-2.5 font-bold"
                          >
                            <LayoutDashboard className="h-4 w-4 text-primary shrink-0" />
                            <span>
                              {userRole === "admin"
                                ? (language === "ar" ? "لوحة التحكم" : "Dashboard")
                                : userRole === "faculty"
                                  ? (language === "ar" ? "بوابة عضو الهيئة التدريسية" : "Faculty Portal")
                                  : userRole === "alumni"
                                    ? (language === "ar" ? "بوابة الخريجين" : "Alumni Portal")
                                    : (language === "ar" ? "البوابة الطلابية" : "Student Portal")}
                            </span>
                          </Button>
                        </Link>
                        <Link
                          href="/dashboard/settings"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Button
                            variant="ghost"
                            className="w-full justify-start gap-2.5 font-medium"
                          >
                            <UserIcon className="h-4 w-4 text-primary shrink-0" />
                            <span>
                              {language === "ar" ? "إعدادات الحساب" : "Account Settings"}
                            </span>
                          </Button>
                        </Link>
                        <div className="my-1 border-t" />
                        <Button
                          onClick={handleLogout}
                          variant="ghost"
                          className="w-full justify-start gap-2.5 font-bold text-destructive hover:bg-destructive/10"
                        >
                          <LogOut className="h-4 w-4 text-destructive shrink-0" />
                          <span>{language === "ar" ? "تسجيل الخروج" : "Logout"}</span>
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
