"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useLanguage } from "@/contexts/language-context";
import { useSiteSettings, DEFAULT_SITE_SETTINGS } from "@/contexts/site-settings-context";
import { contactInfo, universityInfo } from "@/data/contact";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Phone,
  Mail,
  MapPin,
  Building2,
  Clock,
  Send,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import dynamic from "next/dynamic";

const CampusLeafletMap = dynamic(
  () =>
    import("@/components/about/campus-leaflet-map").then(
      (mod) => mod.CampusLeafletMap,
    ),
  { ssr: false },
);

// Custom SVG Icons for Telegram & X (Twitter)
function TelegramIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-2.01 9.48c-.15.68-.55.84-1.12.52l-3.07-2.26-1.48 1.43c-.16.16-.3.3-.61.3l.22-3.13 5.7-5.15c.25-.22-.05-.34-.38-.12l-7.05 4.44-3.04-.95c-.66-.21-.67-.66.14-.98l11.89-4.58c.55-.2 1.03.13.81.98z" />
    </svg>
  );
}

function XTwitterIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function generateRandomText() {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*";
  let text = "";
  for (let i = 0; i < 6; i++) {
    text += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return text;
}

export default function ContactPage() {
  const { language, t, dir } = useLanguage();
  const isArabic = language === "ar";
  const { settings } = useSiteSettings();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [captchaText, setCaptchaText] = useState(() => generateRandomText());
  const [userCaptcha, setUserCaptcha] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const drawCaptcha = useCallback((text: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background gradient
    const gradient = ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height,
    );
    gradient.addColorStop(0, "#f9fafb");
    gradient.addColorStop(1, "#f3f4f6");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw noise lines
    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = `rgba(${Math.floor(Math.random() * 150)}, ${Math.floor(Math.random() * 150)}, ${Math.floor(Math.random() * 150)}, 0.35)`;
      ctx.lineWidth = Math.random() * 2 + 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Draw noise dots
    for (let i = 0; i < 45; i++) {
      ctx.fillStyle = `rgba(${Math.floor(Math.random() * 150)}, ${Math.floor(Math.random() * 150)}, ${Math.floor(Math.random() * 150)}, 0.4)`;
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 2,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }

    // Draw characters
    const fonts = [
      "Arial",
      "Georgia",
      "Courier New",
      "Verdana",
      "Times New Roman",
    ];
    ctx.textBaseline = "middle";

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const fontSize = Math.floor(Math.random() * 6) + 22; // 22px to 28px
      const font = fonts[Math.floor(Math.random() * fonts.length)];
      ctx.font = `bold ${fontSize}px ${font}`;
      ctx.fillStyle = `rgb(${Math.floor(Math.random() * 120)}, ${Math.floor(Math.random() * 120)}, ${Math.floor(Math.random() * 120)})`;

      const x = 12 + i * 22 + Math.random() * 4;
      const y = canvas.height / 2 + (Math.random() * 10 - 5);
      const angle = ((Math.random() * 30 - 15) * Math.PI) / 180; // -15 to 15 degrees

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }
  }, []);

  const generateCaptcha = useCallback(() => {
    const text = generateRandomText();
    setCaptchaText(text);
    setUserCaptcha("");
  }, []);

  useEffect(() => {
    drawCaptcha(captchaText);
  }, [captchaText, drawCaptcha]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate captcha
    if (userCaptcha.toLowerCase() !== captchaText.toLowerCase()) {
      toast.error(
        language === "ar"
          ? "رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى."
          : "Incorrect verification code. Please try again.",
      );
      generateCaptcha();
      return;
    }

    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setUserCaptcha("");
      generateCaptcha();
    }, 3000);
  };

  // Helper to resolve icon for social platform
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

  // Dynamic active social links
  const socialLinksObj = settings.socialLinks || DEFAULT_SITE_SETTINGS.socialLinks;
  const platformOrder = ["facebook", "linkedin", "youtube", "instagram", "telegram", "twitter"];
  const activeSocialLinks = platformOrder
    .map((key) => socialLinksObj[key])
    .filter((item): item is typeof socialLinksObj[string] => Boolean(item && item.enabled !== false && item.url));

  // Enabled contact fields check
  const isPhoneEnabled = settings.contactFields?.phone?.enabled !== false;
  const isEmailEnabled = settings.contactFields?.email?.enabled !== false;
  const isAddressEnabled = settings.contactFields?.address?.enabled !== false;
  const isOfficeAddressEnabled =
    settings.contactFields?.officeAddress?.enabled !== false &&
    Boolean(
      isArabic
        ? (settings.contactFields?.officeAddress?.valueAr || settings.contactFields?.officeAddress?.value || settings.officeAddress)
        : (settings.contactFields?.officeAddress?.valueEn || settings.officeAddressEn || settings.contactFields?.officeAddress?.value || settings.officeAddress)
    );
  const isWorkingHoursEnabled =
    settings.contactFields?.workingHours?.enabled !== false &&
    Boolean(
      isArabic
        ? (settings.contactFields?.workingHours?.valueAr || settings.contactFields?.workingHours?.value || settings.workingHours)
        : (settings.contactFields?.workingHours?.valueEn || settings.workingHoursEn || settings.contactFields?.workingHours?.value || settings.workingHours)
    );

  // Map settings
  const mapUrl = `https://maps.google.com/maps?q=${contactInfo.coordinates.lat},${contactInfo.coordinates.lng}&t=k&z=15&ie=UTF8&iwloc=&hl=${language}&output=embed`;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="border-b bg-muted/30 py-12 sm:py-16">
          <div className="section-container">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
                {t("contact.title")}
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                {language === "ar"
                  ? "نحن هنا لمساعدتك. تواصل معنا للاستفسارات والمعلومات"
                  : "We're here to help. Contact us for inquiries and information"}
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info & Form */}
        <section className="py-12 sm:py-16">
          <div className="section-container">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Contact Cards */}
              <div className="space-y-4 sm:space-y-6">
                {/* Phone Card */}
                {isPhoneEnabled && (
                  <Card>
                    <CardContent className="flex items-start gap-4 p-6 text-start">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {t("contact.phone")}
                        </h3>
                        <p className="mt-1 text-muted-foreground" dir="ltr">
                          {settings.contactFields?.phone?.value || settings.phone || contactInfo.phone}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Email Card */}
                {isEmailEnabled && (
                  <Card>
                    <CardContent className="flex items-start gap-4 p-6 text-start">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {t("contact.email")}
                        </h3>
                        <a
                          href={`mailto:${settings.contactFields?.email?.value || settings.email || contactInfo.email}`}
                          className="mt-1 text-muted-foreground hover:text-primary break-all"
                        >
                          {settings.contactFields?.email?.value || settings.email || contactInfo.email}
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Main Campus Address Card */}
                {isAddressEnabled && (
                  <Card>
                    <CardContent className="flex items-start gap-4 p-6 text-start">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {t("contact.address")}
                        </h3>
                        <p className="mt-1 text-muted-foreground">
                          {isArabic
                            ? (settings.contactFields?.address?.valueAr || settings.contactFields?.address?.value || settings.address || contactInfo.address.ar)
                            : (settings.contactFields?.address?.valueEn || settings.addressEn || settings.contactFields?.address?.value || contactInfo.address.en)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* University Registration Office Address Card */}
                {isOfficeAddressEnabled && (
                  <Card>
                    <CardContent className="flex items-start gap-4 p-6 text-start">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {isArabic ? "مكتب الجامعة والتسجيل" : "Registration Office"}
                        </h3>
                        <p className="mt-1 text-muted-foreground">
                          {isArabic
                            ? (settings.contactFields?.officeAddress?.valueAr || settings.contactFields?.officeAddress?.value || settings.officeAddress)
                            : (settings.contactFields?.officeAddress?.valueEn || settings.officeAddressEn || settings.contactFields?.officeAddress?.value || settings.officeAddress)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Working Hours Card */}
                {isWorkingHoursEnabled && (
                  <Card>
                    <CardContent className="flex items-start gap-4 p-6 text-start">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <Clock className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {isArabic ? "ساعات العمل" : "Working Hours"}
                        </h3>
                        <p className="mt-1 text-muted-foreground">
                          {isArabic
                            ? (settings.contactFields?.workingHours?.valueAr || settings.contactFields?.workingHours?.value || settings.workingHours || contactInfo.workingHours.ar)
                            : (settings.contactFields?.workingHours?.valueEn || settings.workingHoursEn || settings.contactFields?.workingHours?.value || contactInfo.workingHours.en)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Dynamic Social Links Card */}
                {activeSocialLinks.length > 0 && (
                  <Card>
                    <CardContent className="p-6 text-start">
                      <h3 className="mb-4 font-semibold text-foreground">
                        {t("footer.followUs")}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {activeSocialLinks.map((social) => {
                          const IconComponent = getSocialIcon(social.key);
                          return (
                            <a
                              key={social.key}
                              href={social.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted transition-colors hover:bg-primary hover:text-primary-foreground shadow-sm"
                              aria-label={isArabic ? social.nameAr : social.nameEn}
                              title={isArabic ? social.nameAr : social.nameEn}
                            >
                              <IconComponent className="h-5 w-5" />
                            </a>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="text-start">
                    <CardTitle className="text-xl sm:text-2xl">
                      {language === "ar"
                        ? "أرسل لنا رسالة"
                        : "Send us a Message"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    {isSubmitted ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <CheckCircle className="mb-4 h-16 w-16 text-green-500" />
                        <h3 className="text-xl font-semibold text-foreground">
                          {language === "ar"
                            ? "تم إرسال رسالتك بنجاح!"
                            : "Your message has been sent successfully!"}
                        </h3>
                        <p className="mt-2 text-muted-foreground">
                          {language === "ar"
                            ? "شكراً لتواصلك معنا. سنقوم بالرد عليك في أقرب وقت ممكن."
                            : "Thank you for contacting us. We will get back to you as soon as possible."}
                        </p>
                      </div>
                    ) : (
                      <form
                        onSubmit={handleSubmit}
                        className="space-y-4 sm:space-y-6 text-start"
                      >
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="name">{t("contact.name")}</Label>
                            <Input
                              id="name"
                              required
                              placeholder={
                                language === "ar"
                                  ? "الاسم الكامل"
                                  : "Full Name"
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">{t("contact.email")}</Label>
                            <Input
                              id="email"
                              type="email"
                              required
                              placeholder="name@example.com"
                            />
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="phone">{t("contact.phone")}</Label>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="+963 9XX XXX XXX"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="subject">
                              {t("contact.subject")}
                            </Label>
                            <Input
                              id="subject"
                              required
                              placeholder={
                                language === "ar"
                                  ? "موضوع الرسالة"
                                  : "Message Subject"
                              }
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">
                            {t("contact.message")}
                          </Label>
                          <Textarea
                            id="message"
                            rows={5}
                            required
                            placeholder={
                              language === "ar"
                                ? "اكتب رسالتك هنا..."
                                : "Type your message here..."
                            }
                          />
                        </div>

                        {/* Captcha Section */}
                        <div className="space-y-2 rounded-lg border bg-muted/30 p-4">
                          <Label htmlFor="captcha">
                            {language === "ar"
                              ? "رمز التحقق"
                              : "Verification Code"}
                          </Label>
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-2">
                              <canvas
                                ref={canvasRef}
                                width={160}
                                height={42}
                                className="rounded border border-gray-300 shadow-inner bg-white select-none"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={generateCaptcha}
                                title={
                                  language === "ar"
                                    ? "تحديث الرمز"
                                    : "Refresh Code"
                                }
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            </div>
                            <Input
                              id="captcha"
                              required
                              value={userCaptcha}
                              onChange={(e) => setUserCaptcha(e.target.value)}
                              placeholder={
                                language === "ar"
                                  ? "أدخل الرمز أعلاه"
                                  : "Enter code above"
                              }
                              className="sm:w-44"
                            />
                          </div>
                        </div>

                        <Button type="submit" className="w-full sm:w-auto font-bold">
                          <Send className="ml-2 h-4 w-4 rtl:rotate-180" />
                          {t("contact.send")}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Campus Leaflet Map Section */}
            <div className="mt-12">
              <CampusLeafletMap showMarkers={false} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
