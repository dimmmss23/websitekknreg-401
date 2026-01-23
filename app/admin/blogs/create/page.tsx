"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ImageUpload from "@/components/ImageUpload";
import RichTextEditor from "@/components/RichTextEditor";
import AdminNavbar from "@/components/AdminNavbar";

export default function CreateBlogPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        category: "",
        excerpt: "",
        content: "",
        imageUrl: "",
        publishedAt: "",
    });

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setFormData({ ...formData, title, slug: generateSlug(title) });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/blogs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to create blog");

            router.push("/admin/blogs");
            router.refresh();
        } catch (error) {
            alert("Failed to create blog");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <AdminNavbar />
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
                <Link
                    href="/admin/blogs"
                    className="flex items-center text-gray-500 hover:text-gray-700 mb-6"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Kembali
                </Link>

                <h1 className="text-2xl font-bold text-gray-800 mb-6">Tambah Blog Baru</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Judul</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={handleTitleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Slug</label>
                        <input
                            type="text"
                            required
                            readOnly
                            value={formData.slug}
                            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-500 shadow-sm sm:text-sm p-2 border"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Kategori</label>
                        <select
                            required
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        >
                            <option value="">Pilih Kategori</option>
                            <option value="Kegiatan">Kegiatan</option>
                            <option value="Program Digital">Program Digital</option>
                            <option value="Pendidikan">Pendidikan</option>
                            <option value="Sosial">Sosial</option>
                            <option value="Berita">Berita</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tanggal Publish</label>
                        <input
                            type="date"
                            required
                            value={formData.publishedAt}
                            onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Gambar Cover
                        </label>
                        <ImageUpload
                            value={formData.imageUrl}
                            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                            onRemove={() => setFormData({ ...formData, imageUrl: "" })}
                            folder="covers"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ringkasan (Excerpt)</label>
                        <p className="text-xs text-gray-500 mb-2">
                            Ringkasan singkat untuk ditampilkan di daftar blog
                        </p>
                        <textarea
                            required
                            rows={3}
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Konten Artikel
                        </label>
                        <p className="text-xs text-gray-500 mb-2">
                            Tulis konten artikel dan sisipkan gambar langsung di dalam teks
                        </p>
                        <RichTextEditor
                            value={formData.content}
                            onChange={(content) => setFormData({ ...formData, content })}
                            disabled={loading}
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Menyimpan..." : "Simpan Blog"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
