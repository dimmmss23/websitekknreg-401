"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SectionTitle from "./SectionTitle";

const blogs = [
    {
        category: "Kegiatan",
        title: "Hari 1: Observasi Lingkungan Panti",
        date: "22 Jan 2026",
        excerpt: "Mengidentifikasi kebutuhan mendesak panti asuhan untuk merancang program kerja yang tepat sasaran.",
    },
    {
        category: "Program Digital",
        title: "Hari 15: Launching Website Resmi",
        date: "05 Feb 2026",
        excerpt: "Peluncuran website panti asuhan sebagai sarana informasi publik dan transparansi donasi.",
    },
    {
        category: "Pendidikan",
        title: "Bimbingan Belajar Intensif",
        date: "10 Feb 2026",
        excerpt: "Mendampingi anak-anak asuh mengerjakan PR dan memahami materi pelajaran sekolah dengan metode fun learning.",
    },
    {
        category: "Sosial",
        title: "Gotong Royong & Jumat Bersih",
        date: "12 Feb 2026",
        excerpt: "Kegiatan rutin membersihkan area panti untuk menciptakan lingkungan yang sehat dan nyaman.",
    },
];

export default function BlogSection() {
    return (
        <section className="py-24 bg-background border-t border-border">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <SectionTitle label="Jurnal" title="Catatan Kegiatan" subtitle="Dokumentasi perjalanan pengabdian kami selama di lokasi KKN." />
                    <button className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group mb-20">
                        Lihat Semua <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {blogs.map((blog, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 shadow-sm"
                        >
                            <span className="inline-block px-3 py-1 rounded-full bg-secondary text-xs font-medium text-secondary-foreground mb-4">
                                {blog.category}
                            </span>
                            <h3 className="text-xl font-medium text-foreground mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors font-heading">
                                {blog.title}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-6 line-clamp-3 font-sans">
                                {blog.excerpt}
                            </p>
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                                <span className="text-xs text-muted-foreground">{blog.date}</span>
                                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-secondary/80 transition-colors">
                                    <ArrowRight className="w-4 h-4 text-foreground/60 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
                <button className="flex md:hidden items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mt-8 mx-auto">
                    Lihat Semua <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </section>
    );
}
