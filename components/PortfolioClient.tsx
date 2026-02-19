'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PortfolioItem {
    id: string;
    title: string;
    description: string;
    tech_stack: string[];
    github_url: string;
    live_url: string;
    image_url: string;
}

export default function PortfolioClient({ projects }: { projects: PortfolioItem[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(1); // Default to 1 (Mobile First) to prevent hydration mismatch
    const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);

    // Update itemsPerView based on window width
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setItemsPerView(1);
            } else if (window.innerWidth < 1024) {
                setItemsPerView(2);
            } else {
                setItemsPerView(3);
            }
        };

        handleResize(); // Initial call
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const maxIndex = Math.max(0, projects.length - itemsPerView);

    const nextSlide = () => {
        if (currentIndex < maxIndex) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    return (
        <section className="mb-32" id="portfolio">
            <div className="flex items-center justify-between mb-12">
                <h2 className="font-serif text-3xl font-bold flex items-center gap-4">
                    <span className="h-px w-12 bg-primary/20"></span>
                    Selected Works
                </h2>

                {/* Navigation Controls */}
                <div className="flex gap-4">
                    <button
                        onClick={prevSlide}
                        disabled={currentIndex === 0}
                        className="p-3 border border-primary/10 rounded-full hover:bg-primary/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        aria-label="Previous project"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={nextSlide}
                        disabled={currentIndex >= maxIndex}
                        className="p-3 border border-primary/10 rounded-full hover:bg-primary/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        aria-label="Next project"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
                >
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="flex-shrink-0 px-6 box-border"
                            style={{ width: `${100 / itemsPerView}%` }}
                        >
                            <div
                                onClick={() => setSelectedProject(project)}
                                className="group border-b border-primary/5 pb-8 flex flex-col h-full hover:border-primary/20 transition-colors cursor-pointer"
                            >
                                {/* Image Preview */}
                                <div className="aspect-video w-full bg-primary/5 rounded-lg mb-6 overflow-hidden relative">
                                    {project.image_url ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={project.image_url}
                                            alt={project.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-primary/20 font-mono text-xs">
                                            NO PREVIEW
                                        </div>
                                    )}
                                </div>

                                <h3 className="text-xl font-bold mb-2 group-hover:text-accent-dark transition-colors">{project.title}</h3>
                                <p className="text-sm opacity-80 mb-4 font-light flex-grow line-clamp-3">{project.description}</p>

                                <div className="flex flex-wrap gap-3 mb-6">
                                    {project.tech_stack?.map((tech, i) => (
                                        <span key={i} className="text-[10px] font-mono border border-primary/20 px-2 py-0.5 rounded opacity-70">
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center gap-6 mt-auto">
                                    {project.github_url && (
                                        <Link className="inline-flex items-center text-xs font-bold uppercase tracking-widest hover:text-accent-dark transition-all" href={project.github_url} target="_blank">
                                            GitHub
                                        </Link>
                                    )}
                                    {project.live_url && (
                                        <Link className="inline-flex items-center text-xs font-bold uppercase tracking-widest hover:text-accent-dark transition-all group/link" href={project.live_url} target="_blank">
                                            View Project
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right ml-1 w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {selectedProject && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all"
                    onClick={() => setSelectedProject(null)}
                >
                    <div
                        className="bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl max-w-5xl w-full overflow-hidden flex flex-col md:flex-row relative animate-in fade-in zoom-in-95 duration-300 h-[85vh] md:h-auto md:max-h-[85vh] m-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedProject(null)}
                            className="absolute top-4 right-4 z-20 p-2 bg-white/50 hover:bg-white rounded-full transition-colors shadow-sm"
                        >
                            <ChevronLeft className="rotate-45" size={20} />
                        </button>

                        {/* Left: Image (Mobile: Top) */}
                        <div className="w-full md:w-3/5 bg-gray-50 flex items-center justify-center p-4 md:p-8 shrink-0 h-[30%] md:h-auto relative">
                            <div className="relative w-full h-full flex items-center justify-center">
                                {selectedProject.image_url ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={selectedProject.image_url}
                                        alt={selectedProject.title}
                                        className="w-full h-full object-contain shadow-lg rounded-lg"
                                    />
                                ) : (
                                    <div className="text-primary/20">
                                        No Image
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: Content (Mobile: Bottom) */}
                        <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col bg-white/60 overflow-y-auto h-[70%] md:h-auto">
                            <h3 className="font-serif text-2xl md:text-3xl font-bold text-primary mb-4 leading-tight">
                                {selectedProject.title}
                            </h3>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {selectedProject.tech_stack?.map((tech, i) => (
                                    <span key={i} className="text-[10px] font-mono bg-primary/5 border border-primary/10 px-2 py-1 rounded text-primary/70">
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            <div className="prose prose-sm text-primary/80 mb-8 flex-grow custom-scrollbar">
                                <p className="whitespace-pre-wrap leading-relaxed">{selectedProject.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-auto pt-6 border-t border-primary/5 shrink-0">
                                {selectedProject.live_url && (
                                    <Link
                                        href={selectedProject.live_url}
                                        target="_blank"
                                        className="flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors"
                                    >
                                        View Live
                                        <ChevronRight size={14} />
                                    </Link>
                                )}
                                {selectedProject.github_url && (
                                    <Link
                                        href={selectedProject.github_url}
                                        target="_blank"
                                        className={clsx(
                                            "flex items-center justify-center gap-2 border border-primary/10 py-3 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-primary/5 transition-colors",
                                            !selectedProject.live_url && "col-span-2"
                                        )}
                                    >
                                        GitHub Repo
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
