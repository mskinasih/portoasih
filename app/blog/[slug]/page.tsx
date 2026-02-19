
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Markdown from 'react-markdown';
import { Metadata } from 'next';
import { clsx } from 'clsx';
import { ArrowLeft, Calendar, Clock, Share2, Bookmark, MessageCircle } from 'lucide-react';

/* 
  Re-implementing the user's provided HTML design using Next.js and Tailwind.
  Colors from tailwind.config:
  primary: #3D0301 (Deep Maroon)
  accent-dark: #B03052 (Dark Rose)
  accent-light: #D76C82 (Soft Rose) - *Note: config has accent-light, HTML says accent-soft but hex #D76C82 matches accent-light
  background-light: #EBE8DB (Warm Cream)
*/

export const revalidate = 60; // Revalidate every minute

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    created_at: string;
    image_url: string | null;
}

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const { data: post } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .single();

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    return {
        title: `${post.title} - Mutiara Sekar Kinasih`,
        description: post.excerpt,
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;

    const { data: post, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

    if (error || !post) {
        notFound();
    }

    const blogPost = post as BlogPost;

    // Calculate Read Time (approx 200 words per minute)
    const wordCount = blogPost.content?.split(/\s+/g).length || 0;
    const readTime = Math.ceil(wordCount / 200);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-background-light text-primary selection:bg-accent-light/30 min-h-screen font-display">
            {/* Scroll Progress Bar - Simplified for Server Component (could use client hook, but sticking to static for now or just a visual filler as in HTML) 
                The HTML had a static width: 35%. I'll omit the dynamic scroll logic for now to keep it simple server-side, 
                or I'd need a client component wrapper. For now, I'll omit it or make it a static element if requested.
                User code: <div class="fixed top-0 left-0 w-full h-1 z-[100]"><div class="h-full bg-accent-dark" style="width: 35%;"></div></div>
            */}

            {/* Navigation Bar - Assuming a global nav exists, but implementing specific styles from HTML for this page wrapper if needed.
                However, usually layout.tsx handles nav. The user provided a full HTML body, suggesting stand-alone look or override.
                I will respect the layout.tsx but try to match the inner content style.
            */}

            <main className="pt-32 pb-24 px-6">
                <article className="max-w-[800px] mx-auto">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent-dark mb-8 overflow-hidden whitespace-nowrap text-ellipsis">
                        <Link href="/admin" className="hover:underline">Dashboard</Link>
                        <span className="text-[10px] opacity-60">/</span>
                        <Link href="/#blog" className="hover:underline">Blog</Link>
                        <span className="text-[10px] opacity-60">/</span>
                        <span className="text-primary/60 truncate">{blogPost.title}</span>
                    </nav>

                    {/* Article Header */}
                    <header className="text-center mb-12">
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.15] mb-8">
                            {blogPost.title}
                        </h1>
                        <div className="flex items-center justify-center gap-6 text-sm text-primary/60 font-medium">
                            <div className="flex items-center gap-1.5">
                                <Calendar size={18} />
                                <span>{formatDate(blogPost.created_at)}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock size={18} />
                                <span>{readTime} min read</span>
                            </div>
                        </div>
                    </header>

                    {/* Featured Image */}
                    {blogPost.image_url && (
                        <div className="mb-16 rounded-xl overflow-hidden shadow-2xl shadow-primary/10 relative aspect-[16/9] w-full">
                            {/* Using standard img tag as requested to match components/Blog.tsx behavior and avoid config restart issues */}
                            <img
                                src={blogPost.image_url}
                                alt={blogPost.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Article Body */}
                    <div className="prose prose-lg prose-headings:font-serif prose-headings:text-primary prose-p:text-primary/90 prose-p:leading-relaxed prose-a:text-accent-dark prose-blockquote:border-accent-dark prose-blockquote:bg-transparent prose-blockquote:not-italic prose-blockquote:text-xl prose-code:text-accent-dark prose-code:bg-primary/5 prose-code:rounded prose-code:px-1 prose-pre:bg-primary/5 prose-pre:border prose-pre:border-primary/10 prose-pre:text-primary/80 max-w-none">
                        {/* 
                            Custom Markdown Rendering to match specific HTML classes.
                            The user HTML has a specific class for the first letter of the first paragraph.
                            That is hard to target dynamically with simple react-markdown without parsing the content manually.
                            I will use the standard prose for now, which is very close.
                         */}
                        <Markdown
                            components={{
                                // Override generic elements to match the design system
                                h2: ({ node, ...props }) => <h2 className="font-serif text-3xl font-bold pt-6 text-primary" {...props} />,
                                p: ({ node, ...props }) => <p className="text-lg leading-relaxed text-primary/90 mb-6 text-justify" {...props} />,
                                blockquote: ({ node, ...props }) => (
                                    <blockquote className="border-l-4 border-accent-dark pl-8 py-4 my-12 italic" {...props}>
                                        <div className="font-serif text-2xl text-accent-dark leading-relaxed">
                                            {props.children}
                                        </div>
                                    </blockquote>
                                ),
                                pre: ({ node, ...props }) => (
                                    <div className="rounded-xl overflow-hidden bg-primary/5 border border-primary/10 my-10">
                                        <div className="bg-primary/10 px-4 py-2 flex items-center justify-between border-b border-primary/10">
                                            <span className="text-xs font-mono font-bold text-primary/60 uppercase">code snippet</span>
                                            <div className="flex gap-1.5">
                                                <div className="size-2.5 rounded-full bg-accent-light"></div>
                                                <div className="size-2.5 rounded-full bg-accent-dark"></div>
                                            </div>
                                        </div>
                                        <div className="overflow-x-auto p-6">
                                            <pre className="mono-text text-sm leading-relaxed text-primary/80 bg-transparent p-0 m-0 border-none" {...props} />
                                        </div>
                                    </div>
                                )
                            }}
                        >
                            {blogPost.content}
                        </Markdown>
                    </div>

                    {/* Article Footer / Navigation */}
                    <footer className="mt-20 pt-12 border-t border-primary/10">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <Link href="/#blog" className="group flex items-center gap-3 bg-primary text-background-light px-8 py-4 rounded-full font-bold transition-all hover:bg-accent-dark hover:-translate-y-0.5 active:translate-y-0">
                                <ArrowLeft size={20} />
                                <span>Back to Portfolio</span>
                            </Link>
                        </div>
                    </footer>
                </article>
            </main>

            {/* Mobile Bottom Nav (Optional visual flair) */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:hidden z-50">
                <div className="bg-primary text-white rounded-full px-6 py-3 shadow-xl flex items-center gap-6">
                    <button><Share2 size={20} /></button>
                    <button><Bookmark size={20} /></button>
                    <button><MessageCircle size={20} /></button>
                </div>
            </div>
        </div>
    );
}
