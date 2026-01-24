
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionTitle from "@/components/SectionTitle";
import Image from "next/image";

export const revalidate = 0; // Ensure fresh data on every request

export default async function AboutPage() {
    const anggota = await prisma.anggota.findMany({
        orderBy: { createdAt: "asc" },
    });

    return (
        <main className="min-h-screen bg-background font-sans">
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
                <Image
                    src="/hero abaout.jpeg"
                    alt="Hero About"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/60" /> {/* Overlay */}

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-sm font-medium tracking-wide mb-6">
                        Tentang Kami
                    </span>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6">
                        KKN Kelompok 401
                    </h1>
                    <p className="text-xl text-gray-200 font-light max-w-2xl mx-auto">
                        Mengabdi dengan Hati, Berinovasi dengan Teknologi.
                    </p>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/50">
                    <div className="w-1 h-12 rounded-full border border-white/30 flex justify-center pt-2">
                        <div className="w-1 h-2 bg-white rounded-full" />
                    </div>
                </div>
            </section>

            {/* Introduction Text */}
            <section className="py-20 px-4 container mx-auto text-center">
                <div className="max-w-4xl mx-auto">
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                        Kami adalah mahasiswa UIN Raden Fatah Palembang (KKN Rekognisi Kelompok 401) di bawah bimbingan <strong>Bapak Amir Hamzah M.Pd.</strong> Website ini merupakan wujud dedikasi untuk Akses Informasi Tentang Kelompok Kami, menjembatani kebaikan melalui teknologi dan inovasi digital. Kami percaya bahwa kolaborasi antara nilai-nilai Islami dan kemajuan teknologi dapat menciptakan dampak positif yang berkelanjutan.
                    </p>
                    <div className="mt-8 flex justify-center">
                        <div className="h-1 w-20 bg-primary rounded-full" />
                    </div>
                </div>
            </section>

            {/* Location Section */}
            <section className="py-16 bg-card/50">
                <div className="container mx-auto px-4">
                    <SectionTitle label="Lokasi" title="Tempat Pengabdian" />
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold font-heading">Panti Asuhan Amanah</h3>
                            <p className="text-muted-foreground">
                                Lokasi pengabdian kami bertempat di dua lokasi Panti Asuhan Amanah.
                                Tempat ini menjadi pusat kegiatan kami dalam menerapkan program kerja
                                yang berfokus pada pendidikan, teknologi, dan pemberdayaan sosial.
                            </p>

                            <div className="flex flex-col gap-3 mt-4">
                                <a
                                    href="https://maps.app.goo.gl/oGmuZt3YxTrTh6JY7"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-primary hover:underline font-medium"
                                >
                                    <span className="w-2 h-2 rounded-full bg-primary" />
                                    <span>Panti Asuhan Amanah (A) - Lihat Peta</span>
                                </a>
                                <a
                                    href="https://maps.app.goo.gl/GsTFiDJSyDM8YFvg6"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-primary hover:underline font-medium"
                                >
                                    <span className="w-2 h-2 rounded-full bg-primary" />
                                    <span>Panti Asuhan Amanah (B) - Lihat Peta</span>
                                </a>
                            </div>
                        </div>
                        <div className="flex flex-col gap-6">
                            {/* Map A */}
                            <div className="h-64 bg-gray-200 rounded-2xl overflow-hidden relative border border-border">
                                <iframe
                                    src="https://maps.google.com/maps?q=-2.9702901,104.7826551&hl=id&z=16&output=embed"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen={true}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="absolute inset-0 w-full h-full"
                                ></iframe>
                                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-bold shadow-sm z-10 pointer-events-none">
                                    Panti Asuhan Amanah (A)
                                </div>
                            </div>

                            {/* Map B */}
                            <div className="h-64 bg-gray-200 rounded-2xl overflow-hidden relative border border-border">
                                <iframe
                                    src="https://maps.google.com/maps?q=-2.9621059,104.7556659&hl=id&z=16&output=embed"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen={true}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="absolute inset-0 w-full h-full"
                                ></iframe>
                                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-bold shadow-sm z-10 pointer-events-none">
                                    Panti Asuhan Amanah (B)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Members Section */}
            <section className="py-24 container mx-auto px-4">
                <div className="text-center mb-16">
                    <SectionTitle label="Struktur Tim" title="Dosen Pembimbing & Mahasiswa" />
                    <p className="mt-4 text-muted-foreground">
                        Wajah-wajah di balik semangat perubahan dan pengabdian ini.
                    </p>
                </div>

                {anggota.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                        Belum ada data anggota.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {anggota.map((member) => (
                            <Link
                                href={`/about/anggota/${member.id}`}
                                key={member.id}
                                className="group relative flex flex-col items-center text-center cursor-pointer"
                            >
                                <div className="aspect-[3/4] w-full overflow-hidden rounded-xl bg-secondary mb-4 relative shadow-md group-hover:shadow-lg transition-all duration-300">
                                    {member.fotoUrl ? (
                                        <img
                                            src={member.fotoUrl}
                                            alt={member.nama}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            No Photo
                                        </div>
                                    )}
                                    {/* Hover Overlay Icon */}
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="bg-white/90 text-black px-4 py-2 rounded-full text-sm font-medium shadow-sm transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                            Lihat Profil
                                        </span>
                                    </div>
                                </div>

                                <h3 className="text-foreground font-heading font-bold text-xl mb-1 group-hover:text-primary transition-colors">
                                    {member.nama}
                                </h3>
                                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                                    {member.jabatan}
                                </p>
                                {/* Simple social media check or removing it from here as requested to clean up */}
                                <div className="mt-3 md:hidden">
                                    <span className="inline-flex items-center justify-center px-4 py-1.5 text-xs font-semibold text-primary border border-primary/30 bg-primary/5 rounded-full">
                                        Lihat Profil
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            <Footer />
        </main>
    );
}
