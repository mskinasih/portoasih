import { supabase } from '@/lib/supabase';
import AwardsClient from './AwardsClient';

// Define Interface
interface Achievement {
    id: string;
    title: string;
    issuer: string;
    description: string;
    date: string;
    image_url: string;
}

export default async function Awards() {
    // Fetch Data
    const { data: achievementsData, error } = await supabase
        .from('achievements')
        .select('*')
        .order('date', { ascending: false });

    if (error) {
        console.error('Error fetching achievements:', error);
    }

    const achievements = achievementsData || [];

    return <AwardsClient achievements={achievements} />;
}
