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
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    clearAuth();
    router.replace("/login");
  };

  const visibleLinks = links.filter((link) =>
    role ? link.roles.includes(role) : false
  );

  return (
    <header className="mx-auto flex w-full max-w-4xl items-center justify-between rounded-full border bg-white px-5 py-3">
      <div className="text-sm font-semibold tracking-widest">EXAMYNEX</div>

      <nav className="flex gap-2">
        {visibleLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-2 rounded ${
              pathname.startsWith(link.href) ? "bg-black text-white" : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <button onClick={handleLogout}>Logout</button>
    </header>
  );
}
