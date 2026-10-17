"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Book, BookOpen, Bookmark, Library, GraduationCap, PenTool, Globe, Lightbulb } from "lucide-react";

const icons = [
  { Icon: Book, size: 40, color: "text-blue-500/20" },
  { Icon: BookOpen, size: 56, color: "text-primary/20" },
  { Icon: Bookmark, size: 32, color: "text-amber-500/20" },
  { Icon: Library, size: 48, color: "text-emerald-500/20" },
  { Icon: GraduationCap, size: 50, color: "text-purple-500/20" },
  { Icon: PenTool, size: 36, color: "text-orange-500/20" },
  { Icon: Globe, size: 44, color: "text-cyan-500/20" },
  { Icon: Lightbulb, size: 38, color: "text-yellow-500/20" },
];

export function KnowledgeAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();

  // Gentle scroll-based parallax
  const yOffset = useTransform(scrollY, [0, 500], [0, -100]);
  const springYOffset = useSpring(yOffset, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Generate stable random points for the light orbs
  const [orbPoints] = React.useState(() => {
    return [...Array(3)].map(() => ({
      x: [
        `${Math.random() * 100}%`,
        `${Math.random() * 100}%`,
        `${Math.random() * 100}%`,
      ],
      y: [
        `${Math.random() * 100}%`,
        `${Math.random() * 100}%`,
        `${Math.random() * 100}%`,
      ],
    }));
  });

  // Use a stable config for floating icons
  const [floatingIconsConfig] = React.useState(() => {
    return [...Array(15)].map((_, i) => ({
      initialX: (i * 7 + 10) % 90,
      initialY: (i * 13 + 15) % 80,
      depth: (i % 3) + 1,
    }));
  });

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
      style={{ perspective: "1000px" }}
    >
      {/* Background radial gradient that follows mouse */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        animate={{
          background: `radial-gradient(circle at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%, var(--primary) 0%, transparent 70%)`
        }}
        transition={{ type: "tween", ease: "linear", duration: 0.1 }}
      />

      {/* Parallax Container for Icons */}
      <motion.div 
        className="absolute inset-0"
        style={{ y: springYOffset }}
      >
        {/* Floating Elements */}
        {floatingIconsConfig.map((config, i) => {
          const iconData = icons[i % icons.length];
          const Icon = iconData.Icon;
          const { initialX, initialY, depth } = config;

          return (
            <motion.div
              key={i}
              className={`absolute ${iconData.color} blur-[0.5px]`}
              style={{
                left: `${initialX}%`,
                top: `${initialY}%`,
                z: depth * 50,
              }}
              animate={{
                x: mousePosition.x * 30 * depth,
                y: mousePosition.y * 30 * depth,
                rotateX: mousePosition.y * 20,
                rotateY: mousePosition.x * 20,
              }}
              transition={{
                type: "spring",
                stiffness: 70 / depth,
                damping: 20 * depth,
              }}
            >
              <motion.div
                animate={{
                  y: [0, 20, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2
                }}
              >
                <Icon size={iconData.size + depth * 5} strokeWidth={1.5} />
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Animated Light Orbs */}
      {orbPoints.map((orb, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute w-64 h-64 rounded-full bg-primary/5 blur-3xl"
          animate={{
            x: orb.x,
            y: orb.y,
          }}
          transition={{
            duration: 15 + i * 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}
