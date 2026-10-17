"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/language-context";
import { History, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CampusEvolution() {
  const { language, dir } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  // Update slider position based on mouse/touch coordinates
  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove, { passive: true });
      window.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleTouchStart = () => {
    setIsDragging(true);
  };

  // Determine clip-path and positions based on direction (RTL/LTR)
  // LTR: Past on left, Present on right
  // RTL: Past on right, Present on left
  const clipPath =
    dir === "rtl"
      ? `inset(0 0 0 ${sliderPosition}%)`
      : `inset(0 ${100 - sliderPosition}% 0 0)`;

  // Toggle button actions
  const showPast = () => {
    setSliderPosition(dir === "rtl" ? 0 : 100);
  };

  const showPresent = () => {
    setSliderPosition(dir === "rtl" ? 100 : 0);
  };

  const showCompare = () => {
    setSliderPosition(50);
  };

  // Label Texts
  const leftLabel =
    language === "ar"
      ? dir === "rtl"
        ? "2026"
        : "2018"
      : dir === "rtl"
        ? "2026"
        : "2018";

  const rightLabel =
    language === "ar"
      ? dir === "rtl"
        ? "2018"
        : "2026"
      : dir === "rtl"
        ? "2018"
        : "2026";

  return (
    <div className="w-full space-y-6">
      {/* Interactive Slider Container */}
      <div
        ref={containerRef}
        className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl border border-border bg-muted overflow-hidden select-none cursor-ew-resize shadow-xl group"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Present Image (Base layer - Underlay) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <Image
            src="/images/map-history/now.png"
            alt="ASU Campus Present"
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover select-none"
            priority
            draggable={false}
          />
        </div>

        {/* Past Image (Clipped layer - Overlay) */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
          style={{
            clipPath: clipPath,
            transition: isDragging
              ? "none"
              : "clip-path 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <Image
            src="/images/map-history/old.png"
            alt="ASU Campus Past"
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover select-none"
            priority
            draggable={false}
          />
        </div>

        {/* Glassmorphic Labels overlay */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <span className="bg-background/80 text-foreground backdrop-blur-md px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold shadow-md border border-border/40 select-none">
            {leftLabel}
          </span>
        </div>

        <div className="absolute top-4 right-4 z-10 pointer-events-none">
          <span className="bg-background/80 text-foreground backdrop-blur-md px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold shadow-md border border-border/40 select-none">
            {rightLabel}
          </span>
        </div>

        {/* Vertical Divider Slider Line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
          style={{
            left: `${sliderPosition}%`,
            transition: isDragging
              ? "none"
              : "left 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* Slider Handle (Circle with arrows) */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-primary border-2 border-primary flex items-center justify-center shadow-lg transition-transform duration-200 z-30 ${
              isDragging
                ? "scale-110 ring-4 ring-primary/20"
                : "group-hover:scale-105"
            }`}
          >
            {/* Custom SVG horizontal double arrow */}
            <svg
              className="w-5 h-5 text-primary shrink-0 select-none pointer-events-none"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 16l-4-4m0 0l4-4m-4 4h18m-4 4l4-4m0 0l-4-4"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Control Buttons for Easy Interaction */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          variant={
            sliderPosition === (dir === "rtl" ? 0 : 100) ? "default" : "outline"
          }
          size="sm"
          onClick={showPast}
          className="flex items-center gap-2 rounded-xl"
        >
          <History className="w-4 h-4" />
          {language === "ar" ? "عرض قديماً" : "Show Past"}
        </Button>

        <Button
          variant={sliderPosition === 50 ? "default" : "outline"}
          size="sm"
          onClick={showCompare}
          className="flex items-center gap-2 rounded-xl"
        >
          <svg
            className="w-4 h-4 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 16l-4-4m0 0l4-4m-4 4h18m-4 4l4-4m0 0l-4-4"
            />
          </svg>
          {language === "ar" ? "مقارنة 50/50" : "Compare 50/50"}
        </Button>

        <Button
          variant={
            sliderPosition === (dir === "rtl" ? 100 : 0) ? "default" : "outline"
          }
          size="sm"
          onClick={showPresent}
          className="flex items-center gap-2 rounded-xl"
        >
          <Calendar className="w-4 h-4" />
          {language === "ar" ? "عرض الآن" : "Show Now"}
        </Button>
      </div>
    </div>
  );
}
