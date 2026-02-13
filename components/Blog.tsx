'use client';

import Link from 'next/link';
import { clsx } from 'clsx';

const posts = [
    {
        date: "Oct 2023",
        title: "The Ethics of Data in Education",
        excerpt: "Exploring the intersection of privacy and personalized learning.",
        link: "#"
    },
    {
        date: "Sep 2023",
        title: "Functional Programming in UI Design",
        excerpt: "Applying mathematical rigor to interface state management.",
        link: "#"
    },
    {
        date: "Aug 2023",
        title: "Scaling React Context for Complex Apps",
        excerpt: "Strategies for managing state in enterprise-level architecture.",
        link: "#"
    }
];

export default function Blog() {
    // Logic: If data length > 3, use slider. Otherwise, use grid.
    const isSlider = posts.length > 3;

    return (
        <section className="mb-32" id="blog">
            <h2 className="font-serif text-3xl font-bold mb-12 flex items-center gap-4">
                <span className="h-px w-12 bg-primary/20"></span>
                Technical Journal
            </h2>

            <div className={clsx(
                "gap-6",
                isSlider
                    ? "flex overflow-x-auto snap-x snap-mandatory pb-6 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide"
                    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            )}>
                {posts.map((post, index) => (
                    <div
                        key={index}
                        className={clsx(
                            "bg-primary/5 p-8 rounded-xl border border-primary/5 hover:border-accent-dark/20 transition-all flex flex-col",
                            isSlider && "flex-none w-[85vw] md:w-[350px] snap-center"
                        )}
                    >
                        <span className="text-[10px] font-mono opacity-50 uppercase mb-4">{post.date}</span>
                        <h3 className="text-lg font-bold mb-4 flex-grow">{post.title}</h3>
                        <p className="text-xs opacity-70 mb-6">{post.excerpt}</p>
                        <Link href={post.link} className="text-[10px] uppercase font-bold tracking-widest text-accent-dark inline-flex items-center gap-1 hover:gap-2 transition-all">
                            Read Note
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
}
