"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const content = "Di era digital, teknologi hadir sebagai jembatan kebaikan. Website ini merupakan rekam jejak dedikasi kami, Mahasiswa KKN Rekognisi Kelompok 401 UIN Raden Fatah, dalam membersamai Panti Asuhan Amanah. Kami hadir merajut fondasi digital, membantu mereka melangkah mantap menyongsong masa depan, menyelaraskan kemajuan zaman dengan kemuliaan iman.";

export default function Foreword() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    return (
        <section id="foreword" ref={containerRef} className="py-20 md:py-32 px-4 md:px-8 bg-background relative overflow-hidden">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-20 items-start">
                    {/* Left Column: Heading */}
                    <div className="lg:col-span-5 relative z-10">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="block text-xs font-mono text-primary tracking-widest mb-6 uppercase"
                        >
                            Sambutan
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-heading font-medium text-foreground leading-[1.1]"
                        >
                            Sinergi Digital & <br /> <span className="text-muted-foreground italic">Nilai Islami.</span>
                        </motion.h2>
                    </div>

                    {/* Right Column: Paragraph */}
                    <div className="lg:col-span-7 relative z-10 pt-4 lg:pt-16">
                        <p className="text-xl md:text-3xl text-foreground font-light leading-relaxed text-left">
                            <span className="text-primary font-normal">&quot;</span>
                            {content}
                        </p>

                        <motion.div
                            initial={{ opacity: 0, scaleX: 0 }}
                            whileInView={{ opacity: 1, scaleX: 1 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-[1px] w-full bg-border mt-12 origin-left"
                        />
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="flex justify-between mt-4 text-xs font-mono text-muted-foreground"
                        >
                            <span>KELOMPOK 401</span>
                            <span className="font-heading">PALEMBANG, 2026</span>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
