import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface PortfolioItem {
    id: string;
    title: string;
    description: string;
    tech_stack: string[]; // Supabase stores arrays as strings/json, but our insert logic sends array
    github_url: string;
    live_url: string;
    image_url: string;
}

export default async function Portfolio() {
    const { data: portfolioData, error } = await supabase
        .from('portfolios')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching portfolios:', error);
    }

    const projects: PortfolioItem[] = portfolioData || [];

    return (
        <section className="mb-32" id="portfolio">
            <h2 className="font-serif text-3xl font-bold mb-12 flex items-center gap-4">
                <span className="h-px w-12 bg-primary/20"></span>
                Selected Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                {projects.map((project) => (
                    <div key={project.id} className="group border-b border-primary/5 pb-8 flex flex-col h-full">
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
                        <p className="text-sm opacity-80 mb-4 font-light flex-grow">{project.description}</p>

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
                ))}
            </div>
        </section>
    );
}
