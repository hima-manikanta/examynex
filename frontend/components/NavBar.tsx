"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/lib/auth";
import { getStoredToken, getStoredRole } from "@/lib/auth";

type AuthGuardOptions = {
  requireRole?: UserRole;
};

export function useAuthGuard(options?: AuthGuardOptions) {
  const router = useRouter();
  const [role, setRole] = useState<UserRole | null>(null); // ✅ FIX
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getStoredToken();
    const storedRole = getStoredRole();

    if (!token) {
      router.replace("/login");
      return;
    }

    setRole(storedRole);
    setReady(true);

    if (options?.requireRole && storedRole !== options.requireRole) {
      router.replace("/unauthorized");
    }
  }, [options, router]);

  return { role, ready };
}

