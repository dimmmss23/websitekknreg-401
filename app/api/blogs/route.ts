import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const blogs = await prisma.blog.findMany({
            orderBy: { publishedAt: "desc" },
        });
        return NextResponse.json(blogs);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { title, slug, category, excerpt, content, imageUrl, publishedAt } = body;

        const blog = await prisma.blog.create({
            data: {
                title,
                slug,
                category,
                excerpt,
                content,
                imageUrl,
                publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
                createdAt: publishedAt ? new Date(publishedAt) : new Date(),
            },
        });

        return NextResponse.json(blog, { status: 201 });
    } catch (error) {
        console.error("Create blog error:", error);
        return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
    }
}
