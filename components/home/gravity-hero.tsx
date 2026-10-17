"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/language-context";
import { ChevronsDown } from "lucide-react";

export function GravityHero() {
  const { language, t } = useLanguage();

  return (
    <section
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          src="/videos/home-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          poster="/hero-bg.png"
          className="h-full w-full object-cover opacity-60 transition-opacity duration-1000"
        />
        <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px]" />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/70" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 flex flex-col items-center text-center">
        {/* Title */}
        <motion.h1
          className="text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          {language === "ar" ? "جامعة أنطاكية السورية" : "Antioch Syrian University"}
        </motion.h1>

        {/* Description */}
        <motion.p
          className="mt-6 max-w-2xl text-pretty text-lg font-medium text-foreground/80 sm:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {t("hero.description")}
        </motion.p>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center"
        >
          <ChevronsDown className="h-8 w-8 text-foreground/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
