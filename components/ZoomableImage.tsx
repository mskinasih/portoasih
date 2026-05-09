'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';

interface ZoomableImageProps {
    src: string;
    alt?: string;
    className?: string;
    isFeatured?: boolean;
}

export default function ZoomableImage({ src, alt = '', className, isFeatured = false }: ZoomableImageProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div 
                className={clsx(
                    "cursor-zoom-in group relative overflow-hidden",
                    isFeatured ? "mb-16 rounded-xl shadow-2xl shadow-primary/10 aspect-[16/9] w-full" : "my-8 rounded-lg shadow-lg w-full",
                    className
                )}
                onClick={() => setIsOpen(true)}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={src}
                    alt={alt}
                    className={clsx(
                        "w-full h-full object-cover transition-transform duration-500",
                        isFeatured ? "group-hover:scale-105" : ""
                    )}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-primary px-4 py-2 rounded-full text-xs font-bold shadow-lg transition-all transform scale-95 group-hover:scale-100">
                        Perbesar
                    </span>
                </div>
            </div>

            {isOpen && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8 animate-in fade-in duration-200"
                    onClick={() => setIsOpen(false)}
                >
                    <button 
                        className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
                        onClick={() => setIsOpen(false)}
                        aria-label="Tutup gambar"
                    >
                        <X size={24} />
                    </button>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={src}
                        alt={alt}
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </>
    );
}
