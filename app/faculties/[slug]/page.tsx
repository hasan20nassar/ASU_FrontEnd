"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FacultyRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();

  useEffect(() => {
    if (slug) {
      router.replace(`/academics/${slug}`);
    }
  }, [slug, router]);

  return null;
}
