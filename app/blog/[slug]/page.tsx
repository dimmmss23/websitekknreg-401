import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Calendar, Tag, Share2, Facebook, Twitter } from "lucide-react";
import ArticleContent from "@/components/ArticleContent";
import ShareButtons from "@/components/ShareButtons";

export const revalidate = 60;

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    
    const blog = await prisma.blog.findUnique({
        where: { slug },
    });

    if (!blog) {
        notFound();
    }

    // Get related blogs (same category, exclude current)
    const relatedBlogs = await prisma.blog.findMany({
        where: {
            category: blog.category,
            id: { not: blog.id },
        },
        take: 3,
        orderBy: { publishedAt: "desc" },
    });

    return (
        <main className="min-h-screen bg-background font-sans">
            <Navbar />

            <article className="pt-28 pb-16">
                {/* Header Section */}
                <header className="container mx-auto max-w-4xl px-4 mb-8">
                    <Link
                        href="/blog"
                        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors text-sm"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Kembali ke Daftar Artikel
                    </Link>

                    {/* Category & Date */}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                            <Tag className="w-3.5 h-3.5" />
                            {blog.category}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(blog.publishedAt).toLocaleDateString("id-ID", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground leading-tight mb-6">
                        {blog.title}
                    </h1>

                    {/* Excerpt */}
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed border-l-4 border-primary/30 pl-4">
                        {blog.excerpt}
                    </p>

                    {/* Share Buttons */}
                    <ShareButtons title={blog.title} />
                </header>

                {/* Cover Image */}
                {blog.imageUrl && (
                    <div className="container mx-auto max-w-5xl px-4 mb-10">
                        <figure>
                            <img
                                src={blog.imageUrl}
                                alt={blog.title}
                                className="w-full aspect-video object-cover rounded-2xl shadow-xl"
                            />
                        </figure>
                    </div>
                )}

                {/* Article Content */}
                <div className="container mx-auto max-w-4xl px-4">
                    <ArticleContent content={blog.content} />

                    {/* Tags / Footer */}
                    <div className="mt-12 pt-8 border-t border-border">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Kategori:</span>
                                <span className="bg-secondary px-3 py-1 rounded-full text-sm font-medium">
                                    {blog.category}
                                </span>
                            </div>
                            <ShareButtons title={blog.title} compact />
                        </div>
                    </div>
                </div>

                {/* Related Articles */}
                {relatedBlogs.length > 0 && (
                    <section className="container mx-auto max-w-5xl px-4 mt-16">
                        <h2 className="text-2xl font-heading font-bold text-foreground mb-6">
                            Artikel Terkait
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {relatedBlogs.map((related) => (
                                <Link
                                    key={related.id}
                                    href={`/blog/${related.slug}`}
                                    className="group block bg-card rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                                >
                                    {related.imageUrl && (
                                        <div className="aspect-video overflow-hidden">
                                            <img
                                                src={related.imageUrl}
                                                alt={related.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <span className="text-xs text-primary font-medium">
                                            {related.category}
                                        </span>
                                        <h3 className="font-semibold text-foreground mt-1 line-clamp-2 group-hover:text-primary transition-colors">
                                            {related.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                            {related.excerpt}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </article>

            <Footer />
        </main>
    );
}
