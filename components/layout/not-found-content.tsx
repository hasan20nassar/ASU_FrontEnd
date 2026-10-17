"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { useLanguage } from "@/contexts/language-context";

export function NotFoundContent() {
  const { language, dir } = useLanguage();
  return <NotFoundContentInner key={language} language={language} dir={dir} />;
}

function NotFoundContentInner({
  language,
  dir,
}: {
  language: string;
  dir: "rtl" | "ltr";
}) {
  const [step, setStep] = useState(0);
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [text3, setText3] = useState("");

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (step === 0) {
      const target = language === "ar" ? "خطأ 404" : "Error 404";
      let index = 0;
      const type = () => {
        if (index <= target.length) {
          setText1(target.slice(0, index));
          index++;
          timer = setTimeout(type, 60);
        } else {
          timer = setTimeout(() => setStep(1), 250);
        }
      };
      type();
    } else if (step === 1) {
      const target =
        language === "ar"
          ? "يبدو أن خطأ ما قد حدث."
          : "It looks like something went wrong.";
      let index = 0;
      const type = () => {
        if (index <= target.length) {
          setText2(target.slice(0, index));
          index++;
          timer = setTimeout(type, 45);
        } else {
          timer = setTimeout(() => setStep(2), 250);
        }
      };
      type();
    } else if (step === 2) {
      const target =
        language === "ar"
          ? "لا تقلق، فريقنا يعمل على حل المشكلة بالفعل. يرجى محاولة إعادة تحميل الصفحة أو العودة لاحقاً."
          : "Don't worry, our team is already on it. Please try refreshing the page or come back later.";
      let index = 0;
      const type = () => {
        if (index <= target.length) {
          setText3(target.slice(0, index));
          index++;
          timer = setTimeout(type, 25);
        } else {
          timer = setTimeout(() => setStep(3), 200);
        }
      };
      type();
    }

    return () => clearTimeout(timer);
  }, [step, language]);

  const isDone = step === 3;

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-16 px-4 text-center md:py-24">
      {/* Background glow effects for premium look */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="h-[300px] w-[300px] rounded-full bg-primary/5 dark:bg-primary/10 blur-[100px] animate-pulse" />
      </div>

      {/* Waving Flag Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative mb-6"
      >
        <motion.div
          animate={{
            rotate: [0, 8, -6, 6, -4, 0],
            skewX: [0, 3, -3, 2, -2, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-muted shadow-inner text-foreground dark:bg-muted/30"
        >
          <Flag className="h-10 w-10 fill-current" />
        </motion.div>
      </motion.div>

      {/* Error Info / Typewriter Sequence */}
      <div
        className="flex flex-col items-center justify-center max-w-2xl select-text"
        dir={dir}
      >
        {/* Step 0: Error 404 */}
        <h2 className="min-h-[2rem] text-2xl font-bold tracking-wide text-foreground/80 md:text-3xl">
          {text1}
          {step === 0 && (
            <span className="typewriter-cursor inline-block w-[3px] h-[0.9em] bg-primary align-middle ml-1" />
          )}
        </h2>

        {/* Step 1: Main message */}
        <h1 className="mt-2 min-h-[3rem] text-3xl font-extrabold text-foreground sm:text-4xl md:text-5xl">
          {text2}
          {step === 1 && (
            <span className="typewriter-cursor inline-block w-[3px] h-[0.9em] bg-primary align-middle ml-1" />
          )}
        </h1>

        {/* Step 2: Description */}
        <p className="mt-4 min-h-[3rem] text-base leading-relaxed text-muted-foreground sm:text-lg max-w-xl">
          {text3}
          {step === 2 && (
            <span className="typewriter-cursor inline-block w-[3px] h-[0.9em] bg-primary align-middle ml-1" />
          )}
        </p>
      </div>

      {/* Step 3: Fade in Home Button */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: isDone ? 1 : 0, y: isDone ? 0 : 15 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mt-10"
      >
        <Magnetic>
          <Link href="/">
            <Button
              className="rounded-lg bg-foreground text-background hover:bg-foreground/90 font-bold px-8 py-6 text-sm transition-all shadow-md hover:shadow-lg uppercase tracking-wider dark:bg-foreground dark:text-background"
              disabled={!isDone}
            >
              {language === "ar" ? "العودة للرئيسية" : "BACK HOME"}
            </Button>
          </Link>
        </Magnetic>
      </motion.div>

      {/* Caret Blinking CSS animation */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes typewriter-blink {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .typewriter-cursor {
          animation: typewriter-blink 0.8s step-end infinite;
        }
      `,
        }}
      />
    </div>
  );
}
