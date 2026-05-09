'use client';

import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { X, Calendar, Award } from 'lucide-react';

interface Achievement {
    id: string;
    title: string;
    issuer: string;
    description: string;
    date: string;
    image_url: string;
}

export default function AwardsClient({ achievements }: { achievements: Achievement[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(1);
    const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

    // Responsive itemsPerView
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setItemsPerView(1);
            } else if (window.innerWidth < 1024) {
                setItemsPerView(2);
            } else {
                setItemsPerView(3); // Desktop grid-like behavior
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const maxIndex = Math.max(0, achievements.length - itemsPerView);

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
        <section className="mb-32" id="achievements">
            <div className="flex items-center justify-between mb-12">
                <h2 className="font-serif text-3xl font-bold flex items-center gap-4">
                    <span className="h-px w-9 bg-primary/20"></span>
                    Penghargaan & Prestasi
                </h2>

                {achievements.length > itemsPerView && (
                    <div className="flex gap-4">
                        <button
                            onClick={prevSlide}
                            disabled={currentIndex === 0}
                            className="p-3 border border-primary/10 rounded-full hover:bg-primary/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            aria-label="Previous achievement"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6" /></svg>
                        </button>
                        <button
                            onClick={nextSlide}
                            disabled={currentIndex >= maxIndex}
                            className="p-3 border border-primary/10 rounded-full hover:bg-primary/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            aria-label="Next achievement"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6" /></svg>
                        </button>
                    </div>
                )}
            </div>

            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
                >
                    {achievements.map((item: Achievement, index: number) => (
                        <div
                            key={item.id || index}
                            className="flex-shrink-0 px-4 box-border"
                            style={{ width: `${100 / itemsPerView}%` }}
                        >
                            <div
                                onClick={() => setSelectedAchievement(item)}
                                className={clsx(
                                    "group border border-primary/5 rounded-xl bg-white/30 hover:shadow-lg transition-all overflow-hidden flex flex-col cursor-pointer hover:scale-[1.02] active:scale-[0.98] h-full"
                                )}
                            >
                                <div className="aspect-video w-full bg-accent-dark/5 overflow-hidden flex items-center justify-center text-accent-dark/20 bg-gray-100 relative">
                                    {item.image_url ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={item.image_url}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-all duration-500"
                                        />
                                    ) : (
                                        <span className="text-xs font-mono">No Image</span>
                                    )}
                                </div>
                                <div className="p-6 flex-grow flex flex-col">
                                    <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                                    <p className="text-[10px] uppercase tracking-wider text-accent-dark font-bold mb-3">{item.issuer}</p>
                                    <p className="text-xs opacity-60 line-clamp-3 mb-4">{item.description}</p>
                                    <p className="text-[10px] mt-auto opacity-40 font-mono">
                                        {new Date(item.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {selectedAchievement && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all"
                    onClick={() => setSelectedAchievement(null)}
                >
                    <div
                        className="bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row relative animate-in fade-in zoom-in-95 duration-300 h-[80vh] md:h-auto md:max-h-[85vh] m-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedAchievement(null)}
                            className="absolute top-4 right-4 z-20 p-2 bg-white/50 hover:bg-white rounded-full transition-colors shadow-sm"
                        >
                            <X size={20} className="text-primary" />
                        </button>

                        {/* Left: Image (Mobile: Top) */}
                        <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-4 md:p-8 shrink-0 h-[35%] md:h-auto relative">
                            <div className="relative w-full h-full flex items-center justify-center">
                                {selectedAchievement.image_url ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={selectedAchievement.image_url}
                                        alt={selectedAchievement.title}
                                        className="w-full h-full object-contain shadow-lg rounded-lg"
                                    />
                                ) : (
                                    <div className="text-primary/20">
                                        <Award size={64} />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: Content (Mobile: Bottom) */}
                        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col bg-white/60 overflow-y-auto h-[65%] md:h-auto">
                            <div>
                                <span className="inline-block px-3 py-1 rounded-full bg-accent-light/10 text-accent-dark text-xs font-bold uppercase tracking-widest mb-4">
                                    {selectedAchievement.issuer}
                                </span>
                                <h3 className="font-serif text-2xl md:text-3xl font-bold text-primary mb-2 leading-tight">
                                    {selectedAchievement.title}
                                </h3>
                                <p className="text-sm font-mono text-primary/50 mb-6">
                                    {new Date(selectedAchievement.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                                </p>
                            </div>

                            <div className="prose prose-sm text-primary/80 mb-6 flex-grow custom-scrollbar">
                                <p className="leading-relaxed whitespace-pre-wrap">{selectedAchievement.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
