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
import { useFaculties } from "@/hooks/use-faculties";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  UserPlus,
  Edit,
  Trash2,
  FileText,
  Loader2,
  MoreVertical,
  Mail,
  Building2,
  Phone,
  CheckCircle2,
  AlertCircle,
  Globe,
  List,
  LayoutGrid,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ContentManagersPage() {
  const { language, dir } = useLanguage();
  const isArabic = language === "ar";

  const { data: backendFaculties } = useFaculties();
  const faculties = backendFaculties || [];

  const { data: usersData, isLoading } = useUsers();
  const usersList = usersData || [];

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFacultyFilter, setSelectedFacultyFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "cards">("list");

  // Modals State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState<UserProfileItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    nameAr: "",
    nameEn: "",
    email: "",
    password: "",
    phone: "",
    bio: "",
    assignedFaculty: null as number | null,
    isActive: true,
  });

  // Filter only content_manager users
  const contentManagers = useMemo(() => {
    return usersList.filter((u) => u.role === "content_manager");
  }, [usersList]);

  // Filtered List
  const filteredManagers = useMemo(() => {
    return contentManagers.filter((u) => {
      const matchesSearch =
        searchQuery === "" ||
        u.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.nameEn && u.nameEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.phone && u.phone.includes(searchQuery));

      const matchesFaculty =
        selectedFacultyFilter === "all" ||
        (selectedFacultyFilter === "global" && !u.assignedFaculty) ||
        u.assignedFaculty?.toString() === selectedFacultyFilter;

      return matchesSearch && matchesFaculty;
    });
  }, [contentManagers, searchQuery, selectedFacultyFilter]);

  // Stats
  const stats = useMemo(() => {
    let activeCount = 0;
    const facultySet = new Set<number>();

    contentManagers.forEach((u) => {
      if (u.isActive) activeCount++;
      if (u.assignedFaculty) facultySet.add(u.assignedFaculty);
    });

    return {
      total: contentManagers.length,
      activeCount,
      facultiesCovered: facultySet.size,
    };
  }, [contentManagers]);

  const resetForm = () => {
    setFormData({
      nameAr: "",
      nameEn: "",
      email: "",
      password: "",
      phone: "",
      bio: "",
      assignedFaculty: null,
      isActive: true,
    });
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddOpen(true);
  };

  const handleOpenEdit = (manager: UserProfileItem) => {
    setSelectedManager(manager);
    setFormData({
      nameAr: manager.nameAr,
      nameEn: manager.nameEn || "",
      email: manager.email,
      password: "",
      phone: manager.phone || "",
      bio: manager.bio || "",
      assignedFaculty: manager.assignedFaculty || null,
      isActive: manager.isActive,
    });
    setIsEditOpen(true);
  };

  const handleOpenDelete = (manager: UserProfileItem) => {
    setSelectedManager(manager);
    setIsDeleteOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameAr.trim() || !formData.email.trim() || !formData.password.trim()) {
      toast.error(
        isArabic
          ? "يرجى ملء كافة الحقول الأساسية (الاسم بالعربية، البريد، كلمة المرور)"
          : "Please fill required fields (Arabic Name, Email, Password)"
      );
      return;
    }

    try {
      await createUserMutation.mutateAsync({
        nameAr: formData.nameAr,
        nameEn: formData.nameEn,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        bio: formData.bio,
        role: "content_manager",
        assignedFaculty: formData.assignedFaculty,
        avatar: "/user.png",
        isActive: formData.isActive,
      });

      toast.success(
        isArabic
          ? "تمت إضافة مسؤول المحتوى بنجاح!"
          : "Content Manager created successfully!"
      );
      setIsAddOpen(false);
      resetForm();
    } catch (err) {
      toast.error(
        isArabic ? "حدث خطأ أثناء إضافة الحساب" : "Failed to create content manager"
      );
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedManager || !formData.nameAr.trim() || !formData.email.trim()) {
      toast.error(
        isArabic
          ? "يرجى ملء الحقول الأساسية"
          : "Please fill required fields"
      );
      return;
    }

    try {
      await updateUserMutation.mutateAsync({
        id: selectedManager.id,
        data: {
          nameAr: formData.nameAr,
          nameEn: formData.nameEn,
          email: formData.email,
          password: formData.password || undefined,
          phone: formData.phone,
          bio: formData.bio || undefined,
          role: "content_manager",
          assignedFaculty: formData.assignedFaculty,
          isActive: formData.isActive,
        },
      });

      toast.success(
        isArabic
          ? "تم تحديث بيانات مسؤول المحتوى بنجاح!"
          : "Content Manager updated successfully!"
      );
      setIsEditOpen(false);
      setSelectedManager(null);
    } catch (err) {
      toast.error(
        isArabic ? "حدث خطأ أثناء تحديث الحساب" : "Failed to update account"
      );
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedManager) return;

    try {
      await deleteUserMutation.mutateAsync(selectedManager.id);
      toast.success(
        isArabic
          ? "تم حذف حساب مسؤول المحتوى بنجاح!"
          : "Content Manager deleted successfully!"
      );
      setIsDeleteOpen(false);
      setSelectedManager(null);
    } catch (err) {
      toast.error(
        isArabic ? "حدث خطأ أثناء الحذف" : "Failed to delete account"
      );
    }
  };

  const getFacultyName = (facId?: number | null) => {
    if (!facId) return isArabic ? "كامل الجامعة (شامل)" : "Global (All Faculties)";
    const fac = faculties.find((f) => f.id === facId);
    return fac ? (isArabic ? fac.nameAr : fac.nameEn) : `#${facId}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-start" dir={dir}>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isArabic ? "إدارة مسؤولي المحتوى" : "Content Managers"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isArabic
              ? "إدارة حسابات وصلاحيات مسؤولي التحرير لنشر الأخبار، الفعاليات، وإدارة صفحات الكليات."
              : "Manage editorial permissions for news, events, and scoped faculty content management."}
          </p>
        </div>
        <Button className="font-bold flex gap-2 shadow-md" onClick={handleOpenAdd}>
          <UserPlus className="h-4 w-4" />
          {isArabic ? "إضافة مسؤول محتوى" : "Add Content Manager"}
        </Button>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm bg-muted/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-semibold">
                {isArabic ? "إجمالي مسؤولي المحتوى" : "Total Content Managers"}
              </p>
              <p className="text-2xl font-bold mt-1 text-blue-600">{stats.total}</p>
            </div>
            <div className="p-2.5 bg-blue-500/10 text-blue-600 rounded-xl">
              <FileText className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-muted/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-semibold">
                {isArabic ? "الحسابات النشطة" : "Active Accounts"}
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
                {isArabic ? "الكليات المغطاة" : "Faculties Covered"}
              </p>
              <p className="text-2xl font-bold mt-1 text-primary">{stats.facultiesCovered}</p>
            </div>
            <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
              <Building2 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter Toolbar */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={
                  isArabic
                    ? "بحث باسم مسؤول المحتوى، البريد، أو الهاتف..."
                    : "Search by manager name, email, or phone..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9"
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
              {/* Faculty Filter */}
              <div className="w-full sm:w-60">
                <Select
                  value={selectedFacultyFilter}
                  onValueChange={setSelectedFacultyFilter}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={isArabic ? "تصفية بالكلية المسندة" : "Filter by faculty"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {isArabic ? "كافة النطاقات" : "All Scopes"}
                    </SelectItem>
                    <SelectItem value="global">
                      {isArabic ? "كامل الجامعة (عام)" : "Global (Unassigned)"}
                    </SelectItem>
                    {faculties.map((f) => (
                      <SelectItem key={f.id} value={f.id.toString()}>
                        {isArabic ? f.nameAr : f.nameEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* View Mode Toggle: List / Cards */}
              <div className="flex items-center bg-muted/50 p-1 rounded-xl border shrink-0">
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
          </div>
        </CardContent>
      </Card>

      {/* Managers Table / Cards Content */}
      <Card className="border-none shadow-sm overflow-hidden">
        {viewMode === "list" ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead>{isArabic ? "المسؤول" : "Manager"}</TableHead>
                  <TableHead>{isArabic ? "النطاق الأكاديمي المسند" : "Assigned Scope"}</TableHead>
                  <TableHead>{isArabic ? "الهاتف" : "Phone"}</TableHead>
                  <TableHead>{isArabic ? "النبذة / الصلاحيات" : "Bio / Notes"}</TableHead>
                  <TableHead>{isArabic ? "الحالة" : "Status"}</TableHead>
                  <TableHead className="text-end">{isArabic ? "الإجراءات" : "Actions"}</TableHead>
                  <TableHead className="text-center">{isArabic ? "الإجراءات" : "Actions"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-40 text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                      <span className="text-sm text-muted-foreground mt-2 block">
                        {isArabic ? "جاري تحميل مسؤولي المحتوى..." : "Loading content managers..."}
                      </span>
                    </TableCell>
                  </TableRow>
                ) : filteredManagers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-40 text-center text-muted-foreground">
                      <FileText className="h-10 w-10 mx-auto mb-2 opacity-30" />
                      <p className="font-semibold">
                        {isArabic
                          ? "لم يتم العثور على أي مسؤولي محتوى يطابقون خيارات البحث"
                          : "No content managers found"}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredManagers.map((mgr) => (
                    <TableRow key={mgr.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border">
                            <AvatarImage src={mgr.avatar} />
                            <AvatarFallback className="bg-blue-500/10 text-blue-600 font-bold text-xs">
                              {mgr.nameAr.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-sm text-foreground">{mgr.nameAr}</p>
                            <p className="text-xs text-muted-foreground font-mono">{mgr.email}</p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-sm">
                        <div className="flex items-center gap-1.5">
                          {mgr.assignedFaculty ? (
                            <Badge variant="outline" className="gap-1 border-blue-500/30 text-blue-700 bg-blue-500/10">
                              <Building2 className="h-3 w-3" />
                              <span>{getFacultyName(mgr.assignedFaculty)}</span>
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="gap-1 border-slate-300 text-slate-700 bg-slate-500/10">
                              <Globe className="h-3 w-3" />
                              <span>{isArabic ? "كامل محتوى الجامعة" : "Global University"}</span>
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-sm font-mono text-muted-foreground">
                        {mgr.phone || "-"}
                      </TableCell>

                      <TableCell className="text-sm max-w-[200px] truncate text-muted-foreground">
                        {mgr.bio || "-"}
                      </TableCell>

                      <TableCell>
                        {mgr.isActive ? (
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
                            <DropdownMenuItem onClick={() => handleOpenEdit(mgr)}>
                              <Edit className="h-4 w-4 me-2" />
                              {isArabic ? "تعديل الحساب والنطاق" : "Edit Scope & Details"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => window.open(`mailto:${mgr.email}`)}
                            >
                              <Mail className="h-4 w-4 me-2" />
                              {isArabic ? "إرسال بريد إلكتروني" : "Send Email"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleOpenDelete(mgr)}
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
                  {isArabic ? "جاري تحميل مسؤولي المحتوى..." : "Loading content managers..."}
                </span>
              </div>
            ) : filteredManagers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p className="font-semibold">
                  {isArabic
                    ? "لم يتم العثور على أي مسؤولي محتوى يطابقون خيارات البحث"
                    : "No content managers found"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredManagers.map((mgr) => (
                  <Card key={mgr.id} className="border border-border/80 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
                    <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                      {/* Top Header with Avatar & Options */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 border-2 border-blue-500/20 shadow-sm">
                            <AvatarImage src={mgr.avatar} />
                            <AvatarFallback className="bg-blue-500/10 text-blue-600 font-bold text-sm">
                              {mgr.nameAr.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                              {mgr.nameAr}
                            </h3>
                            {mgr.nameEn && (
                              <p className="text-xs text-muted-foreground">{mgr.nameEn}</p>
                            )}
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 -me-2">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenEdit(mgr)}>
                              <Edit className="h-4 w-4 me-2" />
                              {isArabic ? "تعديل الحساب والنطاق" : "Edit Scope & Details"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.open(`mailto:${mgr.email}`)}>
                              <Mail className="h-4 w-4 me-2" />
                              {isArabic ? "إرسال بريد إلكتروني" : "Send Email"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleOpenDelete(mgr)}
                            >
                              <Trash2 className="h-4 w-4 me-2" />
                              {isArabic ? "حذف الحساب" : "Delete Account"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Assigned Scope & Status Badges */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {mgr.assignedFaculty ? (
                          <Badge variant="outline" className="gap-1 border-blue-500/30 text-blue-700 bg-blue-500/10 text-xs font-semibold">
                            <Building2 className="h-3 w-3" />
                            <span>{getFacultyName(mgr.assignedFaculty)}</span>
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1 border-slate-300 text-slate-700 bg-slate-500/10 text-xs font-semibold">
                            <Globe className="h-3 w-3" />
                            <span>{isArabic ? "كامل محتوى الجامعة" : "Global University"}</span>
                          </Badge>
                        )}

                        {mgr.isActive ? (
                          <Badge className="bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 text-xs">
                            {isArabic ? "نشط" : "Active"}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground text-xs">
                            {isArabic ? "معطل" : "Inactive"}
                          </Badge>
                        )}
                      </div>

                      {/* Contact & Bio Info */}
                      <div className="space-y-1.5 text-xs text-muted-foreground border-t pt-3">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span className="font-mono truncate">{mgr.email}</span>
                        </div>
                        {mgr.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span className="font-mono dir-ltr">{mgr.phone}</span>
                          </div>
                        )}
                        {mgr.bio && (
                          <p className="text-[11px] line-clamp-2 text-muted-foreground/80 mt-1 italic">
                            "{mgr.bio}"
                          </p>
                        )}
                      </div>

                      {/* Card Footer Actions */}
                      <div className="flex items-center justify-end gap-2 pt-2 border-t mt-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs font-semibold gap-1.5"
                          onClick={() => handleOpenEdit(mgr)}
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

      {/* Add Content Manager Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              {isArabic ? "إضافة مسؤول محتوى جديد" : "Add Content Manager"}
            </DialogTitle>
            <DialogDescription>
              {isArabic
                ? "إنشاء حساب لمسؤول تحرير لإدارة ونشر الأخبار والفعاليات ومحتوى الكليات."
                : "Create an editorial account for managing news, events, and faculty pages."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <DialogBody>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{isArabic ? "الاسم بالعربية *" : "Name (Arabic) *"}</Label>
                  <Input
                    required
                    placeholder={isArabic ? "خالد العلي" : "Khaled Al-Ali"}
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{isArabic ? "الاسم بالإنجليزية" : "Name (English)"}</Label>
                  <Input
                    placeholder="Khaled Al-Ali"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{isArabic ? "البريد الإلكتروني *" : "Email Address *"}</Label>
                  <Input
                    required
                    type="email"
                    placeholder="content@asu.edu.sy"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{isArabic ? "كلمة المرور *" : "Password *"}</Label>
                  <Input
                    required
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{isArabic ? "الكلية المسندة (النطاق الأكاديمي)" : "Assigned Faculty Scope"}</Label>
                <Select
                  value={formData.assignedFaculty?.toString() || "none"}
                  onValueChange={(val) =>
                    setFormData({
                      ...formData,
                      assignedFaculty: val === "none" ? null : Number(val),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isArabic ? "اختر الكلية" : "Select Faculty"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      {isArabic ? "-- كامل محتوى الجامعة (عام) --" : "-- Entire University (Global) --"}
                    </SelectItem>
                    {faculties.map((fac) => (
                      <SelectItem key={fac.id} value={fac.id.toString()}>
                        {isArabic ? fac.nameAr : fac.nameEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Label>{isArabic ? "النبذة / الملاحظات" : "Bio / Notes"}</Label>
                <Textarea
                  rows={2}
                  placeholder={
                    isArabic
                      ? "مسؤول تحرير قسم الأخبار والفعاليات لكلية الهندسة والمعلوماتية..."
                      : "Editor for news and events..."
                  }
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
                      ? "السماح لمسؤول المحتوى بتسجيل الدخول وإدارة المقالات والأخبار"
                      : "Allow manager to log in and manage content"}
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
              <Button type="submit" disabled={createUserMutation.isPending}>
                {createUserMutation.isPending && (
                  <Loader2 className="h-4 w-4 me-2 animate-spin" />
                )}
                {isArabic ? "حفظ الحساب" : "Create Account"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Content Manager Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-primary" />
              {isArabic ? "تعديل حساب مسؤول المحتوى" : "Edit Content Manager"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <DialogBody>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{isArabic ? "الاسم بالعربية *" : "Name (Arabic) *"}</Label>
                  <Input
                    required
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{isArabic ? "الاسم بالإنجليزية" : "Name (English)"}</Label>
                  <Input
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{isArabic ? "البريد الإلكتروني *" : "Email Address *"}</Label>
                  <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    {isArabic ? "كلمة المرور (اتركها فارغة للإبقاء عليها)" : "New Password"}
                  </Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{isArabic ? "الكلية المسندة (النطاق الأكاديمي)" : "Assigned Faculty Scope"}</Label>
                <Select
                  value={formData.assignedFaculty?.toString() || "none"}
                  onValueChange={(val) =>
                    setFormData({
                      ...formData,
                      assignedFaculty: val === "none" ? null : Number(val),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isArabic ? "اختر الكلية" : "Select Faculty"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      {isArabic ? "-- كامل محتوى الجامعة (عام) --" : "-- Entire University (Global) --"}
                    </SelectItem>
                    {faculties.map((fac) => (
                      <SelectItem key={fac.id} value={fac.id.toString()}>
                        {isArabic ? fac.nameAr : fac.nameEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{isArabic ? "رقم الهاتف" : "Phone Number"}</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>{isArabic ? "النبذة / الملاحظات" : "Bio / Notes"}</Label>
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
                      ? "السماح لمسؤول المحتوى بتسجيل الدخول وإدارة المقالات والأخبار"
                      : "Allow manager to log in and manage content"}
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
              <Button type="submit" disabled={updateUserMutation.isPending}>
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
              {isArabic ? "تأكيد حذف حساب مسؤول المحتوى" : "Confirm Deletion"}
            </DialogTitle>
            <DialogDescription>
              {isArabic
                ? `هل أنت متأكد من رغبتك في حذف حساب "${selectedManager?.nameAr}" (${selectedManager?.email})؟`
                : `Are you sure you want to delete content manager "${selectedManager?.nameAr}" (${selectedManager?.email})?`}
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
              {isArabic ? "تأكيد الحذف" : "Delete Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

