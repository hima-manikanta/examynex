"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getStoredRole, getStoredToken, UserRole } from "@/lib/auth";

type AuthGuardOptions = {
  requireRole?: Extract<UserRole, "admin">;
};

export function useAuthGuard(options?: AuthGuardOptions) {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getStoredToken();
    const storedRole = getStoredRole();

    if (!token) {
      router.replace("/login");
      return;
    }

    if (options?.requireRole === "admin" && storedRole !== "admin") {
      router.replace("/dashboard");
      return;
    }

    setRole(storedRole);
    setReady(true);
  }, [router, options?.requireRole]);

  return { role, ready };
}
