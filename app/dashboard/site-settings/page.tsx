"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/language-context";
import {
  useSiteSettings,
  SocialLinkItem,
  ContactFieldItem,
  DEFAULT_SITE_SETTINGS,
  getMergedContactFields
} from "@/contexts/site-settings-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Save,
  Mail,
  Phone,
  MapPin,
  Building2,
  Clock,
  Smartphone,
  Facebook,
  Linkedin,
  Youtube,
  Instagram,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Edit3,
  XCircle,
  Lock
} from "lucide-react";
import { toast } from "sonner";

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

export default function SiteSettingsPage() {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const { settings, updateSettings } = useSiteSettings();

  // Mode & Loading states
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Helper to ensure all 6 social platforms exist
  const getMergedSocialLinks = (sourceLinks?: Record<string, SocialLinkItem>) => {
    const merged = { ...DEFAULT_SITE_SETTINGS.socialLinks };
    if (sourceLinks && typeof sourceLinks === "object") {
      Object.keys(merged).forEach((key) => {
        if (sourceLinks[key]) {
          merged[key] = {
            ...merged[key],
            ...sourceLinks[key],
          };
        }
      });
    }
    return merged;
  };

  // Form states
  const [contactFields, setContactFields] = useState<Record<string, ContactFieldItem>>(() =>
    getMergedContactFields(settings.contactFields)
  );

  const [registrationOpen, setRegistrationOpen] = useState(settings.registrationOpen);
  const [maintenanceMode, setMaintenanceMode] = useState(settings.maintenanceMode);
  const [showResults, setShowResults] = useState(settings.showResults);
  const [socialLinks, setSocialLinks] = useState<Record<string, SocialLinkItem>>(() =>
    getMergedSocialLinks(settings.socialLinks)
  );

  // Sync state when context settings load (only when not in active edit mode)
  useEffect(() => {
    if (settings && !isEditMode) {
      setContactFields(getMergedContactFields(settings.contactFields));
      setRegistrationOpen(settings.registrationOpen);
      setMaintenanceMode(settings.maintenanceMode);
      setShowResults(settings.showResults);
      setSocialLinks(getMergedSocialLinks(settings.socialLinks));
    }
  }, [settings, isEditMode]);

  const handleStartEdit = () => {
    setContactFields(getMergedContactFields(settings.contactFields));
    setRegistrationOpen(settings.registrationOpen);
    setMaintenanceMode(settings.maintenanceMode);
    setShowResults(settings.showResults);
    setSocialLinks(getMergedSocialLinks(settings.socialLinks));

    setIsEditMode(true);
    toast.info(
      isArabic
        ? "تم تفعيل وضع التعديل."
        : "Edit mode enabled."
    );
  };

  const handleCancelEdit = () => {
    setContactFields(getMergedContactFields(settings.contactFields));
    setRegistrationOpen(settings.registrationOpen);
    setMaintenanceMode(settings.maintenanceMode);
    setShowResults(settings.showResults);
    setSocialLinks(getMergedSocialLinks(settings.socialLinks));

    setIsEditMode(false);
    toast(
      isArabic
        ? "تم إلغاء التعديلات والعودة للإعدادات المحفوظة."
        : "Changes cancelled. Reverted to saved settings."
    );
  };

  // Contact fields state updaters
  const handleContactToggle = (key: string, enabled: boolean) => {
    if (!isEditMode) return;
    setContactFields((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        enabled,
      },
    }));
  };

  const handleContactValueChange = (key: string, value: string, lang?: "ar" | "en") => {
    if (!isEditMode) return;
    setContactFields((prev) => {
      const current = prev[key] || { key: key as any, enabled: true, value: "" };
      if (lang === "ar") {
        return {
          ...prev,
          [key]: {
            ...current,
            valueAr: value,
            value: value,
          },
        };
      } else if (lang === "en") {
        return {
          ...prev,
          [key]: {
            ...current,
            valueEn: value,
          },
        };
      } else {
        return {
          ...prev,
          [key]: {
            ...current,
            value: value,
          },
        };
      }
    });
  };

  // Social links state updaters
  const handleSocialToggle = (key: string, enabled: boolean) => {
    if (!isEditMode) return;
    setSocialLinks((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        enabled,
      },
    }));
  };

  const handleSocialUrlChange = (key: string, url: string) => {
    if (!isEditMode) return;
    setSocialLinks((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        url,
      },
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditMode) return;

    setIsSaving(true);

    try {
      const email = contactFields.email?.value || "";
      const phone = contactFields.phone?.value || "";
      const address = contactFields.address?.valueAr || contactFields.address?.value || "";
      const addressEn = contactFields.address?.valueEn || "";
      const officeAddress = contactFields.officeAddress?.valueAr || contactFields.officeAddress?.value || "";
      const officeAddressEn = contactFields.officeAddress?.valueEn || "";
      const workingHours = contactFields.workingHours?.valueAr || contactFields.workingHours?.value || "";
      const workingHoursEn = contactFields.workingHours?.valueEn || "";

      await updateSettings({
        email,
        phone,
        address,
        addressEn,
        officeAddress,
        officeAddressEn,
        workingHours,
        workingHoursEn,
        contactFields,
        registrationOpen,
        maintenanceMode,
        showResults,
        socialLinks,
      });

      setIsEditMode(false);
      toast.success(
        isArabic
          ? "تم حفظ وتثبيت كافة التغييرات بنجاح!"
          : "All site settings saved successfully!"
      );
    } catch (err) {
      console.error("Error saving site settings:", err);
      toast.error(
        isArabic
          ? "حدث خطأ أثناء الحفظ في قاعدة البيانات"
          : "An error occurred while saving to database"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const getPlatformIcon = (key: string) => {
    switch (key) {
      case "facebook":
        return <Facebook className="h-5 w-5 text-blue-600 shrink-0" />;
      case "linkedin":
        return <Linkedin className="h-5 w-5 text-blue-700 shrink-0" />;
      case "youtube":
        return <Youtube className="h-5 w-5 text-red-600 shrink-0" />;
      case "instagram":
        return <Instagram className="h-5 w-5 text-pink-600 shrink-0" />;
      case "telegram":
        return <TelegramIcon className="h-5 w-5 text-sky-500 shrink-0" />;
      case "twitter":
        return <XTwitterIcon className="h-5 w-5 text-foreground shrink-0" />;
      default:
        return <Smartphone className="h-5 w-5 text-primary shrink-0" />;
    }
  };

  const platformOrder = ["facebook", "linkedin", "youtube", "instagram", "telegram", "twitter"];

  const contactFieldConfig: Record<
    string,
    {
      titleAr: string;
      titleEn: string;
      icon: React.ReactNode;
      isBilingual?: boolean;
      placeholderAr: string;
      placeholderEn?: string;
    }
  > = {
    email: {
      titleAr: "البريد الإلكتروني",
      titleEn: "Email",
      icon: <Mail className="h-5 w-5 text-primary shrink-0" />,
      placeholderAr: "info@asu.edu.sy",
    },
    phone: {
      titleAr: "هاتف الاستعلامات",
      titleEn: "Inquiries Phone",
      icon: <Phone className="h-5 w-5 text-primary shrink-0" />,
      placeholderAr: "(+963) 11 5954910",
    },
    address: {
      titleAr: "عنوان المقر الرئيسي",
      titleEn: "Main Campus Address",
      icon: <MapPin className="h-5 w-5 text-primary shrink-0" />,
      isBilingual: true,
      placeholderAr: "معرة صيدنايا، ريف دمشق، سوريا",
      placeholderEn: "Maarat Saidnaya, Damascus Countryside, Syria",
    },
    officeAddress: {
      titleAr: "عنوان مكتب الجامعة",
      titleEn: "University Office Address",
      icon: <Building2 className="h-5 w-5 text-primary shrink-0" />,
      isBilingual: true,
      placeholderAr: "دمشق، البرامكة، مقابل كلية الحقوق - مكتب المتابعة والتسجيل",
      placeholderEn: "Damascus, Baramkeh, Opposite Faculty of Law - Follow-up & Registration Office",
    },
    workingHours: {
      titleAr: "ساعات العمل",
      titleEn: "Working Hours",
      icon: <Clock className="h-5 w-5 text-amber-600 shrink-0" />,
      isBilingual: true,
      placeholderAr: "الأحد - الخميس: 8:00 ص - 4:00 م",
      placeholderEn: "Sunday - Thursday: 8:00 AM - 4:00 PM",
    },
  };

  const contactFieldKeys = ["email", "phone", "address", "officeAddress", "workingHours"];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 text-start" dir={isArabic ? "rtl" : "ltr"}>
      <form onSubmit={handleSave} className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
              <Sliders className="h-8 w-8 text-primary" />
              {isArabic ? "إعدادات النظام العام للموقع" : "General System Settings"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isArabic
                ? "التحكم في معلومات الاتصال، ساعات العمل، التفضيلات، وروابط التواصل الاجتماعي مع تفعيل أو تعطيل أي حقل."
                : "Control contact info, working hours, preferences, and toggle social media links for the site footer."}
            </p>
          </div>

          {/* Action Buttons: View Mode vs Edit Mode */}
          <div className="flex items-center gap-3">
            {!isEditMode ? (
              <Button
                type="button"
                onClick={handleStartEdit}
                className="font-bold flex gap-2 min-w-28 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
              >
                <Edit3 className="h-4 w-4" />
                {isArabic ? "تعديل" : "Edit"}
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="font-bold flex gap-1.5"
                >
                  <XCircle className="h-4 w-4 text-destructive" />
                  {isArabic ? "إلغاء التعديل" : "Cancel"}
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="font-bold flex gap-2 min-w-40 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {isArabic ? "جاري الحفظ..." : "Saving..."}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      {isArabic ? "حفظ التغييرات" : "Save Changes"}
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Info with Per-Field Enable/Disable Switches */}
            <Card className="border-none shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2 text-xl font-bold">
                    <Mail className="h-5 w-5 text-primary" />
                    {isArabic ? "معلومات الاتصال وساعات العمل" : "Contact Info & Working Hours"}
                  </CardTitle>
                  <CardDescription>
                    {isArabic
                      ? "تعديل وتفعيل أو إيقاف أي حقل من معلومات الاتصال وساعات العمل التي تظهر في الفوتر والصفحات العامة."
                      : "Modify and toggle any contact field or working hours displayed across site footer and pages."}
                  </CardDescription>
                </div>
                {!isEditMode && (
                  <Badge variant="outline" className="gap-1 text-xs text-amber-600 border-amber-500/30 shrink-0">
                    <Lock className="h-3 w-3" />
                    {isArabic ? "مغلق للتعديل" : "Locked"}
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-5">
                {contactFieldKeys.map((key) => {
                  const cfg = contactFieldConfig[key];
                  const item = contactFields[key] || { key, value: "", enabled: true };
                  const isEnabled = item.enabled !== false;

                  return (
                    <div
                      key={key}
                      className={`p-3.5 rounded-xl border transition-all ${isEnabled
                        ? "bg-background border-border shadow-sm"
                        : "bg-muted/30 border-border/50 opacity-80"
                        }`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2.5">
                          {cfg.icon}
                          <span className="font-bold text-sm">
                            {isArabic ? cfg.titleAr : cfg.titleEn}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Label
                            htmlFor={`switch-contact-${key}`}
                            className={`text-xs text-muted-foreground font-bold ${isEditMode ? "cursor-pointer" : "cursor-not-allowed"}`}
                          >
                            {isEnabled ? (isArabic ? "تفعيل" : "Enabled") : (isArabic ? "إيقاف" : "Disabled")}
                          </Label>
                          <Switch
                            id={`switch-contact-${key}`}
                            checked={isEnabled}
                            disabled={!isEditMode}
                            onCheckedChange={(val) => handleContactToggle(key, val)}
                          />
                        </div>
                      </div>

                      {cfg.isBilingual ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                          {/* Arabic Input */}
                          <div className="space-y-1.5 text-start">
                            <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                              <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary">
                                AR
                              </span>
                              {isArabic ? "النص باللغة العربية" : "Arabic (AR)"}
                            </Label>
                            <Input
                              dir="rtl"
                              value={item.valueAr ?? item.value ?? ""}
                              disabled={!isEditMode || !isEnabled}
                              onChange={(e) => handleContactValueChange(key, e.target.value, "ar")}
                              placeholder={cfg.placeholderAr}
                              className={`text-sm ${!isEditMode || !isEnabled
                                ? "bg-muted/50 cursor-not-allowed opacity-70"
                                : "bg-background border-primary/40 focus:border-primary"
                                }`}
                            />
                          </div>

                          {/* English Input */}
                          <div className="space-y-1.5 text-start">
                            <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                              <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600">
                                EN
                              </span>
                              {isArabic ? "النص باللغة الإنجليزية" : "English (EN)"}
                            </Label>
                            <Input
                              dir="ltr"
                              value={item.valueEn ?? ""}
                              disabled={!isEditMode || !isEnabled}
                              onChange={(e) => handleContactValueChange(key, e.target.value, "en")}
                              placeholder={cfg.placeholderEn || ""}
                              className={`text-sm ${!isEditMode || !isEnabled
                                ? "bg-muted/50 cursor-not-allowed opacity-70"
                                : "bg-background border-primary/40 focus:border-primary"
                                }`}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <Input
                            value={item.value || ""}
                            disabled={!isEditMode || !isEnabled}
                            onChange={(e) => handleContactValueChange(key, e.target.value)}
                            placeholder={cfg.placeholderAr}
                            className={`text-sm ${!isEditMode || !isEnabled
                              ? "bg-muted/50 cursor-not-allowed opacity-70"
                              : "bg-background border-primary/40 focus:border-primary"
                              }`}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Social Media Links with Enable/Disable Toggle */}
            <Card className="border-none shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2 text-xl font-bold">
                    <Smartphone className="h-5 w-5 text-primary" />
                    {isArabic ? "روابط التواصل الاجتماعي الرسمية" : "Official Social Links"}
                  </CardTitle>
                  <CardDescription>
                    {isArabic
                      ? "الروابط التي تظهر في فوتر الصفحات العامة وتطبيق الجامعة. يمكنك تفعيل أو إيقاف أي منصة بسهولة."
                      : "Social links displayed in footer across public pages. Enable or disable any platform easily."}
                  </CardDescription>
                </div>
                {!isEditMode && (
                  <Badge variant="outline" className="gap-1 text-xs text-amber-600 border-amber-500/30 shrink-0">
                    <Lock className="h-3 w-3" />
                    {isArabic ? "مغلق للتعديل" : "Locked"}
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-5">
                {platformOrder.map((key) => {
                  const defaultItem = DEFAULT_SITE_SETTINGS.socialLinks[key] || {
                    key,
                    nameAr: key,
                    nameEn: key,
                    url: "",
                    enabled: true,
                  };
                  const item = socialLinks[key] || defaultItem;
                  const isEnabled = item.enabled !== false;

                  return (
                    <div
                      key={key}
                      className={`p-3.5 rounded-xl border transition-all ${isEnabled
                        ? "bg-background border-border shadow-sm"
                        : "bg-muted/30 border-border/50 opacity-80"
                        }`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2.5">
                          {getPlatformIcon(key)}
                          <span className="font-bold text-sm">
                            {isArabic ? (item.nameAr || defaultItem.nameAr) : (item.nameEn || defaultItem.nameEn)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Label
                            htmlFor={`switch-${key}`}
                            className={`text-xs text-muted-foreground font-bold ${isEditMode ? "cursor-pointer" : "cursor-not-allowed"}`}
                          >
                            {isEnabled ? (isArabic ? "تفعيل" : "Enabled") : (isArabic ? "إيقاف" : "Disabled")}
                          </Label>
                          <Switch
                            id={`switch-${key}`}
                            checked={isEnabled}
                            disabled={!isEditMode}
                            onCheckedChange={(val) => handleSocialToggle(key, val)}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Input
                          value={item.url || ""}
                          disabled={!isEditMode || !isEnabled}
                          onChange={(e) => handleSocialUrlChange(key, e.target.value)}
                          placeholder={`https://${key}.com/...`}
                          className={`text-sm ${!isEditMode || !isEnabled
                            ? "bg-muted/50 cursor-not-allowed opacity-70"
                            : "bg-background border-primary/40 focus:border-primary"
                            }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* System Preferences Column */}
          <div className="space-y-8">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-bold">{isArabic ? "تفضيلات النظام" : "System Preferences"}</CardTitle>
                <CardDescription>
                  {isArabic ? "التحكم في الميزات العامة للنظام." : "Control global system features."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="font-bold">{isArabic ? "فتح باب التسجيل" : "Open Registration"}</Label>
                    <p className="text-xs text-muted-foreground">{isArabic ? "تفعيل رابط المفاضلة والتسجيل الإلكتروني" : "Enable online application portal"}</p>
                  </div>
                  <Switch
                    checked={registrationOpen}
                    disabled={!isEditMode}
                    onCheckedChange={setRegistrationOpen}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="font-bold">{isArabic ? "وضع الصيانة" : "Maintenance Mode"}</Label>
                    <p className="text-xs text-muted-foreground">{isArabic ? "تحويل الصفحات العامة لوضع الصيانة" : "Put public pages into maintenance mode"}</p>
                  </div>
                  <Switch
                    checked={maintenanceMode}
                    disabled={!isEditMode}
                    onCheckedChange={setMaintenanceMode}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="font-bold">{isArabic ? "إظهار النتائج العامة" : "Show Public Results"}</Label>
                    <p className="text-xs text-muted-foreground">{isArabic ? "تمكين استعلام نتائج الامتحانات" : "Enable exam result queries"}</p>
                  </div>
                  <Switch
                    checked={showResults}
                    disabled={!isEditMode}
                    onCheckedChange={setShowResults}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg text-primary flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  {isArabic ? "حالة النظام" : "System Status"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-emerald-600 font-bold">
                  <CheckCircle2 className="h-4 w-4" />
                  {isArabic ? "جميع الخدمات والـ APIs تعمل بشكل ممتاز" : "All services and APIs operational"}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isArabic
                    ? "نسخة النظام: ASU-v2.5 (بيئة عمل إنتاجية)"
                    : "System version: ASU-v2.5 (Production Environment)"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
