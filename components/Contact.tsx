'use client';

import { Mail, Linkedin, Github, Instagram } from 'lucide-react';

export default function Contact() {
    return (
        <section className="relative overflow-hidden bg-primary text-background-light rounded-2xl p-8 md:p-20 shadow-2xl" id="contact">
            {/* Lily Watermark */}
            <svg
                className="absolute -bottom-12 -right-5 w-[400px] h-[400px] opacity-5 text-accent-dark pointer-events-none z-0"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="0.5"
                viewBox="0 0 24 24"
            >
                <path d="M12 3C12 3 14 10 21 10C14 10 12 17 12 17C12 17 10 10 3 10C10 10 12 3 12 3Z"></path>
                <path d="M12 10V21"></path>
                <path d="M9 18L12 21L15 18"></path>
                <path d="M5 14C5 14 8 13 12 13C16 13 19 14 19 14"></path>
            </svg>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12">
                <div className="md:col-span-6">
                    <h2 className="font-serif text-4xl font-bold mb-6">Let's build something thoughtful.</h2>
                    <p className="text-lg opacity-80 font-light mb-8">Currently available for select freelance inquiries and collaborative research projects.</p>
                </div>
                <div className="md:col-span-6 flex flex-col gap-4">
                    <a className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors" href="mailto:mtiaraskinasih@gmail.com">
                        <Mail className="w-5 h-5" />
                        <span className="text-sm opacity-60">mtiaraskinasih@gmail.com</span>
                    </a>
                    <a className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors" href="https://www.linkedin.com/in/mskinasih/">
                        <Linkedin className="w-5 h-5" />
                        <span className="text-sm opacity-60">in/mskinasih</span>
                    </a>
                    <a className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors" href="https://github.com/mskinasih">
                        <Github className="w-5 h-5" />
                        <span className="text-sm opacity-60">@mskinasih</span>
                    </a>
                    <a className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors" href="https://www.instagram.com/mskinasih">
                        <Instagram className="w-5 h-5" />
                        <span className="text-sm opacity-60">@mskinasih</span>
                    </a>
                </div>
            </div>
        </section>
    );
}
