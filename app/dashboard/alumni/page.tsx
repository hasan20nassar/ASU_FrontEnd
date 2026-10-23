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
  Briefcase,
  GraduationCap,
  Loader2,
  MoreVertical,
  Mail,
  Building2,
  Phone,
  CheckCircle2,
  AlertCircle,
  List,
  LayoutGrid,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AlumniManagementPage() {
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
  const [selectedAlumni, setSelectedAlumni] = useState<UserProfileItem | null>(null);

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

  // Filter only alumni users
  const alumniUsers = useMemo(() => {
    return usersList.filter((u) => u.role === "alumni");
  }, [usersList]);

  // Filtered List
  const filteredAlumni = useMemo(() => {
    return alumniUsers.filter((u) => {
      const matchesSearch =
        searchQuery === "" ||
        u.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.nameEn && u.nameEn.toLowerCase().includes(searchQuery.toLowerCase())) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.phone && u.phone.includes(searchQuery)) ||
        (u.bio && u.bio.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesFaculty =
        selectedFacultyFilter === "all" ||
        u.assignedFaculty?.toString() === selectedFacultyFilter;

      return matchesSearch && matchesFaculty;
    });
  }, [alumniUsers, searchQuery, selectedFacultyFilter]);

  // Stats
  const stats = useMemo(() => {
    let activeCount = 0;
    const facultySet = new Set<number>();

    alumniUsers.forEach((u) => {
      if (u.isActive) activeCount++;
      if (u.assignedFaculty) facultySet.add(u.assignedFaculty);
    });

    return {
      total: alumniUsers.length,
      activeCount,
      facultiesCount: facultySet.size,
    };
  }, [alumniUsers]);

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

  const handleOpenEdit = (alumni: UserProfileItem) => {
    setSelectedAlumni(alumni);
    setFormData({
      nameAr: alumni.nameAr,
      nameEn: alumni.nameEn || "",
      email: alumni.email,
      password: "",
      phone: alumni.phone || "",
      bio: alumni.bio || "",
      assignedFaculty: alumni.assignedFaculty || null,
      isActive: alumni.isActive,
    });
    setIsEditOpen(true);
  };

  const handleOpenDelete = (alumni: UserProfileItem) => {
    setSelectedAlumni(alumni);
    setIsDeleteOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nameAr?.trim()) {
      toast.error(isArabic ? "يرجى إدخال اسم الخريج بالعربية" : "Please enter the alumni Arabic name");
      return;
    }
    if (!formData.nameEn?.trim()) {
      toast.error(isArabic ? "يرجى إدخال اسم الخريج بالإنجليزية" : "Please enter the alumni English name");
      return;
    }
    if (!formData.email?.trim()) {
      toast.error(isArabic ? "يرجى إدخال البريد الإلكتروني" : "Please enter the email address");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      toast.error(isArabic ? "صيغة البريد الإلكتروني غير صحيحة" : "Invalid email address format");
      return;
    }
    if (!formData.password?.trim()) {
      toast.error(isArabic ? "يرجى إدخال كلمة المرور" : "Please enter the password");
      return;
    }
    if (formData.password.trim().length < 6) {
      toast.error(isArabic ? "كلمة المرور يجب أن لا تقل عن 6 أحرف" : "Password must be at least 6 characters");
      return;
    }

    try {
      await createUserMutation.mutateAsync({
        nameAr: formData.nameAr.trim(),
        nameEn: formData.nameEn.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        phone: formData.phone.trim(),
        bio: formData.bio.trim(),
        role: "alumni",
        assignedFaculty: formData.assignedFaculty,
        avatar: "/user.png",
        isActive: formData.isActive,
      });

      toast.success(
        isArabic
          ? "تمت إضافة حساب الخريج بنجاح!"
          : "Alumni account created successfully!"
      );
      setIsAddOpen(false);
      resetForm();
    } catch (err: any) {
      const msg = err?.message || err?.detail || (isArabic ? "حدث خطأ أثناء إضافة الخريج" : "Failed to create alumni account");
      toast.error(msg);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlumni) return;

    if (!formData.nameAr?.trim()) {
      toast.error(isArabic ? "يرجى إدخال اسم الخريج بالعربية" : "Please enter the alumni Arabic name");
      return;
    }
    if (!formData.nameEn?.trim()) {
      toast.error(isArabic ? "يرجى إدخال اسم الخريج بالإنجليزية" : "Please enter the alumni English name");
      return;
    }
    if (!formData.email?.trim()) {
      toast.error(isArabic ? "يرجى إدخال البريد الإلكتروني" : "Please enter the email address");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      toast.error(isArabic ? "صيغة البريد الإلكتروني غير صحيحة" : "Invalid email address format");
      return;
    }
    if (formData.password?.trim() && formData.password.trim().length < 6) {
      toast.error(isArabic ? "كلمة المرور يجب أن لا تقل عن 6 أحرف" : "Password must be at least 6 characters");
      return;
    }

    try {
      await updateUserMutation.mutateAsync({
        id: selectedAlumni.id,
        data: {
          nameAr: formData.nameAr.trim(),
          nameEn: formData.nameEn.trim(),
          email: formData.email.trim(),
          password: formData.password.trim() || undefined,
          phone: formData.phone.trim(),
          bio: formData.bio.trim() || undefined,
          role: "alumni",
          assignedFaculty: formData.assignedFaculty,
          isActive: formData.isActive,
        },
      });

      toast.success(
        isArabic
          ? "تم تحديث بيانات الخريج بنجاح!"
          : "Alumni account updated successfully!"
      );
      setIsEditOpen(false);
      setSelectedAlumni(null);
    } catch (err: any) {
      const msg = err?.message || err?.detail || (isArabic ? "حدث خطأ أثناء تحديث الحساب" : "Failed to update alumni account");
      toast.error(msg);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedAlumni) return;

    try {
      await deleteUserMutation.mutateAsync(selectedAlumni.id);
      toast.success(
        isArabic
          ? "تم حذف حساب الخريج بنجاح!"
          : "Alumni account deleted successfully!"
      );
      setIsDeleteOpen(false);
      setSelectedAlumni(null);
    } catch (err: any) {
      const msg = err?.message || err?.detail || (isArabic ? "حدث خطأ أثناء حذف الحساب" : "Failed to delete account");
      toast.error(msg);
    }
  };

  const getFacultyName = (facId?: number | null) => {
    if (!facId) return isArabic ? "غير محدد" : "Unspecified";
    const fac = faculties.find((f) => f.id === facId);
    return fac ? (isArabic ? fac.nameAr : fac.nameEn) : `#${facId}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-start" dir={dir}>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isArabic ? "شؤون الطلاب الخريجين" : "Alumni Affairs"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isArabic
              ? "متابعة وإدارة حسابات وسجلات خريجي الجامعة، مساراتهم الوظيفية، ومشاركتهم في شبكة الخريجين."
              : "Manage university alumni accounts, graduation records, and professional careers."}
          </p>
        </div>
        <Button className="font-bold flex gap-2 shadow-md" onClick={handleOpenAdd}>
          <UserPlus className="h-4 w-4" />
          {isArabic ? "إضافة خريج جديد" : "Add New Alumni"}
        </Button>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm bg-muted/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-semibold">
                {isArabic ? "إجمالي الخريجين المسجلين" : "Total Registered Alumni"}
              </p>
              <p className="text-2xl font-bold mt-1 text-amber-600">{stats.total}</p>
            </div>
            <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-xl">
              <Briefcase className="h-6 w-6" />
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
                {isArabic ? "الكليات الممثلة" : "Faculties Represented"}
              </p>
              <p className="text-2xl font-bold mt-1 text-primary">{stats.facultiesCount}</p>
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
                    ? "بحث باسم الخريج، البريد، الهاتف، أو جهة العمل..."
                    : "Search by name, email, phone, or employer..."
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
                      placeholder={isArabic ? "تصفية بالكلية" : "Filter by faculty"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {isArabic ? "كافة الكليات" : "All Faculties"}
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

      {/* Alumni Table / Cards Content */}
      <Card className="border-none shadow-sm overflow-hidden">
        {viewMode === "list" ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead>{isArabic ? "الخريج" : "Alumni"}</TableHead>
                  <TableHead>{isArabic ? "الكلية" : "Faculty"}</TableHead>
                  <TableHead>{isArabic ? "الهاتف" : "Phone"}</TableHead>
                  <TableHead>{isArabic ? "جهة العمل / النبذة المهنية" : "Career / Bio"}</TableHead>
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
                        {isArabic ? "جاري تحميل بيانات الخريجين..." : "Loading alumni..."}
                      </span>
                    </TableCell>
                  </TableRow>
                ) : filteredAlumni.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-40 text-center text-muted-foreground">
                      <Briefcase className="h-10 w-10 mx-auto mb-2 opacity-30" />
                      <p className="font-semibold">
                        {isArabic
                          ? "لم يتم العثور على أي خريجين مطابقين للبحث"
                          : "No alumni records found"}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAlumni.map((alumni) => (
                    <TableRow key={alumni.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border">
                            <AvatarImage src={alumni.avatar} />
                            <AvatarFallback className="bg-amber-500/10 text-amber-600 font-bold text-xs">
                              {alumni.nameAr.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-sm text-foreground">{alumni.nameAr}</p>
                            <p className="text-xs text-muted-foreground font-mono">{alumni.email}</p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Building2 className="h-3.5 w-3.5 shrink-0" />
                          <span>{getFacultyName(alumni.assignedFaculty) || "N/A"}</span>
                        </div>
                      </TableCell>

                      <TableCell className="text-sm font-mono text-muted-foreground">
                        {alumni.phone || "N/A"}
                      </TableCell>

                      <TableCell className="text-sm max-w-[240px] truncate text-muted-foreground">
                        {alumni.bio ? (
                          <span>{alumni.bio}</span>
                        ) : (
                          <span className="text-muted-foreground/60 font-mono text-xs">
                            N/A
                          </span>
                        )}
                      </TableCell>

                      <TableCell>
                        {alumni.isActive ? (
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
                            <DropdownMenuItem onClick={() => handleOpenEdit(alumni)}>
                              <Edit className="h-4 w-4 me-2" />
                              {isArabic ? "تعديل البيانات" : "Edit Profile"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => window.open(`mailto:${alumni.email}`)}
                            >
                              <Mail className="h-4 w-4 me-2" />
                              {isArabic ? "إرسال بريد إلكتروني" : "Send Email"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleOpenDelete(alumni)}
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
                  {isArabic ? "جاري تحميل بيانات الخريجين..." : "Loading alumni..."}
                </span>
              </div>
            ) : filteredAlumni.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Briefcase className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p className="font-semibold">
                  {isArabic
                    ? "لم يتم العثور على أي خريجين مطابقين للبحث"
                    : "No alumni records found"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredAlumni.map((alumni) => {
                  const assignedFac = faculties.find((f) => f.id === alumni.assignedFaculty);

                  return (
                    <Card key={alumni.id} className="border border-border/80 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group min-w-0 w-full">
                      <CardContent className="p-5 flex flex-col justify-between h-full space-y-4 min-w-0">
                        {/* Top Header with Avatar & Options */}
                        <div className="flex items-start justify-between gap-3 min-w-0">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <Avatar className="h-12 w-12 border-2 border-amber-500/20 shadow-sm shrink-0">
                              <AvatarImage src={alumni.avatar} />
                              <AvatarFallback className="bg-amber-500/10 text-amber-600 font-bold text-sm">
                                {alumni.nameAr.slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors truncate">
                                {alumni.nameAr}
                              </h3>
                              {alumni.nameEn && (
                                <p className="text-xs text-muted-foreground truncate">{alumni.nameEn}</p>
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
                              <DropdownMenuItem onClick={() => handleOpenEdit(alumni)}>
                                <Edit className="h-4 w-4 me-2" />
                                {isArabic ? "تعديل البيانات" : "Edit Profile"}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => window.open(`mailto:${alumni.email}`)}>
                                <Mail className="h-4 w-4 me-2" />
                                {isArabic ? "إرسال بريد إلكتروني" : "Send Email"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleOpenDelete(alumni)}
                              >
                                <Trash2 className="h-4 w-4 me-2" />
                                {isArabic ? "حذف الحساب" : "Delete Account"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Faculty & Status Badges */}
                        <div className="flex flex-wrap items-center gap-2 pt-1 min-w-0">
                          {assignedFac ? (
                            <Badge variant="outline" className="gap-1 border-primary/20 text-primary bg-primary/5 text-xs font-semibold max-w-full truncate">
                              <Building2 className="h-3 w-3 shrink-0" />
                              <span className="truncate">{isArabic ? assignedFac.nameAr : assignedFac.nameEn}</span>
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground text-xs shrink-0">
                              {isArabic ? "خريج عام" : "General Alumni"}
                            </Badge>
                          )}

                          {alumni.isActive ? (
                            <Badge className="bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 text-xs shrink-0">
                              {isArabic ? "نشط" : "Active"}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground text-xs shrink-0">
                              {isArabic ? "معطل" : "Inactive"}
                            </Badge>
                          )}
                        </div>

                        {/* Contact & Career/Bio Info */}
                        <div className="space-y-1.5 text-xs text-muted-foreground border-t pt-3 min-w-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                            <span className="font-mono truncate">{alumni.email}</span>
                          </div>
                          {alumni.phone && (
                            <div className="flex items-center gap-2 min-w-0">
                              <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                              <span className="font-mono dir-ltr truncate">{alumni.phone}</span>
                            </div>
                          )}
                          {alumni.bio ? (
                            <div className="flex items-start gap-1.5 pt-1 text-[11px] text-muted-foreground min-w-0">
                              <Briefcase className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                              <p className="line-clamp-2 italic">
                                "{alumni.bio}"
                              </p>
                            </div>
                          ) : (
                            <span className="text-muted-foreground/50 text-[11px] italic block pt-0.5 truncate">
                              {isArabic ? "لم تضاف نبذة مهنية" : "No professional bio added"}
                            </span>
                          )}
                        </div>

                        {/* Card Footer Actions */}
                        <div className="flex items-center justify-end gap-2 pt-2 border-t mt-auto min-w-0">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs font-semibold gap-1.5 shrink-0"
                            onClick={() => handleOpenEdit(alumni)}
                          >
                            <Edit className="h-3.5 w-3.5" />
                            {isArabic ? "تعديل" : "Edit"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Add Alumni Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              {isArabic ? "إضافة خريج جديد" : "Add Alumni"}
            </DialogTitle>
            <DialogDescription>
              {isArabic
                ? "إنشاء حساب وسجل لخريج جامعي لمتابعة مساره والتواصل معه."
                : "Create an alumni account and record for networking and career tracking."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <DialogBody>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="add-nameAr">{isArabic ? "الاسم بالعربية" : "Arabic Name"}</Label>
                  <Input
                    id="add-nameAr"
                    required
                    placeholder={isArabic ? "أحمد المحمود" : "Ahmed Al-Mahmoud"}
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="add-nameEn">{isArabic ? "الاسم بالإنجليزية" : "English Name"}</Label>
                  <Input
                    id="add-nameEn"
                    required
                    placeholder={isArabic ? "أحمد المحمود" : "Ahmed Al-Mahmoud"}
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="add-email">{isArabic ? "البريد الإلكتروني" : "Email Address"}</Label>
                  <Input
                    id="add-email"
                    required
                    type="email"
                    placeholder="alumni@asu.edu.sy"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="add-password">{isArabic ? "كلمة المرور" : "Password"}</Label>
                  <Input
                    id="add-password"
                    required
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{isArabic ? "الكلية" : "Faculty"}</Label>
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
                        {isArabic ? "بدون تحديد كلية" : "Unspecified Faculty"}
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
                  <Label htmlFor="add-phone">{isArabic ? "رقم الهاتف" : "Phone Number"}</Label>
                  <Input
                    id="add-phone"
                    placeholder="0912345678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-bio">{isArabic ? "النبذة المهنية وجهة العمل" : "Career Bio and Employer"}</Label>
                <Textarea
                  id="add-bio"
                  rows={2}
                  placeholder={
                    isArabic
                      ? "مثال: مهندس برمجيات، خريج عام 2023..."
                      : "e.g. Software Engineer, Graduated 2023..."
                  }
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <Label htmlFor="add-isActive" className="font-semibold block cursor-pointer">
                    {isArabic ? "تفعيل الحساب" : "Account Active"}
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    {isArabic
                      ? "السماح للخريج بالدخول لبوابة الخريجين والاستفادة من الخدمات"
                      : "Allow alumni to log into the alumni portal"}
                  </span>
                </div>
                <Switch
                  id="add-isActive"
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
                {isArabic ? "إضافة الخريج" : "Add Alumni"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Alumni Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-primary" />
              {isArabic ? "تعديل حساب الخريج" : "Edit Alumni Account"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <DialogBody>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-nameAr">{isArabic ? "الاسم بالعربية" : "Arabic Name"}</Label>
                  <Input
                    id="edit-nameAr"
                    required
                    placeholder={isArabic ? "أحمد المحمود" : "Ahmed Al-Mahmoud"}
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-nameEn">{isArabic ? "الاسم بالإنجليزية" : "English Name"}</Label>
                  <Input
                    id="edit-nameEn"
                    placeholder={isArabic ? "أحمد المحمود" : "Ahmed Al-Mahmoud"}
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-email">{isArabic ? "البريد الإلكتروني" : "Email Address"}</Label>
                  <Input
                    id="edit-email"
                    required
                    type="email"
                    placeholder="alumni@asu.edu.sy"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-password">
                    {isArabic ? "كلمة المرور الجديدة" : "New Password"}
                  </Label>
                  <Input
                    id="edit-password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {isArabic ? "اترك الحقل فارغاً للإبقاء على كلمة المرور الحالية" : "Leave blank to keep the current password"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{isArabic ? "الكلية" : "Faculty"}</Label>
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
                        {isArabic ? "بدون تحديد كلية" : "Unspecified Faculty"}
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
                  <Label htmlFor="edit-phone">{isArabic ? "رقم الهاتف" : "Phone Number"}</Label>
                  <Input
                    id="edit-phone"
                    placeholder="0912345678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-bio">{isArabic ? "النبذة المهنية وجهة العمل" : "Career Bio and Employer"}</Label>
                <Textarea
                  id="edit-bio"
                  rows={2}
                  placeholder={
                    isArabic
                      ? "مثال: مهندس برمجيات، خريج عام 2023..."
                      : "e.g. Software Engineer, Graduated 2023..."
                  }
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <Label htmlFor="edit-isActive" className="font-semibold block cursor-pointer">
                    {isArabic ? "تفعيل الحساب" : "Account Active"}
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    {isArabic
                      ? "السماح للخريج بالدخول لبوابة الخريجين والاستفادة من الخدمات"
                      : "Allow alumni to log into the alumni portal"}
                  </span>
                </div>
                <Switch
                  id="edit-isActive"
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
                {isArabic ? "حفظ التغييرات" : "Save Changes"}
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
              {isArabic ? "تأكيد حذف حساب الخريج" : "Confirm Account Deletion"}
            </DialogTitle>
            <DialogDescription>
              {isArabic
                ? `هل أنت متأكد من رغبتك في حذف حساب الخريج "${selectedAlumni?.nameAr || ""}" (${selectedAlumni?.email || ""}) نهائياً؟`
                : `Are you sure you want to permanently delete alumni account "${selectedAlumni?.nameEn || selectedAlumni?.nameAr || ""}" (${selectedAlumni?.email || ""})?`}
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

