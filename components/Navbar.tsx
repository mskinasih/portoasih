'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function Navbar() {
    const [isVisible, setIsVisible] = useState(false);
    const [activeSection, setActiveSection] = useState<string>('');

    useEffect(() => {
        const handleScroll = () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                // Show navbar when scrolling past a threshold (e.g. 100px)
                setIsVisible(window.scrollY > 100);
            }
        };

        // Scroll Spy Logic
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -35% 0px', // Activate when section is near the center/top
            threshold: 0.1
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        const sections = document.querySelectorAll('section[id]');
        sections.forEach((section) => observer.observe(section));

        window.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
        };
    }, []);

    const navLinks = [
        { name: 'About', href: '#about' },
        { name: 'Achievements', href: '#achievements' },
        { name: 'Portfolio', href: '#portfolio' },
        { name: 'Blog', href: '#blog' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <nav className={cn(
            "fixed top-0 left-0 right-0 z-50 flex justify-center py-6 px-4 transition-all duration-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        )}>
            <div className="backdrop-blur-md bg-white/80 dark:bg-black/50 rounded-full px-8 py-3 flex items-center gap-8 border border-primary/5 shadow-sm">
                {navLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.href}
                        className={cn(
                            "text-xs font-bold uppercase tracking-widest transition-all duration-300 relative",
                            activeSection === link.href.substring(1)
                                ? "text-accent-dark scale-105"
                                : "text-primary/60 hover:text-primary"
                        )}
                    >
                        {link.name}
                        {activeSection === link.href.substring(1) && (
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent-dark rounded-full"></span>
                        )}
                    </a>
                ))}
            </div>
        </nav>
    );
}
