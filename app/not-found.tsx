"use client";

import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { NotFoundContent } from "@/components/layout/not-found-content";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center bg-background">
        <NotFoundContent />
      </main>
      <Footer />
    </div>
  );
}
