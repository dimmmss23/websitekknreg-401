
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Instagram, Globe } from "lucide-react";
import { notFound } from "next/navigation";

export const revalidate = 0;

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function MemberDetailPage({ params }: PageProps) {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) notFound();

    const member = await prisma.anggota.findUnique({
        where: { id },
    });

    if (!member) notFound();

    return (
        <main className="min-h-screen bg-background font-sans relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-primary/20 rounded-full blur-[120px] opacity-30 animate-pulse" />
                <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-blue-500/20 rounded-full blur-[120px] opacity-30 animate-pulse delay-700" />
            </div>

            <Navbar />

            <section className="relative z-10 pt-32 pb-20 px-4">
                <div className="container mx-auto max-w-5xl">
                    <Link
                        href="/about"
                        className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors group"
                    >
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center mr-3 group-hover:-translate-x-1 transition-transform">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <span className="font-medium">Kembali ke Tentang Kami</span>
                    </Link>

                    <div className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-8 md:p-12">
                        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center">

                            {/* Photo Column */}
                            <div className="w-full md:w-[400px] flex-shrink-0">
                                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-secondary relative shadow-2xl ring-4 ring-white/5 mx-auto md:mx-0 transform hover:scale-[1.02] transition-transform duration-500">
                                    {member.fotoUrl ? (
                                        <img
                                            src={member.fotoUrl}
                                            alt={member.nama}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-800 to-gray-900">
                                            <span className="text-xl font-medium opacity-50">No Photo</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
                                </div>
                            </div>

                            {/* Details Column */}
                            <div className="flex-1 text-center md:text-left space-y-8">
                                <div>
                                    <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-4">
                                        {member.jabatan}
                                    </div>
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-2 leading-tight">
                                        {member.nama}
                                    </h1>
                                    <div className="h-1 w-24 bg-gradient-to-r from-primary to-transparent rounded-full mx-auto md:mx-0 mt-4" />
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-secondary/30 rounded-2xl p-6 md:p-8 border border-white/5 backdrop-blur-sm">
                                        <p className="text-lg md:text-xl leading-relaxed text-foreground/90 font-light">
                                            {member.keterangan || "Tidak ada deskripsi tersedia saat ini."}
                                        </p>
                                    </div>

                                    {member.mediaSosial && (
                                        <div className="pt-2">
                                            <a
                                                href={member.mediaSosial}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-pink-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                                            >
                                                <Instagram className="w-6 h-6" />
                                                <span className="font-bold text-lg">Ikuti di Instagram</span>
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
