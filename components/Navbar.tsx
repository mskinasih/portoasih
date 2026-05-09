'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { User, Award, Briefcase, FileText, Mail } from 'lucide-react';

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
        { name: 'Profil', href: '#about', icon: User },
        { name: 'Riwayat', href: '#achievements', icon: Award },
        { name: 'Karya', href: '#portfolio', icon: Briefcase },
        { name: 'Jurnal', href: '#blog', icon: FileText },
        { name: 'Kontak', href: '#contact', icon: Mail },
    ];

    return (
        <nav className={cn(
            "fixed z-50 flex justify-center px-4 transition-all duration-500 left-0 right-0",
            // Mobile: Bottom-6, Desktop: Top-6
            "bottom-6 md:top-6 md:bottom-auto",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none translate-y-10 md:-translate-y-full"
        )}>
            <div className="backdrop-blur-md bg-white/80 dark:bg-black/50 rounded-full px-6 py-3 md:px-8 flex items-center justify-between md:justify-center md:gap-8 border border-primary/5 shadow-sm min-w-[300px] md:min-w-0 max-w-[90vw] overflow-hidden">
                {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                        <a
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 relative whitespace-nowrap flex items-center justify-center p-2",
                                activeSection === link.href.substring(1)
                                    ? "text-accent-dark scale-110"
                                    : "text-primary/60 hover:text-primary"
                            )}
                            aria-label={link.name}
                        >
                            <span className="md:hidden">
                                <Icon size={20} strokeWidth={2.5} />
                            </span>
                            <span className="hidden md:inline">{link.name}</span>

                            {activeSection === link.href.substring(1) && (
                                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent-dark rounded-full"></span>
                            )}
                        </a>
                    );
                })}
            </div>
        </nav>
    );
}
