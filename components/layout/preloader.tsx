"use client";

import React, { useState, useEffect, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/contexts/language-context";
import { useTheme } from "@/contexts/theme-context";

// Safe layout effect to prevent SSR warnings
const useSafeLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const phrases = {
  ar: [
    "جاري تحميل بوابة الجامعة ...",
    "تهيئة البيانات والمساقات الأكاديمية...",
    "الاتصال بقواعد بيانات الطلاب والامتحانات...",
    "تحميل الموارد الرقمية والمكتبة المركزية...",
    "مرحباً بك في مستقبلك الأكاديمي...",
    "جامعة أنطاكية السورية - تميز، ريادة، بناء...",
  ],
  en: [
    "Loading ASU University Portal...",
    "Initializing academic courses & data...",
    "Connecting to students & exam database...",
    "Loading digital library resources...",
    "Welcome to your academic future...",
    "Antioch Syrian University - Excellence, Leadership, Development...",
  ],
};

export function Preloader() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldTrack, setShouldTrack] = useState(false);

  // Typewriter states
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const currentPhrases = phrases[language] || phrases.ar;

  // 1. Initial check (runs before paint on client)
  useSafeLayoutEffect(() => {
    if (typeof window !== "undefined") {
      const fontsReady = document.fonts
        ? document.fonts.status === "loaded"
        : true;
      const images = Array.from(document.querySelectorAll("img"));
      const allImagesDone =
        images.length === 0 || images.every((img) => img.complete);
      const videos = Array.from(document.querySelectorAll("video"));
      const allVideosDone =
        videos.length === 0 || videos.every((vid) => vid.readyState >= 4);

      const needsLoading = !(fontsReady && allImagesDone && allVideosDone);

      if (!needsLoading) {
        // Everything is already loaded/cached, skip preloader completely
        setIsLoaded(true);
      } else {
        // Needs loading, initialize asset tracking
        setShouldTrack(true);
      }
    }
  }, []);

  // Typewriter effect logic (only runs if we are not loaded yet)
  useEffect(() => {
    if (isLoaded) return;

    let timer: NodeJS.Timeout;
    const currentPhrase = currentPhrases[currentPhraseIndex];

    // Smooth timing configuration
    const typingSpeed = isDeleting ? 25 : 55;
    const pauseBeforeDelete = 1800; // time to read the message
    const pauseBeforeNext = 300; // time between phrases

    const handleType = () => {
      if (!isDeleting) {
        // Typing phase
        const nextText = currentPhrase.substring(0, currentText.length + 1);
        setCurrentText(nextText);

        if (nextText === currentPhrase) {
          timer = setTimeout(() => setIsDeleting(true), pauseBeforeDelete);
        } else {
          timer = setTimeout(handleType, typingSpeed);
        }
      } else {
        // Deleting phase
        const nextText = currentPhrase.substring(0, currentText.length - 1);
        setCurrentText(nextText);

        if (nextText === "") {
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % currentPhrases.length);
          timer = setTimeout(handleType, pauseBeforeNext);
        } else {
          timer = setTimeout(handleType, typingSpeed);
        }
      }
    };

    timer = setTimeout(handleType, typingSpeed);

    return () => clearTimeout(timer);
  }, [
    currentText,
    isDeleting,
    currentPhraseIndex,
    language,
    currentPhrases,
    isLoaded,
  ]);

  // Asset loading logic (only runs if shouldTrack is true and not loaded)
  useEffect(() => {
    if (!shouldTrack || isLoaded) return;

    let isMounted = true;
    let assetsLoaded = false;
    let timeElapsed = false;
    let completeTimeout: NodeJS.Timeout;

    // Lock scrolling on body while preloader is active
    document.body.style.overflow = "hidden";

    const completeLoading = () => {
      completeTimeout = setTimeout(() => {
        if (isMounted) {
          setIsLoaded(true);
          document.body.style.overflow = "";
        }
      }, 700);
    };

    // Minimum screen duration to showcase beautiful typewriter messages
    const minTimeTimer = setTimeout(() => {
      timeElapsed = true;
      if (assetsLoaded) {
        completeLoading();
      }
    }, 2800);

    // Track document assets
    const checkAssets = () => {
      const images = Array.from(document.querySelectorAll("img"));
      const videos = Array.from(document.querySelectorAll("video"));
      const totalAssets = images.length + videos.length;
      let loadedCount = 0;
      let fontsLoaded = !document.fonts; // true if no fonts object

      const checkAllDone = () => {
        if (fontsLoaded && loadedCount >= totalAssets) {
          assetsLoaded = true;
          if (timeElapsed) {
            completeLoading();
          }
        }
      };

      const onAssetLoaded = () => {
        loadedCount++;
        checkAllDone();
      };

      // Async fonts check (does not block registration of image/video observers)
      if (document.fonts) {
        document.fonts.ready
          .then(() => {
            if (isMounted) {
              fontsLoaded = true;
              checkAllDone();
            }
          })
          .catch((e) => {
            console.warn("Preloader: Fonts ready detection failed, skipping...", e);
            if (isMounted) {
              fontsLoaded = true;
              checkAllDone();
            }
          });
      }

      if (totalAssets === 0) {
        checkAllDone();
      }

      // Register loading event listeners
      images.forEach((img) => {
        if (img.complete) {
          onAssetLoaded();
        } else {
          img.addEventListener("load", onAssetLoaded);
          img.addEventListener("error", onAssetLoaded); // Count errors to prevent freezing
        }
      });

      videos.forEach((vid) => {
        if (vid.readyState >= 4) {
          onAssetLoaded();
        } else {
          vid.addEventListener("canplaythrough", onAssetLoaded);
          vid.addEventListener("error", onAssetLoaded); // Count errors to prevent freezing
        }
      });

      // Observer to watch for dynamically added assets during hydration
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLImageElement) {
              if (node.complete) {
                onAssetLoaded();
              } else {
                node.addEventListener("load", onAssetLoaded);
                node.addEventListener("error", onAssetLoaded);
              }
            } else if (node instanceof HTMLVideoElement) {
              if (node.readyState >= 4) {
                onAssetLoaded();
              } else {
                node.addEventListener("canplaythrough", onAssetLoaded);
                node.addEventListener("error", onAssetLoaded);
              }
            }
          });
        });
      });

      observer.observe(document.body, { childList: true, subtree: true });

      return () => {
        observer.disconnect();
        images.forEach((img) => {
          img.removeEventListener("load", onAssetLoaded);
          img.removeEventListener("error", onAssetLoaded);
        });
        videos.forEach((vid) => {
          vid.removeEventListener("canplaythrough", onAssetLoaded);
          vid.removeEventListener("error", onAssetLoaded);
        });
      };
    };

    const cleanupAssets = checkAssets();

    // Safety boundary timeout (e.g. 7.5 seconds)
    const safetyTimeout = setTimeout(() => {
      assetsLoaded = true;
      timeElapsed = true;
      completeLoading();
    }, 7500);

    return () => {
      isMounted = false;
      clearTimeout(minTimeTimer);
      clearTimeout(safetyTimeout);
      if (completeTimeout) clearTimeout(completeTimeout);
      document.body.style.overflow = "";
      cleanupAssets();
    };
  }, [shouldTrack, isLoaded]);

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: -20,
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
          }}
          className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center select-none overflow-hidden transition-colors duration-500 ${
            isDark ? "bg-[#0d090a]" : "bg-[#fbfcfd]"
          }`}
          dir={language === "ar" ? "rtl" : "ltr"}
        >
          {/* Custom style for typewriter cursor blink */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
            @keyframes cursorBlink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0; }
            }
            .cursor-blinking {
              animation: cursorBlink 0.9s infinite;
            }
          `,
            }}
          />

          {/* Premium Glowing Ambient Orbs */}
          <div
            className={`absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full blur-[130px] pointer-events-none transition-colors duration-500 ${
              isDark ? "bg-red-950/20" : "bg-red-500/5"
            }`}
          />
          <div
            className={`absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full blur-[130px] pointer-events-none transition-colors duration-500 ${
              isDark ? "bg-amber-950/15" : "bg-amber-500/5"
            }`}
          />

          {/* Core Content Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="z-10 flex flex-col items-center max-w-lg px-6 text-center"
          >
            {/* Logo Container */}
            <div className="mb-8 group">
              <Image
                src={
                  isDark
                    ? language === "ar"
                      ? "/logo/logo-ar-dark.png"
                      : "/logo/logo-en-dark.png"
                    : language === "ar"
                      ? "/logo/logo-ar-light.png"
                      : "/logo/logo-en-light.png"
                }
                alt="Antioch Syrian University Logo"
                width={300}
                height={96}
                priority
                className="h-20 md:h-24 w-auto object-contain relative z-10 transition-transform duration-500 hover:scale-105"
                style={{
                  filter: isDark
                    ? "drop-shadow(0 0 12px rgba(128, 0, 0, 0.2))"
                    : "drop-shadow(0 0 8px rgba(128, 0, 0, 0.05))",
                }}
              />
            </div>

            {/* Dynamic Typewriter Screen Area */}
            <div className="min-h-[4.5rem] flex items-center justify-center px-4">
              <p
                className={`text-base md:text-lg font-medium leading-relaxed font-serif transition-colors duration-500 ${
                  isDark ? "text-white/80" : "text-neutral-800"
                }`}
              >
                {currentText}
                <span
                  className={`inline-block w-[3px] h-5 ml-1.5 align-middle cursor-blinking ${
                    isDark ? "bg-red-500" : "bg-red-600"
                  }`}
                />
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
