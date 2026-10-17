"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";
import { OpenAPI, ApiError } from "@/lib/api";

// Set base URL of the Django backend API
OpenAPI.BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const handleGlobalApiError = (error: unknown) => {
  if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("asu:unauthorized"));
    }
  }
};

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: handleGlobalApiError,
        }),
        mutationCache: new MutationCache({
          onError: handleGlobalApiError,
        }),
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes
            refetchOnWindowFocus: false, // Prevent refetching when switching tabs
            retry: 1, // Retry failed requests once
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
