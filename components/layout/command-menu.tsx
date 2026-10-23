"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { type DialogProps } from "@radix-ui/react-dialog";
import {
  Building2,
  BookOpen,
  Users,
  GraduationCap,
  TreePine,
  FlaskConical,
  Newspaper,
  Phone,
  Search,
  MapPin,
} from "lucide-react";

import { useLanguage } from "@/contexts/language-context";
import { useSiteSettings } from "@/contexts/site-settings-context";
import { useFaculties } from "@/hooks/use-faculties";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

export function CommandMenu({ compact = false, ...props }: DialogProps & { compact?: boolean }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const { language, t, dir } = useLanguage();
  const { isPagePublished } = useSiteSettings();
  const { data: backendFaculties } = useFaculties();
  const rawFaculties = backendFaculties || [];
  const faculties = rawFaculties.filter((f) =>
    isPagePublished(`/academics/${f.slug}`)
  );

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  const isArabic = language === "ar";

  const navLinks = [
    { href: "/", label: t("nav.home"), icon: Building2 },
    { href: "/about", label: t("nav.about"), icon: Users },
    { href: "/about/directory", label: language === "ar" ? "هيئة التدريس" : "Faculty Directory", icon: Users },
    { href: "/about/map", label: t("nav.map"), icon: MapPin },
    { href: "/academics", label: t("nav.academics"), icon: BookOpen },
    { href: "/admissions", label: t("nav.admissions"), icon: GraduationCap },
    { href: "/campus-life", label: t("nav.campusLife"), icon: TreePine },
    { href: "/library", label: language === "ar" ? "المكتبة المركزية" : "University Library", icon: BookOpen },
    { href: "/research", label: t("nav.research"), icon: FlaskConical },
    { href: "/news", label: t("nav.news"), icon: Newspaper },
    { href: "/contact", label: t("nav.contact"), icon: Phone },
  ].filter((link) => isPagePublished(link.href));

  const portals = [
    { href: "/portal/student", label: t("nav.studentPortal"), icon: UserIcon },
    { href: "/portal/faculty", label: t("nav.facultyPortal"), icon: Users },
    { href: "/portal/alumni", label: t("nav.alumniPortal"), icon: GraduationCap },
  ];

  return (
    <>
      <Button
        variant={compact ? "ghost" : "outline"}
        size={compact ? "icon" : "default"}
        className={cn(
          compact
            ? "h-9 w-9 p-0"
            : "relative h-9 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none",
          !compact && dir === "rtl" ? "sm:pl-12 sm:pr-4" : "",
          !compact && dir === "ltr" ? "sm:pr-12 sm:pl-4" : "",
        )}
        onClick={() => setOpen(true)}
        aria-label={isArabic ? "البحث في الموقع" : "Search website"}
        {...props}
      >
        {compact ? (
          <Search className="h-5 w-5" />
        ) : (
          <>
            <span className="inline-flex">{isArabic ? "البحث في الموقع..." : "Search website..."}</span>
            <kbd className={cn(
              "pointer-events-none absolute top-2 flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100",
              dir === "rtl" ? "left-1.5" : "right-1.5"
            )}>
              <span className="text-xs">⌘</span>K
            </kbd>
          </>
        )}
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={isArabic ? "اكتب للبحث..." : "Type a command or search..."} />
        <CommandList dir={dir}>
          <CommandEmpty>{isArabic ? "لم يتم العثور على نتائج." : "No results found."}</CommandEmpty>

          {faculties.length > 0 && (
            <>
              <CommandGroup heading={isArabic ? "الكليات" : "Faculties"}>
                {faculties.map((faculty) => (
                  <CommandItem
                    key={faculty.id}
                    value={isArabic ? faculty.nameAr : faculty.nameEn}
                    onSelect={() => {
                      runCommand(() => router.push(`/academics/${faculty.slug}`));
                    }}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>{isArabic ? faculty.nameAr : faculty.nameEn}</span>
                  </CommandItem>
                ))}
              </CommandGroup>

              <CommandSeparator />
            </>
          )}

          <CommandGroup heading={isArabic ? "روابط سريعة" : "Quick Links"}>
            {navLinks.map((link) => (
              <CommandItem
                key={link.href}
                value={link.label}
                onSelect={() => {
                  runCommand(() => router.push(link.href));
                }}
              >
                <link.icon className="mr-2 h-4 w-4" />
                <span>{link.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading={isArabic ? "البوابات" : "Portals"}>
            {portals.map((portal) => (
              <CommandItem
                key={portal.href}
                value={portal.label}
                onSelect={() => {
                  runCommand(() => router.push(portal.href));
                }}
              >
                <portal.icon className="mr-2 h-4 w-4" />
                <span>{portal.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>

        </CommandList>
      </CommandDialog>
    </>
  );
}

function UserIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
