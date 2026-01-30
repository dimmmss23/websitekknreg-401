"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import SectionTitle from "./SectionTitle";
import { cn } from "@/lib/utils";

const members = [
    { name: "Ilham Rayyan", id: "23041450131", img: "/anggota/ilham.png" },
    { name: "Dimas Agung Subayu", id: "23041450144", img: "/anggota/dimas.png" },
    { name: "Nicco Roland", id: "23041450123", img: "/anggota/nicco.png" },
    { name: "Achmad Fauzan", id: "23041450119", img: "/anggota/achmad.png" },
    { name: "Muhammad Fattan Attaur Rahman", id: "23041450122", img: "/anggota/fattan.png" },
    { name: "Dosen Pembimbing Lapangan", id: "DPL", img: "/anggota/dpl.png" },
];

export default function MemberMarquee() {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !scrollerRef.current) return;

        const scrollerContent = Array.from(scrollerRef.current.children);

        // Duplicate items enough times to fill screen and allow scrolling
        scrollerContent.forEach((item) => {
            const duplicatedItem = item.cloneNode(true);
            if (scrollerRef.current) {
                scrollerRef.current.appendChild(duplicatedItem);
            }
        });
    }, []);

    return (
        <section className="py-24 bg-background overflow-hidden relative border-t border-border">
            <div className="container mx-auto px-4">
                <SectionTitle label="Tim Kami" title="Anggota Kelompok" />
            </div>

            <div ref={containerRef} className="scroller w-full overflow-hidden mask-image-gradient">
                <div
                    ref={scrollerRef}
                    className={cn(
                        "flex min-w-full gap-8 py-4 w-max flex-nowrap",
                        "animate-scroll hover:[animation-play-state:paused]"
                    )}
                >
                    {members.map((member, i) => (
                        <div
                            key={i}
                            className="relative group w-[280px] h-[350px] flex-shrink-0 bg-card overflow-hidden rounded-xl border border-border cursor-pointer shadow-sm hover:shadow-md transition-all"
                        >
                            <Image
                                src={member.img}
                                alt=""
                                fill
                                sizes="(max-width: 768px) 100vw, 280px"
                                className="object-cover group-hover:grayscale-0 md:grayscale transition-all duration-500 scale-100 group-hover:scale-105"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
