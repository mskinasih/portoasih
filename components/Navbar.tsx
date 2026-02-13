'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function Navbar() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                const aboutTop = aboutSection.getBoundingClientRect().top;
                // Show navbar when About section is near the viewport top or we've scrolled past it
                // Using a threshold like 100px from top or when it enters viewport
                // simpler check: if window.scrollY >= aboutSection.offsetTop - offset

                // Better approach with getBoundingClientRect: 
                // aboutTop <= window.innerHeight (entered viewport) 
                // But user wants it "when entering", so maybe when the top of About is close to 0?
                // Usually "sticky nav appears after hero" means when user scrolls past Hero.
                // Let's use a threshold. If about section is close to top of viewport.

                // Let's say when About section top is less than 50% of viewport height?
                // Or simply when user scrolls past a certain point.

                // Let's try: visible when we scroll down to where About starts.
                setIsVisible(window.scrollY > (aboutSection.offsetTop - 100));
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={cn(
            "fixed top-0 left-0 right-0 z-50 flex justify-center py-6 px-4 transition-all duration-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        )}>
            <div className="backdrop-blur-md bg-background-light/80 rounded-full px-8 py-3 flex items-center gap-8 border border-primary/5 shadow-sm">
                <a className="text-xs font-bold uppercase tracking-widest hover:text-accent-dark transition-colors" href="#about">About</a>
                <a className="text-xs font-bold uppercase tracking-widest hover:text-accent-dark transition-colors" href="#achievements">Achievements</a>
                <a className="text-xs font-bold uppercase tracking-widest hover:text-accent-dark transition-colors" href="#portfolio">Portfolio</a>
                <a className="text-xs font-bold uppercase tracking-widest hover:text-accent-dark transition-colors" href="#blog">Blog</a>
                <a className="text-xs font-bold uppercase tracking-widest hover:text-accent-dark transition-colors" href="#contact">Contact</a>
            </div>
        </nav>
    );
}
