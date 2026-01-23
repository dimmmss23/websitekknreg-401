import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const anggota = await prisma.anggota.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(anggota);
  } catch (e) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nama, jabatan, fotoUrl, keterangan, mediaSosial } = body;
    const anggota = await prisma.anggota.create({
      data: { nama, jabatan, fotoUrl, keterangan, mediaSosial },
    });
    return NextResponse.json(anggota, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Gagal menambah anggota" }, { status: 500 });
  }
}
