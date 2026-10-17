"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogBody,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RotateCw, ShieldAlert, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/language-context";

function generateRandomText(length = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

interface CaptchaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  isPending?: boolean;
}

export function CaptchaModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  isPending = false,
}: CaptchaModalProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const [captchaText, setCaptchaText] = useState(() => generateRandomText());
  const [userCaptcha, setUserCaptcha] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const drawCaptcha = useCallback((text: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#f9fafb");
    gradient.addColorStop(1, "#f3f4f6");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = `rgba(${Math.floor(Math.random() * 150)}, ${Math.floor(Math.random() * 150)}, ${Math.floor(Math.random() * 150)}, 0.35)`;
      ctx.lineWidth = Math.random() * 2 + 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    for (let i = 0; i < 45; i++) {
      ctx.fillStyle = `rgba(${Math.floor(Math.random() * 150)}, ${Math.floor(Math.random() * 150)}, ${Math.floor(Math.random() * 150)}, 0.4)`;
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    const fonts = ["Arial", "Georgia", "Courier New", "Verdana", "Times New Roman"];
    ctx.textBaseline = "middle";

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const fontSize = Math.floor(Math.random() * 4) + 20;
      const font = fonts[Math.floor(Math.random() * fonts.length)];
      ctx.font = `bold ${fontSize}px ${font}`;
      ctx.fillStyle = `rgb(${Math.floor(Math.random() * 120)}, ${Math.floor(Math.random() * 120)}, ${Math.floor(Math.random() * 120)})`;

      const x = 10 + i * 20 + Math.random() * 3;
      const y = canvas.height / 2 + (Math.random() * 8 - 4);
      const angle = ((Math.random() * 30 - 15) * Math.PI) / 180;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }
  }, []);

  const refreshCaptcha = useCallback(() => {
    const text = generateRandomText();
    setCaptchaText(text);
    setUserCaptcha("");
  }, []);

  useEffect(() => {
    if (isOpen) {
      refreshCaptcha();
    }
  }, [isOpen, refreshCaptcha]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        drawCaptcha(captchaText);
      }, 50);
    }
  }, [isOpen, captchaText, drawCaptcha]);

  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userCaptcha.trim().toLowerCase() !== captchaText.toLowerCase()) {
      toast.error(
        isArabic
          ? "رمز التحقق غير صحيح. يرجى إعادة المحاولة."
          : "Incorrect verification code. Please try again."
      );
      refreshCaptcha();
      return;
    }
    await onConfirm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-destructive flex items-center gap-2">
            <ShieldAlert className="h-6 w-6" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleConfirmSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <DialogBody className="space-y-4">
            <div className="p-4 border rounded-xl bg-muted/20 space-y-3">
              <Label htmlFor="security-captcha" className="font-bold text-xs flex items-center justify-between">
                <span>{isArabic ? "رمز التحقق الأمني" : "Security Verification Code"}</span>
                <span className="text-[10px] text-muted-foreground">{isArabic ? "مطلوب للعمليات الحساسة" : "Required"}</span>
              </Label>

              <div className="flex items-center gap-3 dir-ltr">
                <div className="border rounded-lg bg-background p-1 shadow-sm shrink-0">
                  <canvas ref={canvasRef} width={140} height={42} className="block" />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 shrink-0"
                  onClick={refreshCaptcha}
                  title={isArabic ? "تحديث الرمز" : "Refresh"}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>

              <Input
                id="security-captcha"
                value={userCaptcha}
                onChange={(e) => setUserCaptcha(e.target.value)}
                placeholder={isArabic ? "أدخل الرمز الموضح في الصورة" : "Enter characters shown above"}
                required
                autoFocus
                className="text-center font-mono font-bold tracking-widest uppercase"
              />
            </div>
          </DialogBody>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              {isArabic ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isPending || !userCaptcha}
              className="font-bold gap-2"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              {confirmText || (isArabic ? "تأكيد الحذف الأمني" : "Confirm Delete")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
