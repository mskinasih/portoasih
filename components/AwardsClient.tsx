'use client';

import { useState } from 'react';
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
    const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

    // Logic: If data length > 3, use slider. Otherwise, use grid.
    const isSlider = achievements.length > 3;

    return (
        <section className="mb-32" id="achievements">
            <h2 className="font-serif text-3xl font-bold mb-12 flex items-center gap-4">
                <span className="h-px w-12 bg-primary/20"></span>
                Key Achievements
            </h2>

            <div className={clsx(
                "gap-6",
                isSlider
                    ? "flex overflow-x-auto snap-x snap-mandatory pb-6 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide"
                    : "grid grid-cols-1 md:grid-cols-3"
            )}>
                {achievements.map((item: Achievement, index: number) => (
                    <div
                        key={item.id || index}
                        onClick={() => setSelectedAchievement(item)}
                        className={clsx(
                            "group border border-primary/5 rounded-xl bg-white/30 hover:shadow-lg transition-all overflow-hidden flex flex-col cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
                            isSlider && "flex-none w-[85vw] md:w-[350px] snap-center"
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
                        <div className="p-6">
                            <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                            <p className="text-[10px] uppercase tracking-wider text-accent-dark font-bold mb-3">{item.issuer}</p>
                            <p className="text-xs opacity-60 line-clamp-3">{item.description}</p>
                            <p className="text-[10px] mt-4 opacity-40 font-mono">
                                {new Date(item.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {selectedAchievement && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all"
                    onClick={() => setSelectedAchievement(null)}
                >
                    <div
                        className="bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row relative animate-in fade-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedAchievement(null)}
                            className="absolute top-4 right-4 z-10 p-2 bg-white/50 hover:bg-white rounded-full transition-colors"
                        >
                            <X size={20} className="text-primary" />
                        </button>

                        {/* Left: Image (Flexible for 3:4 and 4:3) */}
                        <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-4">
                            <div className="relative w-full h-full min-h-[300px] md:min-h-0 flex items-center justify-center">
                                {selectedAchievement.image_url ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={selectedAchievement.image_url}
                                        alt={selectedAchievement.title}
                                        className="max-w-full max-h-[70vh] md:max-h-full object-contain shadow-sm rounded-sm"
                                    />
                                ) : (
                                    <div className="text-primary/20">
                                        <Award size={64} />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: Content */}
                        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white/50">
                            <div className="mb-6">
                                <h3 className="font-serif text-2xl md:text-3xl font-bold text-primary mb-3 leading-tight">
                                    {selectedAchievement.title}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-primary/80">
                                    <span className="font-light italic opacity-70">Issued by</span>
                                    <span className="font-bold uppercase tracking-wide border-b border-primary/10 pb-0.5">{selectedAchievement.issuer}</span>
                                </div>
                            </div>

                            <div className="prose prose-sm text-primary/70 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                <p className="whitespace-pre-wrap leading-relaxed">{selectedAchievement.description}</p>
                            </div>

                            <div className="mt-auto pt-6 border-t border-primary/5 flex items-center text-primary/40 text-xs font-mono uppercase tracking-widest gap-2">
                                <Calendar size={14} />
                                <span>
                                    {new Date(selectedAchievement.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
