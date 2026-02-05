"use client";

import { useState, useRef, useEffect } from "react";
import { useScroll, motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";

type Message = {
    role: "user" | "assistant";
    content: string;
};

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]); // Start empty
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, isLoading]);

    const sendMessage = async (text: string) => {
        if (!text.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: text };
        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        try {
            const apiMessages = [...messages, userMessage];

            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: apiMessages }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch response");
            }

            const data = await response.json();
            const botMessage: Message = { role: "assistant", content: data.reply };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error:", error);
            // Handle specific error cases if needed, otherwise generic message
            let errorMessage = "Maaf, terjadi kesalahan. Silakan coba lagi nanti.";
            if (error instanceof Error && error.message.includes("Failed to fetch")) {
                errorMessage = "Koneksi terputus. Mohon cek internet Anda.";
            }
            setMessages((prev) => [...prev, { role: "assistant", content: errorMessage }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(inputValue);
    };

    const quickPrompts = [
        "Apa program kerja KKN?",
        "Siapa anggota kelompok ini?",
        "Ada kegiatan apa bulan ini?"
    ];

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="w-[350px] sm:w-[400px] h-[550px] bg-card border border-border rounded-2xl shadow-xl flex flex-col pointer-events-auto mb-4 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-primary p-4 flex items-center justify-between text-primary-foreground">
                            <div className="flex items-center gap-2">
                                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-background/20 border border-primary-foreground/20">
                                    <Image
                                        src="/logo.png"
                                        alt="Logo KKN"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-heading font-medium text-sm">Asisten Amanah</h3>
                                    <p className="text-xs text-primary-foreground/80">Online</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-background/20 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto bg-muted/30 relative">
                            {messages.length === 0 ? (
                                /* Welcome View (Zero State) */
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                    <div className="relative w-20 h-20 mb-4 bg-primary/5 rounded-full flex items-center justify-center p-4">
                                        <Image
                                            src="/logo.png"
                                            alt="Logo KKN"
                                            width={80}
                                            height={80}
                                            className="object-contain"
                                        />
                                    </div>
                                    <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                                        Assalamu&#39;alaikum!
                                    </h3>
                                    <p className="text-muted-foreground text-sm mb-8 max-w-[240px]">
                                        Saya Asisten Amanah. Tanyakan sesuatu tentang website ini atau pilih topik di bawah:
                                    </p>

                                    <div className="grid gap-2 w-full">
                                        {quickPrompts.map((prompt, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => sendMessage(prompt)}
                                                className="w-full text-left p-3 text-sm bg-card border border-border rounded-xl hover:bg-primary/5 hover:border-primary/30 transition-colors text-foreground/80 hover:text-primary flex items-center justify-between group"
                                            >
                                                {prompt}
                                                <Send className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity -ml-3 group-hover:ml-0" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                /* Chat History */
                                <div className="p-4 space-y-4 min-h-full">
                                    {messages.map((msg, idx) => (
                                        <div
                                            key={idx}
                                            className={cn(
                                                "flex w-full mb-2",
                                                msg.role === "user" ? "justify-end" : "justify-start"
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "max-w-[85%] p-3 rounded-2xl text-sm font-sans leading-relaxed shadow-sm",
                                                    msg.role === "user"
                                                        ? "bg-primary text-primary-foreground rounded-br-none"
                                                        : "bg-card text-foreground border border-border rounded-bl-none"
                                                )}
                                            >
                                                {msg.role === "assistant" ? (
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkGfm]}
                                                        components={{
                                                            img: ({ node, ...props }) => (
                                                                <img {...props} className="rounded-lg mt-2 mb-1 max-w-full h-auto border border-border shadow-sm" style={{ maxHeight: '200px', objectFit: 'cover' }} />
                                                            ),
                                                            p: ({ node, ...props }) => <p {...props} className="mb-2 last:mb-0" />,
                                                            ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-4 mb-2 space-y-1" />,
                                                            ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-4 mb-2 space-y-1" />,
                                                            li: ({ node, ...props }) => <li {...props} className="mb-0.5" />,
                                                            strong: ({ node, ...props }) => <strong {...props} className="font-semibold text-primary" />,
                                                            h2: ({ node, ...props }) => <h2 {...props} className="text-base font-bold mt-3 mb-2 text-primary" />,
                                                            h3: ({ node, ...props }) => <h3 {...props} className="text-sm font-bold mt-2 mb-1 text-foreground" />,
                                                            table: ({ node, ...props }) => (
                                                                <div className="overflow-x-auto my-2">
                                                                    <table {...props} className="w-full text-xs border-collapse border border-border rounded" />
                                                                </div>
                                                            ),
                                                            thead: ({ node, ...props }) => <thead {...props} className="bg-muted" />,
                                                            th: ({ node, ...props }) => <th {...props} className="border border-border px-2 py-1 text-left font-semibold" />,
                                                            td: ({ node, ...props }) => <td {...props} className="border border-border px-2 py-1" />,
                                                            blockquote: ({ node, ...props }) => <blockquote {...props} className="border-l-2 border-primary pl-2 italic text-muted-foreground my-2" />,
                                                        }}
                                                    >
                                                        {msg.content}
                                                    </ReactMarkdown>
                                                ) : (
                                                    msg.content
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex justify-start w-full">
                                            <div className="bg-card border border-border p-3 rounded-2xl rounded-bl-none flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                                <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                                <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <form onSubmit={handleFormSubmit} className="p-4 bg-card border-t border-border flex items-center gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Tulis pertanyaan..."
                                className="flex-1 bg-muted/50 border border-input rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-sans"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !inputValue.trim()}
                                className="p-2.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="group relative flex items-center">
                {/* Tooltip */}
                <div className="absolute right-16 px-3 py-1.5 bg-card text-foreground text-xs font-medium rounded-lg shadow-md border border-border opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap hidden sm:block">
                    Chat dengan Asisten Amanah
                    <div className="absolute top-1/2 -right-1.5 w-3 h-3 bg-card border-r border-b border-border rotate-45 -translate-y-1/2"></div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors pointer-events-auto"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-7 h-7" />}
                </motion.button>
            </div>
        </div>
    );
}
