"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/language-context";
import { useAuth, getUserRole } from "@/contexts/auth-context";
import { useUsers, useUpdateUser, useCreateUser, UserProfileItem } from "@/hooks/use-users";
import { AuthService } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Save,
  User,
  Lock,
  Sliders,
  Upload,
  Check,
  Loader2,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Key,
  Smartphone,
  Calendar,
  FileText,
  Facebook,
  Linkedin,
  Youtube,
  Instagram,
  Sparkles,
  Info
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";



export default function AccountSettingsPage() {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const { user, refreshUser } = useAuth();

  const { data: usersList } = useUsers();
  const updateUserMutation = useUpdateUser();
  const createUserMutation = useCreateUser();

  // Find user profile from DB list matching email or pk
  const userProfile = (usersList || []).find(
    (u) => u.email.toLowerCase() === (user?.email || "").toLowerCase()
  );

  // Form states
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("/user.png");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isFormInitialized, setIsFormInitialized] = useState(false);

  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Populate data when user or profile is loaded (only once on initial load)
  useEffect(() => {
    if (isFormInitialized) return;

    if (userProfile) {
      setNameAr(userProfile.nameAr || "");
      setNameEn(userProfile.nameEn || "");
      setEmail(userProfile.email || user?.email || "");
      setPhone(userProfile.phone || "");
      setBirthDate(userProfile.birthDate || "");
      setBio(userProfile.bio || "");
      setAvatar(userProfile.avatar || "/user.png");
      setIsFormInitialized(true);
    } else if (user) {
      setNameAr(user.first_name || user.username || "مدير النظام");
      setNameEn(user.last_name || "System Admin");
      setEmail(user.email || "");
      setIsFormInitialized(true);
    }
  }, [userProfile, user, isFormInitialized]);

  // Image Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error(
        isArabic
          ? "حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 2 ميغابايت"
          : "Image size is too large. Please select an image under 2MB"
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatar(event.target.result as string);
        toast.success(
          isArabic
            ? "تم إدراج الصورة للمعاينة! يرجى الضغط على (حفظ التغييرات) لإنهاء الحفظ."
            : "Image loaded for preview! Please click (Save Changes) to save."
        );
      }
    };
    reader.readAsDataURL(file);
  };

  // Save profile info
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr) {
      toast.error(
        isArabic ? "يرجى كتابة الاسم بالعربية" : "Please enter Arabic name"
      );
      return;
    }

    setIsSavingProfile(true);
    try {
      if (userProfile) {
        await updateUserMutation.mutateAsync({
          id: userProfile.id,
          data: {
            nameAr,
            nameEn,
            email,
            phone,
            birthDate: birthDate || undefined,
            bio: bio || undefined,
            avatar,
          },
        });
      } else {
        await createUserMutation.mutateAsync({
          nameAr: nameAr || user?.first_name || "مدير النظام",
          nameEn: nameEn || user?.last_name || "",
          email: email || user?.email || "",
          phone,
          birthDate: birthDate || undefined,
          bio: bio || undefined,
          avatar,
          role: getUserRole(user),
          isActive: true,
        });
      }

      // Also update Django Auth User
      try {
        await AuthService.authUserPartialUpdate({
          first_name: nameAr,
          last_name: nameEn,
          email: email,
        });
      } catch (authErr) {
        console.warn("Auth user update notice:", authErr);
      }

      await refreshUser();

      toast.success(
        isArabic
          ? "تم حفظ وتحديث بيانات الحساب والصورة بنجاح!"
          : "Account details and profile avatar updated successfully!"
      );
    } catch (err) {
      console.error(err);
      toast.error(
        isArabic
          ? "حدث خطأ أثناء حفظ بيانات الحساب"
          : "An error occurred while saving profile details"
      );
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Change password handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error(
        isArabic
          ? "يرجى تعبئة كافة الحقول المطلوبة بما في ذلك كلمة المرور الحالية"
          : "Please fill in all required fields, including your current password"
      );
      return;
    }

    if (newPassword.length < 8) {
      toast.error(
        isArabic
          ? "كلمة المرور الجديدة يجب أن لا تقل عن 8 أحرف"
          : "New password must be at least 8 characters long"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(
        isArabic
          ? "كلمتا المرور غير متطابقتين"
          : "New password and confirmation do not match"
      );
      return;
    }

    setIsChangingPassword(true);
    try {
      await AuthService.authPasswordChangeCreate({
        old_password: currentPassword,
        new_password1: newPassword,
        new_password2: confirmPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success(
        isArabic
          ? "تم تغيير كلمة المرور بنجاح!"
          : "Password updated successfully!"
      );
    } catch (err: any) {
      console.error(err);
      let errorMessage = isArabic
        ? "فشل تغيير كلمة المرور، يرجى التثبت من المعلومات المدخلة"
        : "Failed to change password. Please verify the entered details.";

      if (err?.body) {
        const body = err.body;
        if (typeof body === "object") {
          const messages: string[] = [];
          for (const key in body) {
            const val = body[key];
            if (Array.isArray(val)) {
              messages.push(...val);
            } else if (typeof val === "string") {
              messages.push(val);
            }
          }
          if (messages.length > 0) {
            errorMessage = messages.join(" | ");
          }
        }
      }
      toast.error(errorMessage);
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 text-start" dir={isArabic ? "rtl" : "ltr"}>
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <User className="h-8 w-8 text-primary" />
            {isArabic ? "إعدادات الحساب الشخصي" : "Account Settings"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isArabic
              ? "إدارة معلومات حسابك الشخصي، الصورة الرمزية، والأمان."
              : "Manage your personal profile details, avatar picture, and security."}
          </p>
        </div>

        <Badge variant="outline" className="w-fit text-sm py-1.5 px-3 border-primary/30 bg-primary/5 text-primary font-bold">
          <ShieldCheck className="h-4 w-4 me-1.5" />
          {userProfile?.role === "admin"
            ? (isArabic ? "مدير النظام (Admin)" : "System Admin")
            : userProfile?.role === "content_manager"
              ? (isArabic ? "مسؤول إدارة المحتوى" : "Content Manager")
              : userProfile?.role === "faculty"
                ? (isArabic ? "عضو هيئة تدريسية" : "Faculty Member")
                : (isArabic ? "مستخدم النظام" : "System User")}
        </Badge>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="profile" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <User className="h-4 w-4" />
            {isArabic ? "بيانات الحساب" : "Personal Profile"}
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Lock className="h-4 w-4" />
            {isArabic ? "كلمة المرور والأمان" : "Security & Password"}
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Profile Info */}
        <TabsContent value="profile" className="space-y-6">
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
              {/* Avatar Selector Card */}
              <Card className="border-none shadow-md lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    {isArabic ? "الصورة الشخصية" : "Profile Avatar"}
                  </CardTitle>
                  <CardDescription>
                    {isArabic
                      ? "قم برفع صورتك الشخصية أو ترك الحساب بالصورة الافتراضية."
                      : "Upload your custom picture or keep the default avatar."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Avatar className="h-28 w-28 border-4 border-primary/20 shadow-lg">
                      <AvatarImage src={avatar || "/user.png"} alt="Profile Avatar" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                        {nameAr ? nameAr[0] : "A"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-xs text-muted-foreground">
                      {isArabic ? "الصورة الحالية للحساب" : "Current Avatar"}
                    </div>
                  </div>

                  {/* File Upload Button & Reset */}
                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        type="file"
                        id="avatar-upload"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Label
                        htmlFor="avatar-upload"
                        className="flex items-center justify-center gap-2 cursor-pointer py-2.5 px-4 rounded-lg bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow"
                      >
                        <Upload className="h-4 w-4" />
                        {isArabic ? "رفع صورة جديدة من الجهاز" : "Upload Custom Picture"}
                      </Label>
                    </div>

                    {avatar && avatar !== "/user.png" && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full font-bold text-destructive hover:bg-destructive/10"
                        onClick={() => setAvatar("/user.png")}
                      >
                        {isArabic ? "إزالة الصورة واستخدام الافتراضية" : "Reset to Default Avatar"}
                      </Button>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {isArabic
                      ? "عند عدم رفع صورة خاصة، سيتم اعتماد صورة النظام الافتراضية لكافة الحسابات."
                      : "If no custom avatar is uploaded, the system default image will be used."}
                  </p>
                </CardContent>
              </Card>

              {/* Account Details Form */}
              <Card className="border-none shadow-md lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    {isArabic ? "المعلومات الشخصية" : "Personal Information"}
                  </CardTitle>
                  <CardDescription>
                    {isArabic
                      ? "تحديث اسم الحساب، البريد الإلكتروني، ورقم الهاتف."
                      : "Update your account name, email address, and phone number."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nameAr">
                        {isArabic ? "الاسم الكامل (بالعربية)" : "Full Name (Arabic)"}
                      </Label>
                      <Input
                        id="nameAr"
                        required
                        value={nameAr}
                        onChange={(e) => setNameAr(e.target.value)}
                        placeholder="مثال: د. أحمد المحمد"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nameEn">
                        {isArabic ? "الاسم الكامل (بالإنجليزية)" : "Full Name (English)"}
                      </Label>
                      <Input
                        id="nameEn"
                        value={nameEn}
                        onChange={(e) => setNameEn(e.target.value)}
                        placeholder="e.g. Dr. Ahmad Al-Mohammad"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {isArabic ? "البريد الإلكتروني" : "Email Address"}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@asu.edu.sy"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {isArabic ? "رقم الهاتف" : "Phone Number"}
                      </Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0912345678"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthDate" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {isArabic ? "تاريخ الميلاد / العمر" : "Date of Birth / Age"}
                    </Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      {isArabic ? "نبذة شخصية" : "Short Description"}
                    </Label>
                    <Textarea
                      id="bio"
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder={isArabic ? "اكتب نبذة مختصرة عن نفسك واهتماماتك الشخصية أو الأكاديمية..." : "Write a brief description about yourself..."}
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button type="submit" className="font-bold flex gap-2 min-w-40" disabled={isSavingProfile}>
                      {isSavingProfile ? (
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
                </CardContent>
              </Card>
            </div>
          </form>
        </TabsContent>

        {/* Tab 2: Security & Password */}
        <TabsContent value="security">
          <Card className="border-none shadow-md max-w-2xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                {isArabic ? "تغيير كلمة المرور" : "Change Password"}
              </CardTitle>
              <CardDescription>
                {isArabic
                  ? "قم بتعزيز أمان حسابك عن طريق اختيار كلمة مرور قوية جديدة."
                  : "Enhance your account security by choosing a strong new password."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">
                    {isArabic ? "كلمة المرور الحالية" : "Current Password"}
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                {/* Requirements info banner */}
                <div className="p-3.5 rounded-lg border border-blue-500/20 bg-blue-500/5 text-blue-800 dark:text-blue-300 text-xs leading-relaxed flex items-start gap-2.5">
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block mb-0.5">
                      {isArabic ? "متطلبات كلمة المرور المقبولة:" : "Password Requirements:"}
                    </span>
                    {isArabic
                      ? "يجب أن لا تقل كلمة المرور عن 8 محارف، وأن تحتوي على مزيج من الأحرف والأرقام والرموز (مثل @, #, $, !) لضمان القبول في النظام."
                      : "Must be at least 8 characters long and contain a mix of letters, numbers, and symbols (e.g. @, #, $, !)."}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">
                    {isArabic ? "كلمة المرور الجديدة" : "New Password"}
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    {isArabic ? "تأكيد كلمة المرور الجديدة" : "Confirm New Password"}
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" className="font-bold flex gap-2 min-w-40" disabled={isChangingPassword}>
                    {isChangingPassword ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {isArabic ? "جاري التحديث..." : "Updating..."}
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        {isArabic ? "تحديث كلمة المرور" : "Update Password"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
