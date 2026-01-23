"use client";

import { useState, useEffect } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import AnggotaForm from "@/components/AnggotaForm";

interface Anggota {
  id: number;
  nama: string;
  jabatan: string;
  fotoUrl: string;
  keterangan?: string;
  mediaSosial?: string;
}

export default function AnggotaPage() {
  const [anggota, setAnggota] = useState<Anggota[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<Anggota | null>(null);

  useEffect(() => {
    fetchAnggota();
  }, []);

  const fetchAnggota = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/anggota", { cache: "no-store" });
      const data = await res.json();
      setAnggota(data);
    } catch {
      setAnggota([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: Anggota) => {
    setEditData(item);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus anggota ini?")) return;
    await fetch(`/api/anggota/${id}`, { method: "DELETE" });
    fetchAnggota();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <div className="max-w-3xl mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manajemen Anggota</h1>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            onClick={() => { setEditData(null); setShowForm(true); }}
          >
            Tambah Anggota
          </button>
        </div>
        {showForm && (
          <AnggotaForm
            initialData={editData || undefined}
            onSuccess={() => { setShowForm(false); fetchAnggota(); }}
            onCancel={() => setShowForm(false)}
          />
        )}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          {loading ? (
            <div>Loading...</div>
          ) : anggota.length === 0 ? (
            <div>Belum ada anggota.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Foto</th>
                  <th className="text-left">Nama</th>
                  <th className="text-left">Jabatan</th>
                  <th className="text-left">Keterangan</th>
                  <th className="text-left">Media Sosial</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {anggota.map((a) => (
                  <tr key={a.id}>
                    <td className="py-2">
                      <img src={a.fotoUrl} alt={a.nama} className="w-14 h-14 object-cover rounded-full border" />
                    </td>
                    <td>{a.nama}</td>
                    <td>{a.jabatan}</td>
                    <td>{a.keterangan}</td>
                    <td>
                      {a.mediaSosial ? (
                        <a href={a.mediaSosial} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Link</a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td>
                      <button className="text-blue-600 mr-2" onClick={() => handleEdit(a)}>Edit</button>
                      <button className="text-red-600" onClick={() => handleDelete(a.id)}>Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
