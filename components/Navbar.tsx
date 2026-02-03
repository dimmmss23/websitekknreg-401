"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
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

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setIsLoading(false);
        setMobileMenuOpen(false);
    }, [pathname]);

    const handleLinkClick = (href: string) => {
        if (href !== pathname) {
            setIsLoading(true);
        }
    };

    return (
        <>
            {/* Loading Bar */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        className="fixed top-0 left-0 right-0 z-[100] h-1 bg-primary origin-left"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 0.7 }}
                        transition={{ duration: 1, ease: "easeInOut" }}
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
                    <Link href="/" onClick={() => handleLinkClick("/")} className="relative z-10 flex items-center gap-3" draggable={false}>
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
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => handleLinkClick(link.href)}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-foreground transition-all duration-300 group-hover:w-full" />
                            </Link>
                        ))}
                    </nav>

                    <ThemeToggle />

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden relative z-50 w-10 h-10 flex items-center justify-center text-foreground"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
                        {links.map((link, i) => (
                            <motion.div
                                key={link.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + i * 0.1 }}
                            >
                                <Link
                                    href={link.href}
                                    onClick={() => handleLinkClick(link.href)}
                                    className="text-3xl font-heading font-bold text-foreground hover:text-primary transition-colors"
                                >
                                    {link.name}
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
