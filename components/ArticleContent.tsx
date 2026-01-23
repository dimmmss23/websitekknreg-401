"use client";

import { useState } from "react";
import ImageLightbox from "./ImageLightbox";

interface ArticleContentProps {
    content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
    const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);

    // Parse markdown to HTML with clickable images
    const renderContent = (text: string) => {
        let html = text
            // Escape HTML first
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            // Headers
            .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-8 mb-4 text-foreground">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-10 mb-5 text-foreground">$1</h2>')
            // Bold & Italic
            .replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>")
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*(.*?)\*/g, "<em>$1</em>")
            // Links
            .replace(
                /\[(.*?)\]\((.*?)\)/g,
                '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
            )
            // Blockquotes
            .replace(
                /^&gt; (.*$)/gim,
                '<blockquote class="border-l-4 border-primary/50 pl-4 italic text-muted-foreground my-6 py-2">$1</blockquote>'
            )
            // Horizontal rule
            .replace(/^---$/gim, '<hr class="my-10 border-border" />')
            // Lists - ordered
            .replace(/^\d+\. (.*$)/gim, '<li class="ml-6 list-decimal text-foreground/90">$1</li>')
            // Lists - unordered
            .replace(/^- (.*$)/gim, '<li class="ml-6 list-disc text-foreground/90">$1</li>')
            // Paragraphs
            .replace(/\n\n/g, '</p><p class="mb-5 text-foreground/90 leading-relaxed text-lg">')
            .replace(/\n/g, "<br />");

        return `<p class="mb-5 text-foreground/90 leading-relaxed text-lg">${html}</p>`;
    };

    // Extract images and their positions
    const parseContentWithImages = (text: string) => {
        const parts: { type: "text" | "image"; content: string; caption?: string; alt?: string }[] = [];

        // Regex to find images with optional caption
        // Matches ![alt](url) followed optionally by *caption*
        const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)(?:\s*\n\*(.*?)\*)?/g;
        let lastIndex = 0;
        let match;

        while ((match = imageRegex.exec(text)) !== null) {
            // Add text before image
            if (match.index > lastIndex) {
                const textContent = text.substring(lastIndex, match.index);
                if (textContent.trim()) {
                    parts.push({ type: "text", content: textContent });
                }
            }

            // Add image
            parts.push({
                type: "image",
                content: match[2], // URL
                alt: match[1] || "Gambar artikel",
                caption: match[3] || undefined,
            });

            lastIndex = match.index + match[0].length;
        }

        // Add remaining text
        if (lastIndex < text.length) {
            const textContent = text.substring(lastIndex);
            if (textContent.trim()) {
                parts.push({ type: "text", content: textContent });
            }
        }

        return parts;
    };

    const contentParts = parseContentWithImages(content);

    return (
        <>
            <div className="article-content">
                {contentParts.map((part, index) => {
                    if (part.type === "image") {
                        return (
                            <figure key={index} className="my-8">
                                <div
                                    className="relative cursor-pointer group"
                                    onClick={() => setLightboxImage({ src: part.content, alt: part.alt || "" })}
                                >
                                    <img
                                        src={part.content}
                                        alt={part.alt}
                                        className="w-full rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-xl flex items-center justify-center">
                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                                            Klik untuk memperbesar
                                        </span>
                                    </div>
                                </div>
                                {(part.caption || (part.alt && part.alt !== "Gambar artikel")) && (
                                    <figcaption className="text-center text-sm text-muted-foreground mt-3 italic bg-secondary/30 p-2 rounded-md">
                                        {part.caption ? part.caption.replace(/^Keterangan:\s*/i, "") : part.alt}
                                    </figcaption>
                                )}
                            </figure>
                        );
                    } else {
                        return (
                            <div
                                key={index}
                                className="prose prose-lg dark:prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: renderContent(part.content) }}
                            />
                        );
                    }
                })}
            </div>

            {/* Lightbox */}
            {lightboxImage && (
                <ImageLightbox
                    src={lightboxImage.src}
                    alt={lightboxImage.alt}
                    onClose={() => setLightboxImage(null)}
                />
            )}
        </>
    );
}
