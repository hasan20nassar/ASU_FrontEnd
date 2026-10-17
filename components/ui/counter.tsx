"use client";

import React, { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

interface CounterProps {
  value: number;
  duration?: number; // duration in seconds
  formatter?: (val: number) => string;
}

export function Counter({ value, duration = 1.5, formatter = (val) => val.toLocaleString() }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    if (start === end) return;

    const totalMiliseconds = duration * 1000;
    const frameRate = 1000 / 60; // 60fps
    const totalFrames = Math.round(totalMiliseconds / frameRate);
    let currentFrame = 0;

    const counter = setInterval(() => {
      currentFrame++;
      const progress = currentFrame / totalFrames;
      // Ease out quad: f(t) = t(2-t)
      const easeProgress = progress * (2 - progress);
      const nextCount = Math.round(easeProgress * end);
      
      setCount(nextCount);

      if (currentFrame >= totalFrames) {
        setCount(end);
        clearInterval(counter);
      }
    }, frameRate);

    return () => clearInterval(counter);
  }, [value, duration, isInView]);

  return <span ref={ref}>{formatter(count)}</span>;
}
