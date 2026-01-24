import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";

export default async function LatestArticles() {
    const blogs = await prisma.blog.findMany({
        orderBy: { publishedAt: "desc" },
        take: 3,
    });

    if (blogs.length === 0) return null;

    return (
        <section className="py-24 px-4 container mx-auto" id="blog">
            <div className="mb-12 text-center">
                <SectionTitle
                    label="Blog Terkini"
                    title="Artikel Terbaru"
                    subtitle="Ikuti kabar terbaru dan cerita inspiratif dari kegiatan kami."
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 w-full max-w-full">
                {blogs.map((blog) => (
                    <Link
                        key={blog.id}
                        href={`/blog/${blog.slug}`}
                        className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className="relative h-48 w-full overflow-hidden">
                            {blog.imageUrl ? (
                                <img
                                    src={blog.imageUrl}
                                    alt={blog.title}
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground">
                                    No Image
                                </div>
                            )}
                            <div className="absolute top-4 left-4">
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

            <div className="flex justify-center">
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors"
                >
                    Lihat Semua Artikel
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </section>
    );
}
