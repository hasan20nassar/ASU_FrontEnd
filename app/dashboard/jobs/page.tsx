"use client";

import React, { useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { useJobs, useCreateJob, useUpdateJob, useDeleteJob, JobOfferItem, JobApplicationItem } from "@/hooks/use-jobs";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Plus,
  MapPin,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  Users,
  Loader2,
  FileText,
  X
} from "lucide-react";
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
  DialogFooter,
  DialogDescription,
  DialogBody
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function JobsManagement() {
  const { language, dir } = useLanguage();
  const isArabic = language === "ar";

  const { data: jobsList, isLoading } = useJobs();
  const displayJobs = jobsList || [];

  const createMutation = useCreateJob();
  const updateMutation = useUpdateJob();
  const deleteMutation = useDeleteJob();

  // Modals state
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isApplicationsOpen, setIsApplicationsOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState<JobOfferItem | null>(null);

  // Form fields
  const [titleAr, setTitleAr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [departmentAr, setDepartmentAr] = useState("");
  const [departmentEn, setDepartmentEn] = useState("");
  const [type, setType] = useState<"full_time" | "part_time" | "contract">("full_time");
  const [deadline, setDeadline] = useState("2026-08-30");
  const [requirementsAr, setRequirementsAr] = useState("");
  const [requirementsEn, setRequirementsEn] = useState("");

  const handleOpenDialog = (job: JobOfferItem | null = null) => {
    setCurrentJob(job);
    if (job) {
      setTitleAr(job.titleAr || "");
      setTitleEn(job.titleEn || "");
      setDepartmentAr(job.departmentAr || "");
      setDepartmentEn(job.departmentEn || "");
      setType(job.type || "full_time");
      setDeadline(job.deadline || "2026-08-30");
      setRequirementsAr(job.requirementsAr || "");
      setRequirementsEn(job.requirementsEn || "");
    } else {
      setTitleAr("");
      setTitleEn("");
      setDepartmentAr("");
      setDepartmentEn("");
      setType("full_time");
      setDeadline("2026-08-30");
      setRequirementsAr("");
      setRequirementsEn("");
    }
    setIsOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAr || !departmentAr) {
      toast.error(isArabic ? "يرجى تعبئة المسمى الوظيفي والقسم" : "Please fill title and department");
      return;
    }

    const payload: Partial<JobOfferItem> = {
      titleAr,
      titleEn: titleEn || titleAr,
      departmentAr,
      departmentEn: departmentEn || departmentAr,
      type,
      deadline,
      requirementsAr,
      requirementsEn: requirementsEn || requirementsAr,
      locationAr: "حرم معرة صيدنايا",
      locationEn: "Maarat Saidnaya Campus",
      isActive: true,
    };

    try {
      if (currentJob) {
        await updateMutation.mutateAsync({ id: currentJob.id, data: payload });
        toast.success(isArabic ? "تم تحديث الإعلان الوظيفي بنجاح!" : "Job posting updated!");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success(isArabic ? "تم نشر الإعلان الوظيفي بنجاح!" : "Job offer posted successfully!");
      }
      setIsOpen(false);
    } catch (err) {
      toast.error(isArabic ? "حدث خطأ أثناء حفظ الفرصة الوظيفية" : "Failed to save job offer");
    }
  };

  const handleDelete = async () => {
    if (!currentJob) return;
    try {
      await deleteMutation.mutateAsync(currentJob.id);
      toast.success(isArabic ? "تم حذف الإعلان الوظيفي" : "Job offer deleted");
      setIsDeleteOpen(false);
    } catch (err) {
      toast.error(isArabic ? "حدث خطأ أثناء الحذف" : "Failed to delete job offer");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-start" dir={dir}>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isArabic ? "إدارة الوظائف الشاغرة" : "Job Vacancies Management"}
          </h1>
          <p className="text-muted-foreground">
            {isArabic
              ? "إضافة وإدارة فرص العمل الشاغرة ومتابعة طلبات المتقدمين للعمل بالجامعة."
              : "Post and manage job opportunities and view applicant submissions."}
          </p>
        </div>
        <Button className="font-bold flex gap-2 shadow-md" onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4" />
          {isArabic ? "إعلان وظيفي جديد" : "New Job Vacancy"}
        </Button>
      </div>

      <Card className="border-none shadow-md overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground font-bold">{isArabic ? "جاري تحميل الوظائف..." : "Loading jobs..."}</p>
            </div>
          ) : displayJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <Briefcase className="h-12 w-12 text-muted-foreground/30" />
              <p className="font-bold text-muted-foreground">{isArabic ? "لا توجد فرص وظيفية معلنة حالياً" : "No job vacancies currently posted"}</p>
              <Button onClick={() => handleOpenDialog()} className="font-bold gap-2">
                <Plus className="h-4 w-4" />
                {isArabic ? "إضافة أول فرصة عمل" : "Post First Job"}
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/20">
                  <TableHead className="text-start font-bold">{isArabic ? "المسمى الوظيفي" : "Job Title"}</TableHead>
                  <TableHead className="text-start font-bold">{isArabic ? "القسم" : "Department"}</TableHead>
                  <TableHead className="text-start font-bold">{isArabic ? "نوع الدوام" : "Type"}</TableHead>
                  <TableHead className="text-start font-bold">{isArabic ? "المتقدمون للوظيفة" : "Applicants"}</TableHead>
                  <TableHead className="text-start font-bold">{isArabic ? "آخر موعد" : "Deadline"}</TableHead>
                  <TableHead className="text-center font-bold">{isArabic ? "المسمى الوظيفي" : "Job Title"}</TableHead>
                  <TableHead className="text-center font-bold">{isArabic ? "القسم" : "Department"}</TableHead>
                  <TableHead className="text-center font-bold">{isArabic ? "نوع الدوام" : "Type"}</TableHead>
                  <TableHead className="text-center font-bold">{isArabic ? "المتقدمون للوظيفة" : "Applicants"}</TableHead>
                  <TableHead className="text-center font-bold">{isArabic ? "آخر موعد" : "Deadline"}</TableHead>
                  <TableHead className="text-center font-bold px-6">{isArabic ? "إجراءات" : "Actions"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayJobs.map((job) => (
                  <TableRow key={job.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="text-start font-bold">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-primary shrink-0" />
                        <span>{isArabic ? job.titleAr : job.titleEn}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-start text-xs font-medium">
                      {isArabic ? job.departmentAr : job.departmentEn}
                    </TableCell>
                    <TableCell className="text-start">
                      <Badge variant="outline" className="font-bold border-primary/20 bg-primary/5 text-primary">
                        {job.type === "full_time"
                          ? (isArabic ? "دوام كامل" : "Full Time")
                          : job.type === "part_time"
                            ? (isArabic ? "دوام جزئي" : "Part Time")
                            : (isArabic ? "عقد" : "Contract")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-start">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="font-bold gap-1 text-xs text-primary"
                        onClick={() => { setCurrentJob(job); setIsApplicationsOpen(true); }}
                      >
                        <Users className="h-3.5 w-3.5" />
                        {job.applications?.length || 0} {isArabic ? "متقدمين" : "Applicants"}
                      </Button>
                    </TableCell>
                    <TableCell className="text-start text-xs text-muted-foreground">
                      {job.deadline}
                    </TableCell>
                    <TableCell className="text-center px-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleOpenDialog(job)}>
                            <Edit className="h-4 w-4" /> {isArabic ? "تعديل الإعلان" : "Edit Job"}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => { setCurrentJob(job); setIsApplicationsOpen(true); }}>
                            <Users className="h-4 w-4" /> {isArabic ? "عرض المتقدمين" : "View Applicants"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 text-destructive font-bold cursor-pointer" onClick={() => { setCurrentJob(job); setIsDeleteOpen(true); }}>
                            <Trash2 className="h-4 w-4" /> {isArabic ? "حذف" : "Delete"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Job Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-xl w-[95vw] sm:max-w-xl p-0 overflow-hidden rounded-xl border shadow-xl">
          <DialogHeader className="p-6 pb-2 border-b bg-muted/20">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              {currentJob ? (isArabic ? "تعديل الإعلان الوظيفي" : "Edit Job Vacancy") : (isArabic ? "إضافة إعلان وظيفي جديد" : "Post New Job Vacancy")}
            </DialogTitle>
            <DialogDescription>
              {isArabic ? "أدخل بيانات الفرصة الوظيفية ومتطلبات التقديم." : "Enter job details and requirements."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <DialogBody className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="job-titleAr">{isArabic ? "المسمى الوظيفي (بالعربية) *" : "Job Title (AR) *"}</Label>
                  <Input
                    id="job-titleAr"
                    placeholder="مثال: مدرس لغة إنكليزية"
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job-titleEn">{isArabic ? "المسمى الوظيفي (بالإنكليزية)" : "Job Title (EN)"}</Label>
                  <Input
                    id="job-titleEn"
                    placeholder="e.g. English Language Instructor"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="job-deptAr">{isArabic ? "القسم / الكلية *" : "Department *"}</Label>
                  <Input
                    id="job-deptAr"
                    placeholder="كلية الهندسة / القسم الإداري"
                    value={departmentAr}
                    onChange={(e) => setDepartmentAr(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>{isArabic ? "نوع الدوام" : "Job Type"}</Label>
                  <Select value={type} onValueChange={(val: any) => setType(val)}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_time">{isArabic ? "دوام كامل" : "Full Time"}</SelectItem>
                      <SelectItem value="part_time">{isArabic ? "دوام جزئي" : "Part Time"}</SelectItem>
                      <SelectItem value="contract">{isArabic ? "عقد مؤقت" : "Contract"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job-deadline">{isArabic ? "آخر موعد للتقديم" : "Deadline"}</Label>
                  <Input
                    id="job-deadline"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="job-reqAr">{isArabic ? "متطلبات الوظيفة والشروط (بالعربية)" : "Requirements (AR)"}</Label>
                <Textarea
                  id="job-reqAr"
                  placeholder="شهادة ماجستير أو دكتوراه، خبرة تدريسية لا تقل عن سنتين..."
                  value={requirementsAr}
                  onChange={(e) => setRequirementsAr(e.target.value)}
                  rows={3}
                />
              </div>
            </DialogBody>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="font-bold">
                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isArabic ? "نشر الإعلان الوظيفي" : "Publish Job"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Applicants Dialog */}
      <Dialog open={isApplicationsOpen} onOpenChange={setIsApplicationsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {isArabic ? `المتقدمون لوظيفة: ${currentJob?.titleAr || ""}` : `Applicants for: ${currentJob?.titleEn || ""}`}
            </DialogTitle>
            <DialogDescription>
              {isArabic ? "استعراض طلبات السيرة الذاتية المقدمة لهذه الوظيفة." : "View candidate applications submitted for this role."}
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="space-y-3">
            {!currentJob?.applications || currentJob.applications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground font-bold">
                {isArabic ? "لم يتقدم أحد لهذه الوظيفة بعد" : "No candidates have applied for this job yet"}
              </div>
            ) : (
              currentJob.applications.map((app) => (
                <div key={app.id} className="p-4 border rounded-xl bg-card space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-base">{app.applicantName}</p>
                      <p className="text-xs text-muted-foreground">{app.email} • {app.phone}</p>
                    </div>
                    <Badge variant="outline" className="font-bold">
                      {app.status}
                    </Badge>
                  </div>
                  {app.coverLetter && (
                    <p className="text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-lg">
                      "{app.coverLetter}"
                    </p>
                  )}
                  {app.resumeUrl && (
                    <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary font-bold underline block">
                      {isArabic ? "رابط السيرة الذاتية (CV)" : "View CV Link"}
                    </a>
                  )}
                </div>
              ))
            )}
          </DialogBody>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsApplicationsOpen(false)}>
              {isArabic ? "إغلاق" : "Close"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-destructive">
              {isArabic ? "حذف الإعلان الوظيفي" : "Delete Job Offer"}
            </DialogTitle>
            <DialogDescription className="pt-2">
              {isArabic
                ? `هل أنت بالتأكيد من حذف وظيفة ${currentJob?.titleAr}؟`
                : `Are you sure you want to delete ${currentJob?.titleEn}?`}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>
              {isArabic ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="font-bold gap-2"
            >
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              <Trash2 className="h-4 w-4" />
              {isArabic ? "تأكيد الحذف" : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
