"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import {
  useFacultyMembers,
  useCreateFacultyMember,
  useUpdateFacultyMember,
  useDeleteFacultyMember
} from "@/hooks/use-faculty-members";
import { useFaculties } from "@/hooks/use-faculties";
import { usePrograms } from "@/hooks/use-programs";
import { FacultyMember } from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  MoreVertical,
  UserPlus,
  Trash2,
  Mail,
  Edit,
  Filter,
  Loader2,
  Upload,
  Plus,
  X,
  GraduationCap,
  FileText,
  UserCheck,
  BookOpen,
  CalendarDays,
  Clock,
  MapPin,
  List,
  LayoutGrid
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";



interface EducationItem {
  degreeAr: string;
  degreeEn?: string;
  schoolAr: string;
  schoolEn?: string;
  year: string;
}

interface PublicationItem {
  titleAr: string;
  titleEn?: string;
  journalAr: string;
  journalEn?: string;
  year: string;
}

interface OfficeSlotItem {
  id?: string;
  dayAr: string;
  dayEn?: string;
  time: string;
  status: string;
}

export default function FacultyMembersManagement() {
  const { language, dir } = useLanguage();
  const isArabic = language === "ar";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeptFilter, setSelectedDeptFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "cards">("list");

  // React Query Hooks
  const { data: backendMembers, isLoading } = useFacultyMembers();
  const { data: backendFaculties } = useFaculties();
  const { data: backendPrograms } = usePrograms();

  const createMemberMutation = useCreateFacultyMember();
  const updateMemberMutation = useUpdateFacultyMember();
  const deleteMemberMutation = useDeleteFacultyMember();

  const displayMembers = backendMembers || [];
  const displayFaculties = backendFaculties || [];
  const displayPrograms = backendPrograms || [];

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<FacultyMember | null>(null);
  const [activeTab, setActiveTab] = useState("basic");

  // Form state
  const [formData, setFormData] = useState({
    nameAr: "",
    nameEn: "",
    titleAr: "أستاذ مساعد",
    titleEn: "Associate Professor",
    facultyId: "",
    departmentId: "",
    departmentAr: "",
    departmentEn: "",
    email: "",
    officeHours: "Sun, Tue 10:00 AM - 12:00 PM",
    locationAr: "حرم معرة صيدنايا - مبنى الإدارة",
    locationEn: "Maarat Saidnaya Campus - Admin Building",
    image: "/user.png",
    isHead: false,
    bioAr: "",
    bioEn: "",
    researchAr: "",
    researchEn: "",
    appointmentLocation: "",
  });

  const [educationList, setEducationList] = useState<EducationItem[]>([]);
  const [publicationsList, setPublicationsList] = useState<PublicationItem[]>([]);
  const [officeSlotsList, setOfficeSlotsList] = useState<OfficeSlotItem[]>([]);

  // Unique departments for filter dropdown
  const departmentsList = useMemo(() => {
    const set = new Set<string>();
    displayMembers.forEach((m) => {
      const name = m.departmentNameAr || m.departmentAr;
      if (name) set.add(name);
    });
    return Array.from(set);
  }, [displayMembers]);

  // Available programs for current selected faculty in form
  const availablePrograms = useMemo(() => {
    if (!formData.facultyId) return displayPrograms;
    return displayPrograms.filter((p) => p.faculty === Number(formData.facultyId));
  }, [displayPrograms, formData.facultyId]);

  const handleFacultyChangeInForm = (facId: string) => {
    if (!facId || facId === "none") {
      setFormData((prev) => ({
        ...prev,
        facultyId: "",
        departmentId: "",
        departmentAr: "",
        departmentEn: "",
      }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      facultyId: facId,
      departmentId: "",
      departmentAr: "",
      departmentEn: "",
    }));
  };

  const handleDepartmentChangeInForm = (deptId: string) => {
    if (!deptId || deptId === "none") {
      setFormData((prev) => ({
        ...prev,
        departmentId: "",
        departmentAr: "",
        departmentEn: "",
      }));
      return;
    }
    const prog = displayPrograms.find((p) => p.id === Number(deptId));
    setFormData((prev) => ({
      ...prev,
      departmentId: deptId,
      departmentAr: prog ? prog.nameAr : "",
      departmentEn: prog ? prog.nameEn : "",
      facultyId: prog ? prog.faculty.toString() : prev.facultyId,
    }));
  };

  // Filtered members list
  const filteredStaff = useMemo(() => {
    return displayMembers.filter((m) => {
      const matchesSearch =
        searchQuery === "" ||
        m.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.departmentAr && m.departmentAr.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.departmentNameAr && m.departmentNameAr.toLowerCase().includes(searchQuery.toLowerCase()));

      const currentDeptName = m.departmentNameAr || m.departmentAr;
      const matchesDept =
        selectedDeptFilter === "all" || currentDeptName === selectedDeptFilter;

      return matchesSearch && matchesDept;
    });
  }, [displayMembers, searchQuery, selectedDeptFilter]);

  const resetForm = () => {
    setActiveTab("basic");
    const defaultFac = displayFaculties.find((f) =>
      displayPrograms.some((p) => p.faculty === f.id)
    ) || displayFaculties[0];
    const progs = defaultFac ? displayPrograms.filter((p) => p.faculty === defaultFac.id) : [];
    const firstProg = progs[0];

    setFormData({
      nameAr: "",
      nameEn: "",
      titleAr: "أستاذ مساعد",
      titleEn: "Associate Professor",
      facultyId: defaultFac ? defaultFac.id.toString() : "1",
      departmentId: firstProg ? firstProg.id.toString() : "",
      departmentAr: firstProg ? firstProg.nameAr : "",
      departmentEn: firstProg ? firstProg.nameEn : "",
      email: "",
      officeHours: "Sun, Tue 10:00 AM - 12:00 PM",
      locationAr: "حرم معرة صيدنايا - مبنى الإدارة",
      locationEn: "Maarat Saidnaya Campus - Admin Building",
      image: "/user.png",
      isHead: false,
      bioAr: "",
      bioEn: "",
      researchAr: "",
      researchEn: "",
      appointmentLocation: "",
    });
    setEducationList([]);
    setPublicationsList([]);
    setOfficeSlotsList([
      { id: "slot-1", dayAr: "الأحد", dayEn: "Sunday", time: "10:00 AM - 11:00 AM", status: "available" },
      { id: "slot-2", dayAr: "الأحد", dayEn: "Sunday", time: "11:00 AM - 12:00 PM", status: "available" },
      { id: "slot-3", dayAr: "الثلاثاء", dayEn: "Tuesday", time: "10:00 AM - 11:00 AM", status: "available" },
      { id: "slot-4", dayAr: "الثلاثاء", dayEn: "Tuesday", time: "11:00 AM - 12:00 PM", status: "available" },
    ]);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddOpen(true);
  };

  const handleOpenEdit = (member: FacultyMember) => {
    setSelectedMember(member);
    setActiveTab("basic");

    // Reverse lookup: resolve faculty from member.department if available
    const prog = displayPrograms.find((p) => p.id === member.department);
    const resolvedFacId = prog?.faculty || member.faculty || displayFaculties[0]?.id || 1;

    setFormData({
      nameAr: member.nameAr || "",
      nameEn: member.nameEn || "",
      titleAr: member.titleAr || "أستاذ مساعد",
      titleEn: member.titleEn || "Associate Professor",
      facultyId: resolvedFacId.toString(),
      departmentId: member.department ? member.department.toString() : "",
      departmentAr: member.departmentAr || prog?.nameAr || "",
      departmentEn: member.departmentEn || prog?.nameEn || "",
      email: member.email || "",
      officeHours: member.officeHours || "Sun, Tue 10:00 AM - 12:00 PM",
      locationAr: member.locationAr || "حرم معرة صيدنايا - مبنى الإدارة",
      locationEn: member.locationEn || "Maarat Saidnaya Campus - Admin Building",
      image: member.image || "/user.png",
      isHead: !!member.isHead,
      bioAr: member.bioAr || "",
      bioEn: member.bioEn || "",
      researchAr: member.researchAr || "",
      researchEn: member.researchEn || "",
      appointmentLocation: member.appointmentLocation || "",
    });

    setEducationList(
      Array.isArray(member.educationAr) && member.educationAr.length > 0
        ? (member.educationAr as EducationItem[])
        : []
    );

    setPublicationsList(
      Array.isArray(member.publications) && member.publications.length > 0
        ? (member.publications as PublicationItem[])
        : []
    );

    setOfficeSlotsList(
      Array.isArray(member.officeHourSlots) && member.officeHourSlots.length > 0
        ? (member.officeHourSlots as OfficeSlotItem[])
        : [
          { id: "slot-1", dayAr: "الأحد", dayEn: "Sunday", time: "10:00 AM - 11:00 AM", status: "available" },
          { id: "slot-2", dayAr: "الأحد", dayEn: "Sunday", time: "11:00 AM - 12:00 PM", status: "available" },
          { id: "slot-3", dayAr: "الثلاثاء", dayEn: "Tuesday", time: "10:00 AM - 11:00 AM", status: "available" },
          { id: "slot-4", dayAr: "الثلاثاء", dayEn: "Tuesday", time: "11:00 AM - 12:00 PM", status: "available" },
        ]
    );

    setIsEditOpen(true);
  };

  const handleOpenDelete = (member: FacultyMember) => {
    setSelectedMember(member);
    setIsDeleteOpen(true);
  };

  // Image File Upload Handler (Max 1MB)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      toast.error(
        isArabic
          ? "حجم الصورة كبير جداً! الحد الأقصى المسموح به هو 1 ميغابايت."
          : "Image file is too large! Maximum allowed size is 1MB."
      );
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
        toast.success(isArabic ? "تم تحميل الصورة بنجاح!" : "Image loaded successfully!");
      }
    };
    reader.readAsDataURL(file);
  };

  // Dynamic Education Handlers
  const handleAddEducation = () => {
    setEducationList((prev) => [
      ...prev,
      { degreeAr: "", schoolAr: "جامعة أنطاكية السورية", year: new Date().getFullYear().toString() },
    ]);
  };

  const handleUpdateEducation = (index: number, field: keyof EducationItem, value: string) => {
    setEducationList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleRemoveEducation = (index: number) => {
    setEducationList((prev) => prev.filter((_, i) => i !== index));
  };

  // Dynamic Publication Handlers
  const handleAddPublication = () => {
    setPublicationsList((prev) => [
      ...prev,
      { titleAr: "", journalAr: "مجلة جامعة أنطاكية للبحوث", year: new Date().getFullYear().toString() },
    ]);
  };

  const handleUpdatePublication = (index: number, field: keyof PublicationItem, value: string) => {
    setPublicationsList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleRemovePublication = (index: number) => {
    setPublicationsList((prev) => prev.filter((_, i) => i !== index));
  };

  // Dynamic Office Hour Slots Handlers
  const handleAddOfficeSlot = () => {
    setOfficeSlotsList((prev) => [
      ...prev,
      { id: `slot-${Date.now()}`, dayAr: "الأحد", dayEn: "Sunday", time: "10:00 AM - 11:00 AM", status: "available" },
    ]);
  };

  const handleUpdateOfficeSlot = (index: number, field: keyof OfficeSlotItem, value: string) => {
    setOfficeSlotsList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleRemoveOfficeSlot = (index: number) => {
    setOfficeSlotsList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameAr || !formData.email) {
      toast.error(isArabic ? "يرجى تعبئة الحقول الإلزامية (الاسم الكامل والبريد الإلكتروني)" : "Please fill required fields (Name and Email)");
      return;
    }

    try {
      await createMemberMutation.mutateAsync({
        nameAr: formData.nameAr,
        nameEn: formData.nameEn || formData.nameAr,
        titleAr: formData.titleAr,
        titleEn: formData.titleEn,
        faculty: formData.facultyId ? Number(formData.facultyId) : undefined,
        department: formData.departmentId ? Number(formData.departmentId) : undefined,
        departmentAr: formData.departmentAr,
        departmentEn: formData.departmentEn || formData.departmentAr,
        email: formData.email,
        officeHours: formData.officeHours,
        locationAr: formData.locationAr,
        locationEn: formData.locationEn,
        image: formData.image,
        isHead: formData.isHead,
        bioAr: formData.bioAr,
        bioEn: formData.bioEn || formData.bioAr,
        researchAr: formData.researchAr,
        researchEn: formData.researchEn || formData.researchAr,
        educationAr: educationList,
        educationEn: educationList,
        publications: publicationsList,
        officeHourSlots: officeSlotsList,
        appointmentLocation: formData.appointmentLocation,
      });

      toast.success(isArabic ? "تم إضافة عضو هيئة التدريس بنجاح!" : "Faculty member added successfully!");
      setIsAddOpen(false);
      resetForm();
    } catch (err) {
      toast.error(isArabic ? "حدث خطأ أثناء إضافة الأستاذ" : "Failed to add faculty member");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;

    try {
      await updateMemberMutation.mutateAsync({
        id: selectedMember.id,
        data: {
          nameAr: formData.nameAr,
          nameEn: formData.nameEn,
          titleAr: formData.titleAr,
          titleEn: formData.titleEn,
          faculty: formData.facultyId ? Number(formData.facultyId) : undefined,
          department: formData.departmentId ? Number(formData.departmentId) : undefined,
          departmentAr: formData.departmentAr,
          departmentEn: formData.departmentEn,
          email: formData.email,
          officeHours: formData.officeHours,
          locationAr: formData.locationAr,
          locationEn: formData.locationEn,
          image: formData.image,
          isHead: formData.isHead,
          bioAr: formData.bioAr,
          bioEn: formData.bioEn,
          researchAr: formData.researchAr,
          researchEn: formData.researchEn,
          educationAr: educationList,
          educationEn: educationList,
          publications: publicationsList,
          officeHourSlots: officeSlotsList,
          appointmentLocation: formData.appointmentLocation,
        },
      });

      toast.success(isArabic ? "تم تعديل بيانات الأستاذ ومواعيد الحجز بنجاح!" : "Faculty member & slots updated successfully!");
      setIsEditOpen(false);
      setSelectedMember(null);
    } catch (err) {
      toast.error(isArabic ? "حدث خطأ أثناء حفظ التعديلات" : "Failed to update faculty member");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMember) return;

    try {
      await deleteMemberMutation.mutateAsync(selectedMember.id);
      toast.success(isArabic ? "تمت إزالة عضو الكادر من قاعدة البيانات" : "Faculty member deleted successfully!");
      setIsDeleteOpen(false);
      setSelectedMember(null);
    } catch (err) {
      toast.error(isArabic ? "حدث خطأ أثناء الحذف" : "Failed to delete faculty member");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-start" dir={dir}>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isArabic ? "أعضاء هيئة التدريس" : "Faculty Members"}
          </h1>
          <p className="text-muted-foreground">
            {isArabic
              ? "إدارة الدكاترة والأساتذة الأكاديميين ومواعيد حجز الساعات المكتبية للطلاب."
              : "Manage PhDs, academic professors, and student booking office hour slots."}
          </p>
        </div>
        <Button className="font-bold flex gap-2 shadow-md" onClick={handleOpenAdd}>
          <UserPlus className="h-4 w-4" />
          {isArabic ? "إضافة عضو جديد" : "Add New Faculty"}
        </Button>
      </div>

      {/* Main Table Card */}
      <Card className="border-none shadow-md overflow-hidden">
        <CardHeader className="bg-muted/30 pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={isArabic ? "بحث عن طريق الاسم أو الإيميل..." : "Search by name or email..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-10 bg-background"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
              <Select value={selectedDeptFilter} onValueChange={setSelectedDeptFilter}>
                <SelectTrigger className="w-[180px] bg-background">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{selectedDeptFilter === "all" ? (isArabic ? "جميع الأقسام" : "All Depts") : selectedDeptFilter}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isArabic ? "جميع الأقسام" : "All Departments"}</SelectItem>
                  {departmentsList.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

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
        </CardHeader>

        <CardContent className="p-0">
          {viewMode === "list" ? (
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground font-bold">{isArabic ? "جاري تحميل البيانات من قاعدة البيانات..." : "Loading staff data from database..."}</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/20">
                      <TableHead className="text-start font-bold">{isArabic ? "الاسم" : "Name"}</TableHead>
                      <TableHead className="text-start font-bold">{isArabic ? "الرتبة العلمية" : "Academic Title"}</TableHead>
                      <TableHead className="text-start font-bold">{isArabic ? "القسم" : "Department"}</TableHead>
                      <TableHead className="text-center font-bold">{isArabic ? "الاسم" : "Name"}</TableHead>
                      <TableHead className="text-center font-bold">{isArabic ? "الرتبة العلمية" : "Academic Title"}</TableHead>
                      <TableHead className="text-center font-bold">{isArabic ? "القسم" : "Department"}</TableHead>
                      <TableHead className="text-center font-bold px-6">{isArabic ? "إجراءات" : "Actions"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-12 text-muted-foreground font-bold">
                          <div className="flex flex-col items-center gap-2">
                            <UserCheck className="h-10 w-10 text-muted-foreground/30" />
                            <p>{isArabic ? "لا يوجد أعضاء تدريس حالياً في قاعدة البيانات" : "No faculty members in database"}</p>
                            <Button variant="outline" size="sm" onClick={handleOpenAdd} className="mt-2 font-bold gap-2">
                              <Plus className="h-4 w-4" />
                              {isArabic ? "إضافة عضو جديد الآن" : "Add First Member"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStaff.map((member) => (
                        <TableRow key={member.id} className="hover:bg-muted/30 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-11 w-11 border shadow-sm">
                                <AvatarImage src={member.image || "/user.png"} alt={member.nameEn} />
                                <AvatarFallback className="bg-primary/10 text-primary font-bold">{member.nameAr ? member.nameAr[0] : "P"}</AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col text-start">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-sm">{isArabic ? member.nameAr : member.nameEn}</span>
                                  {member.isHead && (
                                    <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] px-1.5 py-0">
                                      {isArabic ? "عميد / رئيس قسم" : "Dean / Head"}
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-xs text-muted-foreground">{member.email}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm font-medium text-start">
                            {isArabic ? member.titleAr : member.titleEn}
                          </TableCell>
                          <TableCell className="text-start">
                            <div className="flex flex-col gap-1">
                              <Badge variant="secondary" className="font-semibold text-xs text-primary border-primary/20 w-fit">
                                {isArabic
                                  ? member.departmentNameAr || member.departmentDetail?.nameAr || member.departmentAr || "-"
                                  : member.departmentNameEn || member.departmentDetail?.nameEn || member.departmentEn || "-"}
                              </Badge>
                              <span className="text-[11px] text-muted-foreground">
                                {isArabic
                                  ? member.facultyNameAr || displayFaculties.find((f) => f.id === member.faculty)?.nameAr || ""
                                  : member.facultyNameEn || displayFaculties.find((f) => f.id === member.faculty)?.nameEn || ""}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center px-4">
                            <div className="flex items-center justify-center gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" asChild>
                                <a href={`mailto:${member.email}`} title={isArabic ? "مراسلة بريد" : "Send Mail"}>
                                  <Mail className="h-4 w-4" />
                                </a>
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleOpenEdit(member)}>
                                    <Edit className="h-4 w-4" /> {isArabic ? "تعديل الملف والمواعيد" : "Edit Profile & Slots"}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="gap-2 text-destructive font-bold cursor-pointer" onClick={() => handleOpenDelete(member)}>
                                    <Trash2 className="h-4 w-4" /> {isArabic ? "إزاحة من الكادر" : "Remove"}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          ) : (
            <div className="p-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground font-bold">{isArabic ? "جاري تحميل البيانات من قاعدة البيانات..." : "Loading staff data from database..."}</p>
                </div>
              ) : filteredStaff.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground font-bold flex flex-col items-center gap-2">
                  <UserCheck className="h-10 w-10 text-muted-foreground/30" />
                  <p>{isArabic ? "لا يوجد أعضاء تدريس حالياً في قاعدة البيانات" : "No faculty members in database"}</p>
                  <Button variant="outline" size="sm" onClick={handleOpenAdd} className="mt-2 font-bold gap-2">
                    <Plus className="h-4 w-4" />
                    {isArabic ? "إضافة عضو جديد الآن" : "Add First Member"}
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredStaff.map((member) => (
                    <Card key={member.id} className="border border-border/80 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
                      <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                        {/* Top Header with Avatar & Actions */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-14 w-14 border-2 border-primary/20 shadow-sm">
                              <AvatarImage src={member.image || "/user.png"} alt={member.nameEn} />
                              <AvatarFallback className="bg-primary/10 text-primary font-bold text-base">
                                {member.nameAr ? member.nameAr[0] : "P"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                                  {isArabic ? member.nameAr : member.nameEn}
                                </h3>
                                {member.isHead && (
                                  <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] px-1.5 py-0">
                                    {isArabic ? "عميد / رئيس" : "Dean"}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs font-semibold text-muted-foreground mt-0.5">
                                {isArabic ? member.titleAr : member.titleEn}
                              </p>
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 -me-2">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleOpenEdit(member)}>
                                <Edit className="h-4 w-4" /> {isArabic ? "تعديل الملف والمواعيد" : "Edit Profile & Slots"}
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <a href={`mailto:${member.email}`} className="gap-2 flex items-center cursor-pointer">
                                  <Mail className="h-4 w-4" /> {isArabic ? "إرسال بريد" : "Send Mail"}
                                </a>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="gap-2 text-destructive font-bold cursor-pointer" onClick={() => handleOpenDelete(member)}>
                                <Trash2 className="h-4 w-4" /> {isArabic ? "إزاحة من الكادر" : "Remove"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Faculty & Department */}
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Badge variant="secondary" className="font-semibold text-xs text-primary border-primary/20">
                              {isArabic
                                ? member.departmentNameAr || member.departmentDetail?.nameAr || member.departmentAr || "-"
                                : member.departmentNameEn || member.departmentDetail?.nameEn || member.departmentEn || "-"}
                            </Badge>
                            <Badge variant="outline" className="text-xs text-muted-foreground">
                              {isArabic
                                ? member.facultyNameAr || displayFaculties.find((f) => f.id === member.faculty)?.nameAr || ""
                                : member.facultyNameEn || displayFaculties.find((f) => f.id === member.faculty)?.nameEn || ""}
                            </Badge>
                          </div>
                        </div>

                        {/* Details: Email, Location, Slots */}
                        <div className="space-y-1.5 text-xs text-muted-foreground border-t pt-3">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                            <span className="font-mono truncate">{member.email}</span>
                          </div>

                          {member.appointmentLocation && (
                            <div className="flex items-center gap-2 text-primary font-medium">
                              <MapPin className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">{member.appointmentLocation}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-2 pt-0.5">
                            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span>
                              {Array.isArray(member.officeHourSlots) && member.officeHourSlots.length > 0
                                ? isArabic
                                  ? `${member.officeHourSlots.length} مواعيد حجز متاحة`
                                  : `${member.officeHourSlots.length} booking slots`
                                : isArabic
                                  ? "لا توجد مواعيد مخصصة"
                                  : "No slots configured"}
                            </span>
                          </div>
                        </div>

                        {/* Card Footer Actions */}
                        <div className="flex items-center justify-between gap-2 pt-2 border-t mt-auto">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs font-semibold text-primary"
                            asChild
                          >
                            <a href={`/about/directory/${member.id}`} target="_blank" rel="noopener noreferrer">
                              {isArabic ? "عرض الملف" : "View Profile"}
                            </a>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs font-semibold gap-1.5"
                            onClick={() => handleOpenEdit(member)}
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
        </CardContent>
      </Card>

      {/* Add Faculty Member Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-4xl w-[95vw] sm:max-w-4xl p-0 overflow-hidden rounded-xl border shadow-xl">
          <DialogHeader className="p-6 pb-2 border-b bg-muted/20">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              {isArabic ? "إضافة عضو هيئة تدريس جديد" : "Add New Faculty Member"}
            </DialogTitle>
            <DialogDescription>
              {isArabic ? "أدخل التفاصيل الأكاديمية والمؤهلات ومواعيد الساعات المكتبية المتاحة للحجز." : "Enter academic credentials, degrees, and bookable office hour slots."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 min-h-0 overflow-hidden w-full">
              <div className="px-6 border-b bg-muted/10 shrink-0">
                <TabsList className="h-12 bg-transparent gap-3 overflow-x-auto">
                  <TabsTrigger value="basic" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
                    <UserCheck className="h-4 w-4" />
                    {isArabic ? "البيانات الأساسية" : "Basic Info"}
                  </TabsTrigger>
                  <TabsTrigger value="bio" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
                    <GraduationCap className="h-4 w-4" />
                    {isArabic ? "السيرة والمؤهلات" : "Bio & Education"}
                  </TabsTrigger>
                  <TabsTrigger value="research" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
                    <BookOpen className="h-4 w-4" />
                    {isArabic ? "الأبحاث والمنشورات" : "Research"}
                  </TabsTrigger>
                  <TabsTrigger value="slots" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2 font-bold">
                    <CalendarDays className="h-4 w-4" />
                    {isArabic ? "مواعيد حجز المواعيد" : "Booking Slots"}
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
                {/* Tab 1: Basic Info */}
                <TabsContent value="basic" className="m-0 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nameAr">{isArabic ? "الاسم الكامل (بالعربية) *" : "Full Name (Arabic) *"}</Label>
                      <Input
                        id="nameAr"
                        placeholder="مثال: د. أحمد المنصور"
                        value={formData.nameAr}
                        onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nameEn">{isArabic ? "الاسم الكامل (بالإنكليزية)" : "Full Name (English)"}</Label>
                      <Input
                        id="nameEn"
                        placeholder="e.g. Dr. Ahmed Al-Mansour"
                        value={formData.nameEn}
                        onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="titleAr">{isArabic ? "الرتبة العلمية (عربي) *" : "Academic Title (AR) *"}</Label>
                      <Input
                        id="titleAr"
                        placeholder="مثال: أستاذ مساعد / أستاذ دكتور / مدرس"
                        value={formData.titleAr}
                        onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="titleEn">{isArabic ? "الرتبة العلمية (إنكليزي)" : "Academic Title (EN)"}</Label>
                      <Input
                        id="titleEn"
                        placeholder="e.g. Associate Professor"
                        value={formData.titleEn}
                        onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{isArabic ? "الكلية التابع لها" : "Assigned Faculty"}</Label>
                      <Select
                        value={formData.facultyId || "none"}
                        onValueChange={(val) => handleFacultyChangeInForm(val === "none" ? "" : val)}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder={isArabic ? "اختر الكلية (اختياري)" : "Select Faculty (Optional)"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">
                            {isArabic ? "-- بدون كلية حالياً (مدرس غير مسند) --" : "-- No Faculty (Unassigned) --"}
                          </SelectItem>
                          {displayFaculties.map((f) => (
                            <SelectItem key={f.id} value={f.id.toString()}>
                              {isArabic ? f.nameAr : f.nameEn}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">{isArabic ? "البريد الإلكتروني *" : "Email Address *"}</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@asu.edu.sy"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>{isArabic ? "القسم الأكاديمي" : "Academic Department"}</Label>
                    {!formData.facultyId ? (
                      <div className="rounded-md border border-muted bg-muted/20 p-3 text-muted-foreground text-xs">
                        {isArabic
                          ? "يمكنك تحديد الكلية أولاً لاختيار أحد أقسامها، أو حفظ المدرس بدون قسم حالياً."
                          : "Select a faculty first to choose its department, or save without department for now."}
                      </div>
                    ) : availablePrograms.length === 0 ? (
                      <div className="rounded-md border border-muted bg-muted/20 p-3 text-muted-foreground text-xs flex items-center justify-between">
                        <span>
                          {isArabic
                            ? "لا توجد أقسام مسجلة لهذه الكلية حتى الآن (سيتم تسجيل المدرس كعضو عام بالكلية)."
                            : "No departments exist for this faculty yet (will be saved as general faculty staff)."}
                        </span>
                        <Link href="/dashboard/programs">
                          <Button type="button" size="sm" variant="outline" className="h-7 text-xs bg-background">
                            {isArabic ? "إضافة قسم" : "Add Department"}
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <Select
                        value={formData.departmentId || "none"}
                        onValueChange={(val) => handleDepartmentChangeInForm(val === "none" ? "" : val)}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder={isArabic ? "اختر القسم الأكاديمي (اختياري)" : "Select Department (Optional)"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">
                            {isArabic ? "-- بدون قسم محدد (عضو عام بالكلية) --" : "-- No Specific Dept (General Staff) --"}
                          </SelectItem>
                          {availablePrograms.map((p) => (
                            <SelectItem key={p.id} value={p.id.toString()}>
                              {isArabic ? p.nameAr : p.nameEn}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="officeHours">{isArabic ? "الساعات المكتبية العامّة" : "General Office Hours"}</Label>
                      <Input
                        id="officeHours"
                        placeholder="Sun, Tue 10:00 AM - 12:00 PM"
                        value={formData.officeHours}
                        onChange={(e) => setFormData({ ...formData, officeHours: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="locationAr">{isArabic ? "الموقع / المكتب" : "Office Location"}</Label>
                      <Input
                        id="locationAr"
                        placeholder="حرم معرة صيدنايا - مبنى الإدارة"
                        value={formData.locationAr}
                        onChange={(e) => setFormData({ ...formData, locationAr: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Image Upload Box */}
                  <div className="space-y-3 pt-2">
                    <Label className="font-bold flex items-center justify-between">
                      <span>{isArabic ? "الصورة الشخصية (تحميل ملف بحد أقصى 1 ميغابايت)" : "Profile Picture (Upload file max 1MB)"}</span>
                    </Label>

                    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border rounded-xl bg-muted/10">
                      <Avatar className="h-20 w-20 border-2 border-primary shadow-sm shrink-0">
                        <AvatarImage src={formData.image} />
                        <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">P</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors shadow">
                            <Upload className="h-4 w-4" />
                            {isArabic ? "تحميل صورة جديدة من الجهاز..." : "Upload Image from Device..."}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageUpload}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <Switch
                      id="isHead"
                      checked={formData.isHead}
                      onCheckedChange={(checked) => setFormData({ ...formData, isHead: checked })}
                    />
                    <Label htmlFor="isHead" className="cursor-pointer font-bold">
                      {isArabic ? "تعيين كـ عميد كلية / رئيس قسم" : "Designate as Dean / Department Head"}
                    </Label>
                  </div>
                </TabsContent>

                {/* Tab 2: Bio & Education */}
                <TabsContent value="bio" className="m-0 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="bioAr" className="font-bold">{isArabic ? "السيرة الذاتية والشرح (بالعربية)" : "Biography (Arabic)"}</Label>
                    <Textarea
                      id="bioAr"
                      placeholder="نبذة شاملة عن خبرات الأستاذ ومجالات عمله الأكاديمي..."
                      value={formData.bioAr}
                      onChange={(e) => setFormData({ ...formData, bioAr: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        <h3 className="font-bold text-base">{isArabic ? "المؤهلات العلمية والشهادات" : "Academic Qualifications & Degrees"}</h3>
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={handleAddEducation} className="font-bold gap-1 text-xs">
                        <Plus className="h-4 w-4" />
                        {isArabic ? "إضافة مؤهل علمي" : "Add Degree"}
                      </Button>
                    </div>

                    {educationList.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic text-center py-4 bg-muted/10 rounded-lg border border-dashed">
                        {isArabic ? "لم يتم إضافة شهادات بعد. انقر على 'إضافة مؤهل علمي' لإدراج شهادة." : "No degrees added yet."}
                      </p>
                    ) : (
                      educationList.map((edu, idx) => (
                        <div key={idx} className="p-4 border rounded-xl bg-muted/20 space-y-3 relative">
                          <button
                            type="button"
                            onClick={() => handleRemoveEducation(idx)}
                            className="absolute top-3 end-3 text-destructive hover:bg-destructive/10 p-1 rounded-full"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pe-8">
                            <div className="space-y-1 md:col-span-1">
                              <Label className="text-xs">{isArabic ? "المؤهل / الشهادة" : "Degree Title"}</Label>
                              <Input
                                value={edu.degreeAr}
                                onChange={(e) => handleUpdateEducation(idx, "degreeAr", e.target.value)}
                                placeholder="دكتوراه في الذكاء الاصطناعي"
                                className="bg-background"
                              />
                            </div>
                            <div className="space-y-1 md:col-span-1">
                              <Label className="text-xs">{isArabic ? "الجامعة / المؤسسة" : "University / Institution"}</Label>
                              <Input
                                value={edu.schoolAr}
                                onChange={(e) => handleUpdateEducation(idx, "schoolAr", e.target.value)}
                                placeholder="جامعة دمشق"
                                className="bg-background"
                              />
                            </div>
                            <div className="space-y-1 md:col-span-1">
                              <Label className="text-xs">{isArabic ? "سنة التخرج" : "Graduation Year"}</Label>
                              <Input
                                value={edu.year}
                                onChange={(e) => handleUpdateEducation(idx, "year", e.target.value)}
                                placeholder="2016"
                                className="bg-background"
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>

                {/* Tab 3: Research & Publications */}
                <TabsContent value="research" className="m-0 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="researchAr" className="font-bold">{isArabic ? "الاهتمامات والتوجيهات البحثية" : "Research Interests & Focus"}</Label>
                    <Textarea
                      id="researchAr"
                      placeholder="الأبحاث والحلول الحديثة، مجالات الاهتمام العلمي..."
                      value={formData.researchAr}
                      onChange={(e) => setFormData({ ...formData, researchAr: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <h3 className="font-bold text-base">{isArabic ? "المنشورات الأكاديمية والمقالات" : "Academic Publications & Journals"}</h3>
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={handleAddPublication} className="font-bold gap-1 text-xs">
                        <Plus className="h-4 w-4" />
                        {isArabic ? "إضافة بحث / منشور" : "Add Publication"}
                      </Button>
                    </div>

                    {publicationsList.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic text-center py-4 bg-muted/10 rounded-lg border border-dashed">
                        {isArabic ? "لم يتم إضافة أبحاث بعد." : "No publications added yet."}
                      </p>
                    ) : (
                      publicationsList.map((pub, idx) => (
                        <div key={idx} className="p-4 border rounded-xl bg-muted/20 space-y-3 relative">
                          <button
                            type="button"
                            onClick={() => handleRemovePublication(idx)}
                            className="absolute top-3 end-3 text-destructive hover:bg-destructive/10 p-1 rounded-full"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pe-8">
                            <div className="space-y-1 md:col-span-1">
                              <Label className="text-xs">{isArabic ? "عنوان الورقة العلمية / البحث" : "Publication Title"}</Label>
                              <Input
                                value={pub.titleAr}
                                onChange={(e) => handleUpdatePublication(idx, "titleAr", e.target.value)}
                                placeholder="دراسة تحليلية والتطبيقية..."
                                className="bg-background"
                              />
                            </div>
                            <div className="space-y-1 md:col-span-1">
                              <Label className="text-xs">{isArabic ? "اسم المجلة / الناشر" : "Journal Name"}</Label>
                              <Input
                                value={pub.journalAr}
                                onChange={(e) => handleUpdatePublication(idx, "journalAr", e.target.value)}
                                placeholder="مجلة جامعة أنطاكية"
                                className="bg-background"
                              />
                            </div>
                            <div className="space-y-1 md:col-span-1">
                              <Label className="text-xs">{isArabic ? "سنة النشر" : "Year"}</Label>
                              <Input
                                value={pub.year}
                                onChange={(e) => handleUpdatePublication(idx, "year", e.target.value)}
                                placeholder="2024"
                                className="bg-background"
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>

                {/* Tab 4: Booking Office Hours Slots */}
                <TabsContent value="slots" className="m-0 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-5 w-5 text-primary" />
                        <div>
                          <h3 className="font-bold text-base">{isArabic ? "مواعيد حجز الساعات المكتبية للطلاب" : "Bookable Office Hour Slots"}</h3>
                          <p className="text-xs text-muted-foreground">{isArabic ? "هذه المواعيد تظهر للطلاب في تبويب 'حجز موعد' لحجز مقابلة مع الدكتور." : "These slots appear on professor profile for student bookings."}</p>
                        </div>
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={handleAddOfficeSlot} className="font-bold gap-1 text-xs">
                        <Plus className="h-4 w-4" />
                        {isArabic ? "إضافة موعد جديد" : "Add Time Slot"}
                      </Button>
                    </div>

                    {/* Designated Meeting Hall / Room Field */}
                    <div className="p-4 rounded-xl border bg-primary/5 border-primary/20 space-y-2">
                      <Label htmlFor="addAppointmentLocation" className="text-xs font-bold flex items-center gap-1.5 text-foreground">
                        <MapPin className="h-4 w-4 text-primary" />
                        {isArabic ? "اسم ورقم القاعة / مكتب المواعيد" : "Appointment Hall / Room & Location"}
                      </Label>
                      <Input
                        id="addAppointmentLocation"
                        value={formData.appointmentLocation || ""}
                        onChange={(e) => setFormData({ ...formData, appointmentLocation: e.target.value })}
                        placeholder={isArabic ? "مثال: قاعة السمينار 204 - مبنى كلية الهندسة المعمارية" : "e.g. Seminar Room 204 - Faculty Building"}
                        className="bg-background text-xs"
                      />
                      <p className="text-[11px] text-muted-foreground">
                        {isArabic ? "حدد اسم ورقم القاعة أو المكتب الذي سيتواجد فيه الدكتور خلال مواعيد المقابلات لتظهر للطالب في صفحة الحجز." : "Enter the specific room or hall number where the professor will be available for booked appointments."}
                      </p>
                    </div>

                    {officeSlotsList.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic text-center py-4 bg-muted/10 rounded-lg border border-dashed">
                        {isArabic ? "لا يوجد مواعيد حجز مضافة. انقر على 'إضافة موعد جديد' لإضافة أيام وأوقات الحجز." : "No slots configured yet."}
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {officeSlotsList.map((slot, idx) => (
                          <div key={idx} className="p-3 border rounded-xl bg-muted/20 space-y-2 relative">
                            <button
                              type="button"
                              onClick={() => handleRemoveOfficeSlot(idx)}
                              className="absolute top-2 end-2 text-destructive hover:bg-destructive/10 p-1 rounded-full"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <div className="grid grid-cols-2 gap-2 pe-6">
                              <div className="space-y-1">
                                <Label className="text-xs">{isArabic ? "اليوم" : "Day"}</Label>
                                <Input
                                  value={slot.dayAr}
                                  onChange={(e) => handleUpdateOfficeSlot(idx, "dayAr", e.target.value)}
                                  placeholder="الأحد / الثلاثاء"
                                  className="bg-background h-8 text-xs"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">{isArabic ? "التوقيت" : "Time Slot"}</Label>
                                <Input
                                  value={slot.time}
                                  onChange={(e) => handleUpdateOfficeSlot(idx, "time", e.target.value)}
                                  placeholder="10:00 AM - 11:00 AM"
                                  className="bg-background h-8 text-xs"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </div>

              <DialogFooter className="p-4 border-t bg-muted/20 gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                  {isArabic ? "إلغاء" : "Cancel"}
                </Button>
                <Button type="submit" disabled={createMemberMutation.isPending} className="font-bold">
                  {createMemberMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isArabic ? "حفظ وإضافة الأستاذ" : "Save & Add Faculty"}
                </Button>
              </DialogFooter>
            </Tabs>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Faculty Member Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-4xl w-[95vw] sm:max-w-4xl p-0 overflow-hidden rounded-xl border shadow-xl">
          <DialogHeader className="p-6 pb-2 border-b bg-muted/20">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Edit className="h-5 w-5 text-primary" />
              {isArabic ? "تعديل الملف ومواعيد الحجز لعضو التدريس" : "Edit Profile & Office Slots"}
            </DialogTitle>
            <DialogDescription>
              {isArabic ? "تحديث بيانات الأستاذ، الشهادات، ومواعيد حجز المواعيد المتاحة." : "Update profile details, degrees, and bookable time slots."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 min-h-0 overflow-hidden w-full">
              <div className="px-6 border-b bg-muted/10 shrink-0">
                <TabsList className="h-12 bg-transparent gap-3 overflow-x-auto">
                  <TabsTrigger value="basic" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
                    <UserCheck className="h-4 w-4" />
                    {isArabic ? "البيانات الأساسية" : "Basic Info"}
                  </TabsTrigger>
                  <TabsTrigger value="bio" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
                    <GraduationCap className="h-4 w-4" />
                    {isArabic ? "السيرة والمؤهلات" : "Bio & Education"}
                  </TabsTrigger>
                  <TabsTrigger value="research" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
                    <BookOpen className="h-4 w-4" />
                    {isArabic ? "الأبحاث والمنشورات" : "Research"}
                  </TabsTrigger>
                  <TabsTrigger value="slots" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2 font-bold">
                    <CalendarDays className="h-4 w-4" />
                    {isArabic ? "مواعيد حجز المواعيد" : "Booking Slots"}
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
                {/* Tab 1: Basic Info */}
                <TabsContent value="basic" className="m-0 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-nameAr">{isArabic ? "الاسم الكامل (بالعربية) *" : "Full Name (Arabic) *"}</Label>
                      <Input
                        id="edit-nameAr"
                        value={formData.nameAr}
                        onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-nameEn">{isArabic ? "الاسم الكامل (بالإنكليزية)" : "Full Name (English)"}</Label>
                      <Input
                        id="edit-nameEn"
                        value={formData.nameEn}
                        onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-titleAr">{isArabic ? "الرتبة العلمية (عربي) *" : "Academic Title (AR) *"}</Label>
                      <Input
                        id="edit-titleAr"
                        value={formData.titleAr}
                        onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-titleEn">{isArabic ? "الرتبة العلمية (إنكليزي)" : "Academic Title (EN)"}</Label>
                      <Input
                        id="edit-titleEn"
                        value={formData.titleEn}
                        onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{isArabic ? "الكلية التابع لها" : "Assigned Faculty"}</Label>
                      <Select
                        value={formData.facultyId || "none"}
                        onValueChange={(val) => handleFacultyChangeInForm(val === "none" ? "" : val)}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder={isArabic ? "اختر الكلية (اختياري)" : "Select Faculty (Optional)"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">
                            {isArabic ? "-- بدون كلية حالياً (مدرس غير مسند) --" : "-- No Faculty (Unassigned) --"}
                          </SelectItem>
                          {displayFaculties.map((f) => (
                            <SelectItem key={f.id} value={f.id.toString()}>
                              {isArabic ? f.nameAr : f.nameEn}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-email">{isArabic ? "البريد الإلكتروني *" : "Email Address *"}</Label>
                      <Input
                        id="edit-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>{isArabic ? "القسم الأكاديمي" : "Academic Department"}</Label>
                    {!formData.facultyId ? (
                      <div className="rounded-md border border-muted bg-muted/20 p-3 text-muted-foreground text-xs">
                        {isArabic
                          ? "يمكنك تحديد الكلية أولاً لاختيار أحد أقسامها، أو حفظ المدرس بدون قسم حالياً."
                          : "Select a faculty first to choose its department, or save without department for now."}
                      </div>
                    ) : availablePrograms.length === 0 ? (
                      <div className="rounded-md border border-muted bg-muted/20 p-3 text-muted-foreground text-xs flex items-center justify-between">
                        <span>
                          {isArabic
                            ? "لا توجد أقسام مسجلة لهذه الكلية حتى الآن (سيتم تسجيل المدرس كعضو عام بالكلية)."
                            : "No departments exist for this faculty yet (will be saved as general faculty staff)."}
                        </span>
                        <Link href="/dashboard/programs">
                          <Button type="button" size="sm" variant="outline" className="h-7 text-xs bg-background">
                            {isArabic ? "إضافة قسم" : "Add Department"}
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <Select
                        value={formData.departmentId || "none"}
                        onValueChange={(val) => handleDepartmentChangeInForm(val === "none" ? "" : val)}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder={isArabic ? "اختر القسم الأكاديمي (اختياري)" : "Select Department (Optional)"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">
                            {isArabic ? "-- بدون قسم محدد (عضو عام بالكلية) --" : "-- No Specific Dept (General Staff) --"}
                          </SelectItem>
                          {availablePrograms.map((p) => (
                            <SelectItem key={p.id} value={p.id.toString()}>
                              {isArabic ? p.nameAr : p.nameEn}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-officeHours">{isArabic ? "الساعات المكتبية العامة" : "General Office Hours"}</Label>
                      <Input
                        id="edit-officeHours"
                        value={formData.officeHours}
                        onChange={(e) => setFormData({ ...formData, officeHours: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-locationAr">{isArabic ? "الموقع / المكتب" : "Office Location"}</Label>
                      <Input
                        id="edit-locationAr"
                        value={formData.locationAr}
                        onChange={(e) => setFormData({ ...formData, locationAr: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Image Upload Box */}
                  <div className="space-y-3 pt-2">
                    <Label className="font-bold flex items-center justify-between">
                      <span>{isArabic ? "الصورة الشخصية (تحميل ملف بحد أقصى 1 ميغابايت)" : "Profile Picture (Upload file max 1MB)"}</span>
                    </Label>

                    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border rounded-xl bg-muted/10">
                      <Avatar className="h-20 w-20 border-2 border-primary shadow-sm shrink-0">
                        <AvatarImage src={formData.image} />
                        <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">P</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors shadow">
                            <Upload className="h-4 w-4" />
                            {isArabic ? "تغيير الصورة من الجهاز..." : "Upload New Image..."}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageUpload}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <Switch
                      id="edit-isHead"
                      checked={formData.isHead}
                      onCheckedChange={(checked) => setFormData({ ...formData, isHead: checked })}
                    />
                    <Label htmlFor="edit-isHead" className="cursor-pointer font-bold">
                      {isArabic ? "عميد كلية / رئيس قسم" : "Dean / Department Head"}
                    </Label>
                  </div>
                </TabsContent>

                {/* Tab 2: Bio & Education */}
                <TabsContent value="bio" className="m-0 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="edit-bioAr" className="font-bold">{isArabic ? "السيرة الذاتية والشرح (بالعربية)" : "Biography (Arabic)"}</Label>
                    <Textarea
                      id="edit-bioAr"
                      value={formData.bioAr}
                      onChange={(e) => setFormData({ ...formData, bioAr: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        <h3 className="font-bold text-base">{isArabic ? "المؤهلات العلمية والشهادات" : "Academic Qualifications & Degrees"}</h3>
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={handleAddEducation} className="font-bold gap-1 text-xs">
                        <Plus className="h-4 w-4" />
                        {isArabic ? "إضافة مؤهل علمي" : "Add Degree"}
                      </Button>
                    </div>

                    {educationList.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic text-center py-4 bg-muted/10 rounded-lg border border-dashed">
                        {isArabic ? "لم يتم إضافة شهادات بعد." : "No degrees added yet."}
                      </p>
                    ) : (
                      educationList.map((edu, idx) => (
                        <div key={idx} className="p-4 border rounded-xl bg-muted/20 space-y-3 relative">
                          <button
                            type="button"
                            onClick={() => handleRemoveEducation(idx)}
                            className="absolute top-3 end-3 text-destructive hover:bg-destructive/10 p-1 rounded-full"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pe-8">
                            <div className="space-y-1 md:col-span-1">
                              <Label className="text-xs">{isArabic ? "المؤهل / الشهادة" : "Degree Title"}</Label>
                              <Input
                                value={edu.degreeAr}
                                onChange={(e) => handleUpdateEducation(idx, "degreeAr", e.target.value)}
                                className="bg-background"
                              />
                            </div>
                            <div className="space-y-1 md:col-span-1">
                              <Label className="text-xs">{isArabic ? "الجامعة / المؤسسة" : "University / Institution"}</Label>
                              <Input
                                value={edu.schoolAr}
                                onChange={(e) => handleUpdateEducation(idx, "schoolAr", e.target.value)}
                                className="bg-background"
                              />
                            </div>
                            <div className="space-y-1 md:col-span-1">
                              <Label className="text-xs">{isArabic ? "سنة التخرج" : "Graduation Year"}</Label>
                              <Input
                                value={edu.year}
                                onChange={(e) => handleUpdateEducation(idx, "year", e.target.value)}
                                className="bg-background"
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>

                {/* Tab 3: Research & Publications */}
                <TabsContent value="research" className="m-0 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="edit-researchAr" className="font-bold">{isArabic ? "الاهتمامات والتوجيهات البحثية" : "Research Interests & Focus"}</Label>
                    <Textarea
                      id="edit-researchAr"
                      value={formData.researchAr}
                      onChange={(e) => setFormData({ ...formData, researchAr: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <h3 className="font-bold text-base">{isArabic ? "المنشورات الأكاديمية والمقالات" : "Academic Publications & Journals"}</h3>
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={handleAddPublication} className="font-bold gap-1 text-xs">
                        <Plus className="h-4 w-4" />
                        {isArabic ? "إضافة بحث / منشور" : "Add Publication"}
                      </Button>
                    </div>

                    {publicationsList.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic text-center py-4 bg-muted/10 rounded-lg border border-dashed">
                        {isArabic ? "لم يتم إضافة أبحاث بعد." : "No publications added yet."}
                      </p>
                    ) : (
                      publicationsList.map((pub, idx) => (
                        <div key={idx} className="p-4 border rounded-xl bg-muted/20 space-y-3 relative">
                          <button
                            type="button"
                            onClick={() => handleRemovePublication(idx)}
                            className="absolute top-3 end-3 text-destructive hover:bg-destructive/10 p-1 rounded-full"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pe-8">
                            <div className="space-y-1 md:col-span-1">
                              <Label className="text-xs">{isArabic ? "عنوان الورقة العلمية / البحث" : "Publication Title"}</Label>
                              <Input
                                value={pub.titleAr}
                                onChange={(e) => handleUpdatePublication(idx, "titleAr", e.target.value)}
                                className="bg-background"
                              />
                            </div>
                            <div className="space-y-1 md:col-span-1">
                              <Label className="text-xs">{isArabic ? "اسم المجلة / الناشر" : "Journal Name"}</Label>
                              <Input
                                value={pub.journalAr}
                                onChange={(e) => handleUpdatePublication(idx, "journalAr", e.target.value)}
                                className="bg-background"
                              />
                            </div>
                            <div className="space-y-1 md:col-span-1">
                              <Label className="text-xs">{isArabic ? "سنة النشر" : "Year"}</Label>
                              <Input
                                value={pub.year}
                                onChange={(e) => handleUpdatePublication(idx, "year", e.target.value)}
                                className="bg-background"
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>

                {/* Tab 4: Booking Office Hours Slots */}
                <TabsContent value="slots" className="m-0 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-5 w-5 text-primary" />
                        <div>
                          <h3 className="font-bold text-base">{isArabic ? "مواعيد حجز الساعات المكتبية للطلاب" : "Bookable Office Hour Slots"}</h3>
                          <p className="text-xs text-muted-foreground">{isArabic ? "هذه المواعيد تظهر للطلاب في تبويب 'حجز موعد' لحجز مقابلة مع الدكتور." : "These slots appear on professor profile for student bookings."}</p>
                        </div>
                      </div>
                      <Button type="button" variant="outline" size="sm" onClick={handleAddOfficeSlot} className="font-bold gap-1 text-xs">
                        <Plus className="h-4 w-4" />
                        {isArabic ? "إضافة موعد جديد" : "Add Time Slot"}
                      </Button>
                    </div>

                    {/* Designated Meeting Hall / Room Field */}
                    <div className="p-4 rounded-xl border bg-primary/5 border-primary/20 space-y-2">
                      <Label htmlFor="editAppointmentLocation" className="text-xs font-bold flex items-center gap-1.5 text-foreground">
                        <MapPin className="h-4 w-4 text-primary" />
                        {isArabic ? "اسم ورقم القاعة / مكتب المواعيد" : "Appointment Hall / Room & Location"}
                      </Label>
                      <Input
                        id="editAppointmentLocation"
                        value={formData.appointmentLocation || ""}
                        onChange={(e) => setFormData({ ...formData, appointmentLocation: e.target.value })}
                        placeholder={isArabic ? "مثال: قاعة السمينار 204 - مبنى كلية الهندسة المعمارية" : "e.g. Seminar Room 204 - Faculty Building"}
                        className="bg-background text-xs"
                      />
                      <p className="text-[11px] text-muted-foreground">
                        {isArabic ? "حدد اسم ورقم القاعة أو المكتب الذي سيتواجد فيه الدكتور خلال مواعيد المقابلات لتظهر للطالب في صفحة الحجز." : "Enter the specific room or hall number where the professor will be available for booked appointments."}
                      </p>
                    </div>

                    {officeSlotsList.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic text-center py-4 bg-muted/10 rounded-lg border border-dashed">
                        {isArabic ? "لا يوجد مواعيد حجز مضافة. انقر على 'إضافة موعد جديد' لإضافة أيام وأوقات الحجز." : "No slots configured yet."}
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {officeSlotsList.map((slot, idx) => (
                          <div key={idx} className="p-3 border rounded-xl bg-muted/20 space-y-2 relative">
                            <button
                              type="button"
                              onClick={() => handleRemoveOfficeSlot(idx)}
                              className="absolute top-2 end-2 text-destructive hover:bg-destructive/10 p-1 rounded-full"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <div className="grid grid-cols-2 gap-2 pe-6">
                              <div className="space-y-1">
                                <Label className="text-xs">{isArabic ? "اليوم" : "Day"}</Label>
                                <Input
                                  value={slot.dayAr}
                                  onChange={(e) => handleUpdateOfficeSlot(idx, "dayAr", e.target.value)}
                                  placeholder="الأحد / الثلاثاء"
                                  className="bg-background h-8 text-xs"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">{isArabic ? "التوقيت" : "Time Slot"}</Label>
                                <Input
                                  value={slot.time}
                                  onChange={(e) => handleUpdateOfficeSlot(idx, "time", e.target.value)}
                                  placeholder="10:00 AM - 11:00 AM"
                                  className="bg-background h-8 text-xs"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </div>

              <DialogFooter className="p-4 border-t bg-muted/20 gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                  {isArabic ? "إلغاء" : "Cancel"}
                </Button>
                <Button type="submit" disabled={updateMemberMutation.isPending} className="font-bold">
                  {updateMemberMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isArabic ? "حفظ التعديلات الشاملة" : "Save Full Profile"}
                </Button>
              </DialogFooter>
            </Tabs>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-destructive">
              {isArabic ? "إزاحة عضو من الكادر" : "Remove Faculty Member"}
            </DialogTitle>
            <DialogDescription className="pt-2">
              {isArabic
                ? `هل أنت بالتأكيد من إزالة ${selectedMember?.nameAr || "هذا العضو"} من قاعدة البيانات؟`
                : `Are you sure you want to remove ${selectedMember?.nameEn || "this member"}?`}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>
              {isArabic ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteMemberMutation.isPending}
              className="font-bold gap-2"
            >
              {deleteMemberMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              <Trash2 className="h-4 w-4" />
              {isArabic ? "تأكيد الإزاحة" : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
