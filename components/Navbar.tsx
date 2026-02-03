"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const links = [
    { name: "Home", href: "/" },
    { name: "Tentang Kami", href: "/about" },
    { name: "Galeri", href: "/blog" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Stop loading saat pathname berubah
    useEffect(() => {
        setIsLoading(false);
        setMobileMenuOpen(false);
    }, [pathname]);

    // Stop loading saat transition selesai
    useEffect(() => {
        if (!isPending) {
            setIsLoading(false);
        }
    }, [isPending]);

    const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        // Jika navigasi ke halaman yang sama, jangan loading
        if (href === pathname) {
            e.preventDefault();
            return;
        }

        e.preventDefault();
        setIsLoading(true);

        // Gunakan startTransition untuk smooth navigation
        startTransition(() => {
            router.push(href);
        });
    };

    return (
        <>
            {/* Loading Bar */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        className="fixed top-0 left-0 right-0 z-[100] h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        exit={{ scaleX: 1, opacity: 0 }}
                        transition={{
                            scaleX: { duration: 0.8, ease: "easeInOut" },
                            opacity: { duration: 0.2 }
                        }}
                    />
                )}
            </AnimatePresence>

            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300",
                    scrolled ? "bg-background/80 backdrop-blur-md border-b border-border py-3 shadow-sm" : "bg-transparent py-6"
                )}
            >
                <div className="flex items-center gap-6">
                    <Link
                        href="/"
                        onClick={(e) => handleNavigation(e, "/")}
                        className="relative z-10 flex items-center gap-3"
                        draggable={false}
                    >
                        <Image
                            src="/logo.png"
                            alt="KKN Logo"
                            width={40}
                            height={40}
                            className="w-10 h-10 object-contain select-none"
                            draggable={false}
                        />
                        <span className="font-heading font-bold text-xl tracking-tighter text-foreground">KKN REG - 401</span>
                    </Link>
                </div>

                <div className="flex items-center gap-6">
                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {links.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={(e) => handleNavigation(e, link.href)}
                                    className={cn(
                                        "text-sm font-medium transition-colors relative group",
                                        isActive
                                            ? "text-foreground"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {link.name}
                                    <span
                                        className={cn(
                                            "absolute -bottom-1 left-0 h-[2px] bg-foreground transition-all duration-300",
                                            isActive ? "w-full" : "w-0 group-hover:w-full"
                                        )}
                                    />
                                </Link>
                            );
                        })}
                    </nav>

                    <ThemeToggle />

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden relative z-50 w-10 h-10 flex items-center justify-center text-foreground"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </motion.header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 md:hidden"
                    >
                        {links.map((link, i) => {
                            const isActive = pathname === link.href;
                            return (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + i * 0.1 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={(e) => handleNavigation(e, link.href)}
                                        className={cn(
                                            "text-3xl font-heading font-bold transition-colors",
                                            isActive
                                                ? "text-primary"
                                                : "text-foreground hover:text-primary"
                                        )}
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}