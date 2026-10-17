"use client";

import React, { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/language-context";
import { useFaculties } from "@/hooks/use-faculties";
import { useFacultyMembers } from "@/hooks/use-faculty-members";
import { FacultyMember } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, X, Mail, Clock, MapPin, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function FacultyDirectory() {
  const { language, t, dir } = useLanguage();
  const isArabic = language === "ar";

  const { data: backendFaculties } = useFaculties();
  const displayFaculties = backendFaculties || [];

  const { data: backendMembers } = useFacultyMembers();
  const displayMembers = backendMembers || [];

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState<string>("all");

  const filteredMembers = useMemo(() => {
    return displayMembers.filter((prof) => {
      // Search matching
      const matchesSearch =
        searchQuery === "" ||
        prof.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prof.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prof.departmentAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prof.departmentEn.toLowerCase().includes(searchQuery.toLowerCase());

      // Faculty matching
      const matchesFaculty = selectedFaculty === "all" || prof.facultySlug === selectedFaculty;

      return matchesSearch && matchesFaculty;
    });
  }, [displayMembers, searchQuery, selectedFaculty]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedFaculty("all");
  };

  const getFacultyName = (prof: FacultyMember) => {
    if (prof.facultySlug) {
      const faculty = displayFaculties.find((f) => f.slug === prof.facultySlug);
      if (faculty) return isArabic ? faculty.nameAr : faculty.nameEn;
    }
    if (prof.faculty) {
      const faculty = displayFaculties.find((f) => f.id === prof.faculty);
      if (faculty) return isArabic ? faculty.nameAr : faculty.nameEn;
    }
    return isArabic ? "جامعة أنطاكية السورية" : "Antioch Syrian University";
  };


  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-8">
      {/* Filters Form */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="search-faculty">
              {isArabic ? "بحث بالاسم أو القسم" : "Search by name or department"}
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="search-faculty"
                placeholder={isArabic ? "مثال: د. أحمد..." : "e.g. Dr. Ahmed..."}
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                dir={dir}
              />
            </div>
          </div>

          <div className="space-y-2 lg:col-span-1">
            <Label htmlFor="faculty-filter">{isArabic ? "تصفية حسب الكلية" : "Filter by Faculty"}</Label>
            <Select value={selectedFaculty} onValueChange={setSelectedFaculty} dir={dir}>
              <SelectTrigger id="faculty-filter">
                <SelectValue placeholder={isArabic ? "جميع الكليات" : "All Faculties"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isArabic ? "جميع الكليات" : "All Faculties"}</SelectItem>
                {displayFaculties.map((f) => (
                  <SelectItem key={f.slug} value={f.slug}>
                    {isArabic ? f.nameAr : f.nameEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end lg:col-span-1">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={clearFilters}
              disabled={searchQuery === "" && selectedFaculty === "all"}
            >
              <X className="mr-2 h-4 w-4" />
              {isArabic ? "مسح البحث" : "Clear Filter"}
            </Button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div>
        <div className="mb-4 text-sm text-muted-foreground">
          {isArabic ? "النتائج:" : "Results:"} <strong className="text-foreground">{filteredMembers.length}</strong> {isArabic ? "عضو هيئة تدريس" : "faculty member(s)"}
        </div>

        {filteredMembers.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
            <Search className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <h3 className="text-lg font-bold">{isArabic ? "لم يتم العثور على أستاذ" : "No faculty found"}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {isArabic ? "جرب البحث باسم آخر" : "Try searching using another name"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6">
            {filteredMembers.map((prof) => (
              <Card key={prof.id} className="flex flex-col overflow-hidden transition-all hover:border-primary/50 hover:shadow-md">
                <CardHeader className="flex flex-col items-center p-6 text-center border-b bg-muted/10 space-y-4">
                  <Avatar className="h-24 w-24 border-4 border-background shadow-sm">
                    {prof.image && <AvatarImage src={prof.image} alt={isArabic ? prof.nameAr : prof.nameEn} />}
                    <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
                      {getInitials(prof.nameEn)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="font-bold tracking-tight text-lg text-foreground">
                      {isArabic ? prof.nameAr : prof.nameEn}
                    </h3>
                    <p className="text-sm font-medium text-primary">
                      {isArabic ? prof.titleAr : prof.titleEn}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col p-5 gap-4">
                  <div className="space-y-3 flex-1 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2.5">
                      <Building2 className="mt-0.5 h-4 w-4 text-foreground/50 shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">{getFacultyName(prof)}</p>
                        <p className="text-xs">{isArabic ? prof.departmentAr : prof.departmentEn}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2.5">
                      <Clock className="h-4 w-4 text-foreground/50 shrink-0" />
                      <span className="text-xs">{prof.officeHours}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link 
                      href={`/about/directory/${prof.id}`}
                      className="flex-1 flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-2.5 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      {isArabic ? "الملف الشخصي" : "View Profile"}
                    </Link>
                    <a 
                      href={`mailto:${prof.email}`}
                      className="flex items-center justify-center gap-2 rounded-md bg-primary/10 px-3 py-2.5 text-xs font-bold text-primary transition-colors hover:bg-primary/20"
                      title={isArabic ? "مراسلة البريد" : "Send Email"}
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
