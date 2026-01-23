"use client";

import { useState, useRef } from "react";
import { uploadAnggotaImage } from "@/lib/upload-anggota";

interface AnggotaFormProps {
  initialData?: {
    id?: number;
    nama: string;
    jabatan: string;
    fotoUrl: string;
    keterangan?: string;
    mediaSosial?: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AnggotaForm({ initialData, onSuccess, onCancel }: AnggotaFormProps) {
  const [form, setForm] = useState({
    nama: initialData?.nama || "",
    jabatan: initialData?.jabatan || "",
    fotoUrl: initialData?.fotoUrl || "",
    keterangan: initialData?.keterangan || "",
    mediaSosial: initialData?.mediaSosial || "",
  });
  const [loading, setLoading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const url = await uploadAnggotaImage(file);
    if (url) setForm((f) => ({ ...f, fotoUrl: url }));
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const method = initialData?.id ? "PUT" : "POST";
    const url = initialData?.id ? `/api/anggota/${initialData.id}` : "/api/anggota";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 border rounded-lg p-6 mb-6">
      <div className="mb-4 flex items-center gap-4">
        {form.fotoUrl ? (
          <img src={form.fotoUrl} alt="Foto" className="w-20 h-20 object-cover rounded-full border" />
        ) : (
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">No Foto</div>
        )}
        <div>
          <input
            type="file"
            accept="image/*"
            ref={fileInput}
            onChange={handleFile}
            className="hidden"
            disabled={loading}
          />
          <button
            type="button"
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            onClick={() => fileInput.current?.click()}
            disabled={loading}
          >
            {form.fotoUrl ? "Ganti Foto" : "Upload Foto"}
          </button>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Nama</label>
        <input
          type="text"
          name="nama"
          value={form.nama}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
          disabled={loading}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Jabatan</label>
        <input
          type="text"
          name="jabatan"
          value={form.jabatan}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
          disabled={loading}
          placeholder="Contoh: Ketua, Anggota"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Keterangan</label>
        <textarea
          name="keterangan"
          value={form.keterangan}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          rows={2}
          disabled={loading}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Media Sosial (Link)</label>
        <input
          type="url"
          name="mediaSosial"
          value={form.mediaSosial}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          placeholder="https://instagram.com/username"
          disabled={loading}
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Menyimpan..." : initialData?.id ? "Update" : "Simpan"}
        </button>
        <button
          type="button"
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          onClick={onCancel}
          disabled={loading}
        >
          Batal
        </button>
      </div>
    </form>
  );
}
