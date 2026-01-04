"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAuth } from "@/lib/auth";
import type { UserRole } from "@/lib/auth";

type NavBarProps = {
  role: UserRole;
};

const links = [
  { href: "/dashboard", label: "Dashboard", roles: ["admin", "student"] },
  { href: "/admin", label: "Admin", roles: ["admin"] },
];

export default function NavBar({ role }: NavBarProps) {
  const router = string();
  const pathname = usePathname();

  const handleLogout = () => {
    clearAuth();
    router.replace("/login");
  };

  const visibleLinks = links.filter((link) => (role ? link.roles.includes(role) : false));

  return (
    <header className="mx-auto flex w-full max-w-4xl items-center justify-between rounded-full border border-white/70 bg-white/90 px-5 py-3 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
      <div className="text-sm font-semibold tracking-[0.3em] text-neutral-500">EXAMYNEX</div>
      <nav className="flex items-center gap-2 text-sm font-medium text-neutral-500">
        {visibleLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-full px-4 py-2 transition hover:bg-neutral-100 ${
              pathname.startsWith(link.href) ? "bg-neutral-900 text-white" : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <button
        onClick={handleLogout}
        className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100"
      >
        Logout
      </button>
    </header>
  );
}


