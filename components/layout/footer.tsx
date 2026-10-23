"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import { useSiteSettings } from "@/contexts/site-settings-context";
import { useFaculties } from "@/hooks/use-faculties";
import { ASULogo } from "@/components/ui/asu-logo";
import { contactInfo, universityInfo } from "@/data/contact";
import {
  Phone,
  Mail,
  MapPin,
  Building2,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";

// Custom SVG Icons for Telegram & X (Twitter)
function TelegramIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-2.01 9.48c-.15.68-.55.84-1.12.52l-3.07-2.26-1.48 1.43c-.16.16-.3.3-.61.3l.22-3.13 5.7-5.15c.25-.22-.05-.34-.38-.12l-7.05 4.44-3.04-.95c-.66-.21-.67-.66.14-.98l11.89-4.58c.55-.2 1.03.13.81.98z" />
    </svg>
  );
}

function XTwitterIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function hexToRgba(hex: string, alpha: number) {
  if (!hex || !hex.startsWith("#")) return `rgba(30, 58, 138, ${alpha})`;
  let c = hex.substring(1);
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const num = parseInt(c, 16);
  if (isNaN(num)) return `rgba(30, 58, 138, ${alpha})`;
  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
}

interface FooterProps {
  primaryColor?: string;
  accentColor?: string;
}

export function Footer({ primaryColor, accentColor }: FooterProps = {}) {
  const { language, t } = useLanguage();
  const isArabic = language === "ar";
  const { settings, isPagePublished } = useSiteSettings();
  const { data: backendFaculties } = useFaculties();
  const rawFaculties = backendFaculties || [];
  const faculties = rawFaculties.filter((f) =>
    isPagePublished(`/academics/${f.slug}`)
  );
  const isAcademicsPublished = isPagePublished("/academics");

  const quickLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/about", label: t("nav.about") },
    { href: "/about/directory", label: t("nav.directory") },
    { href: "/about/map", label: t("nav.map") },
    { href: "/academics", label: t("nav.academics") },
    { href: "/admissions", label: t("nav.admissions") },
    { href: "/campus-life", label: t("nav.campusLife") },
    { href: "/library", label: isArabic ? "المكتبة" : "Library" },
    { href: "/research", label: t("nav.research") },
    { href: "/news", label: t("nav.news") },
    { href: "/contact", label: t("nav.contact") },
  ].filter((link) => isPagePublished(link.href));

  // Helper to resolve icon component for each platform key
  const getSocialIcon = (key: string) => {
    switch (key) {
      case "facebook":
        return Facebook;
      case "linkedin":
        return Linkedin;
      case "youtube":
        return Youtube;
      case "instagram":
        return Instagram;
      case "telegram":
        return TelegramIcon;
      case "twitter":
        return XTwitterIcon;
      default:
        return Facebook;
    }
  };

  // Filter only enabled and non-empty social links
  const activeSocialLinks = Object.values(settings.socialLinks || {}).filter(
    (link) => link.enabled && link.url && link.url.trim() !== ""
  );

  return (
    <footer
      className="border-t border-border bg-muted/30 relative footer-component"
      style={
        primaryColor
          ? ({
            borderTopColor: hexToRgba(primaryColor, 0.2),
            "--primary": primaryColor,
          } as React.CSSProperties)
          : undefined
      }
    >
      {primaryColor && (
        <style>{`
          .footer-component a:hover {
            color: ${primaryColor} !important;
          }
          .footer-component .footer-social-btn:hover {
            background-color: ${primaryColor} !important;
            color: #ffffff !important;
          }
          .footer-component .footer-social-btn:hover svg {
            color: #ffffff !important;
          }
        `}</style>
      )}

      <div className="section-container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="mb-4 block">
              <ASULogo imageClassName="max-h-12" />
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              {isArabic
                ? universityInfo.affiliation.ar
                : universityInfo.affiliation.en}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {isArabic
                ? `تأسست عام ${universityInfo.established}`
                : `Established ${universityInfo.established}`}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Faculties */}
          {isAcademicsPublished && (
            <div>
              <h3 className="mb-4 text-sm font-semibold text-foreground">
                {t("nav.academics")}
              </h3>
              <ul className="space-y-2">
                {faculties.slice(0, 5).map((faculty) => (
                  <li key={faculty.id}>
                    <Link
                      href={`/academics/${faculty.slug}`}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {isArabic ? faculty.nameAr : faculty.nameEn}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/academics"
                    className="text-sm font-medium text-primary hover:underline"
                    style={primaryColor ? { color: primaryColor } : undefined}
                  >
                    {t("common.viewAll")}
                  </Link>
                </li>
              </ul>
            </div>
          )}

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              {t("contact.title")}
            </h3>
            <ul className="space-y-3">
              {(settings.contactFields?.phone?.enabled !== false) && (
                <li className="flex items-start gap-2">
                  <Phone
                    className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                    style={primaryColor ? { color: primaryColor } : undefined}
                  />
                  <span className="text-sm text-muted-foreground" dir="ltr">
                    {settings.contactFields?.phone?.value || settings.phone || contactInfo.phone}
                  </span>
                </li>
              )}
              {(settings.contactFields?.email?.enabled !== false) && (
                <li className="flex items-start gap-2">
                  <Mail
                    className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                    style={primaryColor ? { color: primaryColor } : undefined}
                  />
                  <a
                    href={`mailto:${settings.contactFields?.email?.value || settings.email || contactInfo.email}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {settings.contactFields?.email?.value || settings.email || contactInfo.email}
                  </a>
                </li>
              )}
              {(settings.contactFields?.address?.enabled !== false) && (
                <li className="flex items-start gap-2">
                  <MapPin
                    className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                    style={primaryColor ? { color: primaryColor } : undefined}
                  />
                  <span className="text-sm text-muted-foreground">
                    {isArabic
                      ? (settings.contactFields?.address?.valueAr || settings.contactFields?.address?.value || settings.address || contactInfo.address.ar)
                      : (settings.contactFields?.address?.valueEn || settings.addressEn || settings.contactFields?.address?.value || contactInfo.address.en)}
                  </span>
                </li>
              )}
              {(settings.contactFields?.officeAddress?.enabled !== false && (
                isArabic
                  ? (settings.contactFields?.officeAddress?.valueAr || settings.contactFields?.officeAddress?.value || settings.officeAddress)
                  : (settings.contactFields?.officeAddress?.valueEn || settings.officeAddressEn || settings.contactFields?.officeAddress?.value || settings.officeAddress)
              )) && (
                  <li className="flex items-start gap-2">
                    <Building2
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                      style={primaryColor ? { color: primaryColor } : undefined}
                    />
                    <span className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground block">{isArabic ? "مكتب الجامعة والتسجيل:" : "Registration Office:"}</span>
                      {isArabic
                        ? (settings.contactFields?.officeAddress?.valueAr || settings.contactFields?.officeAddress?.value || settings.officeAddress)
                        : (settings.contactFields?.officeAddress?.valueEn || settings.officeAddressEn || settings.contactFields?.officeAddress?.value || settings.officeAddress)}
                    </span>
                  </li>
                )}
              {(settings.contactFields?.workingHours?.enabled !== false && (
                isArabic
                  ? (settings.contactFields?.workingHours?.valueAr || settings.contactFields?.workingHours?.value || settings.workingHours)
                  : (settings.contactFields?.workingHours?.valueEn || settings.workingHoursEn || settings.contactFields?.workingHours?.value || settings.workingHours)
              )) && (
                  <li className="flex items-start gap-2">
                    <Clock
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                      style={primaryColor ? { color: primaryColor } : undefined}
                    />
                    <span className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground block">{isArabic ? "ساعات العمل:" : "Working Hours:"}</span>
                      {isArabic
                        ? (settings.contactFields?.workingHours?.valueAr || settings.contactFields?.workingHours?.value || settings.workingHours)
                        : (settings.contactFields?.workingHours?.valueEn || settings.workingHoursEn || settings.contactFields?.workingHours?.value || settings.workingHours)}
                    </span>
                  </li>
                )}
            </ul>

            {/* Social Links */}
            {activeSocialLinks.length > 0 && (
              <div className="mt-6">
                <h4 className="mb-3 text-sm font-semibold text-foreground">
                  {t("footer.followUs")}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeSocialLinks.map((social) => {
                    const IconComponent = getSocialIcon(social.key);
                    return (
                      <a
                        key={social.key}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-social-btn flex h-9 w-9 items-center justify-center rounded-lg bg-muted transition-colors hover:bg-primary hover:text-primary-foreground shadow-xs"
                        aria-label={isArabic ? social.nameAr : social.nameEn}
                        title={isArabic ? social.nameAr : social.nameEn}
                      >
                        <IconComponent className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()}{" "}
              {isArabic
                ? universityInfo.name.ar
                : universityInfo.name.en}
              . {t("footer.rights")}.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              {isPagePublished("/privacy") && (
                <Link href="/privacy" className="hover:text-primary">
                  {isArabic ? "سياسة الخصوصية" : "Privacy Policy"}
                </Link>
              )}
              {isPagePublished("/terms") && (
                <Link href="/terms" className="hover:text-primary">
                  {isArabic ? "الشروط والأحكام" : "Terms of Service"}
                </Link>
              )}
              {isPagePublished("/developer") && (
                <Link href="/developer" className="hover:text-primary">
                  {t("footer.developer")}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
