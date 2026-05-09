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
    LogOut,
    UserCircle,
    FileText
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import MarkdownEditor from './components/MarkdownEditor';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'achievements' | 'portfolio' | 'blog' | 'profile'>('achievements');
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
            }
        };
        checkUser();
    }, [router]);

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

    useEffect(() => {
        const fetchNextIds = async () => {
            try {
                // Fetch counts for each table to determine the next ID
                // Using count + 1 as the next ID indicator
                const { count: achievementsCount } = await supabase
                    .from('achievements')
                    .select('*', { count: 'exact', head: true });

                const { count: portfolioCount } = await supabase
                    .from('portfolios')
                    .select('*', { count: 'exact', head: true });

                const { count: blogCount } = await supabase
                    .from('blogs')
                    .select('*', { count: 'exact', head: true });

                setCurrentIds({
                    achievements: (achievementsCount || 0) + 1,
                    portfolio: (portfolioCount || 0) + 1,
                    blog: (blogCount || 0) + 1
                });
            } catch (error) {
                console.error('Error fetching next IDs:', error);
            }
        };

        fetchNextIds();
    }, []);

    const [lastSaved, setLastSaved] = useState<Record<string, Date | null>>({
        achievements: null,
        portfolio: null,
        blog: null,
        profile: null
    });

    const [formResetKey, setFormResetKey] = useState<Record<string, number>>({
        achievements: 0,
        portfolio: 0,
        blog: 0,
        profile: 0
    });

    const handleDiscard = () => {
        // Reset last saved
        setLastSaved(prev => ({ ...prev, [activeTab]: null }));
        // Force inputs to clear by changing key
        setFormResetKey(prev => ({ ...prev, [activeTab]: prev[activeTab] + 1 }));

        const initialContext = {
            achievements: { title: '', issuer: '', date: '', description: '', image: null, file: null },
            portfolio: { title: '', description: '', techStack: [], githubUrl: '', liveUrl: '', image: null, file: null },
            blog: { title: '', excerpt: '', content: '', image: null, file: null, isPublished: false },
            profile: { cvFile: null, cvUrl: '' }
        };

        setFormData(prev => ({
            ...prev,
            [activeTab]: initialContext[activeTab]
        }));

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

    // Unified Form State
    // Unified Form State
    const [formData, setFormData] = useState<{
        achievements: {
            title: string;
            issuer: string;
            date: string;
            description: string;
            image: string | null;
            file: File | null;
        };
        portfolio: {
            title: string;
            description: string;
            techStack: string[];
            githubUrl: string;
            liveUrl: string;
            image: string | null;
            file: File | null;
        };
        blog: {
            title: string;
            excerpt: string;
            content: string;
            image: string | null;
            file: File | null;
            isPublished: boolean;
        };
        profile: {
            cvFile: File | null;
            cvUrl: string;
        };
    }>({
        achievements: {
            title: '',
            issuer: '',
            date: '',
            description: '',
            image: null,
            file: null
        },
        portfolio: {
            title: '',
            description: '',
            techStack: [],
            githubUrl: '',
            liveUrl: '',
            image: null,
            file: null
        },
        blog: {
            title: '',
            excerpt: '',
            content: '',
            image: null,
            file: null,
            isPublished: false
        },
        profile: {
            cvFile: null,
            cvUrl: ''
        }
    });

    const updateField = (tab: 'achievements' | 'portfolio' | 'blog' | 'profile', field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [tab]: {
                ...prev[tab],
                [field]: value
            }
        }));
        setLastSaved(prev => ({
            ...prev,
            [tab]: new Date()
        }));
    };

    // Refs for file inputs
    const fileInputRef = useRef<HTMLInputElement>(null);
    const portfolioFileInputRef = useRef<HTMLInputElement>(null);
    const blogFileInputRef = useRef<HTMLInputElement>(null);
    const cvInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, tab: 'achievements' | 'portfolio' | 'blog') => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            updateField(tab, 'image', url);
            updateField(tab, 'file', file);
        }
    };

    const handleDrop = (e: React.DragEvent, tab: 'achievements' | 'portfolio' | 'blog') => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            updateField(tab, 'image', url);
            updateField(tab, 'file', file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const triggerFileInput = (ref: React.RefObject<HTMLInputElement | null>) => {
        ref.current?.click();
    };
    const [newTech, setNewTech] = useState('');


    const handlePublish = async (activeTab: 'achievements' | 'portfolio' | 'blog' | 'profile') => {
        setIsSubmitting(true);

        try {
            // Handle Profile Upload Separately
            if (activeTab === 'profile') {
                const { cvFile } = formData.profile;
                if (!cvFile) {
                    throw new Error("Please select a PDF file to upload.");
                }

                // 1. Upload PDF
                const fileName = 'cv_mskinasih.pdf';
                const { error: uploadError } = await supabase.storage
                    .from('resumes')
                    .upload(fileName, cvFile, {
                        upsert: true
                    });

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('resumes')
                    .getPublicUrl(fileName);

                // 2. Update Profile Table
                // Try to update the existing row first
                const { data: updateData, error: updateError } = await supabase
                    .from('profile')
                    .update({ cv_url: publicUrl, updated_at: new Date().toISOString() })
                    .eq('id', 1)
                    .select();

                if (updateError) throw updateError;

                // If no row existed (and thus not updated), insert a new one
                if (!updateData || updateData.length === 0) {
                    const { error: insertError } = await supabase
                        .from('profile')
                        .insert({ cv_url: publicUrl, updated_at: new Date().toISOString() });

                    if (insertError) throw insertError;
                }

                showToast('CV Updated', 'Your resume has been updated successfully.', 'success');
                setIsSubmitting(false);
                return;
            }

            // Handle Standard Content (Achievements, Portfolio, Blog)
            let imageUrl = '';

            // TS narrowing for non-profile tabs
            // We cast to any here to simplify access because we know activeTab is not profile
            // but TS might still be confused by the union.
            const currentData = formData[activeTab] as any;
            const fileToUpload = currentData.file;

            // 1. Upload Image if exists
            if (fileToUpload) {
                const fileExt = fileToUpload.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const bucketName = activeTab === 'portfolio' ? 'portfolio' : activeTab === 'achievements' ? 'achievement' : 'blog';
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from(bucketName)
                    .upload(filePath, fileToUpload);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from(bucketName)
                    .getPublicUrl(filePath);

                imageUrl = publicUrl;
            } else if (currentData.image) {
                imageUrl = currentData.image;
            }

            // 2. Insert into Database
            let error;

            if (activeTab === 'achievements') {
                const { title, issuer, date, description } = formData.achievements;
                const { error: insertError } = await supabase
                    .from('achievements')
                    .insert({ title, issuer, date, description, image_url: imageUrl });
                error = insertError;
            } else if (activeTab === 'portfolio') {
                const { title, description, techStack, githubUrl, liveUrl } = formData.portfolio;
                const { error: insertError } = await supabase
                    .from('portfolios')
                    .insert({ title, description, tech_stack: techStack, github_url: githubUrl, live_url: liveUrl, image_url: imageUrl });
                error = insertError;
            } else if (activeTab === 'blog') {
                const { title, excerpt, content, isPublished } = formData.blog;
                const generatedSlug = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
                const { error: insertError } = await supabase
                    .from('blogs')
                    .insert({ title, slug: generatedSlug, excerpt, content: content, image_url: imageUrl, published: isPublished, updated_at: new Date().toISOString() });
                error = insertError;
            }

            if (error) throw error;

            showToast('Content Published', `Your ${activeTab} entry has been successfully saved.`, 'success');

            // Success: Reset forms
            setCurrentIds(prev => ({ ...prev, [activeTab]: prev[activeTab as 'achievements' | 'portfolio' | 'blog'] + 1 }));

            const initialContext = {
                achievements: { title: '', issuer: '', date: '', description: '', image: null, file: null },
                portfolio: { title: '', description: '', techStack: [], githubUrl: '', liveUrl: '', image: null, file: null },
                blog: { title: '', excerpt: '', content: '', image: null, file: null, isPublished: false }
            };

            setFormData(prev => ({
                ...prev,
                [activeTab]: initialContext[activeTab]
            }));

            setLastSaved(prev => ({ ...prev, [activeTab]: null }));

        } catch (error: any) {
            console.error('Error publishing (full object):', error);
            console.error('Error publishing (JSON):', JSON.stringify(error, null, 2));
            console.error('Error details:', {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint
            });

            showToast(
                'Publication Failed',
                error.message || 'There was an error saving your changes. Check console for details.',
                'error'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // Markdown Image Upload Handler
    const handleMarkdownImageUpload = async (file: File): Promise<string> => {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `content/${Math.random()}.${fileExt}`;
            const bucketName = 'blog'; // Always blog for markdown content

            const { error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from(bucketName)
                .getPublicUrl(fileName);

            return publicUrl;
        } catch (error) {
            console.error('Error uploading markdown image:', error);
            throw error;
        }
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

                        <button
                            onClick={() => setActiveTab('profile')}
                            className={clsx(
                                "flex-1 py-5 px-4 flex flex-col items-center gap-1 group border-b-2 transition-all",
                                activeTab === 'profile' ? "border-primary bg-primary/5" : "border-transparent hover:bg-primary/5"
                            )}
                        >
                            <UserCircle size={20} className={clsx(activeTab === 'profile' ? "text-primary" : "text-primary/40 group-hover:text-primary")} />
                            <span className={clsx("text-sm font-bold tracking-wide", activeTab === 'profile' ? "text-primary" : "text-primary/40 group-hover:text-primary")}>PROFILE / CV</span>
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="p-8 space-y-8" onChange={handleFormChange} key={formResetKey[activeTab]}>

                        <div className="flex justify-between items-end">
                            <div>
                                <h3 className="font-serif text-2xl font-bold">
                                    {activeTab === 'achievements' ? 'New Achievement Entry' :
                                        activeTab === 'portfolio' ? 'New Project Entry' :
                                            activeTab === 'blog' ? 'New Blog Post Entry' :
                                                'Profile Settings'}
                                </h3>
                                <p className="text-primary/60 text-sm">
                                    {activeTab === 'profile' ? 'Manage your personal documents and links.' : 'Add a new masterpiece to your curated collection.'}
                                </p>
                            </div>
                            <span className="text-xs font-bold uppercase tracking-widest text-primary/40 bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                                {activeTab === 'achievements' ? `Achievement #${currentIds.achievements}` :
                                    activeTab === 'portfolio' ? `Project #${currentIds.portfolio}` :
                                        activeTab === 'blog' ? `Post #${currentIds.blog}` :
                                            'Settings'}
                            </span>
                        </div>

                        {activeTab !== 'profile' ? (
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
                                            value={
                                                activeTab === 'achievements' ? formData.achievements.title :
                                                    activeTab === 'portfolio' ? formData.portfolio.title :
                                                        formData.blog.title
                                            }
                                            onChange={(e) => updateField(activeTab as 'achievements' | 'portfolio' | 'blog', 'title', e.target.value)}
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
                                                    value={formData.achievements.issuer}
                                                    onChange={(e) => updateField('achievements', 'issuer', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-wider text-primary/70">Date</label>
                                                <input
                                                    className="w-full bg-white/50 border border-primary/10 rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-primary/30"
                                                    placeholder="e.g., 2023-10-15"
                                                    type="date"
                                                    value={formData.achievements.date}
                                                    onChange={(e) => updateField('achievements', 'date', e.target.value)}
                                                />
                                            </div>
                                        </>
                                    )}

                                    {activeTab === 'portfolio' && (
                                        <>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold uppercase tracking-wider text-primary/70">GitHub URL</label>
                                                    <input
                                                        className="w-full bg-white/50 border border-primary/10 rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-primary/30"
                                                        placeholder="https://github.com/..."
                                                        type="url"
                                                        value={formData.portfolio.githubUrl}
                                                        onChange={(e) => updateField('portfolio', 'githubUrl', e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold uppercase tracking-wider text-primary/70">Live URL <span className="opacity-50 lowercase font-normal">(optional)</span></label>
                                                    <input
                                                        className="w-full bg-white/50 border border-primary/10 rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-primary/30"
                                                        placeholder="https://..."
                                                        type="url"
                                                        value={formData.portfolio.liveUrl}
                                                        onChange={(e) => updateField('portfolio', 'liveUrl', e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-wider text-primary/70">Tech Stack</label>
                                                <div className="flex flex-wrap gap-2 p-3 bg-white/50 border border-primary/10 rounded-lg min-h-[50px]">
                                                    {formData.portfolio.techStack.map(tech => (
                                                        <span key={tech} className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded flex items-center gap-1 animate-fadeIn">
                                                            {tech} <button onClick={() => {
                                                                const newStack = formData.portfolio.techStack.filter(t => t !== tech);
                                                                updateField('portfolio', 'techStack', newStack);
                                                            }} className="hover:text-red-500"><X size={12} /></button>
                                                        </span>
                                                    ))}
                                                    <input
                                                        className="bg-transparent border-none p-0 text-xs focus:ring-0 w-24 outline-none placeholder:text-primary/30"
                                                        placeholder="Add tool..."
                                                        type="text"
                                                        value={newTech}
                                                        onChange={(e) => setNewTech(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' && newTech.trim()) {
                                                                e.preventDefault();
                                                                const currentStack = formData.portfolio.techStack;
                                                                if (!currentStack.includes(newTech.trim())) {
                                                                    updateField('portfolio', 'techStack', [...currentStack, newTech.trim()]);
                                                                }
                                                                setNewTech('');
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {activeTab === 'blog' && (
                                        <>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-wider text-primary/70">Excerpt</label>
                                                <textarea
                                                    className="w-full bg-white/50 border border-primary/10 rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-primary/30 resize-none custom-scrollbar"
                                                    placeholder="Short preview for the card..."
                                                    rows={3}
                                                    value={formData.blog.excerpt}
                                                    onChange={(e) => updateField('blog', 'excerpt', e.target.value)}
                                                ></textarea>
                                            </div>

                                            <div className="flex items-center gap-3 p-4 border border-primary/10 rounded-lg bg-white/30">
                                                <div
                                                    className={clsx("w-10 h-6 rounded-full relative transition-colors cursor-pointer", formData.blog.isPublished ? "bg-primary" : "bg-primary/20")}
                                                    onClick={() => updateField('blog', 'isPublished', !formData.blog.isPublished)}
                                                >
                                                    <div className={clsx("absolute top-1 left-1 size-4 bg-white rounded-full transition-transform shadow-sm", formData.blog.isPublished ? "translate-x-4" : "translate-x-0")}></div>
                                                </div>
                                                <label className="text-sm font-bold text-primary cursor-pointer select-none" onClick={() => updateField('blog', 'isPublished', !formData.blog.isPublished)}>
                                                    {formData.blog.isPublished ? 'Status: Published' : 'Status: Draft'}
                                                </label>
                                            </div>
                                        </>
                                    )}

                                    <label className="text-xs font-bold uppercase tracking-wider text-primary/70">
                                        {activeTab === 'blog' ? 'Content (Markdown)' : 'Description'}
                                    </label>
                                    {activeTab === 'blog' ? (
                                        <MarkdownEditor
                                            value={formData.blog.content}
                                            onChange={(val) => updateField('blog', 'content', val)}
                                            placeholder="# Write your story here..."
                                            onImageUpload={handleMarkdownImageUpload}
                                        />
                                    ) : (
                                        <textarea
                                            className="w-full bg-white/50 border border-primary/10 rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-primary/30 resize-none custom-scrollbar"
                                            placeholder="Tell the story..."
                                            rows={5}
                                            value={activeTab === 'achievements' ? formData.achievements.description : formData.portfolio.description}
                                            onChange={(e) => updateField(activeTab as 'achievements' | 'portfolio', 'description', e.target.value)}
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
                                                onDrop={(e) => handleDrop(e, 'achievements')}
                                                onDragOver={handleDragOver}
                                                onClick={() => triggerFileInput(fileInputRef)}
                                                className={clsx(
                                                    "flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-all cursor-pointer group relative overflow-hidden",
                                                    formData.achievements.image ? "border-primary/0 bg-white/0" : "border-primary/20 bg-white/30 hover:bg-white/50"
                                                )}
                                            >
                                                <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => handleImageUpload(e, 'achievements')} accept="image/*" />
                                                {formData.achievements.image ? (
                                                    <div className="absolute inset-0 w-full h-full group-hover:opacity-90 transition-opacity">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={formData.achievements.image} alt="Preview" className="w-full h-full object-cover" />
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
                                                onDrop={(e) => handleDrop(e, 'portfolio')}
                                                onDragOver={handleDragOver}
                                                onClick={() => triggerFileInput(portfolioFileInputRef)}
                                                className={clsx(
                                                    "flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-all cursor-pointer group relative overflow-hidden",
                                                    formData.portfolio.image ? "border-primary/0 bg-white/0" : "border-primary/20 bg-white/30 hover:bg-white/50"
                                                )}
                                            >
                                                <input type="file" ref={portfolioFileInputRef} className="hidden" onChange={(e) => handleImageUpload(e, 'portfolio')} accept="image/*" />
                                                {formData.portfolio.image ? (
                                                    <div className="absolute inset-0 w-full h-full group-hover:opacity-90 transition-opacity">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={formData.portfolio.image} alt="Preview" className="w-full h-full object-cover" />
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
                                                onDrop={(e) => handleDrop(e, 'blog')}
                                                onDragOver={handleDragOver}
                                                onClick={() => triggerFileInput(blogFileInputRef)}
                                                className={clsx(
                                                    "flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-all cursor-pointer group relative overflow-hidden",
                                                    formData.blog.image ? "border-primary/0 bg-white/0" : "border-primary/20 bg-white/30 hover:bg-white/50"
                                                )}
                                            >
                                                <input type="file" ref={blogFileInputRef} className="hidden" onChange={(e) => handleImageUpload(e, 'blog')} accept="image/*" />
                                                {formData.blog.image ? (
                                                    <div className="absolute inset-0 w-full h-full group-hover:opacity-90 transition-opacity">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={formData.blog.image} alt="Preview" className="w-full h-full object-cover" />
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
                        ) : (
                            <div className="py-12 animate-fadeIn max-w-2xl mx-auto">
                                <div
                                    onClick={() => cvInputRef.current?.click()}
                                    className={clsx(
                                        "w-full aspect-[2/1] border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-all cursor-pointer group relative overflow-hidden",
                                        formData.profile.cvFile ? "border-primary/0 bg-white/0" : "border-primary/20 bg-white/30 hover:bg-white/50"
                                    )}
                                >
                                    <input
                                        type="file"
                                        ref={cvInputRef}
                                        accept="application/pdf"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) updateField('profile', 'cvFile', file);
                                        }}
                                    />

                                    {formData.profile.cvFile ? (
                                        <div className="absolute inset-0 w-full h-full bg-primary/5 flex flex-col items-center justify-center gap-4 group-hover:opacity-90 transition-opacity backdrop-blur-sm">
                                            <div className="size-20 rounded-2xl bg-white shadow-lg flex items-center justify-center">
                                                <FileText size={40} className="text-primary" />
                                            </div>
                                            <div className="text-center">
                                                <p className="font-bold text-lg text-primary">{formData.profile.cvFile.name}</p>
                                                <p className="text-xs text-primary/50 font-bold uppercase tracking-wider mt-1">
                                                    {(formData.profile.cvFile.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>

                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <p className="text-white font-bold text-sm">Click to Replace</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="size-16 rounded-full bg-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                <FileText size={32} className="text-primary/40 group-hover:text-primary transition-colors" />
                                            </div>
                                            <p className="text-sm font-bold text-primary">Click or drag to upload</p>
                                            <p className="text-xs text-primary/40 mt-1">PDF (Resume)</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Action Footer */}
                        <div className="pt-6 border-t border-primary/10 flex items-center justify-between mt-6">
                            <div className="flex items-center gap-2 text-primary/40 text-xs font-bold italic">
                                <span className="text-sm"><i className="fas fa-magic"></i></span>
                                {getTimeAgo(lastSaved[activeTab])}
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
                                    {isSubmitting ? 'Saving...' : (activeTab === 'blog' && !formData.blog.isPublished ? 'Save as Draft' : 'Publish')}
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
