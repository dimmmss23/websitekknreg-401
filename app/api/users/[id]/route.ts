import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { name, email, password } = body;

        const updates: any = { name, email };
        if (password) {
            updates.password = await bcrypt.hash(password, 10);
        }

        const user = await prisma.user.update({
            where: { id: Number(id) },
            data: updates,
        });
        return NextResponse.json(user);
    } catch (e) {
        return NextResponse.json({ error: "Gagal update user" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.user.delete({ where: { id: Number(id) } });
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: "Gagal hapus user" }, { status: 500 });
    }
}
