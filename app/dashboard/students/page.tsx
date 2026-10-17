"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import {
  useStudents,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
  useBulkTransferStudents,
} from "@/hooks/use-students";
import { useFaculties } from "@/hooks/use-faculties";
import { usePrograms } from "@/hooks/use-programs";
import { Student } from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  GraduationCap,
  Search,
  MoreVertical,
  UserPlus,
  FileText,
  Trash2,
  Edit,
  Download,
  Filter,
  Loader2,
  ArrowLeftRight,
  AlertTriangle,
  BookOpen,
  Plus,
  List,
  LayoutGrid,
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
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function StudentsManagement() {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  // Queries & Mutations
  const { data: studentsList, isLoading: isStudentsLoading } = useStudents();
  const { data: facultiesList, isLoading: isFacultiesLoading } = useFaculties();
  const { data: programsList } = usePrograms();

  const createStudentMutation = useCreateStudent();
  const updateStudentMutation = useUpdateStudent();
  const deleteStudentMutation = useDeleteStudent();
  const bulkTransferMutation = useBulkTransferStudents();

  const displayFaculties = facultiesList || [];
  const displayPrograms = programsList || [];
  const students = studentsList || [];

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [facultyFilter, setFacultyFilter] = useState("all");
  const [programFilter, setProgramFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "cards">("list");

  // Selection & Bulk Actions
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [bulkTargetProgramId, setBulkTargetProgramId] = useState("");

  // Modal State
  const [isOpenAddEdit, setIsOpenAddEdit] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form states
  const [formNameAr, setFormNameAr] = useState("");
  const [formNameEn, setFormNameEn] = useState("");
  const [formStudentId, setFormStudentId] = useState("");
  const [formFacultyId, setFormFacultyId] = useState("");
  const [formProgramId, setFormProgramId] = useState("");
  const [formGpa, setFormGpa] = useState("");

  // Filter available programs in form based on chosen faculty
  const availableFormPrograms = useMemo(() => {
    if (!formFacultyId) return [];
    const facIdNum = Number(formFacultyId);
    return displayPrograms.filter((p) => p.faculty === facIdNum);
  }, [formFacultyId, displayPrograms]);

  // Handle Faculty change in form -> cascade to program
  const handleFacultyChange = (newFacId: string) => {
    setFormFacultyId(newFacId);
    const facIdNum = Number(newFacId);
    const related = displayPrograms.filter((p) => p.faculty === facIdNum);
    if (related.length > 0) {
      setFormProgramId(related[0].id.toString());
    } else {
      setFormProgramId("");
    }
  };

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormNameAr("");
    setFormNameEn("");
    setFormStudentId(`STU-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormGpa("");

    // Find first faculty that has programs
    const defaultFac = displayFaculties.find((f) =>
      displayPrograms.some((p) => p.faculty === f.id)
    ) || displayFaculties[0];

    if (defaultFac) {
      const facId = defaultFac.id.toString();
      setFormFacultyId(facId);
      const progs = displayPrograms.filter((p) => p.faculty === defaultFac.id);
      setFormProgramId(progs[0]?.id?.toString() || "");
    } else {
      setFormFacultyId("");
      setFormProgramId("");
    }

    setIsOpenAddEdit(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormNameAr(student.nameAr);
    setFormNameEn(student.nameEn);
    setFormStudentId(student.studentId);
    setFormGpa(student.gpa || "");

    // Reverse lookup: check program's faculty if student.faculty doesn't match
    const prog = displayPrograms.find((p) => p.id === student.program);
    const resolvedFacultyId = prog?.faculty || student.faculty;

    setFormFacultyId(resolvedFacultyId.toString());
    setFormProgramId(student.program ? student.program.toString() : "");
    setIsOpenAddEdit(true);
  };

  const handleDelete = async (id: number, name: string) => {
    if (
      !confirm(
        isArabic
          ? `هل أنت متأكد من حذف حساب الطالب ${name}؟`
          : `Are you sure you want to delete student ${name}?`
      )
    )
      return;
    try {
      await deleteStudentMutation.mutateAsync(id);
      toast.success(
        isArabic
          ? `تم حذف حساب الطالب ${name} بنجاح`
          : `Student ${name} deleted successfully`
      );
      setSelectedStudentIds((prev) => prev.filter((i) => i !== id));
    } catch (err) {
      toast.error(isArabic ? "حدث خطأ أثناء الحذف" : "An error occurred while deleting");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNameAr || !formNameEn || !formStudentId || !formGpa || !formFacultyId) {
      toast.error(isArabic ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill in all required fields");
      return;
    }

    if (!formProgramId) {
      toast.error(
        isArabic
          ? "يجب اختيار القسم/التخصص الأكاديمي للطالب"
          : "Please select an academic program/department for the student"
      );
      return;
    }

    const gpaVal = parseFloat(formGpa);
    if (isNaN(gpaVal) || gpaVal < 0 || gpaVal > 4) {
      toast.error(isArabic ? "المعدل يجب أن يكون بين 0.00 و 4.00" : "GPA must be between 0.00 and 4.00");
      return;
    }

    const facultyIdNum = Number(formFacultyId);
    const programIdNum = Number(formProgramId);

    const payload: Partial<Student> = {
      nameAr: formNameAr,
      nameEn: formNameEn,
      studentId: formStudentId,
      faculty: facultyIdNum,
      program: programIdNum,
      gpa: formGpa,
      email: `${formStudentId.toLowerCase()}@asu.edu.sy`,
      totalCredits: 130,
      completedCredits: 80,
      isTop: gpaVal >= 3.5,
      year: 3,
    };

    try {
      if (editingStudent) {
        await updateStudentMutation.mutateAsync({
          id: editingStudent.id,
          data: payload as any,
        });
        toast.success(
          isArabic ? "تم تحديث بيانات الطالب بنجاح" : "Student profile updated successfully"
        );
      } else {
        await createStudentMutation.mutateAsync(payload as any);
        toast.success(
          isArabic ? "تم إضافة الطالب الجديد بنجاح" : "New student added successfully"
        );
      }
      setIsOpenAddEdit(false);
    } catch (err: any) {
      const msg = err?.message || err?.detail || (isArabic ? "حدث خطأ أثناء الحفظ" : "An error occurred while saving");
      toast.error(msg);
    }
  };

  // Handle Bulk Transfer
  const handleBulkTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkTargetProgramId || selectedStudentIds.length === 0) {
      toast.error(isArabic ? "يرجى اختيار القسم المراد النقل إليه" : "Please select target department");
      return;
    }

    try {
      await bulkTransferMutation.mutateAsync({
        student_ids: selectedStudentIds,
        target_program_id: Number(bulkTargetProgramId),
      });
      toast.success(
        isArabic
          ? `تم نقل (${selectedStudentIds.length}) طالب بنجاح`
          : `Successfully transferred (${selectedStudentIds.length}) students`
      );
      setSelectedStudentIds([]);
      setIsBulkOpen(false);
    } catch (err: any) {
      toast.error(err?.message || (isArabic ? "فشل النقل الجماعي" : "Bulk transfer failed"));
    }
  };

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        searchQuery === "" ||
        s.nameAr.includes(searchQuery) ||
        s.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.studentId.includes(searchQuery);

      const matchesFaculty =
        facultyFilter === "all" || s.faculty.toString() === facultyFilter;

      const matchesProgram =
        programFilter === "all" || s.program.toString() === programFilter;

      return matchesSearch && matchesFaculty && matchesProgram;
    });
  }, [students, searchQuery, facultyFilter, programFilter]);

  // Select all toggle
  const allFilteredIds = useMemo(() => filteredStudents.map((s) => s.id), [filteredStudents]);
  const isAllSelected =
    allFilteredIds.length > 0 &&
    allFilteredIds.every((id) => selectedStudentIds.includes(id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(allFilteredIds);
    }
  };

  const toggleSelectOne = (id: number) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-start" dir={isArabic ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isArabic ? "إدارة الطلاب والأقسام" : "Students & Academic Departments"}
          </h1>
          <p className="text-muted-foreground">
            {isArabic
              ? "استعراض بيانات الطلاب المسجلين، توزيعهم على الكليات والأقسام، وإجراء النقل الأكاديمي."
              : "Review registered students, their assigned faculties and departments, and handle academic transfers."}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {selectedStudentIds.length > 0 && (
            <Button
              variant="secondary"
              className="font-bold flex gap-2 border-primary/40 bg-primary/10 text-primary hover:bg-primary/20"
              onClick={() => {
                setBulkTargetProgramId(displayPrograms[0]?.id?.toString() || "");
                setIsBulkOpen(true);
              }}
            >
              <ArrowLeftRight className="h-4 w-4" />
              {isArabic
                ? `نقل جماعي (${selectedStudentIds.length})`
                : `Bulk Transfer (${selectedStudentIds.length})`}
            </Button>
          )}

          <Button
            variant="outline"
            className="font-bold flex gap-2"
            onClick={() =>
              toast.success(
                isArabic
                  ? "تم تصدير بيانات الطلاب كـ CSV بنجاح!"
                  : "Students data exported successfully as CSV!"
              )
            }
          >
            <Download className="h-4 w-4" />
            {isArabic ? "تصدير البيانات" : "Export Data"}
          </Button>
          <Button className="font-bold flex gap-2" onClick={handleOpenAdd}>
            <UserPlus className="h-4 w-4" />
            {isArabic ? "إضافة طالب" : "Add Student"}
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-none shadow-md overflow-hidden">
        <CardHeader className="bg-muted/30 pb-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={
                  isArabic
                    ? "البحث بالاسم أو الرقم الجامعي..."
                    : "Search by student name or ID..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9 bg-background"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Faculty Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground hidden sm:inline" />
                <select
                  value={facultyFilter}
                  onChange={(e) => {
                    setFacultyFilter(e.target.value);
                    setProgramFilter("all");
                  }}
                  className="h-10 rounded-md border border-input bg-background px-3 py-1 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="all">{isArabic ? "جميع الكليات" : "All Faculties"}</option>
                  {displayFaculties.map((f) => (
                    <option key={f.id} value={f.id.toString()}>
                      {isArabic ? f.nameAr : f.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department/Program Filter */}
              <select
                value={programFilter}
                onChange={(e) => setProgramFilter(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 py-1 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">{isArabic ? "جميع الأقسام" : "All Departments"}</option>
                {displayPrograms
                  .filter((p) => facultyFilter === "all" || p.faculty.toString() === facultyFilter)
                  .map((p) => (
                    <option key={p.id} value={p.id.toString()}>
                      {isArabic ? p.nameAr : p.nameEn}
                    </option>
                  ))}
              </select>

              {(facultyFilter !== "all" || programFilter !== "all" || searchQuery !== "") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setFacultyFilter("all");
                    setProgramFilter("all");
                  }}
                  className="text-xs"
                >
                  {isArabic ? "إعادة ضبط" : "Reset"}
                </Button>
              )}

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

        {/* Table / Cards Content */}
        <CardContent className="p-0">
          {viewMode === "list" ? (
            <div className="overflow-x-auto">
              {isStudentsLoading || isFacultiesLoading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground font-bold">
                    {isArabic ? "جاري تحميل بيانات الطلاب..." : "Loading students data..."}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/20">
                      <TableHead className="w-12 text-center">
                        <Checkbox
                          checked={isAllSelected}
                          onCheckedChange={toggleSelectAll}
                          aria-label="Select all"
                        />
                      </TableHead>
                      <TableHead className="text-start font-bold">{isArabic ? "الطالب" : "Student"}</TableHead>
                      <TableHead className="text-start font-bold">{isArabic ? "الرقم الجامعي" : "Student ID"}</TableHead>
                      <TableHead className="text-start font-bold">{isArabic ? "الكلية" : "Faculty"}</TableHead>
                      <TableHead className="text-start font-bold">{isArabic ? "القسم / التخصص" : "Department"}</TableHead>
                      <TableHead className="text-center font-bold">{isArabic ? "الطالب" : "Student"}</TableHead>
                      <TableHead className="text-center font-bold">{isArabic ? "الرقم الجامعي" : "Student ID"}</TableHead>
                      <TableHead className="text-center font-bold">{isArabic ? "الكلية" : "Faculty"}</TableHead>
                      <TableHead className="text-center font-bold">{isArabic ? "القسم / التخصص" : "Department"}</TableHead>
                      <TableHead className="text-center font-bold">{isArabic ? "المعدل" : "GPA"}</TableHead>
                      <TableHead className="text-end font-bold px-6">{isArabic ? "إجراءات" : "Actions"}</TableHead>
                      <TableHead className="text-center font-bold px-6">{isArabic ? "إجراءات" : "Actions"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12 text-muted-foreground font-bold">
                          {isArabic ? "لا توجد نتائج مطابقة لبحثك" : "No results match your search"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStudents.map((student) => {
                        const faculty = displayFaculties.find((f) => f.id === student.faculty);
                        const program = displayPrograms.find((p) => p.id === student.program);
                        const gpaNum = Number(student.gpa || 0);
                        const isSelected = selectedStudentIds.includes(student.id);

                        return (
                          <TableRow
                            key={student.id}
                            className={`hover:bg-muted/30 transition-colors ${isSelected ? "bg-primary/5" : ""
                              }`}
                          >
                            <TableCell className="text-center">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => toggleSelectOne(student.id)}
                                aria-label={`Select student ${student.nameEn}`}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border shadow-sm">
                                  <AvatarImage
                                    src={student.image || "/images/students/default.png"}
                                    alt={student.nameEn}
                                  />
                                  <AvatarFallback>{student.nameEn?.[0] || "S"}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <span className="font-bold text-sm">
                                    {isArabic ? student.nameAr : student.nameEn}
                                  </span>
                                  <span className="text-xs text-muted-foreground">{student.email}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm tabular-nums font-mono text-muted-foreground">
                              {student.studentId}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-medium bg-muted/30">
                                {isArabic
                                  ? student.facultyNameAr || faculty?.nameAr || "-"
                                  : student.facultyNameEn || faculty?.nameEn || "-"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="font-semibold text-primary border-primary/20">
                                <BookOpen className="h-3 w-3 me-1" />
                                {isArabic
                                  ? student.programNameAr || program?.nameAr || "-"
                                  : student.programNameEn || program?.nameEn || "-"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center font-bold tabular-nums">
                              <span
                                className={`px-2 py-0.5 rounded text-xs font-bold ${gpaNum >= 3.5
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                  : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                                  }`}
                              >
                                {gpaNum.toFixed(2)}
                              </span>
                            </TableCell>
                            <TableCell className="text-end px-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    className="gap-2"
                                    onClick={() =>
                                      toast.info(
                                        isArabic
                                          ? `عرض الملف الأكاديمي للطالب: ${student.nameAr}`
                                          : `Viewing academic record for ${student.nameEn}`
                                      )
                                    }
                                  >
                                    <FileText className="h-4 w-4" /> {isArabic ? "كشف العلامات" : "Transcript"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="gap-2" onClick={() => handleOpenEdit(student)}>
                                    <Edit className="h-4 w-4" /> {isArabic ? "تعديل البيانات" : "Edit Profile"}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="gap-2 text-destructive font-bold"
                                    onClick={() => handleDelete(student.id, isArabic ? student.nameAr : student.nameEn)}
                                  >
                                    <Trash2 className="h-4 w-4" /> {isArabic ? "حذف الطالب" : "Delete"}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          ) : (
            <div className="p-4">
              {isStudentsLoading || isFacultiesLoading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground font-bold">
                    {isArabic ? "جاري تحميل بيانات الطلاب..." : "Loading students data..."}
                  </p>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground font-bold">
                  {isArabic ? "لا توجد نتائج مطابقة لبحثك" : "No results match your search"}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredStudents.map((student) => {
                    const faculty = displayFaculties.find((f) => f.id === student.faculty);
                    const program = displayPrograms.find((p) => p.id === student.program);
                    const gpaNum = Number(student.gpa || 0);
                    const isSelected = selectedStudentIds.includes(student.id);

                    return (
                      <Card
                        key={student.id}
                        className={`border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group ${isSelected ? "border-primary/50 bg-primary/5 ring-1 ring-primary/30" : "border-border/80"
                          }`}
                      >
                        <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                          {/* Top Header with Checkbox, Avatar & Actions */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => toggleSelectOne(student.id)}
                                aria-label={`Select student ${student.nameEn}`}
                                className="mt-0.5"
                              />
                              <Avatar className="h-12 w-12 border-2 border-primary/20 shadow-sm">
                                <AvatarImage
                                  src={student.image || "/images/students/default.png"}
                                  alt={student.nameEn}
                                />
                                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                  {student.nameEn?.[0] || "S"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                                  {isArabic ? student.nameAr : student.nameEn}
                                </h3>
                                <p className="text-xs font-mono text-muted-foreground">{student.studentId}</p>
                              </div>
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 -me-2">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  className="gap-2"
                                  onClick={() =>
                                    toast.info(
                                      isArabic
                                        ? `عرض الملف الأكاديمي للطالب: ${student.nameAr}`
                                        : `Viewing academic record for ${student.nameEn}`
                                    )
                                  }
                                >
                                  <FileText className="h-4 w-4" /> {isArabic ? "كشف العلامات" : "Transcript"}
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-2" onClick={() => handleOpenEdit(student)}>
                                  <Edit className="h-4 w-4" /> {isArabic ? "تعديل البيانات" : "Edit Profile"}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="gap-2 text-destructive font-bold"
                                  onClick={() => handleDelete(student.id, isArabic ? student.nameAr : student.nameEn)}
                                >
                                  <Trash2 className="h-4 w-4" /> {isArabic ? "حذف الطالب" : "Delete"}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* Faculty & Department */}
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <Badge variant="secondary" className="font-semibold text-xs text-primary border-primary/20">
                                <BookOpen className="h-3 w-3 me-1" />
                                {isArabic
                                  ? student.programNameAr || program?.nameAr || "-"
                                  : student.programNameEn || program?.nameEn || "-"}
                              </Badge>
                              <Badge variant="outline" className="text-xs text-muted-foreground">
                                {isArabic
                                  ? student.facultyNameAr || faculty?.nameAr || "-"
                                  : student.facultyNameEn || faculty?.nameEn || "-"}
                              </Badge>
                            </div>
                          </div>

                          {/* Details: Email & GPA */}
                          <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                            <span className="truncate max-w-[180px]">{student.email || "-"}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] font-semibold text-muted-foreground">
                                {isArabic ? "المعدل:" : "GPA:"}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-xs font-bold ${gpaNum >= 3.5
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                  : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                                  }`}
                              >
                                {gpaNum.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          {/* Card Footer Actions */}
                          <div className="flex items-center justify-end gap-2 pt-2 border-t mt-auto">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-xs font-semibold gap-1 text-muted-foreground hover:text-foreground"
                              onClick={() =>
                                toast.info(
                                  isArabic
                                    ? `عرض الملف الأكاديمي للطالب: ${student.nameAr}`
                                    : `Viewing academic record for ${student.nameEn}`
                                )
                              }
                            >
                              <FileText className="h-3.5 w-3.5" />
                              {isArabic ? "السجل" : "Record"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs font-semibold gap-1.5"
                              onClick={() => handleOpenEdit(student)}
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
        </CardContent>
      </Card>

      {/* Add / Edit Student Dialog */}
      <Dialog open={isOpenAddEdit} onOpenChange={setIsOpenAddEdit}>
        <DialogContent className="sm:max-w-lg" dir={isArabic ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle className="text-start">
              {editingStudent
                ? isArabic
                  ? "تعديل بيانات الطالب الأكاديمية"
                  : "Edit Student Profile"
                : isArabic
                  ? "إضافة وقيد طالب جديد"
                  : "Enroll New Student"}
            </DialogTitle>
            <DialogDescription className="text-start">
              {isArabic
                ? "حدد بيانات الطالب، الكلية، والقسم الأكاديمي التابع له بدقة."
                : "Specify student info, faculty, and their academic department."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <DialogBody>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nameAr">{isArabic ? "الاسم (بالعربية)" : "Name (Arabic)"}</Label>
                  <Input
                    id="nameAr"
                    required
                    value={formNameAr}
                    onChange={(e) => setFormNameAr(e.target.value)}
                    placeholder="محمد أحمد السعيد"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nameEn">{isArabic ? "الاسم (بالإنجليزية)" : "Name (English)"}</Label>
                  <Input
                    id="nameEn"
                    required
                    value={formNameEn}
                    onChange={(e) => setFormNameEn(e.target.value)}
                    placeholder="Mohammad Ahmad Al-Saeed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="studentId">{isArabic ? "الرقم الجامعي" : "Student ID"}</Label>
                  <Input
                    id="studentId"
                    required
                    value={formStudentId}
                    onChange={(e) => setFormStudentId(e.target.value)}
                    placeholder="ENG-2024-0001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gpa">{isArabic ? "المعدل التراكمي (GPA)" : "GPA"}</Label>
                  <Input
                    id="gpa"
                    type="number"
                    step="0.01"
                    min="0.00"
                    max="4.00"
                    required
                    value={formGpa}
                    onChange={(e) => setFormGpa(e.target.value)}
                    placeholder="3.85"
                  />
                </div>
              </div>

              {/* Cascading Select: Faculty */}
              <div className="space-y-2">
                <Label htmlFor="faculty">{isArabic ? "الكلية" : "Faculty"}</Label>
                <select
                  id="faculty"
                  value={formFacultyId}
                  onChange={(e) => handleFacultyChange(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {displayFaculties.map((f) => (
                    <option key={f.id} value={f.id}>
                      {isArabic ? f.nameAr : f.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cascading Select: Academic Department / Program */}
              <div className="space-y-2">
                <Label htmlFor="program">{isArabic ? "القسم / التخصص الأكاديمي" : "Department / Program"}</Label>
                {availableFormPrograms.length === 0 ? (
                  <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-amber-800 text-xs flex items-center justify-between dark:bg-amber-950 dark:border-amber-800 dark:text-amber-200">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>
                        {isArabic
                          ? "لا توجد أقسام مسجلة لهذه الكلية حتى الآن. يرجى إضافة قسم أولاً."
                          : "No departments exist for this faculty yet. Please create a department first."}
                      </span>
                    </div>
                    <Link href="/dashboard/programs">
                      <Button type="button" size="sm" variant="outline" className="h-7 text-xs bg-background">
                        <Plus className="h-3 w-3 mr-1" />
                        {isArabic ? "إضافة قسم" : "Add Dept"}
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <select
                    id="program"
                    required
                    value={formProgramId}
                    onChange={(e) => setFormProgramId(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {availableFormPrograms.map((p) => (
                      <option key={p.id} value={p.id}>
                        {isArabic ? p.nameAr : p.nameEn}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </DialogBody>

            <DialogFooter className="gap-2 sm:justify-start">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpenAddEdit(false)}
                className="bg-transparent w-full sm:w-auto"
              >
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto font-bold"
                disabled={
                  availableFormPrograms.length === 0 ||
                  createStudentMutation.isPending ||
                  updateStudentMutation.isPending
                }
              >
                {createStudentMutation.isPending || updateStudentMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {isArabic ? "جاري الحفظ..." : "Saving..."}
                  </>
                ) : isArabic ? (
                  "حفظ وتثبيت الطالب"
                ) : (
                  "Save Student"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Bulk Transfer Dialog */}
      <Dialog open={isBulkOpen} onOpenChange={setIsBulkOpen}>
        <DialogContent className="sm:max-w-md" dir={isArabic ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle className="text-start flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5 text-primary" />
              {isArabic ? "النقل الأكاديمي الجماعي" : "Bulk Academic Transfer"}
            </DialogTitle>
            <DialogDescription className="text-start">
              {isArabic
                ? `سيتم نقل (${selectedStudentIds.length}) طلاب محددين إلى القسم المختار في عملية ذرية واحدة.`
                : `Transfer (${selectedStudentIds.length}) selected students to the target department in a single atomic action.`}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleBulkTransferSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="bulkTarget">{isArabic ? "القسم / التخصص الجديد" : "Target Department"}</Label>
              <select
                id="bulkTarget"
                required
                value={bulkTargetProgramId}
                onChange={(e) => setBulkTargetProgramId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {displayPrograms.map((p) => {
                  const fac = displayFaculties.find((f) => f.id === p.faculty);
                  return (
                    <option key={p.id} value={p.id}>
                      {isArabic ? `${p.nameAr} (${fac?.nameAr || ""})` : `${p.nameEn} (${fac?.nameEn || ""})`}
                    </option>
                  );
                })}
              </select>
            </div>

            <DialogFooter className="pt-4 gap-2 sm:justify-start">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsBulkOpen(false)}
                className="bg-transparent w-full sm:w-auto"
              >
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto font-bold"
                disabled={bulkTransferMutation.isPending}
              >
                {bulkTransferMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {isArabic ? "جاري تنفيذ النقل..." : "Transferring..."}
                  </>
                ) : isArabic ? (
                  "تنفيذ النقل الجماعي"
                ) : (
                  "Execute Transfer"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
