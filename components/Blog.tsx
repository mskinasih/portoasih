import Link from 'next/link';
import { clsx } from 'clsx';
import { supabase } from '@/lib/supabase';

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    slug: string;
    created_at: string;
    image_url: string;
}

export default async function Blog() {
    const { data: blogData, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching blogs:', error);
    }

    const posts: BlogPost[] = blogData || [];

    // Logic: If data length > 3, use slider. Otherwise, use grid.
    const isSlider = posts.length > 3;

    // Helper to format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

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
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className={clsx(
                            "group bg-primary/5 p-0 rounded-xl border border-primary/5 hover:border-accent-dark/20 transition-all flex flex-col overflow-hidden",
                            isSlider && "flex-none w-[85vw] md:w-[350px] snap-center"
                        )}
                    >
                        {/* Image */}
                        <div className="aspect-[4/3] w-full bg-white/40 overflow-hidden relative">
                            {post.image_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={post.image_url}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-primary/20 font-mono text-xs">
                                    NO COVER
                                </div>
                            )}
                        </div>

                        <div className="p-8 flex flex-col flex-grow">
                            <span className="text-[10px] font-mono opacity-50 uppercase mb-4">{formatDate(post.created_at)}</span>
                            <h3 className="text-lg font-bold mb-4 flex-grow group-hover:text-accent-dark transition-colors">{post.title}</h3>
                            <p className="text-xs opacity-70 mb-6 line-clamp-3">{post.excerpt}</p>
                            <Link href={`/blog/${post.slug}`} className="text-[10px] uppercase font-bold tracking-widest text-accent-dark inline-flex items-center gap-1 hover:gap-2 transition-all mt-auto">
                                Read Note
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
