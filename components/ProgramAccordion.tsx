"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import SectionTitle from "./SectionTitle";

const programs = [
    {
        title: "Transformasi Digital Lembaga",
        desc: "Pembuatan Landing Page Panti Asuhan (Desain, Coding, Integrasi, Revisi) Program utama ini difokuskan pada pengembangan identitas digital lembaga melalui pembuatan website profil yang profesional. Proses pengerjaan mencakup tahapan perancangan antarmuka pengguna (UI/UX Design), penulisan kode program (Coding) menggunakan teknologi kerangka kerja modern, hingga integrasi sistem agar siap digunakan. Kehadiran landing page ini bertujuan untuk meningkatkan kredibilitas panti asuhan, mempermudah akses informasi bagi masyarakat luas, serta memfasilitasi transparansi dan kemudahan bagi para calon donatur yang ingin menyalurkan bantuan secara digital.",
    },
    {
        title: "Pelatihan Admin Panti & Sosialisasi Digital Admin",
        desc: "Guna menjamin keberlanjutan (sustainability) dari sistem yang telah dibangun, program ini memberikan pembekalan teknis kepada staf pengurus panti. Kegiatan meliputi pelatihan manajemen data digital, pengarsipan dokumen secara elektronik, serta tata cara pengelolaan operasional website. Tujuannya adalah agar pengurus panti memiliki kemandirian dalam memperbarui konten informasi dan mengelola data administrasi lembaga secara efisien berbasis teknologi.",
    },
    {
        title: "Pembinaan Akhlak Islami & Doa Harian",
        desc: "Program ini dirancang untuk memperkuat fondasi spiritual dan karakter anak asuh. Melalui pendekatan yang interaktif dan menyenangkan seperti metode bercerita (storytelling) kisah-kisah teladan Nabi serta praktik hafalan doa harian, anak asuh diajak untuk memahami dan menerapkan nilai-nilai akhlak mulia dalam kehidupan sehari-hari. Fokus utama kegiatan ini adalah pembentukan kebiasaan positif dan adab sopan santun sesuai tuntunan agama.",
    },
    {
        title: "Pendampingan Belajar & Pekerjaan Rumah Sekolah",
        desc: "Program pendampingan akademik ini hadir sebagai solusi atas kesulitan belajar yang dihadapi anak asuh di sekolah formal. Dengan menerapkan metode pembelajaran kreatif seperti Jarimatika untuk matematika dan pengenalan bahasa asing dasar, kegiatan ini bertujuan untuk meningkatkan pemahaman materi pelajaran dan motivasi belajar siswa. Selain itu, pendampingan intensif juga diberikan dalam penyelesaian tugas pekerjaan rumah (PR) untuk memastikan prestasi akademik anak asuh tetap terjaga.",
    },
    {
        title: "Kegiatan Kebersihan & Perawatan Lingkungan Panti",
        desc: "Untuk mendukung suasana belajar yang kondusif dan sehat, dilaksanakan kegiatan gotong royong rutin yang melibatkan partisipasi aktif anak asuh. Program ini tidak hanya berorientasi pada fisik lingkungan yang bersih dan rapi, tetapi juga menanamkan rasa tanggung jawab, kedisiplinan, dan kepedulian anak asuh terhadap kebersihan tempat tinggal mereka bersama.",
    },
    {
        title: "Workshop Literasi Digital Sehat & Media Pembelajaran",
        desc: "Program ini dirancang secara komprehensif untuk membangun ekosistem teknologi yang positif dan produktif. Materi pelatihan diperluas mencakup penguasaan perangkat lunak perkantoran untuk kebutuhan administrasi, pengenalan dasar-dasar desain grafis untuk menstimulasi kreativitas visual, serta edukasi pemanfaatan internet sehat. Melalui program ini, anak asuh diharapkan mampu mentransformasi teknologi digital menjadi sarana belajar mandiri dan wadah berkarya yang bermanfaat.",
    },
];

export default function ProgramAccordion() {
    const [active, setActive] = useState<number | null>(null);

    return (
        <section className="py-24 px-4 bg-background border-t border-border">
            <div className="max-w-4xl mx-auto">
                <SectionTitle label="Program Kerja" title="Fokus & Implementasi" />

                <div className="space-y-4">
                    {programs.map((program, index) => (
                        <div
                            key={index}
                            onClick={() => setActive(active === index ? null : index)}
                            className={cn(
                                "group relative border-b border-border py-8 cursor-pointer transition-all duration-300",
                                active === index ? "border-foreground/40" : "hover:border-foreground/20"
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xl md:text-2xl font-heading text-muted-foreground mr-8">0{index + 1}</span>
                                <h3 className={cn(
                                    "text-2xl md:text-3xl font-heading font-medium transition-colors duration-300 flex-1",
                                    active === index ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                                )}>
                                    {program.title}
                                </h3>
                                <div className="relative w-8 h-8 flex items-center justify-center">
                                    <motion.div
                                        animate={{ rotate: active === index ? 45 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ArrowUpRight className={cn("w-6 h-6 transition-colors", active === index ? "text-foreground" : "text-muted-foreground")} />
                                    </motion.div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {active === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pt-6 pl-14 md:pl-16 pr-4">
                                            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl font-sans">
                                                {program.desc}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
