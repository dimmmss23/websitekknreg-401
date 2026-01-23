import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { nama, jabatan, fotoUrl, keterangan, mediaSosial } = body;
    const anggota = await prisma.anggota.update({
      where: { id: Number(id) },
      data: { nama, jabatan, fotoUrl, keterangan, mediaSosial },
    });
    return NextResponse.json(anggota);
  } catch (e) {
    return NextResponse.json({ error: "Gagal update anggota" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.anggota.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Gagal hapus anggota" }, { status: 500 });
  }
}
