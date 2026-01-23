import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { deleteImage } from "@/lib/supabase-storage";

// Helper function to extract image URLs from markdown content
function extractImageUrls(content: string): string[] {
    const regex = /!\[.*?\]\((https?:\/\/[^\s)]+)\)/g;
    const urls: string[] = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
        urls.push(match[1]);
    }
    return urls;
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const blog = await prisma.blog.findUnique({
            where: { id: parseInt(id) },
        });

        if (!blog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        return NextResponse.json(blog);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await req.json();
        const { title, slug, category, excerpt, content, imageUrl, publishedAt } = body;

        const blog = await prisma.blog.update({
            where: { id: parseInt(id) },
            data: {
                title,
                slug,
                category,
                excerpt,
                content,
                imageUrl,
                publishedAt: publishedAt ? new Date(publishedAt) : undefined,
                createdAt: publishedAt ? new Date(publishedAt) : undefined,
            },
        });

        return NextResponse.json(blog);
    } catch (error) {
        console.error("Update blog error:", error);
        return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;

        // Get blog to delete images from storage
        const blog = await prisma.blog.findUnique({
            where: { id: parseInt(id) },
        });

        if (blog) {
            // Delete cover image from storage
            if (blog.imageUrl) {
                await deleteImage(blog.imageUrl);
            }

            // Delete inline images from storage (extracted from content)
            const inlineImages = extractImageUrls(blog.content);
            for (const imgUrl of inlineImages) {
                await deleteImage(imgUrl);
            }
        }

        // Delete blog
        await prisma.blog.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ message: "Blog deleted successfully" });
    } catch (error) {
        console.error("Delete blog error:", error);
        return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
    }
}
