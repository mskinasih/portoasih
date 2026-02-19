'use client';

import { Download } from 'lucide-react';
import Terminal from './Terminal';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Hero() {
    const [cvUrl, setCvUrl] = useState<string>('#');

    useEffect(() => {
        const fetchCV = async () => {
            try {
                const { data, error } = await supabase
                    .from('profile')
                    .select('cv_url, updated_at')
                    .limit(1)
                    .single();

                if (data?.cv_url) {
                    // Append timestamp to prevent caching
                    const version = data.updated_at ? new Date(data.updated_at).getTime() : Date.now();
                    setCvUrl(`${data.cv_url}?v=${version}`);
                }
            } catch (err) {
                console.error('Error fetching CV:', err);
            }
        };

        fetchCV();
    }, []);

    return (
        <section className="flex flex-col items-center text-center mb-32 pt-20 md:pt-32">
            <h1 className="font-serif text-4xl md:text-6xl lg:text-8xl font-bold mb-6 tracking-tight px-4">
                <span className="block mb-2 font-normal font-handwriting">Mutiara Sekar</span>
                <span className="text-accent-dark font-bold font-handwriting">Kinasih</span>
            </h1>
            <p className="text-base md:text-xl font-light tracking-wide mb-12 opacity-80 uppercase px-4 text-center">
                Junior Full-Stack Developer — Web, Data & Education
            </p>

            <Terminal />

            <div className="mt-8 flex justify-center">
                <a
                    className="inline-flex items-center gap-2 px-6 py-3 border border-primary/20 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-background-light transition-all duration-300"
                    href={cvUrl}
                    target={cvUrl !== '#' ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                >
                    <Download className="w-4 h-4" />
                    Download CV
                </a>
            </div>
        </section>
    );
}
