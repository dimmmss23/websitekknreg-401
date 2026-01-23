import { Instagram, Facebook, Mail } from "lucide-react";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="py-12 border-t border-border bg-card">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                            <Image
                                src="/logo.png"
                                alt="KKN Logo"
                                width={32}
                                height={32}
                                className="w-8 h-8 object-contain"
                            />
                            <h4 className="font-heading text-xl text-foreground">KKN Rekognisi 401</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">UIN Raden Fatah Palembang &copy; <span className="font-heading">2026</span></p>
                    </div>

                    <div className="flex items-center gap-6">
                        <a href="https://www.instagram.com/kkn_rekognisi_amanah?igsh=YnhveGlkN2E5YXpz" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all">
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a href="https://www.facebook.com/share/19eSF2X8S4/" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all">
                            <Facebook className="w-5 h-5" />
                        </a>
                        <a href="[pantiasuhanamanah123@gmail.com]" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all">
                            <Mail className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
