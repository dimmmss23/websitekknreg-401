"use client";

import { motion } from "framer-motion";
import { Monitor, Heart } from "lucide-react";
import SectionTitle from "./SectionTitle";

export default function AboutDoubleImpact() {
    return (
        <section id="about" className="py-24 px-4 md:px-8 bg-background relative border-t border-border">
            <div className="container mx-auto">
                <SectionTitle label="Filosofi Program" title="Lahiriah & Batiniah" centered />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                    {/* Column 1: Lahiriah */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="group relative p-8 md:p-12 rounded-3xl bg-card/50 border border-border hover:border-primary/30 transition-colors duration-500 shadow-sm"
                    >
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 text-primary">
                            <Monitor className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-heading text-foreground mb-4">Dimensi Digital <span className="text-muted-foreground block text-lg font-sans mt-1">(Lahiriah)</span></h3>
                        <p className="text-muted-foreground leading-relaxed font-sans">
                            Meningkatkan kapasitas operasional panti asuhan melalui <strong>transformasi digital</strong>. Kami membangun infrastruktur website, melatih admin, dan mengedukasi anak asuh tentang internet sehat agar mereka siap menghadapi tantangan zaman.
                        </p>
                        <div className="mt-8 flex gap-2 flex-wrap">
                            <span className="px-3 py-1 bg-secondary rounded-full text-xs text-secondary-foreground">Landing Page</span>
                            <span className="px-3 py-1 bg-secondary rounded-full text-xs text-secondary-foreground">Pelatihan IT</span>
                            <span className="px-3 py-1 bg-secondary rounded-full text-xs text-secondary-foreground">Literasi</span>
                        </div>
                    </motion.div>

                    {/* Column 2: Batiniah */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="group relative p-8 md:p-12 rounded-3xl bg-card/50 border border-border hover:border-destructive/30 transition-colors duration-500 shadow-sm"
                    >
                        <div className="w-12 h-12 bg-destructive/10 rounded-2xl flex items-center justify-center mb-8 text-destructive">
                            <Heart className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-heading text-foreground mb-4">Dimensi Karakter <span className="text-muted-foreground block text-lg font-sans mt-1">(Batiniah)</span></h3>
                        <p className="text-muted-foreground leading-relaxed font-sans">
                            Menjaga keseimbangan dengan penguatan <strong>nilai-nilai Islami</strong>. Kami mendampingi ibadah harian, doa bersama, dan motivasi spiritual untuk membentuk pribadi anak asuh yang berakhlak mulia dan tangguh secara mental.
                        </p>
                        <div className="mt-8 flex gap-2 flex-wrap">
                            <span className="px-3 py-1 bg-secondary rounded-full text-xs text-secondary-foreground">Doa Bersama</span>
                            <span className="px-3 py-1 bg-secondary rounded-full text-xs text-secondary-foreground">Motivasi</span>
                            <span className="px-3 py-1 bg-secondary rounded-full text-xs text-secondary-foreground">Akhlak</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
