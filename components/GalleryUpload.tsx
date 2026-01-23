"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2, GripVertical, Plus } from "lucide-react";
import { uploadImage, deleteImage } from "@/lib/supabase-storage";

export interface GalleryImage {
    id?: number;
    imageUrl: string;
    caption: string;
    altText: string;
    order: number;
    isNew?: boolean;
    isDeleted?: boolean;
}

interface GalleryUploadProps {
    images: GalleryImage[];
    onChange: (images: GalleryImage[]) => void;
    folder?: string;
    disabled?: boolean;
    maxImages?: number;
}

export default function GalleryUpload({
    images,
    onChange,
    folder = "gallery",
    disabled = false,
    maxImages = 20,
}: GalleryUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const activeImages = images.filter((img) => !img.isDeleted);

    const handleUpload = async (files: FileList) => {
        if (activeImages.length + files.length > maxImages) {
            setError(`Maksimal ${maxImages} gambar`);
            return;
        }

        setError(null);
        setUploading(true);

        try {
            const newImages: GalleryImage[] = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                // Validate file type
                if (!file.type.startsWith("image/")) {
                    continue;
                }

                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    continue;
                }

                const url = await uploadImage(file, folder);
                if (url) {
                    newImages.push({
                        imageUrl: url,
                        caption: "",
                        altText: "",
                        order: activeImages.length + newImages.length,
                        isNew: true,
                    });
                }
            }

            if (newImages.length > 0) {
                onChange([...images, ...newImages]);
            }
        } catch (err) {
            console.error("Upload error:", err);
            setError("Gagal mengupload beberapa gambar");
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleUpload(files);
        }
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

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleUpload(files);
        }
    };

    const handleRemove = async (index: number) => {
        const image = images[index];
        
        // If it's a new image, delete from storage and remove from array
        if (image.isNew) {
            await deleteImage(image.imageUrl);
            const newImages = images.filter((_, i) => i !== index);
            // Reorder remaining images
            newImages.forEach((img, i) => {
                if (!img.isDeleted) {
                    img.order = i;
                }
            });
            onChange(newImages);
        } else {
            // Mark existing image for deletion
            const newImages = [...images];
            newImages[index] = { ...image, isDeleted: true };
            onChange(newImages);
        }
    };

    const handleCaptionChange = (index: number, caption: string) => {
        const newImages = [...images];
        newImages[index] = { ...newImages[index], caption };
        onChange(newImages);
    };

    const handleAltTextChange = (index: number, altText: string) => {
        const newImages = [...images];
        newImages[index] = { ...newImages[index], altText };
        onChange(newImages);
    };

    const moveImage = (fromIndex: number, toIndex: number) => {
        if (toIndex < 0 || toIndex >= activeImages.length) return;

        const newImages = [...images];
        const activeOnly = newImages.filter((img) => !img.isDeleted);
        
        const [moved] = activeOnly.splice(fromIndex, 1);
        activeOnly.splice(toIndex, 0, moved);
        
        // Update order
        activeOnly.forEach((img, i) => {
            img.order = i;
        });

        // Combine with deleted images
        const deletedImages = newImages.filter((img) => img.isDeleted);
        onChange([...activeOnly, ...deletedImages]);
    };

    const openFileDialog = () => {
        if (!disabled && !uploading) {
            inputRef.current?.click();
        }
    };

    return (
        <div className="w-full space-y-4">
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                disabled={disabled || uploading}
                className="hidden"
            />

            {/* Image Grid */}
            {activeImages.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {images.map((image, index) => {
                        if (image.isDeleted) return null;
                        
                        const activeIndex = activeImages.findIndex(
                            (img) => img.imageUrl === image.imageUrl
                        );

                        return (
                            <div
                                key={image.imageUrl}
                                className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm"
                            >
                                <div className="flex gap-3">
                                    {/* Drag Handle & Image */}
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="flex gap-1">
                                            <button
                                                type="button"
                                                onClick={() => moveImage(activeIndex, activeIndex - 1)}
                                                disabled={activeIndex === 0}
                                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                                title="Pindah ke atas"
                                            >
                                                ↑
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => moveImage(activeIndex, activeIndex + 1)}
                                                disabled={activeIndex === activeImages.length - 1}
                                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                                title="Pindah ke bawah"
                                            >
                                                ↓
                                            </button>
                                        </div>
                                        <div className="relative w-24 h-24 flex-shrink-0">
                                            <img
                                                src={image.imageUrl}
                                                alt={image.altText || "Gallery image"}
                                                className="w-full h-full object-cover rounded-md"
                                            />
                                            <span className="absolute top-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                                                #{activeIndex + 1}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Caption & Alt Text */}
                                    <div className="flex-1 space-y-2">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                Caption / Deskripsi
                                            </label>
                                            <textarea
                                                value={image.caption}
                                                onChange={(e) => handleCaptionChange(index, e.target.value)}
                                                placeholder="Deskripsi foto ini..."
                                                rows={2}
                                                className="w-full text-sm border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                Alt Text (SEO)
                                            </label>
                                            <input
                                                type="text"
                                                value={image.altText}
                                                onChange={(e) => handleAltTextChange(index, e.target.value)}
                                                placeholder="Teks alternatif untuk aksesibilitas"
                                                className="w-full text-sm border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        type="button"
                                        onClick={() => handleRemove(index)}
                                        className="p-1 h-fit text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                                        title="Hapus gambar"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Upload Dropzone */}
            {activeImages.length < maxImages && (
                <div
                    onClick={openFileDialog}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`
                        relative border-2 border-dashed rounded-lg p-6 
                        flex flex-col items-center justify-center gap-2
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
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                            <p className="text-sm text-gray-600">Mengupload...</p>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-2">
                                <Plus className="w-5 h-5 text-gray-400" />
                                <ImageIcon className="w-6 h-6 text-gray-400" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-700">
                                    Klik atau drag & drop untuk tambah foto
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    PNG, JPG, GIF hingga 5MB ({activeImages.length}/{maxImages} foto)
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}

            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
