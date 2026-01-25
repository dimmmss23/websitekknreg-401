import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import SectionTitle from "@/components/SectionTitle";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export const revalidate = 0; // Disable caching for now to see updates immediately

export default async function BlogPage({
    searchParams,
}: {
    searchParams: { page?: string };
}) {
    const page = Number(searchParams?.page) || 1;
    const limit = 9;
    const skip = (page - 1) * limit;

    const [blogs, totalBlogs] = await Promise.all([
        prisma.blog.findMany({
            orderBy: { publishedAt: "desc" },
            take: limit,
            skip: skip,
        }),
        prisma.blog.count(),
    ]);

    const totalPages = Math.ceil(totalBlogs / limit);

    return (
        <main className="min-h-screen bg-background font-sans">
            <Navbar />

            <section className="pt-32 pb-24 px-4 container mx-auto">
                <div className="mb-12 text-center">
                    <SectionTitle
                        label="Galeri & Blog"
                        title="Dokumentasi Kegiatan"
                        subtitle="Kumpulan cerita dan momen berharga dari kegiatan KKN kami."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.map((blog) => (
                        <Link
                            key={blog.id}
                            href={`/blog/${blog.slug}`}
                            className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="relative h-48 w-full overflow-hidden">
                                {blog.imageUrl ? (
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={blog.imageUrl}
                                            alt={blog.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground">
                                        No Image
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 z-10">
                                    <span className="px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs font-medium text-foreground">
                                        {blog.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                                    {new Date(blog.publishedAt).toLocaleDateString("id-ID", {
                                        day: "numeric", month: "long", year: "numeric"
                                    })}
                                </div>
                                <h3 className="text-xl font-heading font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                    {blog.title}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-3 mb-6 font-sans">
                                    {blog.excerpt}
                                </p>

                                <div className="mt-auto flex items-center text-primary text-sm font-medium">
                                    Baca Selengkapnya
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {blogs.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground">Belum ada artikel yang diterbitkan.</p>
                    </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-16">
                        {page > 1 ? (
                            <Link
                                href={`/blog?page=${page - 1}`}
                                className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card hover:bg-accent text-sm font-medium transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Sebelumnya
                            </Link>
                        ) : (
                            <button
                                disabled
                                className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted/50 text-muted-foreground text-sm font-medium cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Sebelumnya
                            </button>
                        )}

                        <span className="text-sm font-medium text-muted-foreground">
                            Halaman {page} dari {totalPages}
                        </span>

                        {page < totalPages ? (
                            <Link
                                href={`/blog?page=${page + 1}`}
                                className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card hover:bg-accent text-sm font-medium transition-colors"
                            >
                                Selanjutnya
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        ) : (
                            <button
                                disabled
                                className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted/50 text-muted-foreground text-sm font-medium cursor-not-allowed"
                            >
                                Selanjutnya
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                )}
            </section>

            <Footer />
        </main>
    );
}
