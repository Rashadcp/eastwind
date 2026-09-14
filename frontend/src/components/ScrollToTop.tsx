"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function ScrollToTopHandler() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Disable browser automatic scroll restoration so it never restores a scrolled-down position
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }

      // Always scroll to the top on any route or tab/parameter change
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }
  }, [pathname, searchParams]);

  return null;
}

export default function ScrollToTop() {
  return (
    <Suspense fallback={null}>
      <ScrollToTopHandler />
    </Suspense>
  );
}
