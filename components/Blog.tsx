import Link from 'next/link';
import { clsx } from 'clsx';
import { supabase } from '@/lib/supabase';
import BlogClient from './BlogClient';

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

    return <BlogClient posts={posts} />;
}
