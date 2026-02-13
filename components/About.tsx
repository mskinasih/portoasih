'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function About() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section
            id="about"
            ref={sectionRef}
            className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-32 pt-12 items-center"
        >
            <div className="md:col-span-12">
                <h2 className="font-serif text-3xl font-bold mb-12 flex items-center gap-4">
                    <span className="h-px w-12 bg-primary/20"></span>
                    Identity & Expertise
                </h2>
            </div>
            <div className={cn(
                "md:col-span-5 transition-all duration-1000",
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            )}>
                <div className="relative">
                    <div className="absolute -inset-4 bg-accent-light/5 rounded-[2rem] -z-10 transform rotate-3"></div>
                    {/* Placeholder for actual image - using a colored div for now as requested by plan */}
                    <div className="w-full aspect-[4/5] object-cover rounded-2xl shadow-xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                        <Image
                            src="/images/mutiara.jpg"
                            alt="Mutiara Sekar Kinasih Portrait"
                            width={400}
                            height={500}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
            <div className={cn(
                "md:col-span-7 flex flex-col justify-center transition-all duration-1000 delay-200",
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            )}>
                <p className="text-xl leading-relaxed font-light text-primary/90 mb-10 text-justify">
                    Junior Full-Stack Developer with a strong focus on web development and structured problem-solving. Passionate about mathematics and data analysis, with experience in analytical and educational environments. Adaptable to emerging technologies and committed to building efficient, data-driven digital solutions.
                </p>
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4 text-accent-dark">Frontend</h4>
                        <ul className="text-sm space-y-2 font-medium">
                            <li>React</li>
                            <li>Next.js</li>
                            <li>JavaScript</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4 text-accent-dark">Backend</h4>
                        <ul className="text-sm space-y-2 font-medium">
                            <li>Laravel</li>
                            <li>Node.js</li>
                            <li>Python</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4 text-accent-dark">Data</h4>
                        <ul className="text-sm space-y-2 font-medium">
                            <li>MySQL</li>
                            <li>SQL Optimization</li>
                            <li>Data Visualization</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4 text-accent-dark">Tools</h4>
                        <ul className="text-sm space-y-2 font-medium">
                            <li>Git</li>
                            <li>Proxmox</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
