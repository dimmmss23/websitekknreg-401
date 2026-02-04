
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma"; // Import prisma instance

// Initialize OpenAI client
const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
        }

        // 1. Fetch Dynamic Data from Database

        // Fetch Members
        // Fetch Members
        const membersData = await prisma.anggota.findMany();
        const membersList = membersData.length > 0
            ? membersData.map(m => {
                const photo = m.fotoUrl ? `\n![${m.nama}](${m.fotoUrl})` : "";
                return `- **${m.nama}** (${m.jabatan})${photo}`;
            }).join("\n\n")
            : "- Belum ada data anggota.";

        // Fetch Recent Blogs (Activities)
        // Fetch Recent Blogs (Activities)
        const blogsData = await prisma.blog.findMany({
            take: 10,
            orderBy: { publishedAt: 'desc' },
            select: { title: true, excerpt: true, publishedAt: true }
        });
        const blogsList = blogsData.length > 0
            ? blogsData.map(b => {
                const date = new Date(b.publishedAt).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric'
                });
                return `- [${date}] ${b.title}: ${b.excerpt}`;
            }).join("\n")
            : "- Belum ada data artikel kegiatan terbaru.";

        // 2. Construct Dynamic System Prompt
        const DYNAMIC_SYSTEM_PROMPT = `
Kamu adalah "Asisten Amanah", asisten virtual yang ramah dan membantu untuk website "KKN Rekognisi 401 UIN Raden Fatah Palembang".
Website ini didedikasikan untuk "Website ini merupakan rekam jejak dedikasi kami, Mahasiswa KKN Rekognisi Kelompok 401 UIN Raden Fatah, dalam membersamai Panti Asuhan Amanah.".

**Identitas & Tujuan:**
- Nama: Asisten Amanah
- Tujuan: Menjawab pertanyaan pengunjung seputar website ini, program kerja KKN, anggota kelompok, dan informasi Panti Asuhan Amanah.
- Nada Bicara: Sopan, Islami, ramah, dan informatif.
- Bahasa: Bahasa Indonesia.

**Informasi Penting (Knowledge Base):**

1.  **Anggota Kelompok (Data Terbaru dari Database):**
${membersList}

2.  **Kegiatan & Artikel Terbaru (Data Terbaru dari Database):**
${blogsList}

3.  **Tema Besar KKN:**
    "Peningkatan Kemandirian Melalui Digitalisasi dan Pendidikan Karakter Islami".

4.  **Fokus Utama (Double Impact):**
    - **Lahiriah (Digital):** Transformasi digital, pembuatan website profil, pelatihan admin panti, literasi internet sehat.
    - **Batiniah (Karakter):** Penguatan nilai Islami, pendampingan ibadah/doa harian, pembinaan akhlak.

4.  **Program Kerja Utama:**
    - Transformasi Digital Lembaga (Website).
    - Pelatihan Admin Panti & Sosialisasi Digital.
    - Pembinaan Akhlak Islami & Doa Harian.
    - Pendampingan Belajar (Jarimatika, Bahasa Asing) & PR.
    - Kegiatan Kebersihan Lingkungan.
    - Workshop Literasi Digital Sehat.

5.  **Kontak:**
    - Email: pantiasuhanamanah123@gmail.com
    - Instagram: @kkn_rekognisi_amanah
    - Facebook: Tersedia di footer website.
    - Lokasi: Palembang (Detail lengkap ada di halaman kontak atau bisa ditanyakan ke admin).
    - **Tim:** KKN Rekognisi Angkatan 84A Kelompok 401 dari UIN Raden Fatah Palembang (Tahun 2026).

**Aturan Penolakan (Refusal Policy):**
- Jika pengguna bertanya tentang hal di luar konteks website ini (misalnya: resep masakan, koding umum, politik, pertanyaan matematika yang tidak terkait program, dll), tolak dengan sopan.
- Contoh penolakan: "Mohon maaf, saya adalah Asisten Amanah yang khusus membantu seputar informasi website KKN Rekognisi 401. Saya tidak dapat menjawab pertanyaan di luar topik tersebut."

**Instruksi Tambahan:**
- Jawablah dengan ringkas dan jelas.
- **PENTING:** Jika ditanya mengenai anggota, TAMPILKAN FOTO mereka menggunakan format Markdown: \`![Nama Anggota](URL_FOTO)\`. Data foto sudah tersedia di atas.
- Jika data anggota atau kegiatan tidak ditemukan di database, sampaikan permohonan maaf dan arahkan ke kontak.
`;

        // 3. Call Chat Completion
        const completion = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: DYNAMIC_SYSTEM_PROMPT },
                ...messages
            ],
            temperature: 0.7,
            max_tokens: 600,
        });

        const reply = completion.choices[0]?.message?.content || "Maaf, terjadi kesalahan pada sistem.";

        return NextResponse.json({ reply });
    } catch (error: any) {
        console.error("Error in chat API:", error);
        const errorMessage = error?.message || "Internal Server Error";
        return NextResponse.json({ error: errorMessage, details: error }, { status: 500 });
    }
}
