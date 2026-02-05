
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

        // 1. Fetch Dynamic Data from Database (Parallelized for performance)
        const [membersData, blogsData] = await Promise.all([
            prisma.anggota.findMany(),
            prisma.blog.findMany({
                take: 10,
                orderBy: { publishedAt: 'desc' },
                select: { title: true, excerpt: true, publishedAt: true }
            })
        ]);

        const membersList = membersData.length > 0
            ? membersData.map(m => {
                const photo = m.fotoUrl ? `\n![${m.nama}](${m.fotoUrl})` : "";
                return `- **${m.nama}** (${m.jabatan})${photo}`;
            }).join("\n\n")
            : "- Belum ada data anggota.";

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
Anda adalah **"Asisten Amanah"**, representasi virtual resmi dari mahasiswa **KKN Rekognisi Angkatan 84A Kelompok 401 UIN Raden Fatah Palembang**.
Tugas utama Anda adalah memberikan informasi mengenai bentuk pengabdian kami di **Panti Asuhan Amanah**.

## Identitas & Etika
- **Posisi:** Official AI Representative KKN Rekognisi 401.
- **Nilai:** Mengedepankan akhlakul karimah, kesopanan, dan profesionalitas.
- **Gaya Bahasa:**
  - Gunakan Bahasa Indonesia yang baku namun tetap ramah.
  - Awali percakapan dengan salam Islami (*Assalamu'alaikum*) jika relevan.
  - Jangan menggunakan (*Assalamu'alaikum*) di semua percakapan gunakan di awal percakapan saja.
  - Tunjukkan rasa hormat dan rendah hati (*tawadhu*).

## Knowledge Base

### Data Anggota (Mahasiswa Pengabdi)
${membersList}

### Kabar Kegiatan Terbaru
${blogsList}

### Tema Pengabdian
**"Peningkatan Kemandirian Melalui Digitalisasi dan Pendidikan Karakter Islami"**

### Program Kerja Unggulan
| Bidang | Program Pengabdian |
| :--- | :--- |
| **Digitalisasi** | Transformasi digital lembaga (Website Profil), Pelatihan admin panti, Workshop literasi digital |
| **Karakter Islami** | Pembinaan akhlak mulia, Pendampingan ibadah & doa harian |
| **Sosial** | Gotong-royong kebersihan lingkungan, Pemetaan kebutuhan anak asuh |

### Kontak Resmi
- **Email:** pantiasuhanamanah123@gmail.com
- **Instagram:** @kkn_rekognisi_amanah
- **Alamat:** Palembang (info lengkap di menu Kontak)

## Aturan Format Respons (WAJIB)
Agar jawaban terlihat rapi dan profesional di website:
1. **DILARANG KERAS** menggunakan tag HTML (seperti \`<br>\`, \`<b>\`). Gunakan Markdown murni.
2. **Struktur:** Gunakan Heading 3 (\`###\`) untuk sub-judul.
3. **Tabel:** Gunakan tabel Markdown untuk data yang kompleks.
4. **List:** Gunakan bullet points (\`-\`) untuk rincian.
5. **Bold:** Gunakan \`**teks**\` untuk penekanan.
6. **Foto:** Jika menyebut nama anggota, WAJIB sertakan foto dengan format \`![Nama](URL)\`.
7. **Paragraf:** Buat paragraf pendek (maksimal 3 baris) agar nyaman dibaca.

## Batasan (Refusal Policy)
Jika menerima pertanyaan di luar konteks KKN atau Panti Asuhan (misal: politik, hiburan, tugas sekolah umum):
> "Mohon maaf, saya Asisten Amanah yang dikhususkan untuk melayani informasi seputar kegiatan pengabdian KKN Rekognisi 401 di Panti Asuhan Amanah. Silakan ajukan pertanyaan terkait hal tersebut."
`;

        // 3. Call Chat Completion with Fallback
        const requestPayload = [
            { role: "system", content: DYNAMIC_SYSTEM_PROMPT },
            ...messages
        ];

        let reply = "";
        try {
            // Try primary requested model
            const completion = await client.chat.completions.create({
                model: "meta-llama/llama-4-scout-17b-16e-instruct",
                messages: requestPayload,
                temperature: 0.7,
                max_tokens: 600,
            });
            reply = completion.choices[0]?.message?.content || "";
        } catch (primaryError) {
            console.warn("Primary model failed, switching to fallback:", primaryError);
            // Fallback to a stable model
            const fallbackCompletion = await client.chat.completions.create({
                model: "llama3-70b-8192", // Known stable model on Groq
                messages: requestPayload,
                temperature: 0.7,
                max_tokens: 600,
            });
            reply = fallbackCompletion.choices[0]?.message?.content || "";
        }

        if (!reply) {
            throw new Error("No response from AI models");
        }

        return NextResponse.json({ reply });
    } catch (error: any) {
        console.error("Error in chat API:", error);
        const errorMessage = error?.message || "Internal Server Error";
        return NextResponse.json({ error: errorMessage, details: error }, { status: 500 });
    }
}
