"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import { useFaculties } from "@/hooks/use-faculties";
import { useFacultyMembers } from "@/hooks/use-faculty-members";
import { useNews } from "@/hooks/use-news";
import { useEvents } from "@/hooks/use-events";
import { useStudents } from "@/hooks/use-students";
import { useUsers } from "@/hooks/use-users";
import { useActivityLogs, ActivityLogItem } from "@/hooks/use-activity-logs";
import { useLibraryStats } from "@/hooks/use-library";
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Newspaper,
  Users,
  GraduationCap,
  Building2,
  Calendar,
  History,
  Check,
  ShieldCheck,
  FileText,
  Briefcase,
  UserCheck,
  BookMarked
} from "lucide-react";
import { cn } from "@/lib/utils";

const COLORS = ["#800000", "#1a1a1a", "#9ca3af", "#4b5563", "#d1d5db"];

const defaultActivities: ActivityLogItem[] = [];

const fallbackEnrollmentData: { year: string; students: number }[] = [];

export default function DashboardOverview() {
  const { language, dir } = useLanguage();
  const isArabic = language === "ar";

  const { data: facultiesList } = useFaculties();
  const { data: facultyMembersList } = useFacultyMembers();
  const { data: newsList } = useNews();
  const { data: eventsList } = useEvents();
  const { data: studentsList } = useStudents();
  const { data: usersList } = useUsers();
  const { data: dbActivityLogs } = useActivityLogs();
  const { data: libraryStats } = useLibraryStats();

  const [isLogsDialogOpen, setIsLogsDialogOpen] = useState(false);

  // User Roles Distribution Counts
  const userRoleCounts = useMemo(() => {
    const counts = { admin: 0, content_manager: 0, faculty: 0, alumni: 0, student: 0 };
    (usersList || []).forEach((u) => {
      if (counts[u.role] !== undefined) {
        counts[u.role]++;
      }
    });
    return counts;
  }, [usersList]);

  const userStatsCards = [
    {
      titleAr: "مدراء النظام",
      titleEn: "System Admins",
      count: userRoleCounts.admin,
      icon: ShieldCheck,
      textColor: "text-red-600",
      bgBadge: "bg-red-500/10 text-red-600",
      href: "/dashboard/admins",
    },
    {
      titleAr: "إدارة المحتوى",
      titleEn: "Content Managers",
      count: userRoleCounts.content_manager,
      icon: FileText,
      textColor: "text-blue-600",
      bgBadge: "bg-blue-500/10 text-blue-600",
      href: "/dashboard/content-managers",
    },
    {
      titleAr: "أعضاء التدريس",
      titleEn: "Faculty Members",
      count: userRoleCounts.faculty || (facultyMembersList?.length || 0),
      icon: UserCheck,
      textColor: "text-purple-600",
      bgBadge: "bg-purple-500/10 text-purple-600",
      href: "/dashboard/faculty-members",
    },
    {
      titleAr: "الطلاب الخريجين",
      titleEn: "Alumni Students",
      count: userRoleCounts.alumni,
      icon: Briefcase,
      textColor: "text-amber-600",
      bgBadge: "bg-amber-500/10 text-amber-600",
      href: "/dashboard/alumni",
    },
    {
      titleAr: "الطلاب الحاليين",
      titleEn: "Current Students",
      count: userRoleCounts.student || (studentsList?.length || 0),
      icon: GraduationCap,
      textColor: "text-emerald-600",
      bgBadge: "bg-emerald-500/10 text-emerald-600",
      href: "/dashboard/students",
    },
  ];

  // Dynamic Faculty Student Distribution
  const facultyDistributionData = useMemo(() => {
    if (!facultiesList || facultiesList.length === 0) {
      return [];
    }

    return facultiesList.map((fac) => {
      const facStudentCount = (studentsList || []).filter((s) => s.faculty === fac.id).length;
      return {
        name: fac.nameAr,
        nameEn: fac.nameEn,
        value: facStudentCount,
        count: facStudentCount,
      };
    });
  }, [facultiesList, studentsList]);

  // Statistics Header Cards Data
  const statsCards = [
    {
      titleAr: "إجمالي الطلاب",
      titleEn: "Total Students",
      value: studentsList ? studentsList.length.toString() : "0",
      change: "+12%",
      icon: GraduationCap,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      titleAr: "هيئة التدريس",
      titleEn: "Faculty Members",
      value: facultyMembersList ? facultyMembersList.length.toString() : "0",
      change: "+4%",
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      titleAr: "الكليات والأقسام",
      titleEn: "Faculties & Depts",
      value: facultiesList ? facultiesList.length.toString() : "0",
      change: "0%",
      icon: Building2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      titleAr: "الأخبار والفعاليات",
      titleEn: "News & Events",
      value: ((newsList?.length || 0) + (eventsList?.length || 0)).toString(),
      change: "+8%",
      icon: Newspaper,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      href: "/dashboard/news",
    },
    {
      titleAr: "المكتبة والكتب",
      titleEn: "Library & Books",
      value: libraryStats ? (libraryStats.total || 0).toString() : "14",
      change: libraryStats?.pendingReservations ? `${libraryStats.pendingReservations} ${isArabic ? "حجز قيد المراجعة" : "pending reservations"}` : (isArabic ? "إدارة الكتب والمحتوى" : "Manage books"),
      icon: BookMarked,
      color: "text-rose-600",
      bg: "bg-rose-500/10",
      href: "/dashboard/library",
    },
  ];

  const activities = dbActivityLogs && dbActivityLogs.length > 0 ? dbActivityLogs : defaultActivities;

  const getActivityIcon = (status: string) => {
    switch (status) {
      case "update":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default:
        return <Newspaper className="h-4 w-4 text-purple-500" />;
    }
  };

  const getActivityBg = (status: string) => {
    switch (status) {
      case "update":
        return "bg-blue-500/10";
      case "success":
        return "bg-emerald-500/10";
      case "warning":
        return "bg-amber-500/10";
      default:
        return "bg-purple-500/10";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-start" dir={dir}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isArabic ? "نظرة عامة" : "Overview"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {isArabic
            ? "مرحباً بك مجدداً، إليك آخر إحصائيات الجامعة اليوم."
            : "Welcome back, here are today's university statistics."}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statsCards.map((stat, index) => {
          const cardBody = (
            <Card className="h-full overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-200 group-hover:-translate-y-0.5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {isArabic ? stat.titleAr : stat.titleEn}
                </CardTitle>
                <div className={cn("p-2 rounded-xl transition-transform group-hover:scale-110", stat.bg)}>
                  <stat.icon className={cn("h-4 w-4", stat.color)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  <span className={cn(
                    "font-bold inline-flex items-center gap-0.5",
                    stat.change.startsWith("+") || stat.change.includes("نشط") ? "text-emerald-500" : stat.change === "0%" ? "text-muted-foreground" : "text-muted-foreground"
                  )}>
                    {stat.change.startsWith("+") ? <ArrowUpRight className="h-3 w-3" /> : null}
                    {stat.change}
                  </span>
                  {!stat.change.includes("نشط") && !stat.change.includes("إدارة") && !stat.change.includes("Manage") ? (
                    <> {isArabic ? "منذ الشهر الماضي" : "from last month"}</>
                  ) : null}
                </p>
              </CardContent>
            </Card>
          );

          return stat.href ? (
            <Link key={index} href={stat.href} className="block group">
              {cardBody}
            </Link>
          ) : (
            <div key={index} className="group">
              {cardBody}
            </div>
          );
        })}
      </div>

      {/* User Accounts & Roles Overview Section */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <h2 className="text-lg font-bold tracking-tight">
            {isArabic ? "إحصائيات المستخدمين والصلاحيات" : "User Accounts & Roles Overview"}
          </h2>
          <span className="text-xs text-muted-foreground font-medium">
            {isArabic ? "نظرة تفصيلية على فئات المستخدمين وروابط الإدارة المباشرة" : "Breakdown of university user categories and quick management shortcuts"}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {userStatsCards.map((card, idx) => (
            <Link key={idx} href={card.href} className="block group">
              <Card className="border-none shadow-sm bg-muted/20 hover:bg-muted/40 hover:shadow-md transition-all duration-200 cursor-pointer h-full">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold group-hover:text-foreground transition-colors">
                      {isArabic ? card.titleAr : card.titleEn}
                    </p>
                    <p className={cn("text-2xl font-bold mt-1", card.textColor)}>
                      {card.count}
                    </p>
                  </div>
                  <div className={cn("p-2.5 rounded-xl transition-transform group-hover:scale-110", card.bgBadge)}>
                    <card.icon className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Charts Section matching screenshot */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Faculty Distribution Donut Chart */}
        <Card className="col-span-3 border-none shadow-md">
          <CardHeader>
            <CardTitle>{isArabic ? "توزيع الكليات" : "Faculties Distribution"}</CardTitle>
            <CardDescription>
              {isArabic ? "نسبة الطلاب لكل كلية" : "Percentage of students per faculty"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={facultyDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {facultyDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    formatter={(value: any, name: any, props: any) => [
                      `${value} ${isArabic ? "طالب" : "students"}`,
                      isArabic ? props.payload.name : props.payload.nameEn
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
              {facultyDistributionData.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-muted-foreground">{isArabic ? f.name : f.nameEn}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Registration Growth Bar Chart */}
        <Card className="col-span-4 border-none shadow-md">
          <CardHeader>
            <CardTitle>{isArabic ? "نمو التسجيل" : "Enrollment Growth"}</CardTitle>
            <CardDescription>
              {isArabic ? "عدد الطلاب المسجلين خلال السنوات الخمس الأخيرة" : "Number of enrolled students over the last 5 years"}
            </CardDescription>
          </CardHeader>
          <CardContent className="ps-2">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fallbackEnrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="year"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(128, 0, 0, 0.05)' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar
                    dataKey="students"
                    fill="#800000"
                    radius={[4, 4, 0, 0]}
                    barSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity / Audit Logs matching screenshot */}
      <Card className="border-none shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{isArabic ? "النشاطات الأخيرة" : "Recent Activity"}</CardTitle>
            <CardDescription>
              {isArabic ? "آخر الإجراءات المتخذة في النظام من قبل المشرفين" : "Latest actions taken in the system by administrators"}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="font-bold border-muted-foreground/30 shadow-sm"
            onClick={() => setIsLogsDialogOpen(true)}
          >
            {isArabic ? "عرض جميع السجلات" : "View all logs"}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 group">
                <div className={cn("mt-0.5 p-2 rounded-xl shrink-0", getActivityBg(activity.status))}>
                  {getActivityIcon(activity.status)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-foreground">
                      {isArabic ? activity.userName : (activity.userNameEn || activity.userName)}
                    </p>
                    <span className="text-[11px] text-muted-foreground font-medium bg-muted/60 px-2.5 py-0.5 rounded-full">
                      {activity.createdAt}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {isArabic ? activity.actionAr : activity.actionEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* View All Activity Logs Modal */}
      <Dialog open={isLogsDialogOpen} onOpenChange={setIsLogsDialogOpen}>
        <DialogContent className="sm:max-w-5xl max-w-[95vw] w-full">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              {isArabic ? "سجل كافة الإجراءات والنشاطات (Audit Logs)" : "All System Activity Logs"}
            </DialogTitle>
            <DialogDescription>
              {isArabic ? "استعراض كافة العمليات المسجلة في قاعدة بيانات النظام." : "Browse complete audit log history in the system."}
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="space-y-3">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="bg-muted/20">
                  <TableHead className="font-bold text-start w-1/4">{isArabic ? "المستخدم / المشرف" : "User / Admin"}</TableHead>
                  <TableHead className="font-bold text-start w-1/2">{isArabic ? "الإجراء" : "Action"}</TableHead>
                  <TableHead className="font-bold text-start">{isArabic ? "الحالة" : "Status"}</TableHead>
                  <TableHead className="font-bold text-start">{isArabic ? "التوقيت" : "Time"}</TableHead>
                  <TableHead className="font-bold text-center w-1/4">{isArabic ? "المستخدم / المشرف" : "User / Admin"}</TableHead>
                  <TableHead className="font-bold text-center w-1/2">{isArabic ? "الإجراء" : "Action"}</TableHead>
                  <TableHead className="font-bold text-center">{isArabic ? "الحالة" : "Status"}</TableHead>
                  <TableHead className="font-bold text-center">{isArabic ? "التوقيت" : "Time"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-bold text-start whitespace-normal">{isArabic ? item.userName : (item.userNameEn || item.userName)}</TableCell>
                    <TableCell className="text-start text-xs whitespace-normal">{isArabic ? item.actionAr : item.actionEn}</TableCell>
                    <TableCell className="text-start">
                      <Badge variant="outline" className="font-bold">
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-start text-xs text-muted-foreground whitespace-nowrap">{item.createdAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DialogBody>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLogsDialogOpen(false)}>
              {isArabic ? "إغلاق" : "Close"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
