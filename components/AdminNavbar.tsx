"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, User, Users, FileText, Home, Globe } from "lucide-react";
import { useState } from "react";
import { signOut } from "next-auth/react";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/blogs", label: "Blog", icon: FileText },
  { href: "/admin/anggota", label: "Anggota", icon: Users },
  { href: "/admin/users", label: "User Controller", icon: User },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-background border-b border-border shadow-sm sticky top-0 z-30">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <span className="font-bold text-lg tracking-tight text-primary">Admin Panel</span>
          <div className="hidden md:flex items-center gap-2 ml-8">
            {adminLinks.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="p-2 rounded-lg hover:bg-accent text-muted-foreground mr-1"
            title="Lihat Website"
          >
            <Globe className="w-5 h-5" />
          </Link>
          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button
            className="p-2 rounded-lg hover:bg-accent text-destructive"
            title="Logout"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-background border-t border-border px-4 pb-4">
          <div className="flex flex-col gap-2 mt-2">
            {adminLinks.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}
                  onClick={() => setOpen(false)}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
