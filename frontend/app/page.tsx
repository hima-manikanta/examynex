"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getStoredToken } from "@/lib/auth";

export default function HomeRedirect() {
  const router = useRouter();

  useEffect(() => {
    const token = getStoredToken();
    router.replace(token ? "/dashboard" : "/login");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 text-sm text-neutral-500">
      Redirecting you to the right workspace…
    </div>
  );
}
