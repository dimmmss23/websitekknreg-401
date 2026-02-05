import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";

// Define admin emails (can be moved to env or database later)
const ADMIN_EMAILS = ["admin@example.com"];

export const dynamic = 'force-dynamic';

// Helper function to mask email
function maskEmail(email: string): string {
    const [localPart, domain] = email.split("@");
    if (!localPart || !domain) return "***@***";
    const maskedLocal = localPart.length > 2
        ? localPart.substring(0, 2) + "***"
        : localPart[0] + "***";
    return `${maskedLocal}@${domain}`;
}

// Helper function to mask name
function maskName(name: string | null): string {
    if (!name) return "***";
    return name.length > 2
        ? name.substring(0, 2) + "***"
        : name[0] + "***";
}

export async function GET() {
    try {
        // Check if user is authenticated as admin
        const session = await auth();
        const isAdmin = session?.user?.email && ADMIN_EMAILS.includes(session.user.email);

        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
            },
            orderBy: { createdAt: "desc" },
        });

        // If admin, return full data
        if (isAdmin) {
            return NextResponse.json(users);
        }

        // If public, return masked data (excluding role for privacy)
        const maskedUsers = users.map((user) => ({
            id: user.id,
            email: maskEmail(user.email),
            name: maskName(user.name),
            createdAt: user.createdAt,
        }));

        return NextResponse.json(maskedUsers);
    } catch (e) {
        console.error("Error fetching users:", e);
        return NextResponse.json({ error: "Gagal mengambil data pengguna" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: "Email dan password wajib diisi" }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: "Email sudah digunakan" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword },
        });

        return NextResponse.json(user, { status: 201 });
    } catch (e) {
        return NextResponse.json({ error: "Gagal membuat user" }, { status: 500 });
    }
}
