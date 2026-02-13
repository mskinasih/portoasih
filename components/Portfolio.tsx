import { supabase } from '@/lib/supabase';
import PortfolioClient from './PortfolioClient';

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

    return <PortfolioClient projects={projects} />;
}
