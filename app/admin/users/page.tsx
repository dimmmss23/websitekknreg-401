"use client";

import { useState, useEffect } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import UserForm from "@/components/UserForm";

interface User {
    id: number;
    name: string;
    email: string;
    createdAt: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editData, setEditData] = useState<User | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/users", { cache: "no-store" });
            const data = await res.json();
            setUsers(data);
        } catch {
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item: User) => {
        setEditData(item);
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Hapus user ini?")) return;
        await fetch(`/api/users/${id}`, { method: "DELETE" });
        fetchUsers();
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <AdminNavbar />
            <div className="max-w-4xl mx-auto py-10 px-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Manajemen User Admin</h1>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        onClick={() => { setEditData(null); setShowForm(true); }}
                    >
                        Tambah User
                    </button>
                </div>
                {showForm && (
                    <UserForm
                        initialData={editData || undefined}
                        onSuccess={() => { setShowForm(false); fetchUsers(); }}
                        onCancel={() => setShowForm(false)}
                    />
                )}
                <div className="bg-white rounded-lg shadow p-6 mt-6">
                    {loading ? (
                        <div>Loading...</div>
                    ) : users.length === 0 ? (
                        <div>Belum ada user.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-2">Nama</th>
                                        <th className="text-left py-3 px-2">Email</th>
                                        <th className="text-left py-3 px-2">Dibuat Pada</th>
                                        <th className="py-3 px-2"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u) => (
                                        <tr key={u.id} className="border-b last:border-0 hover:bg-gray-50">
                                            <td className="py-3 px-2">{u.name || "-"}</td>
                                            <td className="py-3 px-2">{u.email}</td>
                                            <td className="py-3 px-2">{new Date(u.createdAt).toLocaleDateString("id-ID")}</td>
                                            <td className="py-3 px-2 text-right">
                                                <button className="text-blue-600 mr-4 hover:underline" onClick={() => handleEdit(u)}>Edit</button>
                                                <button className="text-red-600 hover:underline" onClick={() => handleDelete(u.id)}>Hapus</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
