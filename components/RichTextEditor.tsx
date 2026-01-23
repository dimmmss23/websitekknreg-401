"use client";

import { useState, useRef, useCallback } from "react";
import {
    Bold,
    Italic,
    Heading1,
    Heading2,
    List,
    ListOrdered,
    Image as ImageIcon,
    Link as LinkIcon,
    Quote,
    Minus,
    Loader2,
    Eye,
    Edit,
} from "lucide-react";
import { uploadImage } from "@/lib/supabase-storage";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

export default function RichTextEditor({
    value,
    onChange,
    placeholder = "Tulis konten artikel...",
    disabled = false,
}: RichTextEditorProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const insertAtCursor = (before: string, after: string = "") => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);
        const newText =
            value.substring(0, start) +
            before +
            selectedText +
            after +
            value.substring(end);

        onChange(newText);

        // Set cursor position
        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + before.length + selectedText.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const url = await uploadImage(file, "content");
            if (url) {
                // Insert image with caption placeholder
                const imageMarkdown = `\n\n![Deskripsi gambar](${url})\n*Keterangan: Tulis caption di sini*\n\n`;
                insertAtCursor(imageMarkdown);
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Gagal mengupload gambar");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    const toolbarButtons = [
        {
            icon: Bold,
            title: "Bold",
            action: () => insertAtCursor("**", "**"),
        },
        {
            icon: Italic,
            title: "Italic",
            action: () => insertAtCursor("*", "*"),
        },
        { type: "divider" },
        {
            icon: Heading1,
            title: "Heading 1",
            action: () => insertAtCursor("\n## ", "\n"),
        },
        {
            icon: Heading2,
            title: "Heading 2",
            action: () => insertAtCursor("\n### ", "\n"),
        },
        { type: "divider" },
        {
            icon: List,
            title: "Bullet List",
            action: () => insertAtCursor("\n- ", ""),
        },
        {
            icon: ListOrdered,
            title: "Numbered List",
            action: () => insertAtCursor("\n1. ", ""),
        },
        { type: "divider" },
        {
            icon: Quote,
            title: "Quote",
            action: () => insertAtCursor("\n> ", "\n"),
        },
        {
            icon: LinkIcon,
            title: "Link",
            action: () => {
                const url = prompt("Masukkan URL:");
                if (url) insertAtCursor("[", `](${url})`);
            },
        },
        {
            icon: ImageIcon,
            title: "Insert Image",
            action: () => fileInputRef.current?.click(),
        },
        { type: "divider" },
        {
            icon: Minus,
            title: "Horizontal Line",
            action: () => insertAtCursor("\n\n---\n\n"),
        },
    ];

    // Simple markdown to HTML converter
    const renderPreview = (text: string) => {
        let html = text
            // Escape HTML
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            // Headers
            .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-3">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')
            // Bold & Italic
            .replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>")
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*(.*?)\*/g, "<em>$1</em>")
            // Images with caption
            .replace(
                /!\[(.*?)\]\((.*?)\)\n\*(.*?)\*/g,
                `<figure class="my-6">
                    <img src="$2" alt="$1" class="w-full rounded-lg shadow-md" />
                    <figcaption class="text-sm text-gray-600 dark:text-gray-400 text-center mt-2 italic">$3</figcaption>
                </figure>`
            )
            // Images without caption
            .replace(
                /!\[(.*?)\]\((.*?)\)/g,
                `<figure class="my-6">
                    <img src="$2" alt="$1" class="w-full rounded-lg shadow-md" />
                </figure>`
            )
            // Links
            .replace(
                /\[(.*?)\]\((.*?)\)/g,
                '<a href="$2" class="text-blue-600 hover:underline" target="_blank">$1</a>'
            )
            // Blockquotes
            .replace(
                /^&gt; (.*$)/gim,
                '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600 dark:text-gray-400 my-4">$1</blockquote>'
            )
            // Horizontal rule
            .replace(/^---$/gim, '<hr class="my-8 border-gray-300 dark:border-gray-600" />')
            // Lists
            .replace(/^\d+\. (.*$)/gim, '<li class="ml-6 list-decimal">$1</li>')
            .replace(/^- (.*$)/gim, '<li class="ml-6 list-disc">$1</li>')
            // Paragraphs
            .replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed">')
            .replace(/\n/g, "<br />");

        return `<p class="mb-4 leading-relaxed">${html}</p>`;
    };

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-300 flex-wrap">
                {toolbarButtons.map((btn, index) =>
                    btn.type === "divider" ? (
                        <div
                            key={index}
                            className="w-px h-6 bg-gray-300 mx-1"
                        />
                    ) : (
                        <button
                            key={index}
                            type="button"
                            onClick={btn.action}
                            disabled={disabled || uploading}
                            title={btn.title}
                            className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 transition-colors"
                        >
                            {btn.icon && <btn.icon className="w-4 h-4" />}
                        </button>
                    )
                )}

                <div className="flex-1" />

                {/* Preview Toggle */}
                <button
                    type="button"
                    onClick={() => setPreview(!preview)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                        preview
                            ? "bg-blue-100 text-blue-700"
                            : "hover:bg-gray-200"
                    }`}
                >
                    {preview ? (
                        <>
                            <Edit className="w-4 h-4" />
                            Edit
                        </>
                    ) : (
                        <>
                            <Eye className="w-4 h-4" />
                            Preview
                        </>
                    )}
                </button>
            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
            />

            {/* Upload indicator */}
            {uploading && (
                <div className="flex items-center gap-2 p-2 bg-blue-50 text-blue-700 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Mengupload gambar...
                </div>
            )}

            {/* Editor / Preview */}
            {preview ? (
                <div
                    className="min-h-[400px] p-4 prose prose-lg dark:prose-invert max-w-none bg-white"
                    dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
                />
            ) : (
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    rows={20}
                    className="w-full p-4 resize-none focus:outline-none font-mono text-sm"
                />
            )}

            {/* Help text */}
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
                Gunakan format Markdown. Klik tombol 📷 untuk menyisipkan gambar.
                Format caption: <code>![alt](url)</code> diikuti <code>*caption*</code>
            </div>
        </div>
    );
}
