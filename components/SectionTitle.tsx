"use client";

import { motion } from "framer-motion";

interface SectionTitleProps {
    label: string;
    title: string;
    subtitle?: string;
    centered?: boolean;
}

export default function SectionTitle({ label, title, subtitle, centered = false }: SectionTitleProps) {
    return (
        <div className={`mb-16 md:mb-20 ${centered ? "text-center" : "text-left"}`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-3 mb-4"
            >
                <span className="h-[1px] w-8 bg-primary/50" />
                <span className="text-sm font-mono text-primary tracking-widest uppercase">
                    {label}
                </span>
                {centered && <span className="h-[1px] w-8 bg-primary/50" />}
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl md:text-6xl font-heading font-bold text-foreground leading-[1.1] uppercase"
            >
                {title}
            </motion.h2>

            {subtitle && (
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className={`mt-4 text-muted-foreground text-lg max-w-2xl ${centered ? "mx-auto" : ""}`}
                >
                    {subtitle}
                </motion.p>
            )}
        </div>
    );
}
