'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Code2, Database } from 'lucide-react';

export default function About() {
    const [isVisible, setIsVisible] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section
            id="about"
            ref={sectionRef}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-32 pt-12 items-center"
        >
            <div className="md:col-span-12">
                <h2 className="font-serif text-2xl md:text-3xl font-bold flex items-center gap-4">
                    <span className="h-px w-8 md:w-12 bg-primary/20"></span>
                    Profil & Kompetensi
                </h2>
            </div>
            <div className={cn(
                "md:col-span-5 transition-all duration-1000",
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            )}>
                <div className="relative">
                    <div className="absolute -inset-4 bg-accent-light/5 rounded-[2rem] -z-10 transform rotate-3"></div>
                    {/* Placeholder for actual image - using a colored div for now as requested by plan */}
                    <div className="w-full aspect-[4/5] object-cover rounded-2xl shadow-xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                        <Image
                            src="/images/mutiara.jpg"
                            alt="Mutiara Sekar Kinasih Portrait"
                            width={400}
                            height={500}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
            <div className={cn(
                "md:col-span-7 flex flex-col justify-center transition-all duration-1000 delay-200",
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            )}>
                <div 
                    className="relative w-full [perspective:2000px] cursor-pointer group"
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    <div className={cn(
                        "w-full transition-all duration-700 [transform-style:preserve-3d] grid",
                        isFlipped ? "[transform:rotateY(180deg)]" : ""
                    )}>
                        {/* Front Side: Description Box */}
                        <div className="col-start-1 row-start-1 w-full [backface-visibility:hidden]">
                            <div className="p-8 md:p-12 rounded-3xl bg-white/5 border border-primary/5 hover:bg-white/10 hover:shadow-xl hover:shadow-accent-light/10 transition-all duration-500 backdrop-blur-sm h-full flex flex-col justify-center space-y-6">
                                <p className="text-[1.1rem] leading-relaxed font-light text-primary/90 text-justify">
                                    Junior Full-Stack Developer dengan spesialisasi pengembangan web yang mengutamakan pemecahan masalah secara logis dan terstruktur.
                                </p>
                                <p className="text-[1.1rem] leading-relaxed font-light text-primary/90 text-justify">
                                    Memiliki ketertarikan mendalam pada eksplorasi matematika serta analisis data sebagai pendukung pengambilan keputusan teknis.
                                </p>
                                <p className="text-[1.1rem] leading-relaxed font-light text-primary/90 text-justify">
                                    Adaptif terhadap perkembangan teknologi dan berdedikasi dalam membangun solusi digital yang efisien serta fungsional.
                                </p>
                                <div className="pt-6 flex justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                                    <span className="text-sm font-medium flex items-center gap-2 text-accent-dark">
                                        Klik untuk melihat kompetensi
                                        <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Back Side: Competency Cards */}
                        <div className="col-start-1 row-start-1 w-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
                            <div className="flex flex-col md:grid md:grid-cols-2 gap-6 h-full">
                                {/* Core Development Card */}
                                <div className="p-8 rounded-3xl bg-white/50 border border-primary/5 hover:border-primary/20 hover:bg-white/80 hover:shadow-lg hover:shadow-accent-light/5 transition-all duration-500 backdrop-blur-sm group/card h-full">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="p-2.5 bg-accent-light/10 text-accent-dark rounded-xl group-hover/card:scale-110 group-hover/card:bg-accent-light/20 group-hover/card:-rotate-3 transition-all duration-300">
                                            <Code2 className="w-5 h-5" strokeWidth={1.5} />
                                        </div>
                                        <h3 className="font-serif text-xl font-bold tracking-wide">Pengembangan Inti</h3>
                                    </div>
                                    <div className="flex flex-col gap-8">
                                        <div>
                                            <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4 text-accent-dark/70">Frontend</h4>
                                            <ul className="text-sm space-y-3.5 font-medium text-primary/80">
                                                <li className="flex items-center gap-2 group/item"><span className="w-1.5 h-1.5 rounded-full bg-accent-light/40 group-hover/item:bg-accent-dark transition-colors"></span>React & Next.js</li>
                                                <li className="flex items-center gap-2 group/item"><span className="w-1.5 h-1.5 rounded-full bg-accent-light/40 group-hover/item:bg-accent-dark transition-colors"></span>TypeScript / JavaScript</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4 text-accent-dark/70">Backend</h4>
                                            <ul className="text-sm space-y-3.5 font-medium text-primary/80">
                                                <li className="flex items-center gap-2 group/item"><span className="w-1.5 h-1.5 rounded-full bg-accent-light/40 group-hover/item:bg-accent-dark transition-colors"></span>Nest.js</li>
                                                <li className="flex items-center gap-2 group/item"><span className="w-1.5 h-1.5 rounded-full bg-accent-light/40 group-hover/item:bg-accent-dark transition-colors"></span>Laravel</li>
                                                <li className="flex items-center gap-2 group/item"><span className="w-1.5 h-1.5 rounded-full bg-accent-light/40 group-hover/item:bg-accent-dark transition-colors"></span>Python</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Data & Tools Card */}
                                <div className="p-8 rounded-3xl bg-white/50 border border-primary/5 hover:border-primary/20 hover:bg-white/80 hover:shadow-lg hover:shadow-accent-light/5 transition-all duration-500 backdrop-blur-sm group/card h-full">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="p-2.5 bg-accent-light/10 text-accent-dark rounded-xl group-hover/card:scale-110 group-hover/card:bg-accent-light/20 group-hover/card:rotate-3 transition-all duration-300">
                                            <Database className="w-5 h-5" strokeWidth={1.5} />
                                        </div>
                                        <h3 className="font-serif text-xl font-bold tracking-wide">Data & Alat Dukung</h3>
                                    </div>
                                    <div className="flex flex-col gap-8">
                                        <div>
                                            <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4 text-accent-dark/70">Data</h4>
                                            <ul className="text-sm space-y-3.5 font-medium text-primary/80">
                                                <li className="flex items-center gap-2 group/item"><span className="w-1.5 h-1.5 rounded-full bg-accent-light/40 group-hover/item:bg-accent-dark transition-colors"></span>MySQL</li>
                                                <li className="flex items-center gap-2 group/item"><span className="w-1.5 h-1.5 rounded-full bg-accent-light/40 group-hover/item:bg-accent-dark transition-colors"></span>SQL Optimization</li>
                                                <li className="flex items-center gap-2 group/item"><span className="w-1.5 h-1.5 rounded-full bg-accent-light/40 group-hover/item:bg-accent-dark transition-colors"></span>Data Visualization</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4 text-accent-dark/70">Tools</h4>
                                            <ul className="text-sm space-y-3.5 font-medium text-primary/80">
                                                <li className="flex items-center gap-2 group/item"><span className="w-1.5 h-1.5 rounded-full bg-accent-light/40 group-hover/item:bg-accent-dark transition-colors"></span>Git & Postman</li>
                                                <li className="flex items-center gap-2 group/item"><span className="w-1.5 h-1.5 rounded-full bg-accent-light/40 group-hover/item:bg-accent-dark transition-colors"></span>Linux & Proxmox</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
