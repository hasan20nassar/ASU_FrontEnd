"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "@/contexts/language-context";
import { Loader2, Layers, Maximize2, Minimize2, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarkerPoint {
  lat: number;
  lng: number;
  nameAr: string;
  nameEn: string;
  descAr?: string;
  descEn?: string;
}

// Data extracted directly from ASU.kml file
const KML_POINTS: MarkerPoint[] = [
  {
    lat: 33.65791806613972,
    lng: 36.37497254446367,
    nameAr: "مبنى كلية الحقوق",
    nameEn: "Faculty of Law Building",
    descAr: "مبنى كلية الحقوق في الحرم الجامعي.",
    descEn: "Faculty of Law Building on the university campus."
  },
  {
    lat: 33.65739050328335,
    lng: 36.37526712368856,
    nameAr: "مبنى كلية طب الأسنان",
    nameEn: "Faculty of Dentistry Building",
    descAr: "مبنى كلية طب الأسنان ومختبراتها الطبية المتخصصة.",
    descEn: "Faculty of Dentistry Building and its specialized medical laboratories."
  },
  {
    lat: 33.65823439688824,
    lng: 36.37481761865426,
    nameAr: "مبنى كلية الصيدلة",
    nameEn: "Pharmacy College Building",
    descAr: "مبنى كلية الصيدلة والمختبرات الدوائية والعلمية.",
    descEn: "Pharmacy College Building and pharmaceutical/scientific laboratories."
  },
  {
    lat: 33.65872142897872,
    lng: 36.37441436685869,
    nameAr: "المبنى الرئيسي",
    nameEn: "The Main Building",
    descAr: "المبنى الرئيسي الذي يضم إدارة الجامعة ورئاستها وكلية الهندسة.",
    descEn: "The main building, which houses the university administration, presidency, and the College of Engineering."
  },
  {
    lat: 33.65879398807943,
    lng: 36.37522416020599,
    nameAr: "المرافق الرياضية",
    nameEn: "Sports Facilities",
    descAr: "الملاعب الرياضية والمساحات الخضراء والأنشطة الطلابية الخارجية.",
    descEn: "Sports fields, green spaces, and outdoor student activities."
  }
];

const ASU_CENTER = [33.6581, 36.3750] as [number, number];

interface CampusLeafletMapProps {
  showMarkers?: boolean;
  className?: string;
}

export function CampusLeafletMap({ showMarkers = true, className }: CampusLeafletMapProps = {}) {
  const { language, dir } = useLanguage();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);

  const [isLeafletLoaded, setIsLeafletLoaded] = useState(false);
  const [mapType, setMapType] = useState<"satellite" | "street">("satellite");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGestureOverlay, setShowGestureOverlay] = useState(false);
  const [gestureType, setGestureType] = useState<"scroll" | "touch">("scroll");

  // Load Leaflet assets
  useEffect(() => {
    if ((window as any).L) {
      setIsLeafletLoaded(true);
      return;
    }

    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    if (!document.getElementById("leaflet-js")) {
      const script = document.createElement("script");
      script.id = "leaflet-js";
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => {
        setIsLeafletLoaded(true);
      };
      document.head.appendChild(script);
    } else {
      const interval = setInterval(() => {
        if ((window as any).L) {
          setIsLeafletLoaded(true);
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = Boolean(document.fullscreenElement);
      setIsFullscreen(isCurrentlyFullscreen);
      if (mapInstanceRef.current) {
        setTimeout(() => {
          mapInstanceRef.current.invalidateSize();
        }, 200);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!isLeafletLoaded || !mapRef.current) return;

    const L = (window as any).L;

    // Initialize Map without default +/- zoom buttons
    const map = L.map(mapRef.current, {
      center: ASU_CENTER,
      zoom: 17,
      zoomControl: false,
      scrollWheelZoom: false,
      attributionControl: false,
      doubleClickZoom: true,
      touchZoom: true,
    });
    mapInstanceRef.current = map;

    // Initial tile layer based on mapType
    const tileUrl =
      mapType === "satellite"
        ? `https://mt1.google.com/vt/lyrs=y&hl=${language}&x={x}&y={y}&z={z}`
        : `https://mt1.google.com/vt/lyrs=m&hl=${language}&x={x}&y={y}&z={z}`;

    const tileLayer = L.tileLayer(tileUrl, { maxZoom: 20 }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Add points to the map
    if (showMarkers) {
      // Custom ASU Pin Icon
      const customIcon = L.divIcon({
        className: "custom-leaflet-marker",
        html: `
          <div style="
            background-color: #800020;
            width: 30px;
            height: 30px;
            border-radius: 50% 50% 50% 0;
            position: absolute;
            transform: rotate(-45deg);
            left: -15px;
            top: -30px;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              width: 10px;
              height: 10px;
              background-color: white;
              border-radius: 50%;
            "></div>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
      });

      KML_POINTS.forEach((point) => {
        const marker = L.marker([point.lat, point.lng], { icon: customIcon }).addTo(map);
        const title = language === "ar" ? point.nameAr : point.nameEn;
        const desc = language === "ar" ? point.descAr : point.descEn;

        const popupContent = `
          <div style="
            text-align: ${dir === "rtl" ? "right" : "left"};
            font-family: system-ui, -apple-system, sans-serif;
            min-width: 180px;
            padding: 2px;
          ">
            <h4 style="
              margin: 0 0 4px 0;
              font-size: 13px;
              font-weight: 700;
              color: #800020;
            ">
              ${title}
            </h4>
            ${desc ? `
              <p style="
                margin: 0;
                font-size: 11px;
                line-height: 1.4;
                color: #4b5563;
              ">
                ${desc}
              </p>
            ` : ""}
          </div>
        `;

        marker.bindPopup(popupContent);
      });
    }

    // Gesture Handling Logic
    const container = mapRef.current;
    let overlayTimeout: NodeJS.Timeout | null = null;
    let lastZoomTime = 0;

    // Desktop Wheel Zoom
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setShowGestureOverlay(false);
        if (overlayTimeout) clearTimeout(overlayTimeout);

        const now = Date.now();
        if (now - lastZoomTime > 120) {
          lastZoomTime = now;
          if (e.deltaY < 0) {
            map.zoomIn(1);
          } else if (e.deltaY > 0) {
            map.zoomOut(1);
          }
        }
      } else {
        setGestureType("scroll");
        setShowGestureOverlay(true);
        if (overlayTimeout) clearTimeout(overlayTimeout);
        overlayTimeout = setTimeout(() => {
          setShowGestureOverlay(false);
        }, 1500);
      }
    };

    // Mobile / Touch handling
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        // Single finger -> disable leaflet dragging so the page can scroll freely
        map.dragging.disable();
      } else if (e.touches.length >= 2) {
        // Two fingers -> enable dragging and zooming, hide overlay
        map.dragging.enable();
        map.touchZoom.enable();
        setShowGestureOverlay(false);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        // Show 2-finger gesture overlay
        setGestureType("touch");
        setShowGestureOverlay(true);
        if (overlayTimeout) clearTimeout(overlayTimeout);
        overlayTimeout = setTimeout(() => {
          setShowGestureOverlay(false);
        }, 1500);
      } else if (e.touches.length >= 2) {
        setShowGestureOverlay(false);
      }
    };

    const handleTouchEnd = () => {
      // Re-enable dragging for subsequent multi-touch/mouse gestures
      map.dragging.enable();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Control" || e.key === "Meta") {
        setShowGestureOverlay(false);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
      if (overlayTimeout) clearTimeout(overlayTimeout);
      map.remove();
      mapInstanceRef.current = null;
      tileLayerRef.current = null;
    };
  }, [isLeafletLoaded, language, dir, showMarkers]);

  // Handle Switching between Satellite and Street View
  const toggleMapType = useCallback(() => {
    const nextType = mapType === "satellite" ? "street" : "satellite";
    setMapType(nextType);

    if (mapInstanceRef.current && (window as any).L) {
      const L = (window as any).L;
      if (tileLayerRef.current) {
        mapInstanceRef.current.removeLayer(tileLayerRef.current);
      }
      const url =
        nextType === "satellite"
          ? `https://mt1.google.com/vt/lyrs=y&hl=${language}&x={x}&y={y}&z={z}`
          : `https://mt1.google.com/vt/lyrs=m&hl=${language}&x={x}&y={y}&z={z}`;

      const newLayer = L.tileLayer(url, { maxZoom: 20 }).addTo(mapInstanceRef.current);
      tileLayerRef.current = newLayer;
    }
  }, [mapType, language]);

  // Handle Recenter
  const handleRecenter = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(ASU_CENTER, 17, { duration: 1 });
    }
  }, []);

  // Handle Fullscreen Toggle
  const toggleFullscreen = useCallback(() => {
    if (!wrapperRef.current) return;
    if (!document.fullscreenElement) {
      wrapperRef.current.requestFullscreen?.().catch((err) => {
        console.error("Failed to enter fullscreen:", err);
      });
    } else {
      document.exitFullscreen?.().catch((err) => {
        console.error("Failed to exit fullscreen:", err);
      });
    }
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={cn(
        "relative w-full overflow-hidden bg-card shadow-lg transition-all",
        isFullscreen ? "fixed inset-0 z-50 h-screen w-screen rounded-none border-0" : "h-[550px] rounded-2xl border",
        className
      )}
      onMouseLeave={() => setShowGestureOverlay(false)}
    >
      <div className="relative w-full h-full overflow-hidden bg-muted/20 flex items-center justify-center">
        {!isLeafletLoaded && (
          <div className="flex flex-col items-center gap-2 text-muted-foreground z-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="text-sm">
              {language === "ar" ? "جاري تحميل الخريطة التفاعلية..." : "Loading interactive map..."}
            </span>
          </div>
        )}

        <div ref={mapRef} className="absolute inset-0 w-full h-full z-0" />

        {/* Map Type Switcher Button (Bottom-Start) */}
        <div className="absolute bottom-4 start-4 z-10">
          <button
            type="button"
            onClick={toggleMapType}
            className="flex items-center gap-2 px-3 py-2 bg-background/95 hover:bg-background text-foreground backdrop-blur-md rounded-xl shadow-lg border text-xs font-bold transition-all hover:scale-105 cursor-pointer select-none"
            title={
              mapType === "satellite"
                ? language === "ar"
                  ? "التبديل إلى خريطة الشارع"
                  : "Switch to Street Map"
                : language === "ar"
                  ? "التبديل إلى صور الأقمار الصناعية"
                  : "Switch to Satellite"
            }
          >
            <Layers className="h-4 w-4 text-primary shrink-0" />
            <span>
              {mapType === "satellite"
                ? language === "ar"
                  ? "خريطة الشارع"
                  : "Street Map"
                : language === "ar"
                  ? "قمر صناعي"
                  : "Satellite"}
            </span>
          </button>
        </div>

        {/* Navigation & Fullscreen Controls (Bottom-End) */}
        <div className="absolute bottom-4 end-4 z-10 flex items-center gap-2">
          <button
            type="button"
            onClick={handleRecenter}
            className="flex items-center justify-center h-9 w-9 bg-background/95 hover:bg-background text-foreground backdrop-blur-md rounded-xl shadow-lg border transition-all hover:scale-105 cursor-pointer select-none"
            title={language === "ar" ? "إعادة التوسيط على الجامعة" : "Recenter on Campus"}
          >
            <Compass className="h-4 w-4 text-primary" />
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="flex items-center justify-center h-9 w-9 bg-background/95 hover:bg-background text-foreground backdrop-blur-md rounded-xl shadow-lg border transition-all hover:scale-105 cursor-pointer select-none"
            title={
              isFullscreen
                ? language === "ar"
                  ? "إلغاء ملء الشاشة"
                  : "Exit Fullscreen"
                : language === "ar"
                  ? "ملء الشاشة"
                  : "Fullscreen"
            }
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4 text-primary" />
            ) : (
              <Maximize2 className="h-4 w-4 text-primary" />
            )}
          </button>
        </div>

        {/* Cooperative Gesture Overlay (Responsive for Desktop & Touch Screens) */}
        <div
          className={cn(
            "absolute inset-0 z-20 pointer-events-none flex items-center justify-center bg-black/60 backdrop-blur-[1px] transition-opacity duration-300",
            showGestureOverlay ? "opacity-100" : "opacity-0"
          )}
        >
          <p className="text-white text-sm sm:text-base md:text-lg font-semibold px-6 py-3 rounded-xl bg-black/50 shadow-2xl text-center select-none max-w-[90%] leading-relaxed">
            {gestureType === "touch"
              ? language === "ar"
                ? "استخدم إصبعين لتحريك وتكبير الخريطة"
                : "Use two fingers to move the map"
              : language === "ar"
                ? "استخدم Ctrl + التمرير لتكبير الخريطة"
                : "Use ctrl + scroll to zoom the map"}
          </p>
        </div>
      </div>
    </div>
  );
}
