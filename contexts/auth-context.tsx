"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthService, UserDetails, OpenAPI, Student, StudentsService, ApiError } from "@/lib/api";
import { useLanguage } from "@/contexts/language-context";

interface AuthContextType {
  user: UserDetails | null;
  studentProfile: Student | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: (reason?: { ar: string; en: string } | string) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function getUserRole(user: UserDetails | null): "admin" | "faculty" | "alumni" | "student" | "content_manager" {
  if (!user) return "student";
  if (user.role && ["admin", "faculty", "alumni", "student", "content_manager"].includes(user.role)) {
    return user.role as any;
  }
  if (user.is_staff || user.is_superuser || (user.email && user.email.includes("admin")) || (user.username && user.username.includes("admin"))) {
    return "admin";
  }
  return "student";
}

export function getRoleRedirectPath(role: string): string {
  switch (role) {
    case "admin":
      return "/dashboard";
    case "content_manager":
      return "/dashboard/news";
    case "faculty":
      return "/portal/faculty";
    case "alumni":
      return "/portal/alumni";
    case "student":
    default:
      return "/portal/student";
  }
}


export function AuthProvider({ children }: { children: React.ReactNode }) {

  const [user, setUser] = useState<UserDetails | null>(null);
  const [studentProfile, setStudentProfile] = useState<Student | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const { language } = useLanguage();

  const getBilingualText = React.useCallback(
    (ar: string, en: string) => (language === "ar" ? ar : en),
    [language]
  );

  // Configure token resolver for OpenAPI client
  useEffect(() => {
    OpenAPI.TOKEN = async () => {
      if (typeof window !== "undefined") {
        return localStorage.getItem("asu_access_token") || "";
      }
      return "";
    };
  }, []);

  const logout = React.useCallback(
    (reason?: { ar: string; en: string } | string) => {
      const hadSession = Boolean(
        localStorage.getItem("asu_access_token") || localStorage.getItem("asu_auth")
      );

      localStorage.removeItem("asu_access_token");
      localStorage.removeItem("asu_refresh_token");
      localStorage.removeItem("asu_auth");

      Promise.resolve().then(() => {
        setUser(null);
        setStudentProfile(null);
        setIsAuthenticated(false);
        setIsLoading(false);
      });

      const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
      const isProtectedRoute = currentPath.startsWith("/dashboard") || currentPath.startsWith("/portal");

      if (hadSession && reason && isProtectedRoute) {
        const text = typeof reason === "string" ? reason : getBilingualText(reason.ar, reason.en);
        toast.error(text);
      }

      if (isProtectedRoute) {
        router.push("/login");
      }
    },
    [router, getBilingualText]
  );

  const refreshUser = React.useCallback(async () => {
    const token = localStorage.getItem("asu_access_token");
    if (!token) {
      Promise.resolve().then(() => {
        setIsAuthenticated(false);
        setIsLoading(false);
      });
      return;
    }

    try {
      // Get current user details
      const userDetails = await AuthService.authUserRetrieve();
      Promise.resolve().then(() => {
        setUser(userDetails);
        setIsAuthenticated(true);
      });

      // Fetch student profile in background asynchronously without blocking auth state
      if (userDetails.email) {
        StudentsService.studentsList(userDetails.email)
          .then((studentList) => {
            if (studentList && studentList.length > 0) {
              setStudentProfile(studentList[0]);
            }
          })
          .catch((err) => {
            console.error("Failed to load student profile:", err);
          });
      }
    } catch (error) {
      console.error("Session verification failed:", error);
      localStorage.removeItem("asu_access_token");
      localStorage.removeItem("asu_refresh_token");
      localStorage.removeItem("asu_auth");

      const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
      const isProtectedRoute = currentPath.startsWith("/dashboard") || currentPath.startsWith("/portal");

      if (isProtectedRoute) {
        logout({
          ar: "انتهت صلاحية الجلسة أو بيانات الدخول غير صالحة. تم تسجيل الخروج تلقائياً.",
          en: "Session expired or invalid login credentials. You have been logged out automatically.",
        });
      } else {
        Promise.resolve().then(() => {
          setUser(null);
          setStudentProfile(null);
          setIsAuthenticated(false);
        });
      }
    } finally {
      Promise.resolve().then(() => {
        setIsLoading(false);
      });
    }
  }, [logout]);


  useEffect(() => {
    Promise.resolve().then(() => {
      refreshUser();
    });

    const handleUnauthorized = () => {
      logout({
        ar: "انتهت صلاحية الجلسة أو بيانات الدخول غير صالحة. تم تسجيل الخروج تلقائياً.",
        en: "Session expired or invalid login credentials. You have been logged out automatically.",
      });
    };

    const handleWindowFocus = () => {
      const token = localStorage.getItem("asu_access_token");
      if (token) {
        refreshUser();
      }
    };

    window.addEventListener("asu:unauthorized", handleUnauthorized);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      window.removeEventListener("asu:unauthorized", handleUnauthorized);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [refreshUser, logout]);

  const login = async (email: string, password: string) => {

    setIsLoading(true);
    try {
      const response = await AuthService.authLoginCreate({
        username: email,
        email: email,
        password: password,
      });

      if (response.access) {
        localStorage.setItem("asu_access_token", response.access);
        if (response.refresh) {
          localStorage.setItem("asu_refresh_token", response.refresh);
        }
        localStorage.setItem("asu_auth", "true");

        // Fetch user details immediately after login
        const userDetails = await AuthService.authUserRetrieve();
        setUser(userDetails);
        setIsAuthenticated(true);

        const userRole = getUserRole(userDetails);
        const redirectPath = getRoleRedirectPath(userRole);

        setIsLoading(false);

        toast.success(
          getBilingualText("تم تسجيل الدخول بنجاح", "Logged in successfully")
        );

        router.push(redirectPath);
      } else {
        throw new Error("Missing access token");
      }
    } catch (error: any) {
      let message = getBilingualText(
        "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        "Invalid email or password"
      );

      if (error instanceof ApiError && error.body) {
        const body = error.body;
        const errList = body.non_field_errors || body.nonFieldErrors;
        if (errList && Array.isArray(errList) && errList.length > 0) {
          const raw = String(errList[0]);
          if (
            raw.toLowerCase().includes("unable to log in") ||
            raw.toLowerCase().includes("credentials") ||
            raw.toLowerCase().includes("invalid")
          ) {
            message = getBilingualText(
              "البريد الإلكتروني أو كلمة المرور غير صحيحة",
              "Invalid email or password"
            );
          } else {
            message = raw;
          }
        } else if (body.detail) {
          const raw = String(body.detail);
          if (
            raw.toLowerCase().includes("credentials") ||
            raw.toLowerCase().includes("no active account") ||
            raw.toLowerCase().includes("invalid")
          ) {
            message = getBilingualText(
              "البريد الإلكتروني أو كلمة المرور غير صحيحة",
              "Invalid email or password"
            );
          } else {
            message = raw;
          }
        }
      }

      toast.error(message);
      setIsLoading(false);
    }
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        studentProfile,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
