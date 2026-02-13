'use client';

import Link from 'next/link';

export default function Portfolio() {
    return (
        <section className="mb-32" id="portfolio">
            <h2 className="font-serif text-3xl font-bold mb-12 flex items-center gap-4">
                <span className="h-px w-12 bg-primary/20"></span>
                Selected Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                {/* Project 1 */}
                <div className="group border-b border-primary/5 pb-8">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-accent-dark transition-colors">Distributed Pedagogical Systems</h3>
                    <p className="text-sm opacity-80 mb-4 font-light">A micro-service architecture designed to serve adaptive learning materials at scale.</p>
                    <div className="flex flex-wrap gap-3 mb-6">
                        <span className="text-[10px] font-mono border border-primary/20 px-2 py-0.5 rounded">Python</span>
                        <span className="text-[10px] font-mono border border-primary/20 px-2 py-0.5 rounded">Django</span>
                        <span className="text-[10px] font-mono border border-primary/20 px-2 py-0.5 rounded">Redis</span>
                    </div>
                    <Link className="inline-flex items-center text-xs font-bold uppercase tracking-widest group-hover:gap-3 transition-all" href="#">
                        View Project
                        {/* Material Symbol Arrow replacement with text/entity or generic SVG if needed but leaving symbol class as it was used in HTML, though Lucide is better. User asked for specific code from HTML but also mentioned Lucide. The HTML uses material-symbols.
                            I should probably replace with Lucide arrow for consistency if I switched the other one.
                            HTML: <span class="material-symbols-outlined text-sm ml-1">arrow_forward</span>
                            I'll use Lucide ArrowRight for better consistency.
                         */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right ml-1 w-3.5 h-3.5"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </Link>
                </div>

                {/* Project 2 */}
                <div className="group border-b border-primary/5 pb-8">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-accent-dark transition-colors">Visualizing Global Data Streams</h3>
                    <p className="text-sm opacity-80 mb-4 font-light">Real-time interactive dashboard visualizing demographic shifts in education metrics.</p>
                    <div className="flex flex-wrap gap-3 mb-6">
                        <span className="text-[10px] font-mono border border-primary/20 px-2 py-0.5 rounded">Next.js</span>
                        <span className="text-[10px] font-mono border border-primary/20 px-2 py-0.5 rounded">D3.js</span>
                        <span className="text-[10px] font-mono border border-primary/20 px-2 py-0.5 rounded">PostgreSQL</span>
                    </div>
                    <Link className="inline-flex items-center text-xs font-bold uppercase tracking-widest group-hover:gap-3 transition-all" href="#">
                        View Project
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right ml-1 w-3.5 h-3.5"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </Link>
                </div>

                {/* Project 3 */}
                <div className="group border-b border-primary/5 pb-8">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-accent-dark transition-colors">Open-Source Logic Library</h3>
                    <p className="text-sm opacity-80 mb-4 font-light">A lightweight TypeScript library for handling complex conditional logic in web forms.</p>
                    <div className="flex flex-wrap gap-3 mb-6">
                        <span className="text-[10px] font-mono border border-primary/20 px-2 py-0.5 rounded">TypeScript</span>
                        <span className="text-[10px] font-mono border border-primary/20 px-2 py-0.5 rounded">NPM</span>
                        <span className="text-[10px] font-mono border border-primary/20 px-2 py-0.5 rounded">Jest</span>
                    </div>
                    <Link className="inline-flex items-center text-xs font-bold uppercase tracking-widest group-hover:gap-3 transition-all" href="#">
                        View Project
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right ml-1 w-3.5 h-3.5"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </Link>
                </div>

                {/* Project 4 */}
                <div className="group border-b border-primary/5 pb-8">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-accent-dark transition-colors">Curriculum Mapping Engine</h3>
                    <p className="text-sm opacity-80 mb-4 font-light">Automated tool for cross-referencing global curriculum standards via NLP.</p>
                    <div className="flex flex-wrap gap-3 mb-6">
                        <span className="text-[10px] font-mono border border-primary/20 px-2 py-0.5 rounded">FastAPI</span>
                        <span className="text-[10px] font-mono border border-primary/20 px-2 py-0.5 rounded">Transformers</span>
                        <span className="text-[10px] font-mono border border-primary/20 px-2 py-0.5 rounded">React</span>
                    </div>
                    <Link className="inline-flex items-center text-xs font-bold uppercase tracking-widest group-hover:gap-3 transition-all" href="#">
                        View Project
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right ml-1 w-3.5 h-3.5"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
