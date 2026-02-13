'use client';

import { Download } from 'lucide-react';
import Terminal from './Terminal';

export default function Hero() {
    return (
        <section className="flex flex-col items-center text-center mb-32 pt-32">
            <h1 className="font-serif text-6xl md:text-8xl font-bold mb-6 tracking-tight">
                <span className="block mb-2 font-normal font-handwriting">Mutiara Sekar</span>
                <span className="text-accent-dark font-bold font-handwriting">Kinasih</span>
            </h1>
            <p className="text-lg md:text-xl font-light tracking-wide mb-12 opacity-80 uppercase">
                Junior Full-Stack Developer — Web, Data & Education
            </p>

            <Terminal />

            <div className="mt-8 flex justify-center">
                <a
                    className="inline-flex items-center gap-2 px-6 py-3 border border-primary/20 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-background-light transition-all duration-300"
                    href="#"
                >
                    <Download className="w-4 h-4" />
                    Download CV
                </a>
            </div>
        </section>
    );
}
