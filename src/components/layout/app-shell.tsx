"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  CalendarCheck2,
  ParkingSquare,
  Building2,
  ShieldCheck,
  UserCircle2,
  CarFront,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui";

export interface ShellUser {
  id: string;
  name: string | null;
  email: string;
  role: "SUPER_ADMIN" | "SOCIETY_ADMIN" | "RESIDENT";
  flatNumber: string | null;
  towerName: string | null;
  societyName: string | null;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function AppShell({
  user,
  children,
}: {
  user: ShellUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems: NavItem[] = React.useMemo(() => {
    const items: NavItem[] = [];

    if (user.societyName) {
      items.push(
        { href: "/find", label: "Find", icon: Search },
        { href: "/bookings", label: "Bookings", icon: CalendarCheck2 },
        { href: "/my-slots", label: "My Slots", icon: ParkingSquare }
      );
    }

    if (user.role === "SOCIETY_ADMIN" && user.societyName) {
      items.push({ href: "/society", label: "Society", icon: Building2 });
    }

    if (user.role === "SUPER_ADMIN") {
      items.push({ href: "/admin", label: "Platform", icon: ShieldCheck });
    }

    items.push({ href: "/profile", label: "Profile", icon: UserCircle2 });
    return items;
  }, [user.role, user.societyName]);

  return (
    <div className="min-h-dvh flex flex-col md:flex-row bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-slate-200/80 bg-white z-30">
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-slate-100">
          <div className="h-9 w-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <CarFront className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-slate-900 tracking-tight leading-none">
              RentParking
            </p>
            <p className="text-[11px] text-slate-500 truncate mt-1">
              {user.societyName || "Super Admin Console"}
            </p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors",
                  active
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <Icon
                  className={cn(
                    "h-4.5 w-4.5",
                    active ? "text-emerald-400" : "text-slate-400"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="rounded-xl bg-slate-50 border border-slate-200/70 p-3">
            <p className="text-xs font-bold text-slate-900 truncate">
              {user.name || user.email}
            </p>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">
              {user.flatNumber
                ? `${user.towerName ? `${user.towerName} · ` : ""}Flat ${user.flatNumber}`
                : user.email}
            </p>
            <div className="mt-2">
              <Badge variant={user.role === "RESIDENT" ? "neutral" : "info"}>
                {user.role.replace("_", " ")}
              </Badge>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        {/* Mobile Sticky Top App Bar */}
        <header className="sticky top-0 z-30 md:hidden bg-white/90 backdrop-blur-md border-b border-slate-200/80 pt-safe">
          <div className="flex items-center justify-between gap-2 px-4 h-14">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
                <CarFront className="h-4.5 w-4.5 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-slate-900 leading-none truncate">
                  {user.societyName || "RentParking"}
                </p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {user.flatNumber
                    ? `${user.towerName ? `${user.towerName} · ` : ""}Flat ${user.flatNumber}`
                    : user.role.replace("_", " ")}
                </p>
              </div>
            </div>
            <Link href="/profile" className="shrink-0">
              <Badge variant="success" dot>
                {user.role === "SUPER_ADMIN"
                  ? "Super Admin"
                  : user.role === "SOCIETY_ADMIN"
                  ? "Admin"
                  : "Resident"}
              </Badge>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-5 pb-24 md:px-8 md:py-7 md:pb-10">
          {children}
        </main>

        {/* Mobile Fixed Bottom Tab Bar */}
        <nav
          aria-label="Primary navigation"
          className="fixed bottom-0 inset-x-0 z-30 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/90 pb-safe"
        >
          <div className="flex items-center justify-around px-1 pt-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1 px-2 rounded-xl transition-colors",
                    active ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center h-7 w-11 rounded-full transition-colors",
                      active && "bg-emerald-50 text-emerald-600"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-semibold leading-none",
                      active ? "text-slate-900" : "text-slate-500"
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
