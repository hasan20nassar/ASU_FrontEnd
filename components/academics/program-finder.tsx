"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import { useFaculties } from "@/hooks/use-faculties";
import { Program } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, BookOpen, GraduationCap, X, Building2 } from "lucide-react";

export function ProgramFinder() {
  const { language, t, dir } = useLanguage();
  const isArabic = language === "ar";

  const { data: backendFaculties } = useFaculties();
  const displayFaculties = backendFaculties || [];

  const allPrograms = useMemo(() => {
    const list: Program[] = [];
    displayFaculties.forEach((f) => {
      if (f.programs) {
        f.programs.forEach((p) => {
          list.push(p);
        });
      }
    });
    return list;
  }, [displayFaculties]);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState<string>("all");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [selectedDegree, setSelectedDegree] = useState<string>("all");

  const filteredPrograms = useMemo(() => {
    return allPrograms.filter((program) => {
      // Search matching
      const matchesSearch =
        searchQuery === "" ||
        program.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.descriptionAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.descriptionEn.toLowerCase().includes(searchQuery.toLowerCase());

      // Faculty matching
      const matchesFaculty = selectedFaculty === "all" || program.facultySlug === selectedFaculty;

      // Branch matching
      const matchesBranch = selectedBranch === "all" || program.branch === selectedBranch || program.branch === "both";

      // Degree matching
      const isMaster = program.nameEn.toLowerCase().includes("master") || program.nameAr.includes("ماجستير");
      const programDegree = isMaster ? "master" : "bachelor";
      const matchesDegree = selectedDegree === "all" || programDegree === selectedDegree;

      return matchesSearch && matchesFaculty && matchesBranch && matchesDegree;
    });
  }, [allPrograms, searchQuery, selectedFaculty, selectedBranch, selectedDegree]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedFaculty("all");
    setSelectedBranch("all");
    setSelectedDegree("all");
  };

  const hasActiveFilters = searchQuery !== "" || selectedFaculty !== "all" || selectedBranch !== "all" || selectedDegree !== "all";

  // Helpers
  const formatBranch = (branch: string) => {
    if (branch === "scientific") return isArabic ? "علمي" : "Scientific";
    if (branch === "literary") return isArabic ? "أدبي" : "Literary";
    return isArabic ? "علمي أو أدبي" : "Scientific or Literary";
  };

  const getFacultyName = (slug: string) => {
    const faculty = displayFaculties.find((f) => f.slug === slug);
    if (!faculty) return "";
    return isArabic ? faculty.nameAr : faculty.nameEn;
  };

  return (
    <div className="flex flex-col gap-8 md:flex-row">
      {/* Sidebar Filters */}
      <aside className="w-full shrink-0 md:w-64 lg:w-72 space-y-6">
        <div className="sticky top-24 space-y-6">
          <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{t("programs.filter")}</h3>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2 text-muted-foreground hover:text-foreground">
                  <X className="mr-1 h-3 w-3" />
                  {t("programs.clear")}
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="search-programs">{t("programs.searchLabel")}</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="search-programs"
                  placeholder={t("programs.searchPlaceholder")}
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  dir={dir}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="faculty-select">{t("programs.facultyLabel")}</Label>
              <Select value={selectedFaculty} onValueChange={setSelectedFaculty} dir={dir}>
                <SelectTrigger id="faculty-select">
                  <SelectValue placeholder={t("programs.allFaculties")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("programs.allFaculties")}</SelectItem>
                  {displayFaculties.map((f) => (
                    <SelectItem key={f.slug} value={f.slug}>
                      {isArabic ? f.nameAr : f.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch-select">{t("programs.branchLabel")}</Label>
              <Select value={selectedBranch} onValueChange={setSelectedBranch} dir={dir}>
                <SelectTrigger id="branch-select">
                  <SelectValue placeholder={t("programs.allBranches")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("programs.allBranches")}</SelectItem>
                  <SelectItem value="scientific">{isArabic ? "علمي" : "Scientific"}</SelectItem>
                  <SelectItem value="literary">{isArabic ? "أدبي" : "Literary"}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="degree-select">{isArabic ? "الدرجة العلمية" : "Degree Type"}</Label>
              <Select value={selectedDegree} onValueChange={setSelectedDegree} dir={dir}>
                <SelectTrigger id="degree-select">
                  <SelectValue placeholder={isArabic ? "جميع الدرجات" : "All Degrees"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isArabic ? "جميع الدرجات" : "All Degrees"}</SelectItem>
                  <SelectItem value="bachelor">{isArabic ? "بكالوريوس (إجازة)" : "Bachelor's Degree"}</SelectItem>
                  <SelectItem value="master">{isArabic ? "ماجستير" : "Master's Degree"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </aside>

      {/* Results List */}
      <section className="flex-1">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {t("programs.found")} <strong className="text-foreground font-medium">{filteredPrograms.length}</strong> {t("programs.programFound")}
          </p>
        </div>

        {filteredPrograms.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
            <Search className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-lg font-bold">{t("programs.noPrograms")}</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              {t("programs.noProgramsDesc")}
            </p>
            <Button variant="outline" className="mt-6" onClick={clearFilters}>
              {t("programs.clearAll")}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {filteredPrograms.map((program) => (
              <Card key={program.id} className="flex flex-col overflow-hidden transition-all hover:border-primary/50 hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <Link href={`/academics/${program.facultySlug}`} className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {getFacultyName(program.facultySlug)}
                      </Link>
                      <CardTitle className="leading-tight">
                        <Link href={`/academics/${program.facultySlug}/${program.slug}`} className="hover:text-primary transition-colors">
                          {isArabic ? program.nameAr : program.nameEn}
                        </Link>
                      </CardTitle>
                    </div>
                    <Badge variant="secondary" className="shrink-0">{formatBranch(program.branch || "")}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 pb-4">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {isArabic ? program.descriptionAr : program.descriptionEn}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4 text-foreground/70" />
                      <span>{program.duration} {t("programs.years")}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4 text-foreground/70" />
                      <span>{program.creditHours} {t("common.creditHours")}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 border-t mt-auto px-6 py-4 flex justify-between items-center bg-muted/20">
                  <span className="text-xs font-medium">
                    {t("programs.minScore")}: {program.minScorePercent}%
                  </span>
                  <Button asChild size="sm" variant="outline" className="h-8">
                    <Link href={`/academics/${program.facultySlug}/${program.slug}`}>
                      {t("programs.details")}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
