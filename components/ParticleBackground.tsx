"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

const COLORS = [
    "rgba(59, 130, 246, 0.8)",   // Blue
    "rgba(139, 92, 246, 0.8)",   // Violet
    "rgba(236, 72, 153, 0.8)",   // Pink
    "rgba(16, 185, 129, 0.8)",   // Emerald
    "rgba(245, 158, 11, 0.8)",   // Amber
    "rgba(99, 102, 241, 0.8)",   // Indigo
];

class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;

    constructor(width: number, height: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 4 + 2;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    }

    update(width: number, height: number) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        // Simple Arc - Fastest
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

export default function ParticleBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: true }); // Optimized alpha
        if (!ctx) return;

        let particles: Particle[] = [];
        let animationFrameId: number;
        let width = window.innerWidth;
        let height = window.innerHeight;

        const initParticles = () => {
            particles = [];
            const particleCount = Math.min(width * 0.1, 100); // Reduced count for mobile safety
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(width, height));
            }
        };

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;

            // Handle DPI for sharp rendering without blurriness
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            initParticles();
        };

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);

            // Removed composite operations for max performance
            particles.forEach((p) => {
                p.update(width, height);
                p.draw(ctx);
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener("resize", resize);
        resize();
        animate();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [theme]); // theme is used for re-triggering if needed, though colors are static here

    return (
        <canvas
            ref={canvasRef}
            className={`absolute inset-0 z-0 pointer-events-none opacity-50`}
        />
    );
}
