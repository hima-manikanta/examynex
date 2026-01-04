"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useReducer } from "react";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", adminOnly: false },
  { href: "/admin", label: "Admin", adminOnly: true },
];

export default function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [, bumpAuthTick] = useReducer((value: number) => value + 1, 0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleExternalChange = () => bumpAuthTick();
    window.addEventListener("storage", handleExternalChange);
    window.addEventListener("focus", handleExternalChange);
    return () => {
      window.removeEventListener("storage", handleExternalChange);
      window.removeEventListener("focus", handleExternalChange);
    };
  }, []);

  const authState =
    typeof window === "undefined"
      ? { role: null, token: null }
      : {
          role: localStorage.getItem("role"),
          token: localStorage.getItem("token"),
        };

  const handleLogout = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    bumpAuthTick();
    router.push("/login");
  };

  const visibleLinks = NAV_LINKS.filter((link) => !link.adminOnly || authState.role === "admin");
  const showLogout = Boolean(authState.token);

  const currentPath = pathname ?? "";

  return (
    <header className="fixed inset-x-0 top-4 z-20 px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-3xl border border-white/20 bg-white/90 px-4 py-3 shadow-[0_12px_40px_rgba(10,10,10,0.08)] backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-[0.3em] text-[#0b0c0f]/70">
          <span className="h-8 w-8 rounded-2xl bg-gradient-to-br from-[#111727] to-[#1f2433] text-center text-white">EX</span>
          <span className="text-xs uppercase">Examynex</span>
        </Link>

        <nav className="hidden items-center gap-2 text-sm font-medium text-[#0b0c0f]/70 md:flex">
          {visibleLinks.map((link) => {
            const isActive = currentPath.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 transition ${
                  isActive ? "bg-[#0b0c0f] text-white" : "hover:bg-[#f2f2f5]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {showLogout ? (
          <button
            onClick={handleLogout}
            className="rounded-full bg-[#0b0c0f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-black"
          >
            Logout
          </button>
        ) : (
          <Link
            href="/login"
            className="rounded-full border border-[#dcdde2] px-4 py-2 text-sm font-semibold text-[#0b0c0f]"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
