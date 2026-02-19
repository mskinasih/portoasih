'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    slug: string;
    created_at: string;
    image_url: string;
}

export default function BlogClient({ posts }: { posts: BlogPost[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(1); // Default 1 for mobile

    // Format date helper
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    // Responsive itemsPerView
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

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const maxIndex = Math.max(0, posts.length - itemsPerView);

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
        <section className="mb-32" id="blog">
            <div className="flex items-center justify-between mb-12">
                <h2 className="font-serif text-3xl font-bold flex items-center gap-4">
                    <span className="h-px w-12 bg-primary/20"></span>
                    Technical Journal
                </h2>

                {/* Navigation Controls only if we have more posts than view */}
                {posts.length > itemsPerView && (
                    <div className="flex gap-4">
                        <button
                            onClick={prevSlide}
                            disabled={currentIndex === 0}
                            className="p-3 border border-primary/10 rounded-full hover:bg-primary/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            aria-label="Previous posts"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={nextSlide}
                            disabled={currentIndex >= maxIndex}
                            className="p-3 border border-primary/10 rounded-full hover:bg-primary/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            aria-label="Next posts"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>

            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
                >
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="flex-shrink-0 px-4 box-border"
                            style={{ width: `${100 / itemsPerView}%` }}
                        >
                            <div
                                className={clsx(
                                    "group relative overflow-hidden rounded-xl bg-primary/5 p-8 transition-all hover:shadow-lg hover:shadow-primary/5 border border-primary/5 border-solid hover:border-primary/20 flex flex-col justify-between min-h-[350px] h-full"
                                )}
                            >
                                {/* Subtle Background Image Layer */}
                                {post.image_url && (
                                    <div className="absolute inset-0 z-0 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-700 pointer-events-none grayscale overflow-hidden">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={post.image_url}
                                            alt=""
                                            className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000 transform-gpu"
                                        />
                                    </div>
                                )}

                                {/* Content Container */}
                                <div className="relative z-10 flex flex-col h-full pointer-events-none overflow-hidden">
                                    <span className="text-[10px] font-mono font-bold tracking-widest text-primary/40 uppercase mb-4 block">
                                        {formatDate(post.created_at)}
                                    </span>

                                    <h3 className="text-xl font-bold leading-tight mb-4 text-primary group-hover:text-accent-dark transition-colors pointer-events-auto">
                                        <Link href={`/blog/${post.slug}`} className="hover:underline decoration-2 underline-offset-4 decoration-accent-light/30">
                                            {post.title}
                                        </Link>
                                    </h3>

                                    <p className="text-sm font-medium text-primary/60 leading-relaxed line-clamp-4 mb-8">
                                        {post.excerpt}
                                    </p>

                                    <div className="mt-auto pt-6 pointer-events-auto">
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-accent-dark hover:text-primary transition-colors group/link"
                                        >
                                            Read Note
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="transform group-hover/link:translate-x-1 transition-transform"
                                            >
                                                <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
