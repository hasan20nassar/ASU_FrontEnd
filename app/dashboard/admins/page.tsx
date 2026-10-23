"use client";

import React, { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/language-context";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  UserProfileItem,
} from "@/hooks/use-users";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Search,
  UserPlus,
  Edit,
  Trash2,
  ShieldCheck,
  Loader2,
  MoreVertical,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  Lock,
  List,
  LayoutGrid,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminsManagementPage() {
  const { language, dir } = useLanguage();
  const isArabic = language === "ar";

  const { data: usersData, isLoading } = useUsers();
  const usersList = usersData || [];

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "cards">("list");

  // Modals State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<UserProfileItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    nameAr: "",
    nameEn: "",
    email: "",
    password: "",
    phone: "",
    bio: "",
    isActive: true,
  });

  // Filter only admin users (Super Admins)
  const adminUsers = useMemo(() => {
    return usersList.filter((u) => u.role === "admin");
  }, [usersList]);

  // Filtered List
  const filteredAdmins = useMemo(() => {
    return adminUsers.filter((u) => {
      const q = searchQuery.toLowerCase();
      return (
        searchQuery === "" ||
        u.nameAr.toLowerCase().includes(q) ||
        (u.nameEn && u.nameEn.toLowerCase().includes(q)) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone && u.phone.includes(searchQuery))
      );
    });
  }, [adminUsers, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    let activeCount = 0;
    adminUsers.forEach((u) => {
      if (u.isActive) activeCount++;
    });

    return {
      total: adminUsers.length,
      activeCount,
      inactiveCount: adminUsers.length - activeCount,
    };
  }, [adminUsers]);

  const resetForm = () => {
    setFormData({
      nameAr: "",
      nameEn: "",
      email: "",
      password: "",
      phone: "",
      bio: "",
      isActive: true,
    });
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddOpen(true);
  };

  const handleOpenEdit = (admin: UserProfileItem) => {
    setSelectedAdmin(admin);
    setFormData({
      nameAr: admin.nameAr,
      nameEn: admin.nameEn || "",
      email: admin.email,
      password: "",
      phone: admin.phone || "",
      bio: admin.bio || "",
      isActive: admin.isActive,
    });
    setIsEditOpen(true);
  };

  const handleOpenDelete = (admin: UserProfileItem) => {
    setSelectedAdmin(admin);
    setIsDeleteOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameAr?.trim()) {
      toast.error(isArabic ? "يرجى إدخال الاسم بالعربية" : "Please enter the Arabic name");
      return;
    }
    if (!formData.email?.trim()) {
      toast.error(isArabic ? "يرجى إدخال البريد الإلكتروني" : "Please enter the email address");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      toast.error(isArabic ? "صيغة البريد الإلكتروني غير صحيحة" : "Invalid email address format");
      return;
    }
    if (!formData.password?.trim()) {
      toast.error(isArabic ? "يرجى إدخال كلمة المرور" : "Please enter the password");
      return;
    }
    if (formData.password.trim().length < 8) {
      toast.error(isArabic ? "يجب ألا تقل كلمة المرور عن 8 أحرف" : "Password must be at least 8 characters");
      return;
    }

    try {
      await createUserMutation.mutateAsync({
        nameAr: formData.nameAr.trim(),
        nameEn: formData.nameEn.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
        bio: formData.bio.trim(),
        role: "admin",
        avatar: "/user.png",
        isActive: formData.isActive,
      });

      toast.success(
        isArabic
          ? "تمت إضافة مدير النظام بنجاح!"
          : "System administrator account created successfully!"
      );
      setIsAddOpen(false);
      resetForm();
    } catch (err) {
      toast.error(
        isArabic ? "حدث خطأ أثناء إضافة الحساب" : "Failed to create admin account"
      );
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdmin) return;
    if (!formData.nameAr?.trim()) {
      toast.error(isArabic ? "يرجى إدخال الاسم بالعربية" : "Please enter the Arabic name");
      return;
    }
    if (!formData.email?.trim()) {
      toast.error(isArabic ? "يرجى إدخال البريد الإلكتروني" : "Please enter the email address");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      toast.error(isArabic ? "صيغة البريد الإلكتروني غير صحيحة" : "Invalid email address format");
      return;
    }
    if (formData.password && formData.password.trim().length < 8) {
      toast.error(isArabic ? "يجب ألا تقل كلمة المرور عن 8 أحرف" : "Password must be at least 8 characters");
      return;
    }

    try {
      await updateUserMutation.mutateAsync({
        id: selectedAdmin.id,
        data: {
          nameAr: formData.nameAr.trim(),
          nameEn: formData.nameEn.trim(),
          email: formData.email.trim(),
          password: formData.password ? formData.password : undefined,
          phone: formData.phone.trim(),
          bio: formData.bio.trim() || undefined,
          role: "admin",
          isActive: formData.isActive,
        },
      });

      toast.success(
        isArabic
          ? "تم تحديث بيانات المدير بنجاح!"
          : "Administrator account updated successfully!"
      );
      setIsEditOpen(false);
      setSelectedAdmin(null);
    } catch (err) {
      toast.error(
        isArabic ? "حدث خطأ أثناء تحديث الحساب" : "Failed to update admin account"
      );
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedAdmin) return;

    try {
      await deleteUserMutation.mutateAsync(selectedAdmin.id);
      toast.success(
        isArabic
          ? "تم حذف حساب مدير النظام بنجاح!"
          : "Administrator deleted successfully!"
      );
      setIsDeleteOpen(false);
      setSelectedAdmin(null);
    } catch (err) {
      toast.error(
        isArabic ? "حدث خطأ أثناء الحذف" : "Failed to delete account"
      );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-start" dir={dir}>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isArabic ? "مدراء النظام" : "System Administrators"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isArabic
              ? "إدارة الحسابات الإدارية العليا وصلاحيات التحكم الكاملة في منصة الجامعة."
              : "Manage super administrators with full platform control and privileges."}
          </p>
        </div>
        <Button className="font-bold flex gap-2 shadow-md bg-red-600 hover:bg-red-700 text-white" onClick={handleOpenAdd}>
          <UserPlus className="h-4 w-4" />
          {isArabic ? "إضافة مدير نظام" : "Add System Admin"}
        </Button>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm bg-muted/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-semibold">
                {isArabic ? "إجمالي مدراء النظام" : "Total System Admins"}
              </p>
              <p className="text-2xl font-bold mt-1 text-red-600">{stats.total}</p>
            </div>
            <div className="p-2.5 bg-red-500/10 text-red-600 rounded-xl">
              <ShieldCheck className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-muted/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-semibold">
                {isArabic ? "الحسابات النشطة" : "Active Admins"}
              </p>
              <p className="text-2xl font-bold mt-1 text-emerald-600">{stats.activeCount}</p>
            </div>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-xl">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-muted/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-semibold">
                {isArabic ? "مستوى الصلاحية" : "Privilege Scope"}
              </p>
              <p className="text-lg font-bold mt-1 text-primary">
                {isArabic ? "تحكم كامل وشامل" : "Super Administrator"}
              </p>
            </div>
            <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
              <Lock className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Toolbar */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={
                  isArabic
                    ? "بحث باسم المدير، البريد الإلكتروني، أو الهاتف..."
                    : "Search by administrator name, email, or phone..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9"
              />
            </div>

            {/* View Mode Toggle: List / Cards */}
            <div className="flex items-center bg-muted/50 p-1 rounded-xl border shrink-0 self-end sm:self-center">
              <Button
                type="button"
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                className="h-8 px-3 gap-1.5 text-xs font-bold rounded-lg"
                onClick={() => setViewMode("list")}
                title={isArabic ? "عرض القائمة" : "List View"}
              >
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">{isArabic ? "قائمة" : "List"}</span>
              </Button>
              <Button
                type="button"
                variant={viewMode === "cards" ? "default" : "ghost"}
                size="sm"
                className="h-8 px-3 gap-1.5 text-xs font-bold rounded-lg"
                onClick={() => setViewMode("cards")}
                title={isArabic ? "عرض البطاقات" : "Card View"}
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">{isArabic ? "بطاقات" : "Cards"}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admins Table / Cards Content */}
      <Card className="border-none shadow-sm overflow-hidden">
        {viewMode === "list" ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead>{isArabic ? "مدير النظام" : "System Administrator"}</TableHead>
                  <TableHead>{isArabic ? "الصلاحية" : "Privilege"}</TableHead>
                  <TableHead>{isArabic ? "الهاتف" : "Phone"}</TableHead>
                  <TableHead>{isArabic ? "الملاحظات" : "Notes"}</TableHead>
                  <TableHead>{isArabic ? "الحالة" : "Status"}</TableHead>
                  <TableHead className="text-end">{isArabic ? "الإجراءات" : "Actions"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-40 text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                      <span className="text-sm text-muted-foreground mt-2 block">
                        {isArabic ? "جاري تحميل بيانات المدراء..." : "Loading administrators..."}
                      </span>
                    </TableCell>
                  </TableRow>
                ) : filteredAdmins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-40 text-center text-muted-foreground">
                      <ShieldCheck className="h-10 w-10 mx-auto mb-2 opacity-30" />
                      <p className="font-semibold">
                        {isArabic
                          ? "لم يتم العثور على أي حسابات تطابق خيارات البحث"
                          : "No administrator accounts found"}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAdmins.map((admin) => (
                    <TableRow key={admin.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border">
                            <AvatarImage src={admin.avatar} />
                            <AvatarFallback className="bg-red-500/10 text-red-600 font-bold text-xs">
                              {admin.nameAr.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-sm text-foreground">{admin.nameAr}</p>
                            <p className="text-xs text-muted-foreground font-mono">{admin.email}</p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge className="bg-red-500/15 text-red-600 border border-red-500/30 hover:bg-red-500/20 font-bold gap-1">
                          <ShieldCheck className="h-3 w-3" />
                          {isArabic ? "مدير النظام" : "System Admin"}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-sm font-mono text-muted-foreground">
                        {admin.phone || "N/A"}
                      </TableCell>

                      <TableCell className="text-sm max-w-[220px] truncate text-muted-foreground">
                        {admin.bio || "N/A"}
                      </TableCell>

                      <TableCell>
                        {admin.isActive ? (
                          <Badge className="bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 font-semibold">
                            {isArabic ? "نشط" : "Active"}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">
                            {isArabic ? "معطل" : "Inactive"}
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell className="text-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenEdit(admin)}>
                              <Edit className="h-4 w-4 me-2" />
                              {isArabic ? "تعديل البيانات" : "Edit Details"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => window.open(`mailto:${admin.email}`)}
                            >
                              <Mail className="h-4 w-4 me-2" />
                              {isArabic ? "إرسال بريد إلكتروني" : "Send Email"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleOpenDelete(admin)}
                            >
                              <Trash2 className="h-4 w-4 me-2" />
                              {isArabic ? "حذف الحساب" : "Delete Account"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <span className="text-sm text-muted-foreground font-bold">
                  {isArabic ? "جاري تحميل بيانات المدراء..." : "Loading administrators..."}
                </span>
              </div>
            ) : filteredAdmins.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ShieldCheck className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p className="font-semibold">
                  {isArabic
                    ? "لم يتم العثور على أي حسابات تطابق خيارات البحث"
                    : "No administrator accounts found"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredAdmins.map((admin) => (
                  <Card key={admin.id} className="border border-border/80 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group min-w-0 w-full">
                    <CardContent className="p-5 flex flex-col justify-between h-full space-y-4 min-w-0">
                      {/* Top Header with Avatar & Badge */}
                      <div className="flex items-start justify-between gap-3 min-w-0">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <Avatar className="h-12 w-12 border-2 border-red-500/20 shadow-sm shrink-0">
                            <AvatarImage src={admin.avatar} />
                            <AvatarFallback className="bg-red-500/10 text-red-600 font-bold text-sm">
                              {admin.nameAr.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-base text-foreground group-hover:text-red-600 transition-colors truncate">
                              {admin.nameAr}
                            </h3>
                            {admin.nameEn && (
                              <p className="text-xs text-muted-foreground truncate">{admin.nameEn}</p>
                            )}
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 -me-2 shrink-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenEdit(admin)}>
                              <Edit className="h-4 w-4 me-2" />
                              {isArabic ? "تعديل البيانات" : "Edit Details"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.open(`mailto:${admin.email}`)}>
                              <Mail className="h-4 w-4 me-2" />
                              {isArabic ? "إرسال بريد إلكتروني" : "Send Email"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleOpenDelete(admin)}
                            >
                              <Trash2 className="h-4 w-4 me-2" />
                              {isArabic ? "حذف الحساب" : "Delete Account"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Role & Status Badges */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 min-w-0">
                        <Badge className="bg-red-500/15 text-red-600 border border-red-500/30 font-bold gap-1 text-xs shrink-0">
                          <ShieldCheck className="h-3 w-3" />
                          {isArabic ? "مدير النظام" : "System Admin"}
                        </Badge>
                        {admin.isActive ? (
                          <Badge className="bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 text-xs shrink-0">
                            {isArabic ? "نشط" : "Active"}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground text-xs shrink-0">
                            {isArabic ? "معطل" : "Inactive"}
                          </Badge>
                        )}
                      </div>

                      {/* Contact & Bio Info */}
                      <div className="space-y-1.5 text-xs text-muted-foreground border-t pt-3 min-w-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span className="font-mono truncate">{admin.email}</span>
                        </div>
                        {admin.phone && (
                          <div className="flex items-center gap-2 min-w-0">
                            <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span className="font-mono dir-ltr truncate">{admin.phone}</span>
                          </div>
                        )}
                        {admin.bio && (
                          <p className="text-[11px] line-clamp-2 text-muted-foreground/80 mt-1 italic">
                            "{admin.bio}"
                          </p>
                        )}
                      </div>

                      {/* Card Footer Actions */}
                      <div className="flex items-center justify-end gap-2 pt-2 border-t mt-auto min-w-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs font-semibold gap-1.5 shrink-0"
                          onClick={() => handleOpenEdit(admin)}
                        >
                          <Edit className="h-3.5 w-3.5" />
                          {isArabic ? "تعديل" : "Edit"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Add Administrator Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-red-600" />
              {isArabic ? "إضافة مدير نظام جديد" : "Add System Admin"}
            </DialogTitle>
            <DialogDescription>
              {isArabic
                ? "إنشاء حساب بصلاحيات تحكم وإدارة كاملة على منصة الجامعة."
                : "Create a new privileged super administrator account."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <DialogBody>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{isArabic ? "الاسم بالعربية" : "Arabic Name"}</Label>
                  <Input
                    required
                    placeholder={isArabic ? "م. خالد السالم" : "Khaled Al-Salem"}
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{isArabic ? "الاسم بالإنجليزية" : "English Name"}</Label>
                  <Input
                    placeholder="Khaled Al-Salem"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{isArabic ? "البريد الإلكتروني" : "Email Address"}</Label>
                  <Input
                    required
                    type="email"
                    placeholder="admin@asu.edu.sy"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{isArabic ? "كلمة المرور" : "Password"}</Label>
                  <Input
                    required
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {isArabic ? "يجب ألا تقل عن 8 أحرف" : "Must be at least 8 characters"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{isArabic ? "رقم الهاتف" : "Phone Number"}</Label>
                <Input
                  placeholder="0912345678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>{isArabic ? "ملاحظات إدارية" : "Administrative Notes"}</Label>
                <Textarea
                  rows={2}
                  placeholder={isArabic ? "ملاحظات إدارية عن الحساب..." : "Administrative notes..."}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <Label className="font-semibold block">
                    {isArabic ? "تفعيل الحساب" : "Account Active"}
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    {isArabic
                      ? "السماح لمدير النظام بتسجيل الدخول للوحة التحكم"
                      : "Allow administrator to log into the dashboard"}
                  </span>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
              </div>
            </DialogBody>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddOpen(false)}
              >
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white" disabled={createUserMutation.isPending}>
                {createUserMutation.isPending && (
                  <Loader2 className="h-4 w-4 me-2 animate-spin" />
                )}
                {isArabic ? "حفظ الحساب" : "Create Account"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Administrator Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-red-600" />
              {isArabic ? "تعديل حساب مدير النظام" : "Edit Administrator Account"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <DialogBody>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{isArabic ? "الاسم بالعربية" : "Arabic Name"}</Label>
                  <Input
                    required
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{isArabic ? "الاسم بالإنجليزية" : "English Name"}</Label>
                  <Input
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{isArabic ? "البريد الإلكتروني" : "Email Address"}</Label>
                  <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    {isArabic ? "كلمة المرور الجديدة" : "New Password"}
                  </Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {isArabic ? "اتركها فارغة للإبقاء على كلمة المرور الحالية" : "Leave blank to keep current password"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{isArabic ? "رقم الهاتف" : "Phone Number"}</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>{isArabic ? "ملاحظات إدارية" : "Administrative Notes"}</Label>
                <Textarea
                  rows={2}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <Label className="font-semibold block">
                    {isArabic ? "تفعيل الحساب" : "Account Active"}
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    {isArabic
                      ? "السماح لمدير النظام بتسجيل الدخول للوحة التحكم"
                      : "Allow administrator to log into the dashboard"}
                  </span>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
              </div>
            </DialogBody>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
              >
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white" disabled={updateUserMutation.isPending}>
                {updateUserMutation.isPending && (
                  <Loader2 className="h-4 w-4 me-2 animate-spin" />
                )}
                {isArabic ? "حفظ التعديلات" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              {isArabic ? "تأكيد حذف حساب مدير النظام" : "Confirm Admin Deletion"}
            </DialogTitle>
            <DialogDescription>
              {isArabic
                ? `هل أنت متأكد من رغبتك في حذف حساب مدير النظام "${selectedAdmin?.nameAr}" (${selectedAdmin?.email})؟ سيتم إلغاء كافة صلاحيات التحكم الكاملة.`
                : `Are you sure you want to delete administrator "${selectedAdmin?.nameAr}" (${selectedAdmin?.email})? All privileges will be revoked immediately.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
            >
              {isArabic ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending && (
                <Loader2 className="h-4 w-4 me-2 animate-spin" />
              )}
              {isArabic ? "تأكيد الحذف" : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
