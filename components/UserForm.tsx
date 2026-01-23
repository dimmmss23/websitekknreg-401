"use client";

import { useState } from "react";

interface UserFormProps {
    initialData?: {
        id?: number;
        name: string;
        email: string;
    };
    onSuccess: () => void;
    onCancel: () => void;
}

export default function UserForm({ initialData, onSuccess, onCancel }: UserFormProps) {
    const [form, setForm] = useState({
        name: initialData?.name || "",
        email: initialData?.email || "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const method = initialData?.id ? "PUT" : "POST";
        const url = initialData?.id ? `/api/users/${initialData.id}` : "/api/users";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Gagal menyimpan user");
            }

            onSuccess();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-50 border rounded-lg p-6 mb-6">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Nama</label>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-3 py-2"
                    disabled={loading}
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-3 py-2"
                    disabled={loading}
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                    Password {initialData?.id && "(Kosongkan jika tidak ingin mengubah)"}
                </label>
                <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required={!initialData?.id}
                    className="w-full border rounded px-3 py-2"
                    disabled={loading}
                    minLength={6}
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
