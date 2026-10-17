"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/language-context";
import { useTheme } from "@/contexts/theme-context";
import { useAuth } from "@/contexts/auth-context";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useNotificationPreferences,
  useUpdateNotificationPreferences,
  NotificationItem
} from "@/hooks/use-notifications";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogBody,
} from "@/components/ui/dialog";
import {
  Bell,
  Settings,
  User,
  LogOut,
  Globe,
  Sun,
  Moon,
  CheckCheck,
  Sparkles,
  SlidersHorizontal,
  Volume2,
  VolumeX,
  Layers,
  Loader2,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Initial mock fallback items if DB is fresh
const defaultNotifications: NotificationItem[] = [
  {
    id: 991,
    titleAr: "طلب قبول جديد",
    titleEn: "New Admission Application",
    messageAr: "استفسار وتسجيل طالب جديد للسنة القادمة",
    messageEn: "New student enrollment application for next academic year",
    type: "info",
    link: "/dashboard",
    isRead: false,
    createdAt: "قبل 10 دقائق",
  },
  {
    id: 992,
    titleAr: "تم نشر النتائج",
    titleEn: "Results Published",
    messageAr: "تم رفع علامات كلية الصيدلة بنجاح",
    messageEn: "Pharmacy faculty grades have been uploaded successfully",
    type: "result",
    link: "/dashboard/students",
    isRead: false,
    createdAt: "قبل ساعة",
  },
  {
    id: 993,
    titleAr: "تحديث جدول المحاضرات",
    titleEn: "Class Schedule Updated",
    messageAr: "تم اعتماد القاعات الدراسية الجديدة للفصل الثاني",
    messageEn: "New lecture halls approved for second semester",
    type: "info",
    link: "/dashboard/programs",
    isRead: true,
    createdAt: "قبل يومين",
  },
];

export function DashboardHeader() {
  const { language, setLanguage, dir } = useLanguage();
  const isArabic = language === "ar";
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

  const { data: dbNotifications } = useNotifications(user?.pk);
  const { data: userPreferences } = useNotificationPreferences(user?.pk);

  const markReadMutation = useMarkNotificationRead(user?.pk);
  const markAllReadMutation = useMarkAllNotificationsRead();
  const updatePreferencesMutation = useUpdateNotificationPreferences(user?.pk);

  const notificationsList = dbNotifications !== undefined ? dbNotifications : defaultNotifications;
  const unreadCount = notificationsList.filter((n) => !n.isRead).length;

  const [isViewAllOpen, setIsViewAllOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuOpenTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const userMenuCloseTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const userMenuContainerRef = React.useRef<HTMLDivElement>(null);

  // Cleanup user menu timeouts on unmount
  useEffect(() => {
    return () => {
      if (userMenuOpenTimeout.current) clearTimeout(userMenuOpenTimeout.current);
      if (userMenuCloseTimeout.current) clearTimeout(userMenuCloseTimeout.current);
    };
  }, []);

  const handleUserMenuMouseEnter = () => {
    if (userMenuCloseTimeout.current) {
      clearTimeout(userMenuCloseTimeout.current);
      userMenuCloseTimeout.current = null;
    }
    if (isUserMenuOpen) return;
    if (!userMenuOpenTimeout.current) {
      userMenuOpenTimeout.current = setTimeout(() => {
        setIsUserMenuOpen(true);
        userMenuOpenTimeout.current = null;
      }, 2000); // 2-second hover delay
    }
  };

  const handleUserMenuMouseLeave = () => {
    if (userMenuOpenTimeout.current) {
      clearTimeout(userMenuOpenTimeout.current);
      userMenuOpenTimeout.current = null;
    }
    if (isUserMenuOpen) {
      if (!userMenuCloseTimeout.current) {
        userMenuCloseTimeout.current = setTimeout(() => {
          setIsUserMenuOpen(false);
          userMenuCloseTimeout.current = null;
        }, 200); // 0.2s grace period
      }
    }
  };

  const handleUserMenuContentMouseEnter = () => {
    if (userMenuCloseTimeout.current) {
      clearTimeout(userMenuCloseTimeout.current);
      userMenuCloseTimeout.current = null;
    }
  };

  const handleUserMenuContentMouseLeave = () => {
    if (!userMenuCloseTimeout.current) {
      userMenuCloseTimeout.current = setTimeout(() => {
        setIsUserMenuOpen(false);
        userMenuCloseTimeout.current = null;
      }, 200);
    }
  };

  // Smart Aggregation Calculations
  const unreadItems = notificationsList.filter((n) => !n.isRead);
  const unreadByType: Record<string, number> = {};
  unreadItems.forEach((n) => {
    unreadByType[n.type] = (unreadByType[n.type] || 0) + 1;
  });

  const aggregatedDigests: string[] = [];
  if (unreadByType.message && unreadByType.message > 1) {
    aggregatedDigests.push(
      isArabic ? `تجميع: لديك ${unreadByType.message} رسائل غير مقروءة` : `Digest: ${unreadByType.message} unread messages`
    );
  }
  if (unreadByType.result && unreadByType.result > 1) {
    aggregatedDigests.push(
      isArabic ? `تجميع: تم نشر ${unreadByType.result} نتائج امتحانات حديثة` : `Digest: ${unreadByType.result} new exam results`
    );
  }
  if (unreadByType.info && unreadByType.info > 1) {
    aggregatedDigests.push(
      isArabic ? `تجميع: ${unreadByType.info} تنبيهات عامة` : `Digest: ${unreadByType.info} info alerts`
    );
  }

  const handleNotificationClick = (item: NotificationItem) => {
    if (!item.isRead) {
      markReadMutation.mutate(item.id);
    }
    if (item.link) {
      router.push(item.link);
    }
  };

  const handleMarkAllRead = () => {
    markAllReadMutation.mutate(user?.pk, {
      onSuccess: () => {
        toast.success(
          isArabic
            ? "تم تحديث كافة الإشعارات كـ مقروءة بنجاح"
            : "All notifications marked as read"
        );
      },
    });
  };

  const handleTogglePreference = (key: "muteMessages" | "muteResults" | "muteInfo" | "muteWarning" | "muteUrgent") => {
    const currentVal = userPreferences ? userPreferences[key] : false;
    const updated = {
      [key]: !currentVal,
    };
    updatePreferencesMutation.mutate(updated as any, {
      onSuccess: () => {
        toast.success(
          isArabic ? "تم تحديث تفضيلات الإشعارات" : "Notification preferences updated"
        );
      },
    });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarTrigger className="-ms-1" />
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{isArabic ? "القائمة الجانبية" : "Toggle Sidebar"}</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 border-s ps-1 ms-1">
          {/* Notifications Dropdown */}
          <DropdownMenu open={isNotificationOpen} onOpenChange={setIsNotificationOpen} dir={dir}>
            <Tooltip open={isNotificationOpen ? false : undefined}>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    aria-label={isArabic ? "التنبيهات والإشعارات" : "Notifications"}
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 items-center justify-center p-0 text-[10px] bg-destructive text-destructive-foreground font-bold shadow-md">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{isArabic ? "التنبيهات والإشعارات" : "Notifications"}</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-80 sm:w-96 p-0 overflow-hidden shadow-xl border rounded-xl">
              <div className="flex items-center justify-between p-3.5 bg-muted/30 border-b">
                <span className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Bell className="h-4 w-4 text-primary" />
                  {isArabic ? "التنبيهات والإشعارات" : "Notifications"}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    aria-label={isArabic ? "تفضيلات الإشعارات" : "Notification Preferences"}
                    onClick={() => setIsPreferencesOpen(true)}
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs font-bold text-primary gap-1 px-2"
                      onClick={handleMarkAllRead}
                      disabled={markAllReadMutation.isPending}
                    >
                      {markAllReadMutation.isPending ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <CheckCheck className="h-3.5 w-3.5" />
                      )}
                      {isArabic ? "تحديد الكل كقروء" : "Mark all as read"}
                    </Button>
                  )}
                </div>
              </div>

              {/* Smart Aggregation Digest Banner */}
              {aggregatedDigests.length > 0 && (
                <div className="p-2.5 bg-primary/10 border-b border-primary/20 text-start space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                    {isArabic ? "التجميع الذكي للإشعارات" : "Smart Notification Digest"}
                  </div>
                  {aggregatedDigests.map((digest, i) => (
                    <p key={i} className="text-[11px] font-medium text-foreground/90">
                      • {digest}
                    </p>
                  ))}
                </div>
              )}

              <div className="max-h-80 overflow-y-auto p-2 space-y-1.5">
                {notificationsList.length === 0 ? (
                  <p className="py-6 text-center text-xs text-muted-foreground font-bold">
                    {isArabic ? "لا توجد إشعارات حالية" : "No notifications available"}
                  </p>
                ) : (
                  notificationsList.map((item) => {
                    const isUnread = !item.isRead;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleNotificationClick(item)}
                        className={cn(
                          "p-3 rounded-lg cursor-pointer transition-all duration-200 text-start space-y-1",
                          isUnread
                            ? "bg-[#800000] text-white shadow-md hover:bg-[#6b0000]"
                            : "hover:bg-muted/50 border border-transparent"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <p className={cn("text-sm font-bold", isUnread ? "text-white" : "text-emerald-600 dark:text-emerald-400")}>
                            {isArabic ? item.titleAr : item.titleEn}
                          </p>
                          {isUnread && (
                            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                          )}
                        </div>
                        <p className={cn("text-xs line-clamp-2", isUnread ? "text-white/90" : "text-muted-foreground")}>
                          {isArabic ? item.messageAr : item.messageEn}
                        </p>
                        <p className={cn("text-[10px]", isUnread ? "text-white/70" : "text-muted-foreground/70")}>
                          {item.createdAt}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="p-2 border-t text-center bg-muted/10">
                <Button
                  variant="ghost"
                  className="w-full text-xs font-bold text-primary hover:bg-muted/50 h-8"
                  onClick={() => setIsViewAllOpen(true)}
                >
                  {isArabic ? "عرض أرشيف كافة الإشعارات" : "View All Notifications Archive"}
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Language Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
                aria-label={isArabic ? "التحويل إلى اللغة الإنجليزية" : "Switch to Arabic language"}
              >
                <Globe className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{isArabic ? "التحويل إلى اللغة الإنجليزية" : "Switch to Arabic"}</p>
            </TooltipContent>
          </Tooltip>

          {/* Theme Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label={
                  theme === "light"
                    ? (isArabic ? "تفعيل الوضع الليلي" : "Switch to Dark Mode")
                    : (isArabic ? "تفعيل الوضع النهاري" : "Switch to Light Mode")
                }
              >
                {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>
                {theme === "light"
                  ? (isArabic ? "تفعيل الوضع الليلي" : "Switch to Dark Mode")
                  : (isArabic ? "تفعيل الوضع النهاري" : "Switch to Light Mode")}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* User Profile Menu */}
        <div
          ref={userMenuContainerRef}
          onMouseEnter={handleUserMenuMouseEnter}
          onMouseLeave={handleUserMenuMouseLeave}
        >
          <DropdownMenu
            open={isUserMenuOpen}
            onOpenChange={setIsUserMenuOpen}
            modal={false}
            dir={dir}
          >
            <Tooltip open={isUserMenuOpen ? false : undefined}>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full ms-1 p-0 cursor-pointer focus-visible:outline-none"
                    aria-label={isArabic ? "الملف الشخصي والحساب" : "User Profile & Account"}
                  >
                    <Avatar className="h-9 w-9 border-2 border-primary/20 hover:border-primary/50 transition-all">
                      <AvatarImage src={(user as any)?.avatar || "/user.png"} alt={user?.username || "User"} />
                      <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                        {user?.first_name ? user.first_name[0].toUpperCase() : (user?.username ? user.username[0].toUpperCase() : "A")}
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
              className="w-56"
              onMouseEnter={handleUserMenuContentMouseEnter}
              onMouseLeave={handleUserMenuContentMouseLeave}
              onPointerDownOutside={(event) => {
                if (
                  userMenuContainerRef.current?.contains(
                    event.target as Node,
                  )
                ) {
                  event.preventDefault();
                }
              }}
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1 text-start">
                  <p className="text-sm font-bold leading-none truncate">
                    {isArabic
                      ? (user?.first_name || user?.username || "مدير النظام")
                      : (user?.last_name || user?.first_name || user?.username || "Admin")}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground truncate">{user?.email || "admin@asu.edu.sy"}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onClick={() => {
                  setIsUserMenuOpen(false);
                  router.push("/dashboard/settings");
                }}
              >
                <User className="h-4 w-4" />
                {isArabic ? "إعدادات الحساب" : "Account Settings"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 text-destructive font-bold cursor-pointer hover:bg-destructive/10 focus:text-destructive focus:bg-destructive/10"
                onClick={() => {
                  setIsUserMenuOpen(false);
                  logout();
                }}
              >
                <LogOut className="h-4 w-4" />
                {isArabic ? "تسجيل الخروج" : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* View All Notifications Dialog */}
      <Dialog open={isViewAllOpen} onOpenChange={setIsViewAllOpen}>
        <DialogContent className="max-w-lg" dir={isArabic ? "rtl" : "ltr"}>
          <DialogHeader className="text-start">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              {isArabic ? "أرشيف التنبيهات والإشعارات" : "Notifications Archive"}
            </DialogTitle>
            <DialogDescription>
              {isArabic ? "سجل كافة التنبيهات المستلمة في حسابك." : "Complete history of notifications."}
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="space-y-3">
            {notificationsList.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  handleNotificationClick(item);
                  setIsViewAllOpen(false);
                }}
                className={cn(
                  "p-4 rounded-xl border transition-all cursor-pointer space-y-1.5 text-start",
                  !item.isRead ? "border-primary/40 bg-primary/5" : "bg-card hover:bg-muted/30"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-base text-foreground">
                    {isArabic ? item.titleAr : item.titleEn}
                  </span>
                  <Badge variant={!item.isRead ? "default" : "outline"} className="text-xs">
                    {!item.isRead ? (isArabic ? "جديد" : "New") : (isArabic ? "مقروء" : "Read")}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{isArabic ? item.messageAr : item.messageEn}</p>
                <p className="text-[10px] text-muted-foreground/70">{item.createdAt}</p>
              </div>
            ))}
          </DialogBody>

          <DialogFooter>
            <Button variant="outline" className="w-full font-bold" onClick={() => setIsViewAllOpen(false)}>
              {isArabic ? "إغلاق" : "Close"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Notification Preferences Modal */}
      <Dialog open={isPreferencesOpen} onOpenChange={setIsPreferencesOpen}>
        <DialogContent className="sm:max-w-[480px]" dir={isArabic ? "rtl" : "ltr"}>
          <DialogHeader className="text-start">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-primary" />
              {isArabic ? "تفضيلات ومترشحات الإشعارات" : "Notification Preferences"}
            </DialogTitle>
            <DialogDescription>
              {isArabic
                ? "حدد أنواع الإشعارات التي ترغب بكتمها أو استلامها في النظام."
                : "Configure notification types you want to mute or receive."}
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="space-y-5 text-start">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-bold">{isArabic ? "إشعارات الرسائل (Messages)" : "Message Alerts"}</Label>
                <p className="text-xs text-muted-foreground">
                  {isArabic ? "الرسائل الجديدة والاستفسارات الواردة" : "New incoming messages and inquiries"}
                </p>
              </div>
              <Switch
                checked={!userPreferences?.muteMessages}
                onCheckedChange={() => handleTogglePreference("muteMessages")}
              />
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <div className="space-y-0.5">
                <Label className="font-bold">{isArabic ? "إشعارات نتائج الامتحانات (Exam Results)" : "Exam Result Alerts"}</Label>
                <p className="text-xs text-muted-foreground">
                  {isArabic ? "تنبيهات نشر العلامات والنتائج" : "Notifications when grades are published"}
                </p>
              </div>
              <Switch
                checked={!userPreferences?.muteResults}
                onCheckedChange={() => handleTogglePreference("muteResults")}
              />
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <div className="space-y-0.5">
                <Label className="font-bold">{isArabic ? "التنبيهات العامة والمعلومات (Info Alerts)" : "General Info Alerts"}</Label>
                <p className="text-xs text-muted-foreground">
                  {isArabic ? "التحديثات العامة وتغييرات الجداول" : "General updates and schedule changes"}
                </p>
              </div>
              <Switch
                checked={!userPreferences?.muteInfo}
                onCheckedChange={() => handleTogglePreference("muteInfo")}
              />
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <div className="space-y-0.5">
                <Label className="font-bold">{isArabic ? "التحذيرات والإشعارات العاجلة (Warnings & Urgent)" : "Warnings & Urgent Alerts"}</Label>
                <p className="text-xs text-muted-foreground">
                  {isArabic ? "الإشعارات العاجلة والتحذيرات الأكاديمية" : "Urgent alerts and system warnings"}
                </p>
              </div>
              <Switch
                checked={!userPreferences?.muteUrgent}
                onCheckedChange={() => handleTogglePreference("muteUrgent")}
              />
            </div>
          </DialogBody>

          <DialogFooter>
            <Button variant="outline" className="w-full font-bold" onClick={() => setIsPreferencesOpen(false)}>
              {isArabic ? "إغلاق" : "Close"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
