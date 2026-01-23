"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { uploadImage, deleteImage } from "@/lib/supabase-storage";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    onRemove?: () => void;
    folder?: string;
    disabled?: boolean;
    className?: string;
}

export default function ImageUpload({
    value,
    onChange,
    onRemove,
    folder = "covers",
    disabled = false,
    className = "",
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleUpload = useCallback(
        async (file: File) => {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                setError("File harus berupa gambar");
                return;
            }

            // Validate file size (max 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                setError("Ukuran gambar maksimal 5MB");
                return;
            }

            setError(null);
            setUploading(true);

            try {
                // Delete old image if exists
                if (value) {
                    await deleteImage(value);
                }

                // Upload new image
                const url = await uploadImage(file, folder);

                if (url) {
                    onChange(url);
                } else {
                    setError("Gagal mengupload gambar");
                }
            } catch (err) {
                console.error("Upload error:", err);
                setError("Terjadi kesalahan saat upload");
            } finally {
                setUploading(false);
            }
        },
        [value, folder, onChange]
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleUpload(file);
        }
        // Reset input value to allow re-uploading same file
        e.target.value = "";
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (disabled || uploading) return;

        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleUpload(file);
        }
    };

    const handleRemove = async () => {
        if (value && onRemove) {
            setUploading(true);
            try {
                await deleteImage(value);
                onRemove();
            } catch (err) {
                console.error("Delete error:", err);
                setError("Gagal menghapus gambar");
            } finally {
                setUploading(false);
            }
        }
    };

    const openFileDialog = () => {
        if (!disabled && !uploading) {
            inputRef.current?.click();
        }
    };

    return (
        <div className={`w-full ${className}`}>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={disabled || uploading}
                className="hidden"
            />

            {value ? (
                // Preview uploaded image
                <div className="relative group">
                    <img
                        src={value}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={openFileDialog}
                            disabled={disabled || uploading}
                            className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                            title="Ganti gambar"
                        >
                            {uploading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Upload className="w-5 h-5" />
                            )}
                        </button>
                        {onRemove && (
                            <button
                                type="button"
                                onClick={handleRemove}
                                disabled={disabled || uploading}
                                className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                                title="Hapus gambar"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                // Upload dropzone
                <div
                    onClick={openFileDialog}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`
                        relative border-2 border-dashed rounded-lg p-8 
                        flex flex-col items-center justify-center gap-3
                        cursor-pointer transition-colors
                        ${dragActive
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                        }
                        ${disabled || uploading ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                >
                    {uploading ? (
                        <>
                            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                            <p className="text-sm text-gray-600">Mengupload...</p>
                        </>
                    ) : (
                        <>
                            <div className="p-3 bg-gray-100 rounded-full">
                                <ImageIcon className="w-8 h-8 text-gray-400" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-700">
                                    Klik untuk upload atau drag & drop
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    PNG, JPG, GIF hingga 5MB
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}

            {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
