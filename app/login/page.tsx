"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import { useTheme } from "@/contexts/theme-context";
import { useAuth, getUserRole, getRoleRedirectPath } from "@/contexts/auth-context";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Moon, Sun, Globe, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { MouseGravityIcons } from "@/components/ui/mouse-gravity-icons";
import { ASULogo } from "@/components/ui/asu-logo";

export default function LoginPage() {
  const { language, setLanguage, t, dir } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { login, user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      const userRole = getUserRole(user);
      router.push(getRoleRedirectPath(userRole));
    }
  }, [isAuthenticated, user, router]);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);

    try {
      await login(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12 overflow-hidden" dir={dir}>
      {/* Interactive Floating Icons and Background Pattern */}
      <MouseGravityIcons />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80000008_1px,transparent_1px),linear-gradient(to_bottom,#80000008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="absolute right-4 top-4 z-10 flex gap-2">
        <Button variant="ghost" size="icon" onClick={() => setLanguage(language === "ar" ? "en" : "ar")}>
          <Globe className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="shadow-2xl border-none backdrop-blur-md bg-card/90">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 flex justify-center">
              <Link href="/" title={language === "ar" ? "العودة للرئيسية" : "Back to Home"}>
                <ASULogo imageClassName="h-14 max-h-14 w-auto cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-all duration-200" priority />
              </Link>
            </div>
            <CardTitle className="text-2xl font-bold">
              {language === "ar" ? "تسجيل الدخول" : "Login"}
            </CardTitle>
            <CardDescription>
              {language === "ar"
                ? "جامعة أنطاكية السورية - بوابة الوصول"
                : "Antioch Syrian University - Access Portal"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("contact.form.email")}</Label>
                <div className="relative">
                  <Mail className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@asu.edu.sy"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="ps-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">
                    {language === "ar" ? "كلمة المرور" : "Password"}
                  </Label>
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="ps-10"
                  />
                </div>
              </div>
              <Button className="w-full font-bold" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  language === "ar" ? "دخول" : "Login"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}