"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import Image from "next/image";
import ParticleBackground from "./ParticleBackground";

const sentence = "Membangun Kemandirian,";
const sentence2 = "Menebar Kebaikan.";

const letterDetails = {
    hidden: { opacity: 0, y: 100 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.2, 0.65, 0.3, 0.9],
        },
    },
};

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section ref={containerRef} className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-background">
            {/* Background Particles */}
            <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
                <ParticleBackground />
                {/* Gradients for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50 pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-primary)_0%,_transparent_50%)] opacity-10 blur-[100px] pointer-events-none" />
            </motion.div>

            <div className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-[100vw] overflow-hidden pt-20 md:pt-32">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="mb-6 md:mb-10 py-2 px-4 md:px-6 border border-primary/20 rounded-full bg-primary/5 backdrop-blur-md shadow-lg shadow-primary/10 max-w-[90vw]"
                >
                    <span className="text-xs md:text-sm lg:text-base font-heading font-bold tracking-[0.1em] md:tracking-[0.2em] text-primary uppercase whitespace-nowrap">
                        KKN REKOGNISI KELOMPOK 401
                    </span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-8 p-4 bg-background/30 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group flex flex-col items-center justify-center"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                    <Image
                        src="/hero_logo.png"
                        alt="KKN Hero Logo"
                        width={300}
                        height={100}
                        className="w-[140px] h-[50px] md:w-[220px] md:h-[80px] object-contain relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                    />
                </motion.div>

                <motion.h1
                    className="text-3xl md:text-7xl lg:text-8xl font-heading font-bold tracking-tighter text-foreground mb-4 md:mb-6 leading-tight md:leading-[1.1] text-center"
                    initial="hidden"
                    animate="visible"
                    transition={{ staggerChildren: 0.03 }}
                >
                    {/* Mobile safe rendering without complex mapping if needed, or keeping it but with text-wrap adjustment */}
                    <span className="block md:inline">{sentence}</span>
                    <span className="block md:hidden h-2" />
                    <span className="block md:inline"> {sentence2}</span>
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 1 }}
                    className="max-w-xl px-4"
                >
                    <p className="text-base md:text-2xl text-muted-foreground font-light leading-relaxed font-sans text-center">
                        PENINGKATAN KEMANDIRIAN MELALUI DIGITALISASI DAN PENDIDIKAN KARAKTER ISLAMI DI PANTI ASUHAN AMANAH
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "60px" }}
                    transition={{ delay: 1.8, duration: 1 }}
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-foreground/20 to-foreground/5 md:h-[100px]"
                />
            </div>
        </section>
    );
}
