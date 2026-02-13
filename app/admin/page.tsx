'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { clsx } from 'clsx';
import {
    ArrowLeft,
    Award,
    Briefcase,
    FileEdit,
    X,
    ImagePlus,
    Plus,
    Trash2,
    History,
    Check,
    LogOut
} from 'lucide-react';
import { useState, useRef } from 'react';
import MarkdownEditor from './components/MarkdownEditor';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'achievements' | 'portfolio' | 'blog'>('achievements');
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const [toast, setToast] = useState<{ message: string; subMessage: string; type: 'success' | 'error'; visible: boolean }>({
        message: '',
        subMessage: '',
        type: 'success',
        visible: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const showToast = (message: string, subMessage: string, type: 'success' | 'error') => {
        setToast({ message, subMessage, type, visible: true });
        setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
    };

    const [currentIds, setCurrentIds] = useState<Record<string, number>>({
        achievements: 1,
        portfolio: 1,
        blog: 1
    });

    const [lastSaved, setLastSaved] = useState<Record<string, Date | null>>({
        achievements: null,
        portfolio: null,
        blog: null
    });

    const [formResetKey, setFormResetKey] = useState<Record<string, number>>({
        achievements: 0,
        portfolio: 0,
        blog: 0
    });

    const handleDiscard = () => {
        // Reset last saved
        setLastSaved(prev => ({ ...prev, [activeTab]: null }));
        // Force inputs to clear by changing key
        setFormResetKey(prev => ({ ...prev, [activeTab]: prev[activeTab] + 1 }));

        if (activeTab === 'achievements') {
            setAchievementImage(null);
        } else if (activeTab === 'portfolio') {
            setPortfolioImage(null);
            setTechStack([]); // Reset to empty
        } else if (activeTab === 'blog') {
            setBlogImage(null);
            setIsPublished(false);
            setBlogContent('');
        }

        showToast('Changes Discarded', 'Your draft has been cleared.', 'success');
    };

    const handleFormChange = () => {
        setLastSaved(prev => ({
            ...prev,
            [activeTab]: new Date()
        }));
    };

    const getTimeAgo = (date: Date | null) => {
        if (!date) return 'Not saved yet';
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        if (seconds < 60) return 'Draft saved just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `Draft saved ${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        const hours = Math.floor(minutes / 60);
        return `Draft saved ${hours} hour${hours > 1 ? 's' : ''} ago`;
    };

    // Update time ago every minute to keep it fresh
    const [, setTick] = useState(0);
    useState(() => {
        const timer = setInterval(() => setTick(t => t + 1), 60000);
        return () => clearInterval(timer);
    });

    const [achievementImage, setAchievementImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [portfolioImage, setPortfolioImage] = useState<string | null>(null);
    const portfolioFileInputRef = useRef<HTMLInputElement>(null);
    const [blogImage, setBlogImage] = useState<string | null>(null);
    const blogFileInputRef = useRef<HTMLInputElement>(null);
    const [isPublished, setIsPublished] = useState(false); // Default false (Draft)
    const [blogContent, setBlogContent] = useState('');

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setAchievementImage(url);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setAchievementImage(url);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handlePortfolioImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPortfolioImage(url);
        }
    };

    const handlePortfolioDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPortfolioImage(url);
        }
    };

    const triggerPortfolioFileInput = () => {
        portfolioFileInputRef.current?.click();
    };

    const handleBlogImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setBlogImage(url);
        }
    };

    const handleBlogDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setBlogImage(url);
        }
    };

    const triggerBlogFileInput = () => {
        blogFileInputRef.current?.click();
    };

    const [techStack, setTechStack] = useState<string[]>([]); // Default
    const [newTech, setNewTech] = useState('');

    const addTech = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newTech.trim()) {
            e.preventDefault();
            if (!techStack.includes(newTech.trim())) {
                setTechStack([...techStack, newTech.trim()]);
            }
            setNewTech('');
        }
    };

    const removeTech = (techToRemove: string) => {
        setTechStack(techStack.filter(tech => tech !== techToRemove));
    };

    const handlePublish = async (activeTab: string) => {
        setIsSubmitting(true);
        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Randomly simulate success or error for demonstration
        const isSuccess = Math.random() > 0.3; // 70% chance of success

        if (isSuccess) {
            showToast(
                'Content Updated',
                `Your ${activeTab} entry has been ${activeTab === 'blog' && !isPublished ? 'saved as draft' : 'published'}.`,
                'success'
            );

            // Only increment ID if we are actually publishing, OR if user wants drafts to also increment. 
            // For now, let's increment ID for any successful "save" action to simulate a new entry being created.
            setCurrentIds(prev => ({
                ...prev,
                [activeTab]: prev[activeTab] + 1
            }));

            // Reset last saved for this tab
            setLastSaved(prev => ({ ...prev, [activeTab]: null }));

            if (activeTab === 'achievements') setAchievementImage(null);
            if (activeTab === 'portfolio') {
                setPortfolioImage(null);
                setTechStack([]);
            }
            if (activeTab === 'blog') {
                setBlogImage(null);
                setIsPublished(false);
                setBlogContent('');
            }
        } else {
            showToast(
                'Publication Failed',
                'There was an error saving your changes. Please try again.',
                'error'
            );
        }
        setIsSubmitting(false);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen text-primary font-display selection:bg-accent-light/30">
            {/* ... (Navigation and Header) ... */}
            <main className="max-w-5xl mx-auto px-6 py-12">
                {/* ... (Top Navigation logic) ... */}
                <div className="flex justify-between items-center mb-6">
                    <Link href="/" className="flex items-center gap-2 text-sm font-bold text-primary/60 hover:text-primary transition-colors">
                        <ArrowLeft size={18} />
                        Back to Portfolio
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-sm font-bold text-primary/60 hover:text-red-600 transition-colors"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>

                {/* Header */}
                <div className="mb-10">
                    <h2 className="font-serif text-4xl font-bold text-primary mb-2">Content Management</h2>
                    <p className="text-primary/60 font-medium">Curate your professional presence with precision and style.</p>
                </div>

                {/* Main Dashboard Card */}
                <div className="bg-background-light/50 rounded-xl shadow-xl shadow-primary/5 border border-primary/10 overflow-hidden">
                    {/* ... (Tabs) ... */}
                    <div className="flex border-b border-primary/10 bg-white/40">
                        <button
                            onClick={() => setActiveTab('achievements')}
                            className={clsx(
                                "flex-1 py-5 px-4 flex flex-col items-center gap-1 group border-b-2 transition-all",
                                activeTab === 'achievements' ? "border-primary bg-primary/5" : "border-transparent hover:bg-primary/5"
                            )}
                        >
                            <Award size={20} className={clsx(activeTab === 'achievements' ? "text-primary" : "text-primary/40 group-hover:text-primary")} />
                            <span className={clsx("text-sm font-bold tracking-wide", activeTab === 'achievements' ? "text-primary" : "text-primary/40 group-hover:text-primary")}>ACHIEVEMENTS</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('portfolio')}
                            className={clsx(
                                "flex-1 py-5 px-4 flex flex-col items-center gap-1 group border-b-2 transition-all",
                                activeTab === 'portfolio' ? "border-primary bg-primary/5" : "border-transparent hover:bg-primary/5"
                            )}
                        >
                            <Briefcase size={20} className={clsx(activeTab === 'portfolio' ? "text-primary" : "text-primary/40 group-hover:text-primary")} />
                            <span className={clsx("text-sm font-bold tracking-wide", activeTab === 'portfolio' ? "text-primary" : "text-primary/40 group-hover:text-primary")}>PORTFOLIO</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('blog')}
                            className={clsx(
                                "flex-1 py-5 px-4 flex flex-col items-center gap-1 group border-b-2 transition-all",
                                activeTab === 'blog' ? "border-primary bg-primary/5" : "border-transparent hover:bg-primary/5"
                            )}
                        >
                            <FileEdit size={20} className={clsx(activeTab === 'blog' ? "text-primary" : "text-primary/40 group-hover:text-primary")} />
                            <span className={clsx("text-sm font-bold tracking-wide", activeTab === 'blog' ? "text-primary" : "text-primary/40 group-hover:text-primary")}>BLOG POSTS</span>
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="p-8 space-y-8" onChange={handleFormChange} key={formResetKey[activeTab]}>

                        <div className="flex justify-between items-end">
                            <div>
                                <h3 className="font-serif text-2xl font-bold">New {activeTab === 'achievements' ? 'Achievement' : activeTab === 'portfolio' ? 'Project' : 'Blog Post'} Entry</h3>
                                <p className="text-primary/60 text-sm">Add a new masterpiece to your curated collection.</p>
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-primary/40 bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                                {activeTab === 'achievements' ? `Achievement #${currentIds.achievements}` : activeTab === 'portfolio' ? `Project #${currentIds.portfolio}` : `Post #${currentIds.blog}`}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Column 1: Text Info */}
                            <div className="space-y-6">
                                {/* ... (Text Inputs - kept same) ... */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-primary/70">
                                        {activeTab === 'achievements' ? 'Title' : activeTab === 'portfolio' ? 'Project Name' : 'Post Title'}
                                    </label>
                                    <input
                                        className="w-full bg-white/50 border border-primary/10 rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-primary/30"
                                        placeholder={activeTab === 'achievements' ? "e.g., Adobe Certified Expert" : activeTab === 'portfolio' ? "e.g., Silk & Code Brand Identity" : "e.g., The Future of Web Design"}
                                        type="text"
                                    />
                                </div>

                                {activeTab === 'achievements' && (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-primary/70">Issuer</label>
                                            <input
                                                className="w-full bg-white/50 border border-primary/10 rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-primary/30"
                                                placeholder="e.g., Adobe"
                                                type="text"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-primary/70">Date</label>
                                            <input
                                                className="w-full bg-white/50 border border-primary/10 rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-primary/30"
                                                placeholder="e.g., 2023-10-15"
                                                type="date"
                                            />
                                        </div>
                                    </>
                                )}

                                {activeTab === 'portfolio' && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-wider text-primary/70">GitHub URL</label>
                                                <input className="w-full bg-white/50 border border-primary/10 rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-primary/30" placeholder="https://github.com/..." type="url" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-wider text-primary/70">Live URL <span className="opacity-50 lowercase font-normal">(optional)</span></label>
                                                <input className="w-full bg-white/50 border border-primary/10 rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-primary/30" placeholder="https://..." type="url" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-primary/70">Tech Stack</label>
                                            <div className="flex flex-wrap gap-2 p-3 bg-white/50 border border-primary/10 rounded-lg min-h-[50px]">
                                                {techStack.map(tech => (
                                                    <span key={tech} className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded flex items-center gap-1 animate-fadeIn">
                                                        {tech} <button onClick={() => removeTech(tech)} className="hover:text-red-500"><X size={12} /></button>
                                                    </span>
                                                ))}
                                                <input
                                                    className="bg-transparent border-none p-0 text-xs focus:ring-0 w-24 outline-none placeholder:text-primary/30"
                                                    placeholder="Add tool..."
                                                    type="text"
                                                    value={newTech}
                                                    onChange={(e) => setNewTech(e.target.value)}
                                                    onKeyDown={addTech}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {activeTab === 'blog' && (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-primary/70">Excerpt</label>
                                            <textarea className="w-full bg-white/50 border border-primary/10 rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-primary/30 resize-none custom-scrollbar" placeholder="Short preview for the card..." rows={3}></textarea>
                                        </div>

                                        <div className="flex items-center gap-3 p-4 border border-primary/10 rounded-lg bg-white/30">
                                            <div
                                                className={clsx("w-10 h-6 rounded-full relative transition-colors cursor-pointer", isPublished ? "bg-primary" : "bg-primary/20")}
                                                onClick={() => setIsPublished(!isPublished)}
                                            >
                                                <div className={clsx("absolute top-1 left-1 size-4 bg-white rounded-full transition-transform shadow-sm", isPublished ? "translate-x-4" : "translate-x-0")}></div>
                                            </div>
                                            <label className="text-sm font-bold text-primary cursor-pointer select-none" onClick={() => setIsPublished(!isPublished)}>
                                                {isPublished ? 'Status: Published' : 'Status: Draft'}
                                            </label>
                                        </div>
                                    </>
                                )}

                                <label className="text-xs font-bold uppercase tracking-wider text-primary/70">
                                    {activeTab === 'blog' ? 'Content (Markdown)' : 'Description'}
                                </label>
                                {activeTab === 'blog' ? (
                                    <MarkdownEditor
                                        value={blogContent}
                                        onChange={setBlogContent}
                                        placeholder="# Write your story here..."
                                    />
                                ) : (
                                    <textarea
                                        className="w-full bg-white/50 border border-primary/10 rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-primary/30 resize-none custom-scrollbar"
                                        placeholder="Tell the story..."
                                        rows={5}
                                    ></textarea>
                                )}
                            </div>

                            {/* Column 2: Visuals */}
                            <div className="space-y-6">
                                <div className="space-y-2 h-full flex flex-col">
                                    <label className="text-xs font-bold uppercase tracking-wider text-primary/70">
                                        {activeTab === 'achievements' ? 'Certificate / Image' : activeTab === 'portfolio' ? 'Project Image' : 'Cover Image'}
                                    </label>

                                    {activeTab === 'achievements' ? (
                                        <div
                                            onDrop={handleDrop}
                                            onDragOver={handleDragOver}
                                            onClick={triggerFileInput}
                                            className={clsx(
                                                "flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-all cursor-pointer group relative overflow-hidden",
                                                achievementImage ? "border-primary/0 bg-white/0" : "border-primary/20 bg-white/30 hover:bg-white/50"
                                            )}
                                        >
                                            <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageUpload} accept="image/*" />
                                            {achievementImage ? (
                                                <div className="absolute inset-0 w-full h-full group-hover:opacity-90 transition-opacity">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={achievementImage} alt="Preview" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <p className="text-white font-bold text-sm">Click or Drop to Replace</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="size-16 rounded-full bg-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                        <ImagePlus size={32} className="text-primary/40 group-hover:text-primary transition-colors" />
                                                    </div>
                                                    <p className="text-sm font-bold text-primary">Click or drag to upload</p>
                                                    <p className="text-xs text-primary/40 mt-1">PNG, JPG (Achievement)</p>
                                                </>
                                            )}
                                        </div>
                                    ) : activeTab === 'portfolio' ? (
                                        <div
                                            onDrop={handlePortfolioDrop}
                                            onDragOver={handleDragOver}
                                            onClick={triggerPortfolioFileInput}
                                            className={clsx(
                                                "flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-all cursor-pointer group relative overflow-hidden",
                                                portfolioImage ? "border-primary/0 bg-white/0" : "border-primary/20 bg-white/30 hover:bg-white/50"
                                            )}
                                        >
                                            <input type="file" ref={portfolioFileInputRef} className="hidden" onChange={handlePortfolioImageUpload} accept="image/*" />
                                            {portfolioImage ? (
                                                <div className="absolute inset-0 w-full h-full group-hover:opacity-90 transition-opacity">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={portfolioImage} alt="Preview" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <p className="text-white font-bold text-sm">Click or Drop to Replace</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="size-16 rounded-full bg-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                        <ImagePlus size={32} className="text-primary/40 group-hover:text-primary transition-colors" />
                                                    </div>
                                                    <p className="text-sm font-bold text-primary">Click or drag to upload</p>
                                                    <p className="text-xs text-primary/40 mt-1">High resolution (Project)</p>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        // Blog Image Upload
                                        <div
                                            onDrop={handleBlogDrop}
                                            onDragOver={handleDragOver}
                                            onClick={triggerBlogFileInput}
                                            className={clsx(
                                                "flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-all cursor-pointer group relative overflow-hidden",
                                                blogImage ? "border-primary/0 bg-white/0" : "border-primary/20 bg-white/30 hover:bg-white/50"
                                            )}
                                        >
                                            <input type="file" ref={blogFileInputRef} className="hidden" onChange={handleBlogImageUpload} accept="image/*" />
                                            {blogImage ? (
                                                <div className="absolute inset-0 w-full h-full group-hover:opacity-90 transition-opacity">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={blogImage} alt="Preview" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <p className="text-white font-bold text-sm">Click or Drop to Replace</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="size-16 rounded-full bg-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                        <ImagePlus size={32} className="text-primary/40 group-hover:text-primary transition-colors" />
                                                    </div>
                                                    <p className="text-sm font-bold text-primary">Click or drag to upload</p>
                                                    <p className="text-xs text-primary/40 mt-1">Wide landscape (Cover)</p>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Footer */}
                        <div className="pt-6 border-t border-primary/10 flex items-center justify-between mt-6">
                            <div className="flex items-center gap-2 text-primary/40 text-xs font-bold italic">
                                <span className="text-sm"><i className="fas fa-magic"></i></span>
                                {getTimeAgo(lastSaved[activeTab as 'achievements' | 'portfolio' | 'blog'])}
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={handleDiscard}
                                    className="px-6 py-2.5 rounded-lg font-bold text-primary/60 hover:text-primary hover:bg-primary/5 transition-all text-sm"
                                >
                                    Discard Changes
                                </button>
                                <button
                                    onClick={() => handlePublish(activeTab)}
                                    disabled={isSubmitting}
                                    className="px-8 py-2.5 bg-primary text-white rounded-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSubmitting ? 'Saving...' : (activeTab === 'blog' && !isPublished ? 'Save as Draft' : 'Publish')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Dynamic Toast Notification */}
            {
                toast.visible && (
                    <div className={clsx(
                        "fixed bottom-8 right-8 flex items-center gap-4 px-6 py-4 rounded-xl shadow-2xl border transition-all duration-300 transform translate-y-0 z-50",
                        toast.type === 'success' ? "bg-primary text-white border-white/10" : "bg-red-600 text-white border-red-400"
                    )}>
                        <div className={clsx(
                            "size-8 rounded-full flex items-center justify-center",
                            toast.type === 'success' ? "bg-accent-light" : "bg-white/20"
                        )}>
                            {toast.type === 'success' ? <Check size={16} className="text-primary" /> : <X size={16} className="text-white" />}
                        </div>
                        <div>
                            <p className="text-sm font-bold leading-none">{toast.message}</p>
                            <p className="text-[10px] opacity-70 mt-1 uppercase tracking-widest">{toast.subMessage}</p>
                        </div>
                        <button
                            onClick={() => setToast(prev => ({ ...prev, visible: false }))}
                            className="ml-4 opacity-50 hover:opacity-100 transition-opacity"
                        >
                            <X size={18} />
                        </button>
                    </div>
                )
            }
        </div >
    );
}
